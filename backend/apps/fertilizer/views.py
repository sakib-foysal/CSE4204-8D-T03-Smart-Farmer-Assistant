<<<<<<< HEAD
from rest_framework.generics import ListCreateAPIView

from apps.fertilizer.models import FertilizerRecommendation
from apps.fertilizer.serializers import FertilizerRecommendationSerializer
=======
from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.chatbot.sf_ai_service import SFAIServiceError, generate_fertilizer_plan
from apps.fertilizer.models import FertilizerRecommendation
from apps.fertilizer.serializers import FertilizerGenerateSerializer, FertilizerRecommendationSerializer
>>>>>>> ai-integration
from apps.users.permissions import IsJWTAuthenticated


class FertilizerRecommendationListCreateAPIView(ListCreateAPIView):
	serializer_class = FertilizerRecommendationSerializer
	permission_classes = [IsJWTAuthenticated]

	def get_queryset(self):
		return FertilizerRecommendation.objects.filter(user=self.request.user).order_by("-date")

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)
<<<<<<< HEAD
=======


class FertilizerGenerateAPIView(APIView):
    permission_classes = [IsJWTAuthenticated]

    def post(self, request):
        serializer = FertilizerGenerateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            plan = generate_fertilizer_plan(
                serializer.validated_data["crop_name"],
                serializer.validated_data.get("farm_context", ""),
            )
        except SFAIServiceError as exc:
            return Response({"detail": str(exc)}, status=exc.status_code)

        fertilizers = plan.get("fertilizers") if isinstance(plan, dict) else None
        tips = plan.get("tips") if isinstance(plan, dict) else None
        if not isinstance(fertilizers, list) or not isinstance(tips, list):
            return Response({"detail": "AI returned an invalid fertilizer plan. Please try again."}, status=502)
        saved = FertilizerRecommendation.objects.create(
            user=request.user,
            crop_name=serializer.validated_data["crop_name"],
            suggestion="\n".join(f"{item.get('name', 'Fertilizer')}: {item.get('amount', '')}. {item.get('timing', '')}" for item in fertilizers if isinstance(item, dict)),
        )
        return Response({"id": str(saved.id), "crop": plan.get("crop") or saved.crop_name, "fertilizers": fertilizers, "tips": tips, "disclaimer": plan.get("disclaimer", "Confirm recommendations with a soil test and local agriculture officer."), "date": saved.date}, status=status.HTTP_201_CREATED)
>>>>>>> ai-integration
