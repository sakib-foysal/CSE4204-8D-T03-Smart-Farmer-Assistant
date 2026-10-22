from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.chatbot.sf_ai_service import SFAIServiceError, generate_fertilizer_plan
from apps.fertilizer.models import FertilizerRecommendation
from apps.disease_detection.models import DiseaseHistory
from apps.fertilizer.serializers import FertilizerGenerateSerializer, FertilizerRecommendationSerializer
from apps.users.permissions import IsJWTAuthenticated


class FertilizerRecommendationListCreateAPIView(ListCreateAPIView):
	serializer_class = FertilizerRecommendationSerializer
	permission_classes = [IsJWTAuthenticated]

	def get_queryset(self):
		return FertilizerRecommendation.objects.filter(user=self.request.user).order_by("-date")

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


class FertilizerGenerateAPIView(APIView):
    permission_classes = [IsJWTAuthenticated]

    def post(self, request):
        serializer = FertilizerGenerateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        crop_name = serializer.validated_data["crop_name"]
        language = serializer.validated_data["language"]
        area_sqft = serializer.validated_data["area_sqft"]
        disease = None
        if serializer.validated_data.get("disease_id"):
            disease = DiseaseHistory.objects.filter(id=serializer.validated_data["disease_id"], user=request.user).first()
            if disease is None:
                return Response({"detail": "Disease assessment was not found."}, status=status.HTTP_404_NOT_FOUND)
        disease_name = disease.prediction if disease else serializer.validated_data.get("farm_context", "unspecified")
        try:
            plan = generate_fertilizer_plan(
                crop_name,
                f"Visual disease assessment: {disease_name}. Cultivated area: {area_sqft} square feet. Recommend crop-specific fertilizer by name and give amounts calculated for this exact area. Adapt the nutrient guidance to this disease, but clearly state that fertilizer does not cure infection.",
                language,
            )
        except SFAIServiceError as exc:
            return Response({"detail": str(exc)}, status=exc.status_code)

        fertilizers = plan.get("fertilizers") if isinstance(plan, dict) else None
        tips = plan.get("tips") if isinstance(plan, dict) else None
        if (
            not isinstance(fertilizers, list)
            or not fertilizers
            or not all(isinstance(item, dict) for item in fertilizers)
            or any(not str(item.get("name", "")).strip() or not str(item.get("amount", "")).strip() for item in fertilizers)
            or any(not any(character.isdigit() for character in str(item.get("amount", ""))) for item in fertilizers)
            or not isinstance(tips, list)
            or not all(isinstance(item, str) for item in tips)
        ):
            return Response({"detail": "AI could not produce crop-specific fertilizer amounts for the supplied area. Please try again."}, status=status.HTTP_502_BAD_GATEWAY)
        saved = FertilizerRecommendation.objects.create(
            user=request.user,
            disease=disease,
            crop_name=plan.get("crop") or crop_name,
            suggestion="\n".join(f"{item.get('name', 'Fertilizer')}: {item.get('amount', '')}. {item.get('timing', '')}" for item in fertilizers if isinstance(item, dict)),
        )
        return Response({"id": str(saved.id), "crop": plan.get("crop") or saved.crop_name, "fertilizers": fertilizers, "tips": tips, "disclaimer": plan.get("disclaimer", "Confirm recommendations with a soil test and local agriculture officer."), "date": saved.date}, status=status.HTTP_201_CREATED)
