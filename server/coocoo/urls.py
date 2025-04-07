from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Swagger config
schema_view = get_schema_view(
    openapi.Info(
        title="CooCoo API",
        default_version='v1',
        description="API documentation for CooCoo Group Buying Application",
        contact=openapi.Contact(email="contact@myapi.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    url="http://localhost:8000/",
)

urlpatterns = [
    path("admin/", admin.site.urls),  # 🛠️ Django admin stays here
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0), name="swagger-ui"),
    
    # 🚀 Your app endpoints
    path("auth/", include("authentication.urls")),
    path("api/", include("groups.urls")),
    path("api/admin/", include("admin_app.urls")),  # ✅ Move admin_app here
]

