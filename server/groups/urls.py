from django.urls import path
from .views import (
    GroupListCreateView,
    GroupDetailView,
    JoinGroupView,
    GroupProgressView,
    ParticipantListView,
    ProductListView
)

urlpatterns = [
    # Group-related endpoints
    path('groups/', GroupListCreateView.as_view(), name='group-list-create'),  # List all groups or create a new group
    path('groups/<int:id>/', GroupDetailView.as_view(), name='group-detail'),  # Retrieve specific group details
    path('groups/<int:group_id>/join/', JoinGroupView.as_view(), name='join-group'),  # Join a specific group
    path('groups/<int:group_id>/progress/', GroupProgressView.as_view(), name='group-progress'),  # Get group progress
    path('groups/<int:group_id>/participants/', ParticipantListView.as_view(), name='group-participants'),  # List group participants
    
    # Product-related endpoints
    path('products/', ProductListView.as_view(), name='product-list-create'),  # List or add products
]

