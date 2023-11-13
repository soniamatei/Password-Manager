from django.urls import path
from passwords import views
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.UserCreate.as_view()),
    path('register/confirm/<str:code>', views.UserConfirmCreation.as_view()),
    path('user/<int:pk>/role', views.UserRole.as_view()),

    path('vault/gt/<int:year>', views.FilterVaults.as_view()),
    path('statistics-vault', views.OrderVaultsByPasswords.as_view(), name='statistics-vault'),
    path('statistics-password', views.OrderPasswordsByTags.as_view(), name='statistics-password'),

    path('user', views.UserList.as_view()),
    path('user/<int:pk>', views.UserDetails.as_view()),

    path('vault', views.VaultList.as_view()),
    path('vault/<int:pk>', views.VaultDetails.as_view()),
    path('vault/<int:pk>/tags', views.MultipleTagsToVault.as_view()),

    path('tag', views.TagList.as_view()),
    path('tag/<int:pk>', views.TagDetails.as_view()),

    path('account', views.PasswordAccountList.as_view()),
    path('account/<int:pk>', views.PasswordAccountDetails.as_view()),

    path('classic', views.PasswordClassicList.as_view()),
    path('classic/<int:pk>', views.PasswordClassicDetails.as_view()),

    path('account/<int:pk>/tag', views.TagAccountPasswordList.as_view()),
    path('account/<int:pwd_id>/tag/<int:tag_id>', views.TagAccountPasswordDetails.as_view()),

    path('tag/<int:pk>/account', views.AccountPasswordTagList.as_view()),
    path('tag/<int:tag_id>/account/<int:pwd_id>', views.TagAccountPasswordDetails.as_view()),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    path("vault/autocomplete/", views.VaultViewForAutocomplete.as_view()),
    path("tag/<int:pk>/autocomplete/", views.TagViewForAutocomplete.as_view()),

    path("vault/number", views.get_number_vaults),
    path("account/number", views.get_number_passwacc),
    path("classic/number", views.get_number_passwcls),
    path("tag/number", views.get_number_tags),
    path("vault-filter/number/<int:year>", views.get_number_vaults_filter),

    path("user/per-page", views.SetPerPageAPIView.as_view()),


    path("vault/delete-list", views.VaultDeleteListView.as_view()),
    path("account/delete-list", views.AccountDeleteListView.as_view()),
    path("classic/delete-list", views.ClassicDeleteListView.as_view()),
    path("tag/delete-list", views.TagDeleteListView.as_view()),


    path("user/reset", views.ResetUserView.as_view()),
    path("vault/reset", views.ResetVaultView.as_view()),
    path("account/reset", views.ResetAccountView.as_view()),
    path("classic/reset", views.ResetClassicView.as_view()),
    path("tag/reset", views.ResetTagView.as_view()),


    path("populate", views.PopulateView.as_view()),
]
