import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from complaints.models import District, Taluk
from users.models import User

def seed_data():
    # Create Districts
    tvm, _ = District.objects.get_or_create(name='Thiruvananthapuram')
    ekm, _ = District.objects.get_or_create(name='Ernakulam')
    kkd, _ = District.objects.get_or_create(name='Kozhikode')
    pkd, _ = District.objects.get_or_create(name='Palakkad')

    # Create Taluks
    Taluk.objects.get_or_create(name='Neyyattinkara', district=tvm)
    Taluk.objects.get_or_create(name='Kattakada', district=tvm)
    Taluk.objects.get_or_create(name='Kanayannur', district=ekm)
    Taluk.objects.get_or_create(name='Kochi', district=ekm)
    Taluk.objects.get_or_create(name='Kozhikode', district=kkd)
    
    # Create Admin
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@kerala.gov.in', 'AdminPassword123!', role=User.Role.COMMISSIONER)
        print("Superuser created.")

    # Create Officers
    if not User.objects.filter(username='taluk_off').exists():
        User.objects.create_user(username='taluk_off', password='OfficerPassword123!', role=User.Role.TALUK_OFFICER, district=tvm, taluk=Taluk.objects.get(name='Neyyattinkara'))
    if not User.objects.filter(username='dist_off').exists():
        User.objects.create_user(username='dist_off', password='OfficerPassword123!', role=User.Role.DISTRICT_OFFICER, district=tvm)
    
    # Create Agencies
    if not User.objects.filter(username='indane_agency').exists():
        User.objects.create_user(username='indane_agency', password='AgencyPassword123!', role=User.Role.AGENCY_INDANE)
    if not User.objects.filter(username='hp_agency').exists():
        User.objects.create_user(username='hp_agency', password='AgencyPassword123!', role=User.Role.AGENCY_HP)
    if not User.objects.filter(username='bharat_agency').exists():
        User.objects.create_user(username='bharat_agency', password='AgencyPassword123!', role=User.Role.AGENCY_BHARAT)

    print("Seeding completed.")

if __name__ == "__main__":
    seed_data()
