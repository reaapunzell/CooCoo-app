from django.urls import path
from .views import GroupListView, GroupDetailView, JoinGroupView, GroupProgressView, ParticipantListView, CreateGroupView

urlpatterns = [
    path('groups/', GroupListView.as_view(), name='group-list'),  # List or create groups
    path('groups/<int:id>/', GroupDetailView.as_view(), name='group-detail'),  # Retrieve a specific group's details
    path('groups/<int:group_id>/join/', JoinGroupView.as_view(), name='join-group'),  # Join a specific group
    path('groups/<int:group_id>/progress/', GroupProgressView.as_view(), name='group-progress'),  # Retrieve progress of a group
    path('groups/<int:group_id>/participants/', ParticipantListView.as_view(), name='group-participants'),  # List participants in a group
    path('groups/create/', CreateGroupView.as_view(), name='create-group'),  # Create a new group
]

