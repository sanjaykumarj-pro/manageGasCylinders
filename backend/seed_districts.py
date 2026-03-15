import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from complaints.models import District

def seed_districts():
    districts = [
        "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", 
        "Kottayam", "Idukki", "Ernakulam", "Thrissur", "Palakkad", 
        "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
    ]
    
    for name in districts:
        obj, created = District.objects.get_or_create(name=name)
        if created:
            print(f"Created district: {name}")
        else:
            print(f"District already exists: {name}")

if __name__ == "__main__":
    seed_districts()
