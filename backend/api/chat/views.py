# chat/views.py
from django.shortcuts import render

def message_page(request):
    return render(request, 'messages.html')