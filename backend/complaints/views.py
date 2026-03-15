from rest_framework import viewsets, permissions, status, decorators, views
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
import pandas as pd
from .models import District, Taluk, Complaint, StatusHistory, Notification, AgencyStock
from .serializers import DistrictSerializer, TalukSerializer, ComplaintSerializer, StatusHistorySerializer, AgencyStockSerializer
from .serializers_notify import NotificationSerializer
from users.models import User
from django.db.models import Count

def get_row_value(row, *possible_headers, default=0):
    """Utility to safely extract values from a pandas row using multiple possible headers."""
    for h in possible_headers:
        h_norm = h.strip().upper()
        if h_norm in row:
            val = row[h_norm]
            try:
                if pd.isna(val) or str(val).strip().lower() in ['na', '-', '']:
                    return default
                return val
            except:
                return default
    return default

# Maps user's agency_type (stored on User model) to the Role used on Complaint.assigned_agency
AGENCY_TYPE_TO_ROLE = {
    'INDANE': User.Role.AGENCY_INDANE,
    'HP': User.Role.AGENCY_HP,
    'BHARAT': User.Role.AGENCY_BHARAT,
}

STOCK_HEADER_MAPPING = {
    'OMC': 'OMC',
    'LOCATION NAME': 'LOCATION NAME',
    'PRODUCT': 'PRODUCT',
    'TOTAL INSTALLED CAPACITY (MT)': 'INSTALLED',
    'OPERATIONAL (MT)': 'OPERATIONAL',
    'OPENING STOCK (MT) - TOTAL': 'OPEN_TOTAL',
    'OPENING STOCK (MT) - DOMESTIC': 'OPEN_DOM',
    'OPENING STOCK (MT) - NON DOMESTIC': 'OPEN_NON_DOM',
    'RECEIPT PREV DAY': 'RECEIPTS',
    'PREVIOUS DAY DISPATCH': 'DISPATCH',
    'DAYS COVER': 'DAYS_COVER',
    'IN TRANSIT STOCK': 'IN_TRANSIT',
    'REMARKS': 'REMARKS'
}

class IsOwnerOrStaff(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == User.Role.PUBLIC:
            return obj.user == request.user
        return True

class DistrictViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    permission_classes = [permissions.AllowAny]

class TalukViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Taluk.objects.all()
    serializer_class = TalukSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Taluk.objects.all()
        district_id = self.request.query_params.get('district')
        if district_id:
            queryset = queryset.filter(district_id=district_id)
        return queryset

class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]

    def get_permissions(self):
        if self.action in ['create', 'track']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @decorators.action(detail=False, methods=['get'])
    def track(self, request):
        """Allow anonymous status lookup by ID/Token."""
        token_id = request.query_params.get('token')
        phone = request.query_params.get('phone')
        
        if not token_id and not phone:
            return Response(
                {"error": "Please provide a Token ID or Phone Number."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        queryset = Complaint.objects.all()
        if token_id:
            # Handle '#' prefix if provided by user
            clean_id = str(token_id).replace('#', '')
            queryset = queryset.filter(id=clean_id)
        if phone:
            queryset = queryset.filter(consumer_phone=phone)

        complaint = queryset.first()
        if not complaint:
            return Response(
                {"error": "No SOS report found with these details."}, 
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(complaint)
        return Response(serializer.data)

    def get_queryset(self):
        user = self.request.user
        if user.role == User.Role.PUBLIC:
            # Public sees only their own complaints
            return Complaint.objects.filter(user=user).order_by('-created_at')
        elif user.role == User.Role.TALUK_OFFICER:
            # Taluk officer sees complaints in their taluk
            if user.taluk:
                return Complaint.objects.filter(taluk=user.taluk).order_by('-created_at')
            return Complaint.objects.none()
        elif user.role == User.Role.DISTRICT_OFFICER:
            # District officer sees complaints in any taluk of their district
            if user.district:
                return Complaint.objects.filter(taluk__district=user.district).order_by('-created_at')
            return Complaint.objects.none()
        elif user.role == User.Role.COMMISSIONER:
            # Commissioner sees all complaints
            return Complaint.objects.all().order_by('-created_at')
        elif user.role in [User.Role.AGENCY_INDANE, User.Role.AGENCY_HP, User.Role.AGENCY_BHARAT]:
            # Agency sees only complaints assigned to them
            return Complaint.objects.filter(assigned_agency=user.role).order_by('-created_at')
        return Complaint.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        """
        When public user submits complaint:
        - Force-assign taluk from their registered profile (guarantees correct routing)
        - Set status to UNDER_TALUK_REVIEW immediately
        """
        user = self.request.user
        if user.is_authenticated:
            taluk = user.taluk or None
            complaint = serializer.save(
                user=user,
                taluk=taluk,
                status=Complaint.Status.UNDER_TALUK_REVIEW
            )
            StatusHistory.objects.create(
                complaint=complaint,
                status=Complaint.Status.UNDER_TALUK_REVIEW,
                changed_by=user,
                comments=f"Complaint submitted by {user.username}. Routed to Taluk Supply Office."
            )
        else:
            complaint = serializer.save(
                user=None,
                status=Complaint.Status.UNDER_TALUK_REVIEW
            )
            StatusHistory.objects.create(
                complaint=complaint,
                status=Complaint.Status.UNDER_TALUK_REVIEW,
                comments="Anonymous SOS submitted by guest. Routed to Taluk Supply Office."
            )

    @decorators.action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        complaint = self.get_object()
        complaint.status = Complaint.Status.REJECTED
        complaint.save()
        StatusHistory.objects.create(
            complaint=complaint,
            status=complaint.status,
            changed_by=request.user,
            comments=request.data.get('comments', 'Complaint rejected.')
        )
        return Response({'status': 'rejected'})

    @decorators.action(detail=True, methods=['post'])
    def forward_to_district(self, request, pk=None):
        complaint = self.get_object()
        complaint.status = Complaint.Status.UNDER_DISTRICT_REVIEW
        complaint.save()
        StatusHistory.objects.create(
            complaint=complaint,
            status=complaint.status,
            changed_by=request.user,
            comments=request.data.get('comments', 'Verified and forwarded to District Supply Office.')
        )
        return Response({'status': 'forwarded to district'})

    @decorators.action(detail=True, methods=['post'])
    def forward_to_commissioner(self, request, pk=None):
        complaint = self.get_object()
        complaint.status = Complaint.Status.FORWARDED_TO_COMMISSIONER
        complaint.save()
        StatusHistory.objects.create(
            complaint=complaint,
            status=complaint.status,
            changed_by=request.user,
            comments=request.data.get('comments', 'Reviewed and escalated to Commissioner.')
        )
        return Response({'status': 'forwarded to commissioner'})

    @decorators.action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """
        Commissioner approves the complaint.
        Agency is AUTO-ASSIGNED based on complainant's registered agency_type.
        No manual input required.
        """
        complaint = self.get_object()
        complainant = complaint.user

        # Auto-map from user's agency_type to the Role string
        agency_role = None
        if complainant:
            agency_role = AGENCY_TYPE_TO_ROLE.get(complainant.agency_type)
        else:
            # Guest submission: use the consumer_agency_type field
            agency_role = AGENCY_TYPE_TO_ROLE.get(complaint.consumer_agency_type)

        if not agency_role:
            # Fallback: if data missing, Commissioner can specify
            agency_role = request.data.get('agency')
        
        if not agency_role:
            return Response(
                {'error': 'Could not determine agency. Please manually select one.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        complaint.status = Complaint.Status.ASSIGNED_TO_AGENCY
        complaint.assigned_agency = agency_role
        complaint.save()

        StatusHistory.objects.create(
            complaint=complaint,
            status=complaint.status,
            changed_by=request.user,
            comments=f'Approved by Commissioner. Auto-assigned to {agency_role} based on consumer registration.'
        )
        return Response({'status': 'approved', 'assigned_to': agency_role})

    @decorators.action(detail=True, methods=['post'])
    def update_agency_status(self, request, pk=None):
        complaint = self.get_object()
        new_status = request.data.get('status')
        if new_status not in [Complaint.Status.IN_PROGRESS, Complaint.Status.RESOLVED]:
            return Response({'error': 'Invalid status update for agency.'}, status=status.HTTP_400_BAD_REQUEST)

        complaint.status = new_status
        complaint.save()

        StatusHistory.objects.create(
            complaint=complaint,
            status=new_status,
            changed_by=request.user,
            comments=request.data.get('comments', f'Status updated to {new_status} by agency.'),
            proof_document=request.FILES.get('proof_document')
        )
        return Response({'status': 'updated'})

class AnalyticsView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        stats = {
            'total_complaints': Complaint.objects.count(),
            'resolved_complaints': Complaint.objects.filter(status=Complaint.Status.RESOLVED).count(),
            'status_breakdown': list(Complaint.objects.values('status').annotate(count=Count('status'))),
            'district_breakdown': list(District.objects.annotate(count=Count('taluks__complaint')).values('name', 'count')),
            'agency_breakdown': list(Complaint.objects.values('assigned_agency').annotate(count=Count('assigned_agency')))
        }
        return Response(stats)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @decorators.action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})


# Map agency role to agency_type string for stock creation
ROLE_TO_AGENCY_TYPE = {
    User.Role.AGENCY_INDANE: 'INDANE',
    User.Role.AGENCY_HP: 'HP',
    User.Role.AGENCY_BHARAT: 'BHARAT',
}

class AgencyStockViewSet(viewsets.ModelViewSet):
    """
    Agencies POST daily stock updates.
    Officials (Taluk/District/Commissioner) GET all stock records.
    """
    serializer_class = AgencyStockSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        if user.role in [User.Role.AGENCY_INDANE, User.Role.AGENCY_HP, User.Role.AGENCY_BHARAT]:
            # Agencies only see their own stock history
            agency_type = ROLE_TO_AGENCY_TYPE.get(user.role)
            return AgencyStock.objects.filter(agency_type=agency_type)
        # All officials see all stock records
        return AgencyStock.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        agency_type = ROLE_TO_AGENCY_TYPE.get(user.role)
        if not agency_type:
            raise PermissionDenied("Only agency accounts can update stock.")
        serializer.save(updated_by=user, agency_type=agency_type)
class BulkStockUploadView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if 'file' not in request.FILES:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        
        excel_file = request.FILES['file']
        
        try:
            df = pd.read_excel(excel_file)
            
            # Case-insensitive column matching
            df.columns = [str(c).strip().upper() for c in df.columns]
            
            records_created = 0
            errors = []
            
            for i, row in df.iterrows():
                try:
                    omc = str(get_row_value(row, 'OMC', default='')).upper()
                    agency_type = None
                    if 'IOCL' in omc or 'INDANE' in omc: agency_type = 'INDANE'
                    elif 'HPCL' in omc or 'HP' in omc: agency_type = 'HP'
                    elif 'BPCL' in omc or 'BHARAT' in omc: agency_type = 'BHARAT'
                    
                    if not agency_type:
                        continue # Skip rows without a valid OMC
                    
                    AgencyStock.objects.create(
                        agency_type=agency_type,
                        location_name=str(get_row_value(row, 'LOCATION NAME', default='Unknown')),
                        product=str(get_row_value(row, 'PRODUCT', default='LPG')).upper(),
                        installed_capacity=float(get_row_value(row, 'TOTAL INSTALLED CAPACITY (MT)', 'INSTALLED')),
                        operational_capacity=float(get_row_value(row, 'OPERATIONAL (MT)', 'OPERATIONAL')),
                        opening_stock_total=float(get_row_value(row, 'OPENING STOCK (MT) - TOTAL', 'OPEN_TOTAL')),
                        opening_stock_domestic=float(get_row_value(row, 'OPENING STOCK (MT) - DOMESTIC', 'OPEN_DOM')),
                        opening_stock_non_domestic=float(get_row_value(row, 'OPENING STOCK (MT) - NON DOMESTIC', 'OPEN_NON_DOM')),
                        receipts_prev_day=float(get_row_value(row, 'RECEIPT PREV DAY', 'RECEIPTS')),
                        prev_day_dispatch=float(get_row_value(row, 'PREVIOUS DAY DISPATCH', 'DISPATCH')),
                        days_cover=float(get_row_value(row, 'DAYS COVER', 'DAYS_COVER')),
                        in_transit_stock=float(get_row_value(row, 'IN TRANSIT STOCK', 'IN_TRANSIT')),
                        remarks=str(get_row_value(row, 'REMARKS', default='')),
                        updated_by=request.user
                    )
                    records_created += 1
                except Exception as row_err:
                    errors.append(f"Row {i+2}: {str(row_err)}")
            
            if errors and records_created == 0:
                return Response({'error': f"Processing failed: {errors[0]}"}, status=status.HTTP_400_BAD_REQUEST)
                
            return Response({
                'message': f'Successfully processed {records_created} records.',
                'warnings': errors if errors else None
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': f"Critical Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
