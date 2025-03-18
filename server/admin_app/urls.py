# admin_app/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.AdminStatsView.as_view(), name='admin_stats'),
    path('users/', views.ManageUsersView.as_view(), name='manage_users'),
    path('groups/', views.ManageGroupsView.as_view(), name='manage_groups'),
]
