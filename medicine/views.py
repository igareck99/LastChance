from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from.models import Man, Record, Surveys
from django.urls import reverse_lazy
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from datetime import datetime
import json
from medicine.forms import AuthUserForm,AuthenticationForm, RegisterUserForm
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.views.generic.edit import CreateView
from urllib.parse import urlparse

from django.shortcuts import redirect
from django.contrib import auth
from django.template.context_processors import csrf
from django.views import View


#следующие 4 функции - просто представление страниц

def authing(request):
    return render(request, 'med/index.html')


def Patients(request):
    return render(request,'med/html/patients.html')


@csrf_exempt
def recording(request):
    return render(request, 'med/html/record.html')

@csrf_exempt
def surving(request):
    return render(request, 'med/html/surveys.html')


def survey_list(request):   # список всех обсследований
    if request.method == 'GET':
        list=Surveys.objects.all()
        l = []
        result_dict = dict()
        for x in list:
            l.append({'num': x.id, 'name': x.Survey})
        return HttpResponse(json.dumps(l, ensure_ascii=False),
                            content_type="application/json")


def people_list(request):  # cписок всех пациентов
    if request.method == 'GET':
        people = Man.objects.all()
        l = []
        result_dict = dict()
        for x in people:
            l.append({'number': x.id, 'FIO': x.fio, 'date': str(x.date)[0:19], 'card': x.Card})
    return HttpResponse(json.dumps(l, ensure_ascii=False),
                        content_type="application/json")


def record_list(request):  # cписок всех записей
    if request.method == 'GET':
        records = Record.objects.all()
        l = []
        result_dict = dict()
        for x in records:
            l.append({'num': x.id, 'fio': x.fio, 'card': x.Card, 'survey': x.survey, 'surveyDate': str(x.date)[0:19],'status': x.status})
    return JsonResponse(l,safe=False)


@csrf_exempt
def createSurvey(request):    # создание нового обсследования
    if request.method == 'POST':
        r = request.body.decode()
        r = r.split(":")
        survey = Surveys()
        f = r[1][1:-2]
        survey.Survey = f
        survey.save()
    return HttpResponseRedirect('/survey')


@csrf_exempt
def Create(request):     # создание новго пациента
    if request.method =='POST':
        r = request.body.decode()
        r = r.split(":")
        man_list = Man.objects.all()
        data = datetime.now()
        man = Man()
        F = r[1].split(',')
        F = F[0].replace('"','')
        man.fio  = F
        F = r[2].replace('"','').replace('}','')
        man.Card = F
        man.date = data
        man.save()
    return  HttpResponseRedirect('/patients')



def get_fio(request):        #список Фамилеий пациентов
    if request.method == "GET":
        man_list = Man.objects.all()
        LIST_FIO = []
        for x in man_list:
            LIST_FIO.append({'name': x.fio})
        return HttpResponse(json.dumps(LIST_FIO, ensure_ascii=False),
                            content_type="application/json")


def get_survey(request):
    if request.method == "GET":
        survey_list = Surveys.objects.all()
        l = []
        for x in survey_list:
            l.append({'name': x.Survey})
        return HttpResponse(json.dumps(l, ensure_ascii=False),
                            content_type="application/json")


@csrf_exempt
def create_record(request):
    if request.method == 'POST':
        data = request.body.decode().split(':')
        print(data)
        rec = Record()
        rec.fio = data[1].split(',')[0][1:-1]
        rec.survey = data[2].split(',')[0][1:-1]
        rec.Card = Man.objects.get(fio = rec.fio).Card
        t = data[3].replace('T',' ')[1::] +':' +  data[4][0:-2]
        d = datetime.strptime(t,'%Y-%m-%d %H:%M')
        rec.date = d
        rec.save()
    return HttpResponseRedirect('record/')


@csrf_exempt
def delete_survey(request):
    if request.method == 'POST':
            d = request.body.decode().split(':')[1][0:-1]
            d = d[1:-1]
            d = int(d)
            print(d)
            survey = Surveys.objects.get(id = d)
            survey.delete()
            return HttpResponseRedirect('survey/')



@csrf_exempt
def delete_record(request):
    if request.method == 'POST':
        try:
            d = int(request.body.decode())
            survey = Record.objects.get(id=d)
            survey.delete()
            return HttpResponseRedirect('record/')
        except Surveys.DoesNotExist:
            return HttpResponseRedirect('record/')


@csrf_exempt
def done_record(request):
    if request.method == 'POST':
        d = int(request.body.decode())
        record = Record.objects.get(id = d)
        record.status = 'Сделано'
        record.save()
        return HttpResponseRedirect('/')


@csrf_exempt
def cancel_record(request):
    if request.method == 'POST':
        d = int(request.body.decode())
        record = Record.objects.get(id=d)
        record.status = 'Отменён'
        record.save()
        return HttpResponseRedirect('record/')



@csrf_exempt
def delete_man(request):
    if request.method == 'POST':
        try:
            d = int(request.body.decode())
            man = Man.objects.get(id=d)
            man.delete()
            return HttpResponseRedirect('patients/')
        except Surveys.DoesNotExist:
            return HttpResponseRedirect('patients/')



class UserLoginView(LoginView):
    template_name = 'med/index.html'
    form_class = AuthUserForm
    success_url = reverse_lazy('Patients_page')

    def get_success_url(self):
        return self.success_url

    def form_valid(self, form):
        form_valid = super().form_valid(form)
        username = form.cleaned_data["username"]
        password = form.cleaned_data["password"]
        aut_user = authenticate(username=username, password=password)
        login(self.request, aut_user)
        return form_valid



class UserRegisterView(CreateView):
    model = User
    template_name = 'registration/registration_page.html'
    form_class = RegisterUserForm
    success_url = reverse_lazy('login_page')



class UserLogoutView(LogoutView):
    next_page = 'login_page'


