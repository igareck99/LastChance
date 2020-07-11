from django.urls import path, re_path, include
from .views import *
urlpatterns = [
    path('survey/', surving, name='survey_page'),
    path('patients/', Patients,name = 'Patients_page'),
    path('record/', recording, name = 'record_page'),
    re_path(r'patients_update/$', people_list),
    re_path(r'survey_list/$', survey_list),
    re_path(r'create/$', Create, name = 'create'),
    re_path(r'get_fio/$',get_fio),
    re_path(r'get_survey/$',get_survey),
    re_path(r'record_list/$',record_list),
    re_path(r'create_survey/$', createSurvey, name = 'create_survey'),
    re_path(r'create_record/$', create_record, name = 'create_record'),
    re_path(r'delete_survey/$',delete_survey, name = 'delete_survey'),
    re_path(r'delete_record/$',delete_record, name = 'delete_record'),
    re_path(r'delete_man/$',delete_man, name = 'delete_man'),
    re_path(r'html/patients.html$',Patients,name = 'authing'),
    path('', UserLoginView.as_view(), name='login_page'),
    path('logout', UserLogoutView.as_view(), name='logout_page')


]