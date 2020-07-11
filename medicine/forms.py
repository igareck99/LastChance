from django import forms
from .models import Man
from datetime import datetime
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm


class AuthUserForm(AuthenticationForm, forms.ModelForm):
    class Meta:
        model = User
        fields = ('username', 'password')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].widget.attrs['class'] = 'form-control'


class RegisterUserForm(forms.ModelForm):
    email = forms.EmailField()
    username = forms.CharField(label='username')
    username_css_class = "#login"
    login_css_class = "#password"

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'first_name', 'last_name')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].widget.attrs['class'] = 'form-control'






