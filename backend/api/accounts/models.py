from django.contrib.auth import models


class User(models.AbstractUser):
    profile_picture = models.models.ImageField(upload_to='profiles',
                                default='./media/default/default_profile.png')

    def __str__(self):
        return self.username
