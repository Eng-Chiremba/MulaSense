from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from .models import UserProfile
from .serializers import UserSerializer, UserProfileSerializer, UserRegistrationSerializer, UserLoginSerializer, PasswordChangeSerializer, PasswordResetSerializer, PasswordResetConfirmSerializer
from .permissions import IsAdminUser, IsOwnerProfile

# User CRUD Views
class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

# User Profile CRUD Views
class UserProfileListCreateView(generics.ListCreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    
    def perform_create(self, serializer):
        # For demo, use user ID 1
        user = User.objects.get(id=1)
        serializer.save(user=user)

class UserProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

# Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data = request.data
    is_business = data.get('is_business', False)
    
    try:
        # Get phone number based on account type
        phone = data.get('phone') if not is_business else data.get('business_phone')
        email = data.get('email', '') if not is_business else data.get('business_email', '')
        
        # Check if phone number already exists
        if UserProfile.objects.filter(phone_number=phone).exists():
            return Response({'error': 'Phone number already registered'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if username (phone) already exists
        if User.objects.filter(username=phone).exists():
            return Response({'error': 'Phone number already registered'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user with phone as username
        user = User.objects.create_user(
            username=phone,
            email=email,
            password=data.get('password')
        )
        
        # Create profile
        if is_business:
            profile = UserProfile.objects.create(
                user=user,
                phone_number=data.get('business_phone'),
                is_business=True,
                business_name=data.get('business_name'),
                business_phone=data.get('business_phone'),
                business_email=data.get('business_email'),
                business_address=data.get('business_address', '')
            )
        else:
            profile = UserProfile.objects.create(
                user=user,
                phone_number=data.get('phone'),
                is_business=False,
                full_name=data.get('name', ''),
            )
        
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'name': profile.business_name if is_business else profile.full_name,
                'phone': profile.phone_number,
                'email': user.email,
                'is_business': profile.is_business
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    phone = request.data.get('phone')
    password = request.data.get('password')
    
    if not phone or not password:
        return Response({'error': 'Phone and password required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Authenticate using phone as username
    user = authenticate(username=phone, password=password)
    
    if user:
        token, created = Token.objects.get_or_create(user=user)
        
        try:
            profile = user.profile
        except UserProfile.DoesNotExist:
            profile = UserProfile.objects.create(user=user, phone_number=phone)
        
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'name': profile.business_name if profile.is_business else profile.full_name,
                'phone': profile.phone_number,
                'email': user.email,
                'is_business': profile.is_business
            }
        })
    
    # Check if user exists to give better error message
    if User.objects.filter(username=phone).exists():
        return Response({'error': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response({'error': 'Phone number not registered'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def logout(request):
    try:
        request.user.auth_token.delete()
        return Response({'message': 'Logged out successfully'})
    except:
        return Response({'error': 'Error logging out'}, status=status.HTTP_400_BAD_REQUEST)

# Profile Management Views
class CurrentUserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsOwnerProfile]
    
    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

@api_view(['GET'])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['PUT', 'PATCH'])
def update_user(request):
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def change_password(request):
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        # Delete old token and create new one
        Token.objects.filter(user=request.user).delete()
        token = Token.objects.create(user=request.user)
        return Response({
            'message': 'Password changed successfully',
            'token': token.key
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    serializer = PasswordResetSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # In production, send actual email
            reset_url = f"http://localhost:5173/reset-password/{uid}/{token}/"
            
            # For development, just return the reset info
            return Response({
                'message': 'Password reset email sent',
                'reset_url': reset_url,  # Remove in production
                'uid': uid,
                'token': token
            })
        except User.DoesNotExist:
            # Don't reveal if email exists
            return Response({'message': 'Password reset email sent'})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    serializer = PasswordResetConfirmSerializer(data=request.data)
    if serializer.is_valid():
        uid = serializer.validated_data['uid']
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
            
            if default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                # Delete old tokens and create new one
                Token.objects.filter(user=user).delete()
                new_token = Token.objects.create(user=user)
                return Response({
                    'message': 'Password reset successful',
                    'token': new_token.key,
                    'user_id': user.id,
                    'username': user.username
                })
            else:
                return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
        except (User.DoesNotExist, ValueError):
            return Response({'error': 'Invalid reset link'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def refresh_token(request):
    try:
        # Delete old token and create new one
        Token.objects.filter(user=request.user).delete()
        new_token = Token.objects.create(user=request.user)
        return Response({
            'token': new_token.key,
            'user_id': request.user.id,
            'username': request.user.username
        })
    except Exception as e:
        return Response({'error': 'Token refresh failed'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def verify_token(request):
    return Response({
        'valid': True,
        'user_id': request.user.id,
        'username': request.user.username,
        'email': request.user.email
    })