# Generated by Django 5.2 on 2025-05-04 13:56

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('commentId', models.AutoField(primary_key=True, serialize=False)),
                ('taskId', models.IntegerField()),
                ('agentId', models.IntegerField()),
                ('content', models.TextField()),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
