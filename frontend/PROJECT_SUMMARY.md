# Smart Farmer Assistant - Complete Application

## Project Overview
AI-Based Agriculture Support System for Bangladeshi Farmers
**Team:** CSE4204-8D-T03  
**Institution:** Northern University of Business & Technology Khulna

## Features Implemented

### Public Pages (3)
1. **Landing/Home Page** (`/`) - Hero section, features showcase, how it works, about section
2. **Login Page** (`/login`) - User authentication with demo accounts
3. **Registration Page** (`/register`) - New user signup

### User Pages (8)
1. **Dashboard** (`/dashboard`) - Overview with quick actions, stats, recent activity
2. **User Profile Page** (`/profile`) - Profile management, password change
3. **Crop Disease Detection** (`/disease-detection`) - AI-powered image upload and disease analysis
4. **AI Chatbot** (`/chatbot`) - Real-time Bangla/English farming assistant
5. **Weather & Flood Alert** (`/weather`) - Current weather, 7-day forecast, flood alerts
6. **Market Price Page** (`/market-prices`) - Live crop prices with search functionality
7. **Fertilizer Recommendation** (`/fertilizer`) - AI-generated fertilizer suggestions
8. **History Page** (`/history`) - Disease detection and chat conversation history

### Admin Pages (3)
1. **Admin Dashboard** (`/admin`) - System statistics, user activity charts
2. **User Management** (`/admin/users`) - View, search, and manage farmers
3. **Market Price Update** (`/admin/market-prices`) - Add, edit, delete crop prices

## Key Features

### Language Support
- **Bilingual Interface**: Full Bangla and English translation support
- **Toggle Button**: Easy language switching in header
- **Mixed Content**: English + Bengali text for better accessibility

### Design System
- **Professional Agricultural Theme**: Green color scheme representing agriculture
- **Responsive Design**: Works on mobile, tablet, and desktop
- **UI Components**: Using shadcn/ui component library
- **Consistent Footer**: Present on all pages with contact info and links

### Mock Data & AI Simulation
- Disease detection with confidence scores
- AI chatbot responses in both languages
- Weather forecasts and flood alerts
- Market price trends
- Fertilizer recommendations
- User activity statistics

## Technology Stack
- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v7 (Data Mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Hooks + Context API
- **Notifications**: Sonner

## Demo Accounts

### User Account
- Email: `farmer@example.com`
- Password: any

### Admin Account
- Email: `admin@smartfarmer.com`
- Password: any

## Navigation Structure

```
/                       → Landing Page
/login                  → Login
/register               → Registration
/dashboard              → User Dashboard
/profile                → User Profile
/disease-detection      → Crop Disease Detection
/chatbot                → AI Chatbot
/weather                → Weather & Flood Alerts
/market-prices          → Market Prices
/fertilizer             → Fertilizer Recommendations
/history                → Activity History
/admin                  → Admin Dashboard
/admin/users            → User Management
/admin/market-prices    → Market Price Management
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── PageLayout.tsx
│   │   └── ui/           # shadcn/ui components
│   ├── contexts/
│   │   └── LanguageContext.tsx
│   ├── pages/
│   │   ├── public/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── user/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── DiseaseDetectionPage.tsx
│   │   │   ├── ChatbotPage.tsx
│   │   │   ├── WeatherPage.tsx
│   │   │   ├── MarketPricePage.tsx
│   │   │   ├── FertilizerPage.tsx
│   │   │   └── HistoryPage.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── UserManagement.tsx
│   │       └── MarketPriceUpdate.tsx
│   ├── App.tsx
│   └── routes.tsx
├── styles/
│   ├── index.css
│   ├── tailwind.css
│   ├── theme.css
│   └── fonts.css
└── main.tsx
```

## Features Highlights

1. **Fully Responsive**: Mobile-first design approach
2. **Professional UI**: Clean, modern agricultural theme
3. **Complete CRUD**: User management, market price updates
4. **Data Visualization**: Charts for admin analytics
5. **Search & Filter**: Market prices, user management
6. **File Upload**: Disease detection image upload
7. **Real-time Chat Interface**: Chatbot with typing indicators
8. **Toast Notifications**: Success/error feedback
9. **Loading States**: User-friendly loading indicators
10. **Error Handling**: Graceful error messages

## Accessibility

- Clear heading hierarchy
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance
- Responsive font sizes

## Future Enhancements

Based on the SRS document, future versions could include:
- Real backend integration with Django REST API
- TensorFlow disease detection model integration
<<<<<<< HEAD
- Google Gemini AI chatbot integration
=======
- SF AI chatbot integration
>>>>>>> ai-integration
- OpenWeatherMap API integration
- PostgreSQL database connection
- JWT authentication
- Image processing pipeline
- Voice-based AI assistant in Bangla
- IoT sensor integration
- Drone monitoring support

## Development Team

- **Sakib Foysal Ejarder** (11220320948) - Team Leader / Backend
- **Md. Noyon Sheikh** (11220320946) - Frontend Developer
- **Sayed Tauhidul Islam** (11220320950) - AI / ML Engineer
- **Sayed Akib Osman** (11220320974) - Database / QA

---

© 2024 Smart Farmer Assistant. All rights reserved.
CSE4204-8D-T03 - Software Engineering Project
