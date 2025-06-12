from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import StepInstance
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TriggerNextStepSerializer
from action.serializers import ActionSerializer  # You'll need to create this
from step.models import StepTransition

class AvailableActionsView(APIView):
    def get(self, request, step_instance_id):
        try:
            instance = StepInstance.objects.get(step_instance_id=step_instance_id)
        except StepInstance.DoesNotExist:
            return Response({'detail': 'StepInstance not found'}, status=status.HTTP_404_NOT_FOUND)

        current_step = instance.step_transition_id.to_step_id
        transitions = StepTransition.objects.filter(from_step_id=current_step)
        actions = [t.action_id for t in transitions if t.action_id]

        serializer = ActionSerializer(actions, many=True)
        return Response(serializer.data)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import StepInstance, StepTransition
from .serializers import TriggerNextStepSerializer
from rest_framework.generics import CreateAPIView
from rest_framework.exceptions import NotFound

class TriggerNextStepView(CreateAPIView):
    queryset = StepInstance.objects.all()
    serializer_class = TriggerNextStepSerializer

    def get(self, request, step_instance_id):
        try:
            instance = StepInstance.objects.get(step_instance_id=step_instance_id)
        except StepInstance.DoesNotExist:
            return Response({'detail': 'StepInstance not found'}, status=status.HTTP_404_NOT_FOUND)

        # Find the current step based on the transition taken to reach this instance
        current_step = instance.step_transition_id.to_step_id
        if not current_step:
            return Response({'detail': 'This step does not transition to another step.'}, status=status.HTTP_204_NO_CONTENT)

        transitions = StepTransition.objects.filter(from_step_id=current_step).select_related('action_id')
        actions = [t.action_id for t in transitions if t.action_id]

        serialized_actions = ActionSerializer(actions, many=True).data
        return Response({
            'step_instance_id': step_instance_id,
            'current_step_id': current_step.step_id,
            'available_actions': serialized_actions
        })

    def get_step_instance(self):
        try:
            return StepInstance.objects.get(step_instance_id=self.kwargs['step_instance_id'])
        except StepInstance.DoesNotExist:
            raise NotFound('StepInstance not found')

    def create(self, request, *args, **kwargs):
        step_instance = self.get_step_instance()

        serializer = self.get_serializer(data=request.data, context={'step_instance': step_instance})
        serializer.is_valid(raise_exception=True)
        step_instance = serializer.save()

        return Response({
            'message': 'Step instance created',
            'step_instance_id': step_instance.step_instance_id
        }, status=status.HTTP_201_CREATED)