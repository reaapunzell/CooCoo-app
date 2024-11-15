from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.shortcuts import get_object_or_404
from .models import Group, Participant, Product, Province, City
from .serializers import GroupSerializer, ParticipantSerializer, ProductSerializer

# JWT Authentication Header
token_param = openapi.Parameter(
    'Authorization', openapi.IN_HEADER,
    description="Bearer token for authentication",
    type=openapi.TYPE_STRING,
    required=True
)

class GroupListCreateView(ListCreateAPIView):
    """
    List all groups or create a new group.
    """
    permission_classes = [IsAuthenticated]
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    @swagger_auto_schema(
        operation_description="Retrieve a list of groups or create a new group",
        responses={200: GroupSerializer(many=True)},
        manual_parameters=[token_param]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Create a new group",
        request_body=GroupSerializer,
        responses={201: GroupSerializer},
        manual_parameters=[token_param]
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        # Automatically assign the current user as the organizer
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
        manual_parameters=[token_param]
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
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'quantity': openapi.Schema(type=openapi.TYPE_INTEGER, description="Quantity to join with"),
                'amount_contributed': openapi.Schema(type=openapi.TYPE_NUMBER, description="Amount contributed")
            },
            required=['quantity', 'amount_contributed']
        ),
        responses={200: 'Successfully joined the group', 400: 'Invalid data'},
        manual_parameters=[token_param]
    )
    def post(self, request, group_id, *args, **kwargs):
        group = get_object_or_404(Group, id=group_id)
        quantity = request.data.get('quantity')
        amount_contributed = request.data.get('amount_contributed')

        # Prevent multiple participations by the same user
        if Participant.objects.filter(group=group, user=request.user).exists():
            return Response({"detail": "You have already joined this group."}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure the group goal is not exceeded
        if group.current_progress + quantity > group.target_goal:
            return Response({"detail": "Group goal would be exceeded."}, status=status.HTTP_400_BAD_REQUEST)

        # Create the participant and update group progress
        participant = Participant.objects.create(
            group=group,
            user=request.user,
            quantity=quantity,
            amount_contributed=amount_contributed
        )

        group.current_progress += quantity
        group.save()

        # Check if group goal is reached and mark the group as completed
        if group.current_progress >= group.target_goal:
            group.status = 'completed'
            group.save()

        return Response({"detail": "Successfully joined the group."}, status=status.HTTP_200_OK)


class GroupProgressView(APIView):
    """
    Get the current progress for a specific group.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Get the current progress of a group",
        responses={200: openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "group_id": openapi.Schema(type=openapi.TYPE_INTEGER),
                "product_name": openapi.Schema(type=openapi.TYPE_STRING),
                "target_goal": openapi.Schema(type=openapi.TYPE_INTEGER),
                "current_progress": openapi.Schema(type=openapi.TYPE_INTEGER),
                "status": openapi.Schema(type=openapi.TYPE_STRING),
                "participants_count": openapi.Schema(type=openapi.TYPE_INTEGER),
            }
        )},
        manual_parameters=[token_param]
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
    Get participants for a specific group.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Retrieve participants in a specific group",
        responses={200: ParticipantSerializer(many=True)},
        manual_parameters=[token_param]
    )
    def get(self, request, group_id, *args, **kwargs):
        group = get_object_or_404(Group, id=group_id)
        participants = group.participants.all()
        serializer = ParticipantSerializer(participants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductListView(ListCreateAPIView):
    """
    List or add products.
    """
    permission_classes = [IsAuthenticated]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    @swagger_auto_schema(
        operation_description="List all products or add a new one",
        responses={200: ProductSerializer(many=True)},
        manual_parameters=[token_param]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

