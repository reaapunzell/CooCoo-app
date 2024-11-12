# groups/views.py
from rest_framework.generics import RetrieveAPIView, APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from .models import Group, Participant
from .serializers import GroupSerializer, ParticipantSerializer
from django.shortcuts import get_object_or_404

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
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class GroupProgressView(APIView):
    """
    Get current progress toward the target goal for a specific group.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Retrieve the current progress for a specific group toward the target goal",
        responses={
            200: 'Progress data includes target goal, current progress, and status',
        }
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

