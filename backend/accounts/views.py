from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView

class HomeView(APIView):

    def get(self, request):
        content = {'message': 'sf ghayerha'}
        return Response(content)
