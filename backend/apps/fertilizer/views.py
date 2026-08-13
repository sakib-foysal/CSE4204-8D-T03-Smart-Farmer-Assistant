from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.chatbot.sf_ai_service import SFAIServiceError, generate_fertilizer_plan
from apps.fertilizer.models import FertilizerRecommendation
from apps.fertilizer.serializers import FertilizerGenerateSerializer, FertilizerRecommendationSerializer
from apps.users.permissions import IsJWTAuthenticated


def fallback_fertilizer_plan(crop, language):
    if language == "bn":
        return {
            "crop": crop,
            "fertilizers": [
                {"name": "সুষম সার পরিকল্পনা", "amount": "মাটির পরীক্ষার ফল ও পণ্যের লেবেল অনুযায়ী সুষম NPK সার ব্যবহার করুন।", "timing": "জমি প্রস্তুতির সময় এবং ফসলের বৃদ্ধির ধাপ অনুযায়ী ভাগ করে প্রয়োগ করুন।"},
                {"name": "জৈব সার", "amount": "ভালোভাবে পচানো গোবর বা কম্পোস্ট স্থানীয় সুপারিশ অনুযায়ী দিন।", "timing": "জমি প্রস্তুতির সময় মাটির সঙ্গে ভালোভাবে মিশিয়ে দিন।"},
            ],
            "tips": [
                "একবারে অতিরিক্ত সার দেবেন না; ফসলের বৃদ্ধি দেখে ভাগ করে দিন।",
                "সার দেওয়ার পরে প্রয়োজনমতো সেচ দিন, কিন্তু জমিতে পানি জমতে দেবেন না।",
                "পাতার রোগ বা পোকার সময় নাইট্রোজেন সার অতিরিক্ত ব্যবহার এড়িয়ে চলুন।",
            ],
            "disclaimer": "এটি নিরাপদ সাধারণ নির্দেশনা। সঠিক পরিমাণের জন্য মাটি পরীক্ষা, ফসলের বয়স এবং পণ্যের লেবেল অনুসরণ করুন।",
        }
    return {
        "crop": crop,
        "fertilizers": [
            {"name": "Balanced fertilizer plan", "amount": "Use a balanced NPK fertilizer only according to a soil test and the product label.", "timing": "Apply in split doses during land preparation and the crop's growth stages."},
            {"name": "Organic matter", "amount": "Use well-decomposed compost or manure according to local guidance.", "timing": "Incorporate it well into the soil during land preparation."},
        ],
        "tips": [
            "Do not apply too much fertilizer at once; split applications according to crop growth.",
            "Irrigate as needed after fertilizer application, without allowing standing water.",
            "Avoid excessive nitrogen while the crop has active pest or disease damage.",
        ],
        "disclaimer": "This is a safe general guide. Confirm the exact dose with a soil test, crop stage, and product label.",
    }


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
        try:
            plan = generate_fertilizer_plan(
                crop_name,
                serializer.validated_data.get("farm_context", ""),
                language,
            )
        except SFAIServiceError:
            plan = fallback_fertilizer_plan(crop_name, language)

        fertilizers = plan.get("fertilizers") if isinstance(plan, dict) else None
        tips = plan.get("tips") if isinstance(plan, dict) else None
        if (
            not isinstance(fertilizers, list)
            or not fertilizers
            or not all(isinstance(item, dict) for item in fertilizers)
            or not isinstance(tips, list)
            or not all(isinstance(item, str) for item in tips)
        ):
            plan = fallback_fertilizer_plan(crop_name, language)
            fertilizers = plan["fertilizers"]
            tips = plan["tips"]
        saved = FertilizerRecommendation.objects.create(
            user=request.user,
            crop_name=plan.get("crop") or crop_name,
            suggestion="\n".join(f"{item.get('name', 'Fertilizer')}: {item.get('amount', '')}. {item.get('timing', '')}" for item in fertilizers if isinstance(item, dict)),
        )
        return Response({"id": str(saved.id), "crop": plan.get("crop") or saved.crop_name, "fertilizers": fertilizers, "tips": tips, "disclaimer": plan.get("disclaimer", "Confirm recommendations with a soil test and local agriculture officer."), "date": saved.date}, status=status.HTTP_201_CREATED)
