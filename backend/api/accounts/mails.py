from django.conf import settings
from django.core.mail import send_mail

from  .models import User


def send_email_verification(to_email: str, confirmation_url: str) -> None:
    """
    Send the verification email to the given email.
    """
    html_message = f"""
    <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #000;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }}
                .email-container {{
                    background-color: #ffffff;
                    border: 1px solid #ddd;
                    padding: 20px;
                    margin: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }}
                h1 {{
                    color: #4CAF50;
                }}
                p {{
                    font-size: 16px;
                }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <h1>Please confirm your Email</h1>
                <p>Click here to confirm your email:</p>
                <a href="{confirmation_url}"
                style="background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">
                    Confirm
                </a>
            </div>
        </body>
    </html>
    """
    #user.email_user(
    #    subject='Please confirm your Email',
    #    message=('Click this link to confirm your email '
    #             f'{confirmation_url}'),
    #    from_email=settings.EMAIL_HOST_USER,
    #    html_message=html_message
    #)
    send_mail(
        subject='Please confirm your Email',
        message=('Click this link to confirm your email '
                 f'{confirmation_url}'),
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[to_email],
        html_message=html_message,
        fail_silently=True
    )


def send_email(user: User, *, subject: str, message: str,
               html_message: str) -> None:
    """
    Send an email to the user.
    """
    user.email_user(
        subject=subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        html_message=html_message
    )

