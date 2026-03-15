from django.db import models
from django.conf import settings
from users.models import User

class District(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Taluk(models.Model):
    name = models.CharField(max_length=100)
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name='taluks')

    def __str__(self):
        return f"{self.name} ({self.district.name})"

class Complaint(models.Model):
    class Status(models.TextChoices):
        SUBMITTED = 'SUBMITTED', 'Submitted'
        UNDER_TALUK_REVIEW = 'UNDER_TALUK_REVIEW', 'Under Taluk Review'
        UNDER_DISTRICT_REVIEW = 'UNDER_DISTRICT_REVIEW', 'Under District Review'
        FORWARDED_TO_COMMISSIONER = 'FORWARDED_TO_COMMISSIONER', 'Forwarded to Commissioner'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
        ASSIGNED_TO_AGENCY = 'ASSIGNED_TO_AGENCY', 'Assigned to Agency'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        RESOLVED = 'RESOLVED', 'Resolved'
        CLOSED = 'CLOSED', 'Closed'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='complaints', null=True, blank=True)
    
    # Guest/Anonymous details
    consumer_name = models.CharField(max_length=255, null=True, blank=True)
    consumer_phone = models.CharField(max_length=20, null=True, blank=True)
    consumer_agency_type = models.CharField(max_length=20, choices=User.AgencyType.choices, null=True, blank=True)
    description = models.TextField()
    location_details = models.TextField()
    taluk = models.ForeignKey(Taluk, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Sector(models.TextChoices):
        DOMESTIC = 'DOMESTIC', 'Domestic'
        COMMERCIAL = 'COMMERCIAL', 'Commercial'

    class CenterType(models.TextChoices):
        HOSPITAL = 'HOSPITAL', 'Hospitals'
        EDUCATION = 'EDUCATION', 'Educational institutes'
        PHARMA = 'PHARMA', 'Pharmaceutical Industry'
        SEED = 'SEED', 'Seed Processing industry'
        FISHERIES = 'FISHERIES', 'Fisheries Industry'
        TRANSPORT_CANTEEN = 'TRANSPORT_CANTEEN', 'Airline/ Railway Canteens'
        RESTAURANT = 'RESTAURANT', 'Restaurant/Dhaba'
        HOTEL = 'HOTEL', 'Hotel Industry'
        CORPORATE_CANTEEN = 'CORPORATE_CANTEEN', 'Corporate Canteen'
        INDUSTRIAL_CANTEEN = 'INDUSTRIAL_CANTEEN', 'Industrial Canteens'
        GUEST_HOUSE = 'GUEST_HOUSE', 'Corporate Guest House'
        FOOD_DIARY = 'FOOD_DIARY', 'Food Processing/Diary Industry'
        STEEL = 'STEEL', 'Steel Industry'
        POWER = 'POWER', 'Power Industry'
        AUTOMOBILE = 'AUTOMOBILE', 'Automobile Industry'
        CERAMIC_GLASS = 'CERAMIC_GLASS', 'Ceramic/ Glass Industry'
        TEXTILE_DYE = 'TEXTILE_DYE', 'Textile/Dye Industry'
        FOUNDRY = 'FOUNDRY', 'Foundry Forge Industry'
        CHEMICAL_PLASTIC = 'CHEMICAL_PLASTIC', 'Chemical / Plastics Industry'
        OTHERS = 'OTHERS', 'Others / Case-to-case basis'

    # Cylinder Details
    cylinder_count = models.IntegerField(default=1)
    cylinder_weight = models.CharField(max_length=50, null=True, blank=True) # e.g., 14.2kg, 19kg
    
    # New SOS Fields
    consumer_number = models.CharField(max_length=50, null=True, blank=True)
    center_type = models.CharField(max_length=50, choices=CenterType.choices, default=CenterType.OTHERS)
    sector = models.CharField(max_length=20, choices=Sector.choices, default=Sector.DOMESTIC)
    
    supporting_document = models.FileField(upload_to='complaints/proofs/', null=True, blank=True)
    
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.SUBMITTED)
    assigned_agency = models.CharField(max_length=20, choices=User.Role.choices, null=True, blank=True) # E.g., AGENCY_INDANE
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Complaint #{self.id} - {self.get_status_display()}"

class StatusHistory(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='history')
    status = models.CharField(max_length=50, choices=Complaint.Status.choices)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    comments = models.TextField(blank=True, null=True)
    proof_document = models.FileField(upload_to='complaints/resolution_proofs/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.complaint} -> {self.get_status_display()}"

class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message[:20]}..."


class AgencyStock(models.Model):
    """
    Daily stock update submitted by each agency.
    Matches professional MT (Metric Ton) based Excel report.
    """
    class ProductType(models.TextChoices):
        LPG = 'LPG', 'LPG'
        PROPANE = 'PROPANE', 'Propane'
        BUTANE = 'BUTANE', 'Butane'

    AGENCY_CHOICES = [
        ('INDANE', 'IOCL – Indian Oil Corporation Limited'),
        ('HP', 'HPCL – Hindustan Petroleum Corporation Limited'),
        ('BHARAT', 'BPCL – Bharat Petroleum Corporation Limited'),
    ]

    agency_type = models.CharField(max_length=10, choices=AGENCY_CHOICES)
    location_name = models.CharField(max_length=255, help_text="e.g., Cochin LPG Bottling Plant")
    product = models.CharField(max_length=20, choices=ProductType.choices, default=ProductType.LPG)
    
    # Tankage Summary (in MT)
    installed_capacity = models.FloatField(default=0.0)
    operational_capacity = models.FloatField(default=0.0)
    
    # Stock Overview (in MT)
    opening_stock_total = models.FloatField(default=0.0)
    opening_stock_domestic = models.FloatField(default=0.0)
    opening_stock_non_domestic = models.FloatField(default=0.0)
    
    receipts_prev_day = models.FloatField(default=0.0)
    prev_day_dispatch = models.FloatField(default=0.0)
    days_cover = models.FloatField(default=0.0, help_text="Number of days supply")
    in_transit_stock = models.FloatField(default=0.0)
    
    remarks = models.TextField(blank=True, null=True)
    
    # Legacy/Cylinder fields (keeping for compatibility but moving to MT primary)
    cylinders_available = models.PositiveIntegerField(default=0)
    cylinders_distributed = models.PositiveIntegerField(default=0)
    
    date = models.DateField(auto_now_add=True)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='stock_updates'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.agency_type} — {self.date}: {self.cylinders_available} available"
