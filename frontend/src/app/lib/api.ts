const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  created_at: string;
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
  prediction: string;
  confidence: string;
  treatment: string;
  date: string;
}

export interface ChatHistory {
  id: string;
  question: string;
  response: string;
  date: string;
}

export interface FertilizerRecommendation {
  id: string;
  disease: string;
  crop_name: string;
  suggestion: string;
  date: string;
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

  if (hasBody && !headers.has("Content-Type")) {
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
  createMarketPrice: (token: string, payload: Omit<MarketPrice, "id" | "date">) =>
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
};
