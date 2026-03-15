from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'phone_number', 'consumer_number', 'organization_name', 'agency_type', 'address', 'district', 'taluk', 'password')
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=User.Role.PUBLIC,
            phone_number=validated_data.get('phone_number', ''),
            consumer_number=validated_data.get('consumer_number', ''),
            organization_name=validated_data.get('organization_name', ''),
            agency_type=validated_data.get('agency_type', 'NONE'),
            address=validated_data.get('address', ''),
            district=validated_data.get('district'),
            taluk=validated_data.get('taluk')
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['username'] = user.username
        token['organization_name'] = user.organization_name
        token['agency_type'] = user.agency_type
        token['district'] = user.district.id if user.district else None
        token['taluk'] = user.taluk.id if user.taluk else None
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        data['username'] = self.user.username
        data['organization_name'] = self.user.organization_name
        data['agency_type'] = self.user.agency_type
        data['district'] = self.user.district.id if self.user.district else None
        data['taluk'] = self.user.taluk.id if self.user.taluk else None
        return data
