# groups/urls.py
from django.urls import path
from .views import CreateGroupView, JoinGroupView, GroupDetailView, GroupProgressView

urlpatterns = [
    path('create/', CreateGroupView.as_view(), name='create_group'),
    path('<int:group_id>/join/', JoinGroupView.as_view(), name='join_group'),
    path('<int:id>/', GroupDetailView.as_view(), name='group_detail'),  # Group details
    path('<int:group_id>/progress/', GroupProgressView.as_view(), name='group_progress'),  # Group progress
]

