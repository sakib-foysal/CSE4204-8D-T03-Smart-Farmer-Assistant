const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar: string;
  role: string;
  created_at: string;
}

export interface AdminUser extends UserProfile {
  is_active: boolean;
}

export interface AdminDashboardData {
  stats: {
    total_users: number;
    total_detections: number;
    total_chats: number;
    active_today: number;
  };
  activity: Array<{ date: string; name: string; users: number; detections: number; chats: number }>;
  recent_users: AdminUser[];
}

export interface AuthResponse {
  message: string;
  user: UserProfile;
  access_token: string;
  token_type: string;
}

export interface WeatherData {
  id: string;
  temperature: string;
  humidity: string;
  rainfall: string;
  flood_risk: "low" | "medium" | "high";
  date: string;
}

export interface MarketPrice {
  id: string;
  crop_name: string;
  price: string;
  unit: string;
  region: string;
  date: string;
}

export interface DiseaseHistory {
  id: string;
  image_url: string;
  crop_name: string;
  prediction: string;
  confidence: string | number;
  treatment: string;
  disclaimer: string;
  fertilizer_recommendations: string[];
  date: string;
}

export interface ChatHistory {
  id: string;
  conversation?: string | null;
  question: string;
  response: string;
  date: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface WeatherForecastDay {
  date: string;
  temperature_max: number;
  temperature_min: number;
  rainfall: number;
  rain_probability: number;
  wind_speed: number;
  weather_code: number;
  flood_risk: "low" | "medium" | "high";
}

export interface WeatherAlert {
  type: "flood" | "rain" | "lightning" | "wind" | "heat";
  severity: "medium" | "high";
  message: string;
  start_date: string;
  end_date: string;
  days: number;
  do: string[];
  avoid: string[];
}

export interface HourlyRainForecast {
  date: string;
  time: string;
  rain_probability: number;
  rainfall: number;
}

export interface LiveWeatherForecast {
  location: string;
  updated_at: string;
  current: { temperature: number; humidity: number; rainfall: number; wind_speed: number; weather_code: number };
  forecast: WeatherForecastDay[];
  hourly: HourlyRainForecast[];
  alerts: WeatherAlert[];
}

export interface DiseaseAnalysis extends DiseaseHistory {
  crop: string;
  disclaimer: string;
  is_crop: boolean;
  has_disease: boolean;
}

export interface SFAIChatResponse extends ChatHistory {
  model: string;
}

export interface FertilizerRecommendation {
  id: string;
  disease: string;
  crop_name: string;
  suggestion: string;
  date: string;
}

export interface FertilizerPlan {
  id: string;
  crop: string;
  fertilizers: Array<{ name: string; amount: string; timing: string }>;
  tips: string[];
  disclaimer: string;
  date: string;
  trend: "up" | "down" | "same" | "new";
}

type ApiOptions = RequestInit & {
  token?: string | null;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let data: Record<string, unknown> = {};

  if (text) {
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      data = { detail: text };
    }
  }

  if (!response.ok) {
    const detail =
      data.detail ||
      (Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : undefined) ||
      Object.values(data).flat().join(" ") ||
      "Request failed. Please try again.";
    throw new Error(detail);
  }

  return data as T;
}

export async function checkBackendHealth() {
  return apiRequest<{ message: string }>("/api/health/");
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}) {
  const headers = new Headers(options.headers);
  const hasBody = options.body !== undefined;

  if (hasBody && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  return parseResponse<T>(response);
}

export const api = {
  register: (payload: Record<string, unknown>) =>
    apiRequest<AuthResponse>("/api/register/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (identifier: string, password: string) =>
    apiRequest<AuthResponse>("/api/login/", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    }),
  logout: (token: string) =>
    apiRequest<{ message: string }>("/api/logout/", {
      method: "POST",
      token,
    }),
  profile: (token: string) =>
    apiRequest<UserProfile>("/api/profile/", {
      token,
    }),
  updateProfile: (token: string, payload: Partial<UserProfile>) =>
    apiRequest<{ message: string; user: UserProfile }>("/api/profile/", {
      method: "PUT",
      token,
      body: JSON.stringify(payload),
    }),
  weather: (token: string) =>
    apiRequest<WeatherData[]>("/api/weather-data/", {
      token,
    }),
  marketPrices: (token: string) =>
    apiRequest<MarketPrice[]>("/api/market-prices/", {
      token,
    }),
  createMarketPrice: (token: string, payload: Omit<MarketPrice, "id" | "date" | "trend">) =>
    apiRequest<MarketPrice>("/api/market-prices/", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }),
  diseaseHistory: (token: string) =>
    apiRequest<DiseaseHistory[]>("/api/disease-history/", {
      token,
    }),
  createDiseaseHistory: (token: string, payload: Omit<DiseaseHistory, "id" | "date">) =>
    apiRequest<DiseaseHistory>("/api/disease-history/", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }),
  chatHistory: (token: string) =>
    apiRequest<ChatHistory[]>("/api/chat-history/", {
      token,
    }),
  createChatHistory: (token: string, payload: Pick<ChatHistory, "question" | "response">) =>
    apiRequest<ChatHistory>("/api/chat-history/", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }),
  weatherForecast: (token: string, language: "en" | "bn") =>
    apiRequest<LiveWeatherForecast>(`/api/weather-data/forecast/?lang=${language}`, { token }),
  analyzeDisease: (token: string, image_data: string, crop_hint = "", language: "en" | "bn" = "en", signal?: AbortSignal) =>
    apiRequest<DiseaseAnalysis>("/api/disease-history/analyze/", {
      method: "POST",
      token,
      body: JSON.stringify({ image_data, crop_hint, language }), signal,
    }),
  analyzeDiseaseVideo: (token: string, video: File, crop_hint = "", signal?: AbortSignal) => {
    const body = new FormData(); body.append("video", video); body.append("crop_hint", crop_hint);
    return apiRequest<DiseaseAnalysis>("/api/disease-history/analyze-video/", { method: "POST", token, body, signal });
  },
  chatConversations: (token: string) =>
    apiRequest<ChatConversation[]>("/api/chat-history/conversations/", { token }),
  createChatConversation: (token: string, title = "New chat") =>
    apiRequest<ChatConversation>("/api/chat-history/conversations/", {
      method: "POST", token, body: JSON.stringify({ title }),
    }),
  chatConversationMessages: (token: string, conversationId: string) =>
    apiRequest<ChatHistory[]>(`/api/chat-history/conversations/${conversationId}/messages/`, { token }),
  updateChatConversation: (token: string, conversationId: string, title: string) =>
    apiRequest<ChatConversation>(`/api/chat-history/conversations/${conversationId}/`, {
      method: "PATCH", token, body: JSON.stringify({ title }),
    }),
  askSFAI: (token: string, question: string, conversation_id?: string) =>
    apiRequest<SFAIChatResponse>("/api/chat-history/ask/", {
      method: "POST",
      token,
      body: JSON.stringify({ question, conversation_id }),
    }),
  adminUsers: (token: string) =>
    apiRequest<AdminUser[]>("/api/admin/users/", { token }),
  adminDashboard: (token: string) =>
    apiRequest<AdminDashboardData>("/api/admin/dashboard/", { token }),
  updateAdminUser: (token: string, id: string, payload: Partial<AdminUser>) =>
    apiRequest<AdminUser>(`/api/admin/users/${id}/`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    }),
  deleteAdminUser: (token: string, id: string) =>
    apiRequest<void>(`/api/admin/users/${id}/`, {
      method: "DELETE",
      token,
    }),
  fertilizerRecommendations: (token: string) =>
    apiRequest<FertilizerRecommendation[]>("/api/fertilizer-recommendations/", {
      token,
    }),
  createFertilizerRecommendation: (
    token: string,
    payload: Omit<FertilizerRecommendation, "id" | "date">,
  ) =>
    apiRequest<FertilizerRecommendation>("/api/fertilizer-recommendations/", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }),
  generateFertilizerPlan: (token: string, crop_name: string, farm_context = "", language: "en" | "bn" = "en", disease_id?: string) =>
    apiRequest<FertilizerPlan>("/api/fertilizer-recommendations/generate/", {
      method: "POST",
      token,
      body: JSON.stringify({ crop_name, farm_context, language, disease_id }),
    }),
};
