# admin_app/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from authentication.models import User
from groups.models import Group, Participant
from authentication.serializers import UserProfileSerializer
from groups.serializers import GroupSerializer
from .serializers import AdminGroupSerializer

# JWT Authentication Header
token_param = openapi.Parameter(
    'Authorization', openapi.IN_HEADER,
    description="Bearer token for authentication",
    type=openapi.TYPE_STRING,
    required=True
)

class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    @swagger_auto_schema(
        operation_description="Get admin dashboard statistics",
        responses={200: openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'total_users': openapi.Schema(type=openapi.TYPE_INTEGER),
                'active_users': openapi.Schema(type=openapi.TYPE_INTEGER),
                'total_groups': openapi.Schema(type=openapi.TYPE_INTEGER),
                'active_groups': openapi.Schema(type=openapi.TYPE_INTEGER),
                'completed_groups': openapi.Schema(type=openapi.TYPE_INTEGER),
                'total_participants': openapi.Schema(type=openapi.TYPE_INTEGER),
            }
        )},
        manual_parameters=[token_param]
    )
    def get(self, request):
        stats = {
            'total_users': User.objects.count(),
            'active_users': User.objects.filter(is_active=True).count(),
            'total_groups': Group.objects.count(),
            'active_groups': Group.objects.filter(status='active').count(),
            'completed_groups': Group.objects.filter(status='completed').count(),
            'total_participants': Participant.objects.count(),
        }
        return Response(stats, status=status.HTTP_200_OK)

class ManageUsersView(APIView):
    permission_classes = [IsAdminUser]

    @swagger_auto_schema(
        operation_description="List all registered users with details",
        responses={200: UserProfileSerializer(many=True)},
        manual_parameters=[token_param]
    )
    def get(self, request):
        users = User.objects.all()
        serializer = UserProfileSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="Update a user's details",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'first_name': openapi.Schema(type=openapi.TYPE_STRING),
                'last_name': openapi.Schema(type=openapi.TYPE_STRING),
                'email': openapi.Schema(type=openapi.TYPE_STRING),
                'is_active': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                'is_staff': openapi.Schema(type=openapi.TYPE_BOOLEAN),
            },
            required=['user_id']
        ),
        responses={200: 'User updated successfully', 404: 'User not found'},
        manual_parameters=[token_param]
    )
    def patch(self, request):
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            if 'first_name' in request.data:
                user.first_name = request.data['first_name']
            if 'last_name' in request.data:
                user.last_name = request.data['last_name']
            if 'email' in request.data:
                user.email = request.data['email']
            if 'is_active' in request.data:
                user.is_active = request.data['is_active']
            if 'is_staff' in request.data:
                user.is_staff = request.data['is_staff']
            user.save()
            return Response({"message": "User updated successfully"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        operation_description="Delete a user",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            },
            required=['user_id']
        ),
        responses={200: 'User deleted successfully', 404: 'User not found'},
        manual_parameters=[token_param]
    )
    def delete(self, request):
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class ManageGroupsView(APIView):
    permission_classes = [IsAdminUser]

    @swagger_auto_schema(
        operation_description="List all groups with details including participants",
        responses={200: AdminGroupSerializer(many=True)},
        manual_parameters=[token_param]
    )
    def get(self, request):
        groups = Group.objects.all()
        serializer = AdminGroupSerializer(groups, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="Update a group's details",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'group_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'target_goal': openapi.Schema(type=openapi.TYPE_INTEGER),
                'current_progress': openapi.Schema(type=openapi.TYPE_INTEGER),
                'status': openapi.Schema(type=openapi.TYPE_STRING, enum=['active', 'completed']),
            },
            required=['group_id']
        ),
        responses={200: 'Group updated successfully', 404: 'Group not found'},
        manual_parameters=[token_param]
    )
    def patch(self, request):
        group_id = request.data.get('group_id')
        try:
            group = Group.objects.get(id=group_id)
            if 'target_goal' in request.data:
                group.target_goal = request.data['target_goal']
            if 'current_progress' in request.data:
                group.current_progress = request.data['current_progress']
            if 'status' in request.data:
                group.status = request.data['status']
            group.save()
            return Response({"message": "Group updated successfully"}, status=status.HTTP_200_OK)
        except Group.DoesNotExist:
            return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        operation_description="Delete a group",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'group_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            },
            required=['group_id']
        ),
        responses={200: 'Group deleted successfully', 404: 'Group not found'},
        manual_parameters=[token_param]
    )
    def delete(self, request):
        group_id = request.data.get('group_id')
        try:
            group = Group.objects.get(id=group_id)
            group.delete()
            return Response({"message": "Group deleted successfully"}, status=status.HTTP_200_OK)
        except Group.DoesNotExist:
            return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)
