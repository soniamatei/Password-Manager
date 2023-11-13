import sqlite3

from django.core.paginator import Paginator
from django.db import connections
from django.db.models import Avg, Count, Subquery, OuterRef
from django.db.models.functions import Length, Coalesce
from rest_framework.generics import get_object_or_404
from passwords.permissions import *
from passwords.serializers import *
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.decorators import api_view


class FilterVaults(generics.ListAPIView):
    serializer_class = VaultSerializerList
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        vaults = Vault.objects.filter(created_at__year__gt=self.kwargs['year'])
        paginator = Paginator(vaults.order_by("id"), self.request.user.per_page)
        page_number = self.request.query_params.get("page")
        page_obj = paginator.get_page(page_number)

        return page_obj.object_list


@api_view(['GET'])
def get_number_vaults_filter(request, year):
    if request.method == "GET":
        return Response(
            {
                "number": len(Vault.objects.filter(created_at__year__gt=year))
            }
        )


@api_view(['GET'])
def get_number_vaults(request):
    if request.method == "GET":
        return Response(
            {
                "number": Vault.objects.count()
            }
        )


@api_view(['GET'])
def get_number_passwacc(request):
    if request.method == "GET":
        return Response(
            {
                "number": PasswordAccount.objects.count()
            }
        )


@api_view(['GET'])
def get_number_passwcls(request):
    if request.method == "GET":
        return Response(
            {
                "number": PasswordClassic.objects.count(),
            }
        )


@api_view(['GET'])
def get_number_tags(request):
    if request.method == "GET":
        return Response(
            {
                "number": Tag.objects.count()
            }
        )


class UserCreate(generics.CreateAPIView):
    serializer_class = UserSerializerList
    authentication_classes = []
    permission_classes = []


class UserConfirmCreation(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, code):
        try:
            registration_code = RegistrationCode.objects.get(code=code)
        except RegistrationCode.DoesNotExist:
            return Response({"detail": "Invalid confirmation code."}, status=status.HTTP_400_BAD_REQUEST)
        user = registration_code.user
        if registration_code.expires_at < timezone.now():
            user.delete()
            return Response({"detail": "Confirmation code has expired."}, status=status.HTTP_400_BAD_REQUEST)
        user.is_active = True
        user.save()
        registration_code.delete()
        return Response({"detail": "Account activated."}, status=status.HTTP_200_OK)


class UserList(generics.ListAPIView):
    serializer_class = VaultSerializerList
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = User.objects.all()

        username = self.request.query_params.get("username")
        if username:
            queryset = User.objects.filter(username__icontains=username)

        paginator = Paginator(queryset, self.request.user.per_page)
        page_number = self.request.query_params.get("page")
        page_obj = paginator.get_page(page_number)

        return page_obj.object_list


class VaultList(generics.ListCreateAPIView):
    serializer_class = VaultSerializerList
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs.setdefault("context", self.get_serializer_context())
        serializer = serializer_class(*args, **kwargs)
        if self.request.method == "GET":
            serializer.child.fields['nb_acc'] = serializers.IntegerField()
        return serializer

    def get_queryset(self):
        vaults = Vault.objects.annotate(
            nb_acc=Coalesce(Subquery(
                PasswordAccount.objects.filter(vault=OuterRef('pk')).values('vault').annotate(count=Count('id')).values(
                    'count')
            ), 0)
        )

        title = self.request.query_params.get("title")
        if title:
            vaults = vaults.filter(title__icontains=title)

        paginator = Paginator(vaults, self.request.user.per_page)
        page_number = self.request.query_params.get("page")
        page_obj = paginator.get_page(page_number)

        return page_obj.object_list


class UserDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializerDetails
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        user = self.request.user
        permissions = self.permission_classes

        if user.is_authenticated:
            if user.role == User.Roles.USER:
                permissions += [IsOwner]

        return [permission() for permission in permissions]

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs.setdefault("context", self.get_serializer_context())
        serializer = serializer_class(*args, **kwargs)
        if self.request.method == "GET":
            serializer.fields['nb_acc'] = serializers.IntegerField()
            serializer.fields['nb_cls'] = serializers.IntegerField()
            serializer.fields['nb_vls'] = serializers.IntegerField()
            serializer.fields['nb_tgs'] = serializers.IntegerField()
        return serializer

    def get_queryset(self):
        vaults = User.objects.annotate(
            nb_acc=Coalesce(Subquery(
                PasswordAccount.objects.filter(user=OuterRef('pk')).values('user').annotate(count=Count('id')).values(
                    'count')
            ), 0),
            nb_cls=Coalesce(Subquery(
                PasswordClassic.objects.filter(user=OuterRef('pk')).values('user').annotate(count=Count('id')).values(
                    'count')
            ), 0),
            nb_vls=Coalesce(Subquery(
                Vault.objects.filter(user=OuterRef('pk')).values('user').annotate(count=Count('id')).values('count')
            ), 0),
            nb_tgs=Coalesce(Subquery(
                Tag.objects.filter(user=OuterRef('pk')).values('user').annotate(count=Count('id')).values('count')
            ), 0),
        )

        return vaults


class VaultDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vault.objects.all()
    serializer_class = VaultSerializerDetails
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        user = self.request.user
        permissions = self.permission_classes

        if user.is_authenticated:
            if user.role == User.Roles.USER:
                permissions += [IsOwner]

        return [permission() for permission in permissions]


class TagList(generics.ListCreateAPIView):
    serializer_class = TagSerializerList
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer(self, *args, **kwargs):
        serializer = super().get_serializer(*args, **kwargs)
        serializer.child.fields['nb_acc'] = serializers.IntegerField()
        return serializer

    def get_queryset(self):
        # tags = Tag.objects.all().annotate(nb_acc=Count("tagged_passwords"))
        tags = Tag.objects.annotate(
            nb_acc=Coalesce(Subquery(
                TagPassword.objects.filter(tag=OuterRef('pk')).values('tag').annotate(
                    count=Count('id')).values(
                    'count')
            ), 0)
        )
        paginator = Paginator(tags, self.request.user.per_page)
        page_number = self.request.query_params.get("page")
        page_obj = paginator.get_page(page_number)

        return page_obj.object_list


class TagDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializerDetails

    permission_classes = [IsAuthenticatedOrReadOnly]


    def get_permissions(self):
        user = self.request.user
        permissions = self.permission_classes

        if user.is_authenticated:
            if user.role == User.Roles.USER:
                permissions += [IsOwner]

        return [permission() for permission in permissions]


class PasswordAccountList(generics.ListCreateAPIView):
    serializer_class = PasswordAccountSerializerList
    permission_classes = [IsAuthenticatedOrReadOnly]


    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs.setdefault("context", self.get_serializer_context())
        serializer = serializer_class(*args, **kwargs)
        if self.request.method == "GET":
            serializer.child.fields['nb_tgs'] = serializers.IntegerField()
        return serializer

    def get_queryset(self):
        passws = PasswordAccount.objects.annotate(
            nb_tgs=Coalesce(Subquery(
                TagPassword.objects.filter(password=OuterRef('pk')).values('password').annotate(
                    count=Count('id')).values(
                    'count')
            ), 0)
        )
        paginator = Paginator(passws, self.request.user.per_page)
        page_number = self.request.query_params.get("page")
        page_obj = paginator.get_page(page_number)

        return page_obj.object_list


class PasswordAccountDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = PasswordAccount.objects.all()
    serializer_class = PasswordAccountSerializerDetails
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        user = self.request.user
        permissions = self.permission_classes

        if user.is_authenticated:
            if user.role == User.Roles.USER:
                permissions += [IsOwner]

        return [permission() for permission in permissions]

class PasswordClassicList(generics.ListCreateAPIView):
    serializer_class = PasswordClassicSerializerList
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        passws = PasswordClassic.objects.all()
        paginator = Paginator(passws, self.request.user.per_page)
        page_number = self.request.query_params.get("page")
        page_obj = paginator.get_page(page_number)

        return page_obj.object_list


class PasswordClassicDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = PasswordClassic.objects.all()
    serializer_class = PasswordClassicSerializerDetails
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        user = self.request.user
        permissions = self.permission_classes

        if user.is_authenticated:
            if user.role == User.Roles.USER:
                permissions += [IsOwner]

        return [permission() for permission in permissions]

class TagAccountPasswordList(APIView):
    def check_permissions(self, request):
        message = "no permision for this action"
        if not request.user or not request.user.is_authenticated:
            self.permission_denied(request, message)
        if request.user.role == User.Roles.USER:
            password = get_object_or_404(PasswordAccount, id=self.kwargs["pk"])
            if request.user != password.user:
                self.permission_denied(request, message)

    def post(self, request, pk):
        request.data["password"] = pk
        serializer = TagPasswordSerializer(data=request.data)
        serializer.fields['tag'] = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all())
        # serializer.fields['password'] = serializers.PrimaryKeyRelatedField(queryset=PasswordAccount.objects.all())
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TagAccountPasswordDetails(APIView):
    def check_object_permissions(self, request, obj):
        message = "no permision for this action"
        if not request.user or not request.user.is_authenticated:
            self.permission_denied(request, message)
        if request.user.role == User.Roles.USER:
            if request.user != obj.password.user:
                self.permission_denied(request, message)

    def get_object(self, pwd_id, tag_id):
        try:
            obj = TagPassword.objects.get(password=pwd_id, tag=tag_id)
            self.check_object_permissions(self.request, obj)
            return obj
        except TagPassword.DoesNotExist:
            raise Http404

    def patch(self, request, pwd_id, tag_id):
        relation = self.get_object(pwd_id, tag_id)
        serializer = TagPasswordSerializer(instance=relation, data=request.data, partial=True,
                                           exclude_fields=["tag", "password"])
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pwd_id, tag_id):
        relation = self.get_object(pwd_id, tag_id)
        relation.delete()
        return Response({"message": "Deleted."})

# 1834

class AccountPasswordTagList(APIView):
    def post(self, request, pk):
        request.data["tag"] = pk
        serializer = TagPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderVaultsByPasswords(generics.ListAPIView):
    serializer_class = VaultOrderSerializerList
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Vault.objects.annotate(avg_password_length=Avg(Length('account_passwords__password'))).order_by(
            "-avg_password_length")
        paginator = Paginator(queryset, self.request.user.per_page)
        page_number = self.request.query_params.get("page")
        page_obj = paginator.get_page(page_number)

        return page_obj.object_list


class OrderPasswordsByTags(generics.ListCreateAPIView):
    serializer_class = OrderPasswordsByTagsSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # queryset = PasswordAccount.objects.annotate(count_tags=Count("tags")).order_by("-count_tags")
        queryset = PasswordAccount.objects.annotate(
            count_tags=Coalesce(Subquery(
                TagPassword.objects.filter(password=OuterRef('pk')).values('password').annotate(
                    count=Count('id')).values(
                    'count')
            ), 0)
        ).order_by("-count_tags")
        paginator = Paginator(queryset, self.request.user.per_page)
        page_number = self.request.query_params.get("page")
        page_obj = paginator.get_page(page_number)

        return page_obj.object_list


class MultipleTagsToVault(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    def post(self, request, pk):
        tags = []

        for tag_data in request.data:
            tags.append(get_object_or_404(Tag, pk=tag_data['id']))

        for i, tag_data in enumerate(request.data):
            tag_data['vault'] = pk
            serializer = TagSerializerDetails(tags[i], data=tag_data, partial=True)
            serializer.fields['vault'] = serializers.PrimaryKeyRelatedField(queryset=Vault.objects.all())

            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)


class VaultViewForAutocomplete(APIView):
    serializer_class = VaultSerializerList
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, *args, **kwargs):
        query = request.GET.get('query')
        vaults = Vault.objects.filter(title__icontains=query).filter(user=self.request.user.id).order_by('title')[:10]
        serializer = VaultSerializerList(vaults, many=True)
        return Response(serializer.data)


class TagViewForAutocomplete(APIView):
    serializer_class = TagSerializerList
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, pk, *args, **kwargs):
        query = request.GET.get('query')
        tags = Tag.objects.filter(title__icontains=query).filter(vault=pk).order_by('title')[:10]
        serializer = TagSerializerList(tags, many=True)
        return Response(serializer.data)


class SetPerPageAPIView(APIView):
    permission_classes = [IsAdmin]
    def post(self, request):
        per_page = request.data.get('per_page')  # Get the desired per_page value from the request data
        print(per_page)
        try:
            per_page = int(per_page)
            if per_page < 5:
                return Response("The number should be >= 5.", status=400)

            User.objects.update(per_page=per_page)  # Update the per_page value for all users
            return Response("Successfully updated per_page for all users.")
        except ValueError:
            return Response("Invalid per_page value.", status=400)


class VaultDeleteListView(generics.DestroyAPIView):
    serializer_class = VaultSerializerDetails
    queryset = Vault.objects.all()
    permission_classes = [IsAdmin]

    def delete(self, request, *args, **kwargs):
        vault_ids = request.data.get("vault_ids", [])
        if not vault_ids:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        queryset = self.filter_queryset(self.get_queryset().filter(id__in=vault_ids))
        if not queryset.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)

        for obj in queryset:
            self.perform_destroy(obj)

        return Response(status=status.HTTP_204_NO_CONTENT)


class AccountDeleteListView(generics.DestroyAPIView):
    serializer_class = PasswordAccountSerializerDetails
    queryset = PasswordAccount.objects.all()
    permission_classes = [IsAdmin]

    def delete(self, request, *args, **kwargs):
        passw_ids = request.data.get("passw_ids", [])
        if not passw_ids:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        queryset = self.filter_queryset(self.get_queryset().filter(id__in=passw_ids))
        if not queryset.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)

        for obj in queryset:
            self.perform_destroy(obj)

        return Response(status=status.HTTP_204_NO_CONTENT)


class ClassicDeleteListView(generics.DestroyAPIView):
    serializer_class = PasswordClassicSerializerDetails
    queryset = PasswordClassic.objects.all()
    permission_classes = [IsAdmin]

    def delete(self, request, *args, **kwargs):
        passw_ids = request.data.get("passw_ids", [])
        if not passw_ids:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        queryset = self.filter_queryset(self.get_queryset().filter(id__in=passw_ids))
        if not queryset.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)

        for obj in queryset:
            self.perform_destroy(obj)

        return Response(status=status.HTTP_204_NO_CONTENT)


class TagDeleteListView(generics.DestroyAPIView):
    serializer_class = TagSerializerDetails
    queryset = Tag.objects.all()
    permission_classes = [IsAdmin]

    def delete(self, request, *args, **kwargs):
        tag_ids = request.data.get("tag_ids", [])

        if not tag_ids:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        queryset = self.filter_queryset(self.get_queryset().filter(id__in=tag_ids))
        if not queryset.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)

        for obj in queryset:
            self.perform_destroy(obj)

        return Response(status=status.HTTP_204_NO_CONTENT)


class ResetUserView(APIView):
    permission_classes = [IsAdmin]
    def get(self, request):
        User.objects.all().delete()
        with connections['default'].cursor() as cursor:
            cursor.execute(
                f"UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='passwords_user';\n")
        return Response("All users deleted.")


class ResetVaultView(APIView):
    permission_classes = [IsAdmin]
    def get(self, request):
        Vault.objects.all().delete()
        return Response("All vaults deleted.")


class ResetAccountView(APIView):
    permission_classes = [IsAdmin]
    def get(self, request):
        PasswordAccount.objects.all().delete()
        return Response("All account passwords deleted.")


class ResetClassicView(APIView):
    permission_classes = [IsAdmin]
    def get(self, request):
        PasswordClassic.objects.all().delete()
        return Response("All classic passwords deleted.")


class ResetTagView(APIView):
    permission_classes = [IsAdmin]
    def get(self, request):
        Tag.objects.all().delete()
        return Response("All tags deleted.")


class PopulateView(generics.CreateAPIView):
    permission_classes = [IsAdmin]
    def post(self, request, *args, **kwargs):
        type = request.data.get("type")
        file = ""
        if type == "profile":
            file = "profiles.sql"

        elif type == "user":
            file = "users.sql"

        elif type == "vault":
            file = "vaults.sql"

        elif type == "account":
            file = "accounts.sql"

        elif type == "classic":
            file = "classics.sql"

        elif type == "tag":
            file = "tags.sql"

        elif type == "relation":
            file = "relation.sql"

        try:
            with open(file, 'r') as sql_file:
                sql_script = sql_file.read()

            db = sqlite3.connect('db.sqlite3')
            cursor = db.cursor()
            cursor.executescript(sql_script)
            db.commit()
            db.close()
        except FileNotFoundError as e:
            return Response(e.strerror, status=status.HTTP_400_BAD_REQUEST)

        return Response("Population completed.")


class UserRole(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRoleSerializer
    permission_classes = [IsAdmin]