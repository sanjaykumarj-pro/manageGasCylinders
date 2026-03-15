import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from complaints.models import District, Taluk

def seed_taluks():
    data = {
        "Thiruvananthapuram": ["Thiruvananthapuram", "Neyyattinkara", "Kattakada", "Nedumangad", "Varkala", "Chirayinkeezhu"],
        "Kollam": ["Kollam", "Karunagappally", "Kunnathur", "Kottarakkara", "Punalur", "Pathanapuram"],
        "Pathanamthitta": ["Pathanamthitta", "Adoor", "Konni", "Kozhencherry", "Mallappally", "Ranni", "Thiruvalla"],
        "Alappuzha": ["Alappuzha", "Ambalappuzha", "Chengannur", "Cherthala", "Karthikappally", "Kuttanad", "Mavelikkara"],
        "Kottayam": ["Kottayam", "Changanassery", "Kanjirappally", "Meenachil", "Vaikom"],
        "Idukki": ["Idukki", "Devikulam", "Peermade", "Udumbanchola", "Thodupuzha"],
        "Ernakulam": ["Ernakulam", "Aluva", "Kanayannur", "Kochi", "Kothamangalam", "Kunnathunad", "Muvattupuzha", "Paravur"],
        "Thrissur": ["Thrissur", "Chavakkad", "Kodungallur", "Mukundapuram", "Chalakudy", "Kunnamkulam", "Thalapilly"],
        "Palakkad": ["Palakkad", "Alathur", "Chittur", "Ottappalam", "Pattambi", "Mannarkkad"],
        "Malappuram": ["Malappuram", "Ernad", "Kondotty", "Nilambur", "Perinthalmanna", "Ponnani", "Tirur", "Tirurangadi"],
        "Kozhikode": ["Kozhikode", "Koyilandy", "Thamarassery", "Vadakara"],
        "Wayanad": ["Wayanad", "Kalpetta", "Mananthavady", "Sulthan Bathery"],
        "Kannur": ["Kannur", "Alakode", "Iritty", "Payyannur", "Taliparamba", "Thalassery"],
        "Kasaragod": ["Kasaragod", "Hosdurg", "Manjeshwaram", "Vellarikundu"]
    }
    
    for district_name, taluk_list in data.items():
        try:
            district = District.objects.get(name=district_name)
            for taluk_name in taluk_list:
                obj, created = Taluk.objects.get_or_create(name=taluk_name, district=district)
                if created:
                    print(f"Created Taluk: {taluk_name} in {district_name}")
                else:
                    print(f"Taluk already exists: {taluk_name} in {district_name}")
        except District.DoesNotExist:
            print(f"District {district_name} does not exist. Skipping.")

if __name__ == "__main__":
    seed_taluks()
