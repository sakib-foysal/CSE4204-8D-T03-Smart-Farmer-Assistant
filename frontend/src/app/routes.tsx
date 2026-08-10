import { createMemoryRouter } from "../../router-shim";
import App from "./App";
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

export const router = createMemoryRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { index: true, element: <LandingPage /> },
        { path: "login", element: <LoginPage /> },
        { path: "register", element: <RegisterPage /> },
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
