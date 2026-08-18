import re
import hashlib

from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.chatbot.sf_ai_service import SFAIServiceError, analyze_crop_image, analyze_crop_video
from apps.disease_detection.models import DiseaseHistory
from apps.disease_detection.serializers import DiseaseAnalyzeSerializer, DiseaseHistorySerializer
from apps.users.permissions import IsJWTAuthenticated


class DiseaseHistoryListCreateAPIView(ListCreateAPIView):
	serializer_class = DiseaseHistorySerializer
	permission_classes = [IsJWTAuthenticated]

	def get_queryset(self):
		return DiseaseHistory.objects.filter(user=self.request.user).order_by("-date")

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


class DiseaseAnalyzeAPIView(APIView):
    permission_classes = [IsJWTAuthenticated]

    def post(self, request):
        serializer = DiseaseAnalyzeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        language = serializer.validated_data["language"]
        try:
            result = analyze_crop_image(
                serializer.context["image_base64"],
                serializer.context["mime_type"],
                serializer.validated_data.get("crop_hint", "") or ("বাংলা" if language == "bn" else ""),
            )
            crop = str(result.get("crop", "")).strip()[:100]
            if crop.upper() in {"UNKNOWN", "NOT SURE", "UNCERTAIN", "N/A", "NONE"}:
                crop = ""
            prediction = str(result.get("prediction", "Visual crop assessment")).strip()[:150]
            confidence_text = str(result.get("confidence", 0))
            confidence_match = re.search(r"\d{1,3}", confidence_text)
            confidence = max(0, min(100, int(confidence_match.group()) if confidence_match else 0))
            treatment = str(result.get("treatment", "Please retake a clear crop-leaf photo.")).strip()
            disclaimer = str(result.get("disclaimer", "This is an AI visual assessment, not a confirmed diagnosis.")).strip()
        except (SFAIServiceError, ValueError, TypeError) as exc:
            detail = str(exc) if isinstance(exc, SFAIServiceError) else "AI returned an invalid assessment. Please try again."
            status_code = exc.status_code if isinstance(exc, SFAIServiceError) else status.HTTP_502_BAD_GATEWAY
            return Response({"detail": detail}, status=status_code)

        prediction = prediction or "Visual crop assessment"
        image_hash = hashlib.sha256(serializer.context["image_base64"].encode("ascii")).hexdigest()
        prediction_key = " ".join(prediction.casefold().split())
        is_crop = bool(result.get("is_crop"))
        has_disease = bool(result.get("has_disease")) and is_crop
        saved = DiseaseHistory.objects.filter(
            user=request.user,
            image_hash=image_hash,
            prediction_key=prediction_key,
        ).first()
        if saved is None:
            saved = DiseaseHistory.objects.create(
                user=request.user,
                image_url=serializer.validated_data["image_data"],
                crop_name=crop,
                image_hash=image_hash,
                prediction=prediction,
                prediction_key=prediction_key,
                confidence=confidence,
                treatment=treatment,
                disclaimer=disclaimer,
            )
        return Response({**DiseaseHistorySerializer(saved).data, "crop": saved.crop_name, "disclaimer": saved.disclaimer or disclaimer, "is_crop": is_crop, "has_disease": has_disease}, status=status.HTTP_201_CREATED)


class DiseaseVideoAnalyzeAPIView(APIView):
    permission_classes = [IsJWTAuthenticated]
    allowed_types = {"video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo", "video/webm", "video/x-ms-wmv", "video/3gpp"}

    def post(self, request):
        video = request.FILES.get("video")
        if video is None:
            return Response({"detail": "Upload a crop video."}, status=status.HTTP_400_BAD_REQUEST)
        if video.content_type not in self.allowed_types:
            return Response({"detail": "Upload an MP4, MOV, AVI, WEBM, MPEG, WMV, or 3GP video."}, status=status.HTTP_400_BAD_REQUEST)
        if video.size > 1024 * 1024 * 1024:
            return Response({"detail": "Video must be 1 GB or smaller."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            result = analyze_crop_video(video, video.content_type, request.data.get("crop_hint", ""))
        except SFAIServiceError as exc:
            return Response({"detail": str(exc)}, status=exc.status_code)
        prediction = str(result.get("prediction") or "SF AI crop video assessment")[:150]
        video_hash = hashlib.sha256()
        video.seek(0)
        for chunk in video.chunks():
            video_hash.update(chunk)
        media_hash = video_hash.hexdigest()
        prediction_key = " ".join(prediction.casefold().split())
        confidence_match = re.search(r"\d{1,3}", str(result.get("confidence", 0)))
        confidence = max(0, min(100, int(confidence_match.group()) if confidence_match else 0))
        saved, _ = DiseaseHistory.objects.get_or_create(
            user=request.user,
            image_hash=media_hash,
            prediction_key=prediction_key,
            defaults={
                "image_url": f"video:{media_hash}",
                "crop_name": str(result.get("crop") or "")[:100],
                "prediction": prediction,
                "confidence": confidence,
                "treatment": str(result.get("treatment") or "Upload a clear crop video."),
                "disclaimer": str(result.get("disclaimer") or "This is an AI visual assessment, not a laboratory-confirmed diagnosis."),
            },
        )
        is_crop = bool(result.get("is_crop"))
        return Response({**DiseaseHistorySerializer(saved).data, "crop": saved.crop_name, "disclaimer": saved.disclaimer, "is_crop": is_crop, "has_disease": bool(result.get("has_disease")) and is_crop}, status=status.HTTP_201_CREATED)
