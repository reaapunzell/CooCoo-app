# groups/views.py
from rest_framework.generics import RetrieveAPIView, ListCreateAPIView
from rest_framework.views import APIView  # Correct import for APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Group, Participant
from .serializers import GroupSerializer, ParticipantSerializer
from django.shortcuts import get_object_or_404

# Define the JWT Authentication Header parameter
token_param = openapi.Parameter(
    'Authorization',  # Header name
    openapi.IN_HEADER,
    description="Bearer token for authentication",  # Description of the token
    type=openapi.TYPE_STRING,
    required=True,
)


class GroupListView(ListCreateAPIView):
    """
    List all groups or create a new group.
    """
    permission_classes = [IsAuthenticated]
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    @swagger_auto_schema(
        operation_description="Retrieve a list of groups or create a new group",
        responses={200: GroupSerializer},
        manual_parameters=[token_param], #Add security for jwt
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def perform_create(self, serializer):
        # Add logic here to ensure only authenticated users can create groups
        serializer.save(organizer=self.request.user)


class GroupDetailView(RetrieveAPIView):
    """
    Retrieve detailed information about a specific group.
    """
    permission_classes = [IsAuthenticated]
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    lookup_field = 'id'

    @swagger_auto_schema(
        operation_description="Retrieve detailed information about a specific group", 
        responses={200: GroupSerializer},
        manual_parameters=[token_param],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class JoinGroupView(APIView):
    """
    Join an existing group.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Join an existing group",
        responses={200: 'Joined group successfully', 400: 'Invalid data'},
        manual_parameters=[token_param],
    )
    def post(self, request, group_id, *args, **kwargs):
        group = get_object_or_404(Group, id=group_id)
        quantity = request.data.get('quantity')
        amount_contributed = request.data.get('amount_contributed')

        # Ensure the user isn't joining the group again
        if Participant.objects.filter(group=group, user=request.user).exists():
            return Response({"detail": "You have already joined this group."}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure the quantity doesn't exceed the group target
        if group.current_progress + quantity > group.target_goal:
            return Response({"detail": "The group goal would be exceeded with this quantity."}, status=status.HTTP_400_BAD_REQUEST)

        # Create a participant entry
        participant = Participant.objects.create(
            group=group,
            user=request.user,
            quantity=quantity,
            amount_contributed=amount_contributed
        )

        # Update the group's current progress
        group.current_progress += quantity
        group.save()

        # Update group status if target goal is reached
        if group.current_progress >= group.target_goal:
            group.status = 'completed'
            group.save()

        return Response({"detail": "Successfully joined the group."}, status=status.HTTP_200_OK)


class GroupProgressView(APIView):
    """
    Get current progress toward the target goal for a specific group.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Retrieve the current progress for a specific group toward the target goal",
        responses={200: 'Progress data includes target goal, current progress, and status'},
        manual_parameters=[token_param],
    )
    def get(self, request, group_id, *args, **kwargs):
        group = get_object_or_404(Group, id=group_id)
        data = {
            "group_id": group.id,
            "product_name": group.product.name,
            "target_goal": group.target_goal,
            "current_progress": group.current_progress,
            "status": group.status,
            "participants_count": group.participants.count()
        }
        return Response(data, status=status.HTTP_200_OK)


class ParticipantListView(APIView):
    """
    Get the list of participants for a specific group.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Retrieve the list of participants in a specific group",
        responses={200: ParticipantSerializer},
        manual_parameters=[token_param], 
    )
    def get(self, request, group_id, *args, **kwargs):
        group = get_object_or_404(Group, id=group_id)
        participants = group.participants.all()
        serializer = ParticipantSerializer(participants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateGroupView(APIView):
    """
    Create a new group.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Create a new group for a product",
        responses={201: GroupSerializer},
        manual_parameters=[token_param], 
    )
    def post(self, request, *args, **kwargs):
        product_id = request.data.get('product_id')
        target_goal = request.data.get('target_goal')
        end_date = request.data.get('end_date')

        # Get the product object
        product = get_object_or_404(Product, id=product_id)

        # Create the group
        group = Group.objects.create(
            product=product,
            organizer=request.user,
            target_goal=target_goal,
            current_progress=0,  # initially no progress
            status='open',
            end_date=end_date
        )

        # Return the created group details
        serializer = GroupSerializer(group)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

