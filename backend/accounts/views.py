from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView


class HomeView(APIView):

    def get(self, request):
        return Response({'message': 'Sf ghayerha'})


def set_test(request):
    request.session.set_test_cookie()
    return HttpResponse('Set')


def test_worked(request):
    if request.session.test_cookie_worked():
        request.session.delete_test_cookie()
        return HttpResponse('Worked')
    return HttpResponse('Not Worked')


def set_cookie(request):
    response = HttpResponse('Set')
    response.set_cookie('test_cookie', 'Test if cookies are set')
    return response


def get_cookie(request, key):
    return HttpResponse(request.COOKIES.get(key, 'Not Worked'))


def delete_cookie(request):
    response = HttpResponse('Cookie deleted successfully')
    response.delete_cookie('test_cookie')
    return response
