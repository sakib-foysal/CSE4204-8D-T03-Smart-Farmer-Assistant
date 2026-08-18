import { createMemoryRouter } from "../router-shim";
import App from "./App";
import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";
import LegalPage from "./pages/public/LegalPage";
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

export const router = createMemoryRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { index: true, element: <LandingPage /> },
        { path: "login", element: <LoginPage /> },
        { path: "register", element: <RegisterPage /> },
        { path: "privacy-policy", element: <LegalPage title="Privacy Policy"><p>Smart Farmer Assistant uses the information you provide only to operate and improve the platform.</p></LegalPage> },
        { path: "terms-of-service", element: <LegalPage title="Terms of Service"><p>Use Smart Farmer Assistant responsibly and provide accurate information when using its farming-support features.</p></LegalPage> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "profile", element: <ProfilePage /> },
        { path: "disease-detection", element: <DiseaseDetectionPage /> },
        { path: "chatbot", element: <ChatbotPage /> },
        { path: "weather", element: <WeatherPage /> },
        { path: "market-prices", element: <MarketPricePage /> },
        { path: "fertilizer", element: <FertilizerPage /> },
        { path: "history", element: <HistoryPage /> },
        { path: "admin", element: <AdminDashboard /> },
        { path: "admin/users", element: <UserManagement /> },
        { path: "admin/market-prices", element: <MarketPriceUpdate /> },
      ],
    },
  ],
  { initialEntries: ["/"] }
);
