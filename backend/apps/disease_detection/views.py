<<<<<<< HEAD
from rest_framework.generics import ListCreateAPIView

from apps.disease_detection.models import DiseaseHistory
from apps.disease_detection.serializers import DiseaseHistorySerializer
=======
import re

from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.chatbot.sf_ai_service import SFAIServiceError, analyze_crop_image
from apps.disease_detection.models import DiseaseHistory
from apps.disease_detection.serializers import DiseaseAnalyzeSerializer, DiseaseHistorySerializer
>>>>>>> ai-integration
from apps.users.permissions import IsJWTAuthenticated


class DiseaseHistoryListCreateAPIView(ListCreateAPIView):
	serializer_class = DiseaseHistorySerializer
	permission_classes = [IsJWTAuthenticated]

	def get_queryset(self):
		return DiseaseHistory.objects.filter(user=self.request.user).order_by("-date")

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)
<<<<<<< HEAD
=======


class DiseaseAnalyzeAPIView(APIView):
    permission_classes = [IsJWTAuthenticated]

    def post(self, request):
        serializer = DiseaseAnalyzeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            result = analyze_crop_image(
                serializer.context["image_base64"],
                serializer.context["mime_type"],
                serializer.validated_data.get("crop_hint", ""),
            )
            prediction = str(result.get("prediction", "Visual crop assessment")).strip()[:150]
            confidence_text = str(result.get("confidence", 0))
            confidence_match = re.search(r"\d{1,3}", confidence_text)
            confidence = max(0, min(100, int(confidence_match.group()) if confidence_match else 0))
            treatment = str(result.get("treatment", "Please retake a clear crop-leaf photo.")).strip()
            disclaimer = str(result.get("disclaimer", "This is an AI visual assessment, not a confirmed diagnosis.")).strip()
        except (SFAIServiceError, ValueError, TypeError) as exc:
            detail = str(exc) if isinstance(exc, SFAIServiceError) else "AI returned an invalid assessment. Please try again."
            code = exc.status_code if isinstance(exc, SFAIServiceError) else 502
            return Response({"detail": detail}, status=code)

        saved = DiseaseHistory.objects.create(
            user=request.user,
            image_url=serializer.validated_data["image_data"][:500],
            prediction=prediction or "Visual crop assessment",
            confidence=confidence,
            treatment=treatment,
        )
        return Response({**DiseaseHistorySerializer(saved).data, "disclaimer": disclaimer}, status=status.HTTP_201_CREATED)
>>>>>>> ai-integration
