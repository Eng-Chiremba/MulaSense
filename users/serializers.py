from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile
from .validators import validate_username_unique, validate_email_unique, validate_phone_number, validate_positive_amount

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    username = serializers.CharField(validators=[validate_username_unique])
    email = serializers.EmailField(validators=[validate_email_unique])
    # Optional/profile fields
    phone_number = serializers.CharField(write_only=True, required=False, allow_blank=True, validators=[validate_phone_number])
    is_business = serializers.BooleanField(write_only=True, required=False)
    business_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    business_address = serializers.CharField(write_only=True, required=False, allow_blank=True)
    business_phone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    business_email = serializers.EmailField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 
                 'phone_number', 'is_business', 'business_name', 'business_address', 'business_phone', 'business_email']
    
    def validate_username(self, value):
        if len(value) < 3:
            raise serializers.ValidationError('Username must be at least 3 characters long.')
        return value
    
    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError('Email is required.')
        return value.lower()
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        # If a business_email was supplied use it as the user's email
        if 'business_email' in attrs and attrs.get('business_email'):
            attrs['email'] = attrs['business_email']
        return attrs
    
    def create(self, validated_data):
        # Pop serializer-only fields before creating the User
        validated_data.pop('password_confirm', None)
        phone = validated_data.pop('phone_number', '')
        is_business = validated_data.pop('is_business', False)
        business_name = validated_data.pop('business_name', '')
        business_address = validated_data.pop('business_address', '')
        business_phone = validated_data.pop('business_phone', '')
        validated_data.pop('business_email', None)  # Remove business_email as it's not a User field

        # Create the User instance with only User model fields
        password = validated_data.pop('password')
        user_data = {
            'username': validated_data.get('username'),
            'email': validated_data.get('email'),
            'first_name': validated_data.get('first_name', ''),
            'last_name': validated_data.get('last_name', '')
        }
        user = User.objects.create_user(password=password, **user_data)

        # Create or update related profile with provided data
        profile, _ = UserProfile.objects.get_or_create(user=user)
        if phone:
            profile.phone_number = phone
        profile.is_business = bool(is_business)
        if business_name:
            profile.business_name = business_name
        if business_address:
            profile.business_address = business_address
        if business_phone:
            profile.business_phone = business_phone
        profile.save()

        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    new_password_confirm = serializers.CharField()
    
    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect')
        return value
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError('New passwords do not match')
        return attrs

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    new_password_confirm = serializers.CharField()
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError('Passwords do not match')
        return attrs

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    phone_number = serializers.CharField(validators=[validate_phone_number], required=False, allow_blank=True)
    monthly_income = serializers.DecimalField(max_digits=12, decimal_places=2, validators=[validate_positive_amount], required=False)
    
    class Meta:
        model = UserProfile
        fields = ['user', 'currency', 'theme', 'monthly_income', 'phone_number', 
                 'full_name', 'date_of_birth', 'is_business', 'business_name', 
                 'business_address', 'business_phone', 'business_email', 
                 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def validate_monthly_income(self, value):
        if value and value > 1000000:
            raise serializers.ValidationError('Monthly income seems unrealistic.')
        return value