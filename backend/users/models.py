from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        PUBLIC = 'PUBLIC', 'Public User'
        TALUK_OFFICER = 'TALUK_OFFICER', 'Taluk Officer'
        DISTRICT_OFFICER = 'DISTRICT_OFFICER', 'District Officer'
        COMMISSIONER = 'COMMISSIONER', 'Commissioner'
        AGENCY_INDANE = 'AGENCY_INDANE', 'Agency - Indane'
        AGENCY_HP = 'AGENCY_HP', 'Agency - HP Gas'
        AGENCY_BHARAT = 'AGENCY_BHARAT', 'Agency - Bharat Gas'

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.PUBLIC)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    consumer_number = models.CharField(max_length=50, blank=True, null=True)
    organization_name = models.CharField(max_length=255, blank=True, null=True)
    
    class AgencyType(models.TextChoices):
        INDANE = 'INDANE', 'Indane'
        BHARAT = 'BHARAT', 'Bharat'
        HP = 'HP', 'HP'
        NONE = 'NONE', 'None'

    agency_type = models.CharField(max_length=10, choices=AgencyType.choices, default=AgencyType.NONE)
    address = models.TextField(blank=True, null=True)
    district = models.ForeignKey('complaints.District', on_delete=models.SET_NULL, null=True, blank=True)
    taluk = models.ForeignKey('complaints.Taluk', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"
