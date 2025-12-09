# Generated manually for EcoCash API integration

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('accounting', '0003_alter_category_category_type'),
        ('ecocash', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='ecocashpayment',
            name='customer_msisdn',
            field=models.CharField(default='263000000000', help_text='Customer phone number', max_length=15),
        ),
        migrations.AddField(
            model_name='ecocashpayment',
            name='currency',
            field=models.CharField(choices=[('USD', 'US Dollar'), ('ZIG', 'Zimbabwe Gold')], default='USD', max_length=3),
        ),
        migrations.AddField(
            model_name='ecocashpayment',
            name='reason',
            field=models.CharField(default='Payment', help_text='Payment description', max_length=255),
        ),
        migrations.AddField(
            model_name='ecocashpayment',
            name='source_reference',
            field=models.UUIDField(default=uuid.uuid4, help_text='Unique payment reference', unique=True),
        ),
        migrations.AddField(
            model_name='ecocashpayment',
            name='ecocash_transaction_id',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='ecocashpayment',
            name='response_data',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='ecocashpayment',
            name='error_message',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='ecocashpayment',
            name='transaction',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='accounting.transaction'),
        ),
        migrations.AddField(
            model_name='ecocashpayment',
            name='auto_payment',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='ecocash.automaticbillpayment'),
        ),
        migrations.AddField(
            model_name='ecocashpayment',
            name='completed_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='automaticbillpayment',
            name='recipient_msisdn',
            field=models.CharField(default='263000000000', help_text='Recipient phone number', max_length=15),
        ),
        migrations.AddField(
            model_name='automaticbillpayment',
            name='currency',
            field=models.CharField(choices=[('USD', 'US Dollar'), ('ZIG', 'Zimbabwe Gold')], default='USD', max_length=3),
        ),
        migrations.AddField(
            model_name='automaticbillpayment',
            name='reason',
            field=models.CharField(default='Bill Payment', help_text='Payment description', max_length=255),
        ),
        migrations.AddField(
            model_name='automaticbillpayment',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='ecocashpayment',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('processing', 'Processing'), ('completed', 'Completed'), ('failed', 'Failed'), ('cancelled', 'Cancelled')], default='pending', max_length=20),
        ),
        migrations.AlterField(
            model_name='automaticbillpayment',
            name='frequency',
            field=models.CharField(choices=[('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly'), ('quarterly', 'Quarterly'), ('yearly', 'Yearly')], default='monthly', max_length=20),
        ),
        migrations.AlterModelOptions(
            name='ecocashpayment',
            options={'ordering': ['-created_at']},
        ),
        migrations.AlterModelOptions(
            name='automaticbillpayment',
            options={'ordering': ['-created_at']},
        ),
    ]