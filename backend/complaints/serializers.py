from rest_framework import serializers
from .models import District, Taluk, Complaint, StatusHistory, AgencyStock
from users.serializers import UserSerializer

class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = '__all__'

class TalukSerializer(serializers.ModelSerializer):
    district_name = serializers.CharField(source='district.name', read_only=True)
    class Meta:
        model = Taluk
        fields = ('id', 'name', 'district', 'district_name')

class StatusHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source='changed_by.username', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = StatusHistory
        fields = ('id', 'status', 'status_display', 'changed_by', 'changed_by_name', 'comments', 'proof_document', 'created_at')

class ComplaintSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    taluk_name = serializers.CharField(source='taluk.name', read_only=True)
    district_name = serializers.CharField(source='taluk.district.name', read_only=True)
    history = StatusHistorySerializer(many=True, read_only=True)
    user_details = UserSerializer(source='user', read_only=True)
    # Flat convenience fields for frontends
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_agency_type = serializers.CharField(source='user.agency_type', read_only=True)

    class Meta:
        model = Complaint
        fields = (
            'id', 'user', 'user_details', 'user_name', 'user_agency_type',
            'consumer_name', 'consumer_phone', 'consumer_agency_type',
            'cylinder_count', 'cylinder_weight',
            'description', 'location_details', 
            'consumer_number', 'center_type', 'sector',
            'taluk', 'taluk_name', 'district_name', 
            'status', 'status_display', 'assigned_agency', 'created_at', 
            'updated_at', 'history'
        )
        read_only_fields = ('user', 'status', 'assigned_agency')


class AgencyStockSerializer(serializers.ModelSerializer):
    updated_by_name = serializers.CharField(source='updated_by.username', read_only=True)
    agency_display = serializers.SerializerMethodField()
    product_display = serializers.CharField(source='get_product_display', read_only=True)

    def get_agency_display(self, obj):
        from .models import AgencyStock
        return dict(AgencyStock.AGENCY_CHOICES).get(obj.agency_type, obj.agency_type)

    class Meta:
        model = AgencyStock
        fields = (
            'id', 'agency_type', 'agency_display',
            'location_name', 'product', 'product_display',
            'installed_capacity', 'operational_capacity',
            'opening_stock_total', 'opening_stock_domestic', 'opening_stock_non_domestic',
            'receipts_prev_day', 'prev_day_dispatch',
            'days_cover', 'in_transit_stock',
            'remarks', 'cylinders_available', 'cylinders_distributed',
            'date', 'updated_by', 'updated_by_name', 'created_at'
        )
        read_only_fields = ('updated_by', 'date', 'agency_type')

