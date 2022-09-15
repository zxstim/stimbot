from django.conf import settings
#custom send email 
from django.core.mail import EmailMessage


def send_email(data):
    email = EmailMessage(
                        subject=data['email_subject'],
                        body=data['email_body'],
                        from_email = data['from_email'],# from = 'Dont Reply',
                        to=[data['to_email']],)
    email.content_subtype = data['content_subtype']
    email.send()