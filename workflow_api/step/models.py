from django.db import models
from role.models import Roles
from action.models import Actions
from django.core.exceptions import ValidationError
import uuid

class Steps(models.Model):
    step_id = models.CharField(max_length=64, unique=True, null=True, blank=True)  # New UUID field
    
    # foreign keys - now reference UUID fields
    workflow_id = models.ForeignKey('workflow.Workflows', on_delete=models.CASCADE, to_field='workflow_id')
    role_id = models.ForeignKey(Roles, on_delete=models.PROTECT, to_field='role_id')

    # steps details
    name = models.CharField(max_length=64, unique=True)
    description = models.CharField(max_length=256, null=True)
    order = models.PositiveIntegerField(default=0)

    # flags
    is_initialized = models.BooleanField(default=False)

    # timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.name} (Order: {self.order})"  # Fixed: was stepName, now name

    def save(self, *args, **kwargs):
        if not self.pk:  # Only enforce immutability on creation
            if not self.step_id:
                self.step_id = str(uuid.uuid4())  # Assign a unique identifier if missing
        else:
            if 'step_id' in kwargs.get('update_fields', []):
                raise ValidationError("step_id cannot be modified after creation.")  # Prevent updates

        super().save(*args, **kwargs)  # Save to database

    def get_workflow(self):
        # Optional: only if you need to reference it somewhere dynamically
        from workflow.models import Workflows
        return Workflows.objects.first()


class StepTransition(models.Model):
    transition_id = models.CharField(max_length=64, unique=True, null=True, blank=True)  # New UUID field
    workflow_id = models.ForeignKey('workflow.Workflows',  unique=False, on_delete=models.CASCADE, to_field='workflow_id', null=True)
    
    from_step_id = models.ForeignKey(
        Steps,
        related_name='outgoing_transitions',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        to_field='step_id'  # Reference the UUID field
    )
    to_step_id = models.ForeignKey(
        Steps,
        related_name='incoming_transitions',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        to_field='step_id'  # Reference the UUID field
    )
    action_id = models.ForeignKey(
        Actions,
        on_delete=models.CASCADE,
        null=True,
        unique=True,  # enforce one-to-one between Action and StepTransition
        to_field='action_id'  # Reference the UUID field
    )

    class Meta:
        constraints = [
            # this is redundant if you use unique=True above, but shown here
            models.UniqueConstraint(
                fields=['action_id'],
                name='unique_action_per_step_transition'
            )
        ]

    def clean(self):
        super().clean()

        # 1) No self-loop
        if self.from_step_id and self.to_step_id and self.from_step_id == self.to_step_id:
            raise ValidationError("from_step and to_step must be different")
        # 2) Same-workflow guard - Fixed attribute names
        if self.from_step_id and self.to_step_id and (
            self.from_step_id.workflow_id != self.to_step_id.workflow_id
        ):
            raise ValidationError("from_step and to_step must belong to the same workflow")

    def save(self, *args, **kwargs):
        if not self.pk:
            if not self.transition_id:
                self.transition_id = str(uuid.uuid4())
        else:
            if 'transition_id' in kwargs.get('update_fields', []):
                raise ValidationError("transition_id cannot be modified after creation.")

        # Determine workflow_id from steps
        if self.from_step_id and self.to_step_id:
            if self.from_step_id.workflow_id != self.to_step_id.workflow_id:
                raise ValidationError("from_step and to_step must belong to the same workflow")
            self.workflow_id = self.from_step_id.workflow_id
        elif self.from_step_id:
            self.workflow_id = self.from_step_id.workflow_id
        elif self.to_step_id:
            self.workflow_id = self.to_step_id.workflow_id
        else:
            raise ValidationError("At least one of from_step or to_step must be set.")

        # ensure clean() runs on every save
        self.full_clean()
        super().save(*args, **kwargs)