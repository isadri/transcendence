from django.contrib.postgres.operations import CITextExtension
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        # Install the citext extension to provide a case-insensitive character
        # string type.
        CITextExtension,
    ]
