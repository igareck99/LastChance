from django.db import models

class Man(models.Model):
    id = models.IntegerField(primary_key=True)
    fio = models.CharField(max_length = 50,db_index=True)
    Card = models.CharField(max_length = 50,db_index=True)
    date = models.DateTimeField(auto_now=True)


    def __str__(self):
        return '{}'.format(self.FIO)



class Surveys(models.Model):
    id = models.IntegerField(primary_key=True,db_index=True)
    Survey = models.CharField(max_length = 50)


    def __str__(self):
        return '{}'.format(self.survey)


class Status_Record(models.Model):
    id = models.IntegerField(primary_key=True)
    Stat = models.CharField(max_length = 50,db_index=True)

    def __str__(self):
        return '{}'.format(self.status)

class Record(models.Model):
    id = models.IntegerField(primary_key=True)
    fio = models.CharField(max_length = 80,db_index=True)
    survey =  models.CharField(max_length = 80,db_index=True)
    Card = models.CharField(max_length = 80,db_index=True)
    status = models.CharField(max_length=40, db_index=True,default='Ожидает')
    date = models.DateTimeField()



    def __str__(self):
        return '{}'.format(self.fio)


