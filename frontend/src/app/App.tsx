import { useEffect, useState } from "react";
import { RouterProvider, useLocation } from "../router-shim";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { checkBackendHealth } from "./lib/api";
import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";
import Dashboard from "./pages/user/Dashboard";
import ProfilePage from "./pages/user/ProfilePage";
import DiseaseDetectionPage from "./pages/user/DiseaseDetectionPage";
import ChatbotPage from "./pages/user/ChatbotPage";
import WeatherPage from "./pages/user/WeatherPage";
import MarketPricePage from "./pages/user/MarketPricePage";
import FertilizerPage from "./pages/user/FertilizerPage";
import HistoryPage from "./pages/user/HistoryPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import MarketPriceUpdate from "./pages/admin/MarketPriceUpdate";

const protectedPaths = [
  "/dashboard",
  "/profile",
  "/disease-detection",
  "/chatbot",
  "/weather",
  "/market-prices",
  "/fertilizer",
  "/history",
  "/admin",
  "/admin/users",
  "/admin/market-prices",
];

function BackendGate({ children }: { children: React.ReactNode }) {
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verifyBackend = async () => {
      try {
        await checkBackendHealth();
        if (isMounted) {
          setIsBackendReady(true);
          setIsChecking(false);
        }
      } catch {
        if (isMounted) {
          setIsBackendReady(false);
          setIsChecking(false);
        }
      }
    };

    verifyBackend();
    const interval = window.setInterval(verifyBackend, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  if (isChecking || !isBackendReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
        <div className="w-full max-w-lg rounded-2xl border border-green-200 bg-white p-8 text-center shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">Smart Farmer Assistant</p>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            {isChecking ? "সার্ভার যাচাই করা হচ্ছে" : "Backend server চালু নেই"}
          </h1>
          <p className="mt-3 text-gray-600">
            frontend আর backend দুইটাই চালু থাকলে তবেই app কাজ করবে। আগে backend server চালু করুন, তারপর frontend refresh করুন।
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Backend health check: <span className="font-medium text-gray-700">/api/health/</span>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function ProtectedPage({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 text-green-700">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Dashboard />;
  }

  return <>{children}</>;
}

function Pages() {
  const { pathname } = useLocation();

  const routes: Record<string, React.ReactNode> = {
    "/": <LandingPage />,
    "/login": <LoginPage />,
    "/register": <RegisterPage />,
    "/dashboard": <ProtectedPage><Dashboard /></ProtectedPage>,
    "/profile": <ProtectedPage><ProfilePage /></ProtectedPage>,
    "/disease-detection": <ProtectedPage><DiseaseDetectionPage /></ProtectedPage>,
    "/chatbot": <ProtectedPage><ChatbotPage /></ProtectedPage>,
    "/weather": <ProtectedPage><WeatherPage /></ProtectedPage>,
    "/market-prices": <ProtectedPage><MarketPricePage /></ProtectedPage>,
    "/fertilizer": <ProtectedPage><FertilizerPage /></ProtectedPage>,
    "/history": <ProtectedPage><HistoryPage /></ProtectedPage>,
    "/admin": <ProtectedPage adminOnly><AdminDashboard /></ProtectedPage>,
    "/admin/users": <ProtectedPage adminOnly><UserManagement /></ProtectedPage>,
    "/admin/market-prices": <ProtectedPage adminOnly><MarketPriceUpdate /></ProtectedPage>,
  };

  if (!routes[pathname] && protectedPaths.includes(pathname)) {
    return <ProtectedPage><Dashboard /></ProtectedPage>;
  }

  return <>{routes[pathname] ?? <LandingPage />}</>;
}

export default function App() {
  return (
    <BackendGate>
      <RouterProvider>
        <LanguageProvider>
          <AuthProvider>
            <Pages />
          </AuthProvider>
        </LanguageProvider>
      </RouterProvider>
    </BackendGate>
  );
}
