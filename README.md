# 🌾 Smart Farmer Assistant: AI-Based Agriculture Support System

An AI-powered agriculture support platform designed to help farmers improve crop management, reduce farming losses, and provide intelligent farming assistance using Artificial Intelligence, Machine Learning, and cloud technologies.

This project focuses on solving real-world agricultural challenges in Bangladesh through AI-based disease detection, smart recommendations, weather alerts, and farming guidance.

---

## 📌 Team Information

| Field | Information |
|---------|-------------|
| Team Name | CSE4204-8D-T03 |
| Section | 8D |
| Project Title | Smart Farmer Assistant: AI-Based Agriculture Support System |
| Team Leader | Sakib Foysal Ejarder |
| Team Leader ID | 11220320948 |

### 👨‍💻 Team Members

| Name | Student ID | Role |
|--------|------------|------|
| Sakib Foysal Ejarder | 11220320948 | Team Leader / Backend Developer /  Team management |
| Md. Noyon Sheikh | 11220320946 |Frontend Developer |
| Sayed Tauhidul Islam | 11220320950 | AI & ML Engineer |
| Sayed Akib Osman | 11220320974 |  Database / QA |

---

## 🔗 GitHub Repository

Repository Link: https://github.com/sakib-foysal/CSE4204-8D-T03-Smart-Farmer-Assistant

---

# 📖 Project Description

Smart Farmer Assistant is an AI-powered agriculture support system designed to assist farmers in crop management and agricultural decision-making.

The system provides:

- Crop disease detection using image recognition
- Smart fertilizer recommendations
- Weather forecasting and flood alerts
- AI farming assistant using Gemini AI
- Live market price tracking
- Bangla language support

The platform aims to improve productivity and reduce agricultural losses through intelligent automation.

---

# ❗ Problem Statement

Bangladesh is highly dependent on agriculture, but many farmers face serious challenges such as:

- Lack of knowledge about crop diseases
- Incorrect fertilizer usage
- Sudden weather changes
- Flood damage
- Lack of expert farming support
- Limited market information

As a result:

- Crop production decreases
- Financial losses increase
- Farmers struggle to make informed decisions

Existing systems often:

- Are expensive
- Lack Bangla language support
- Are not focused on Bangladesh
- Have limited AI capability

---

# 🤖 Why AI Is Needed

Artificial Intelligence is a core component of this project.

AI will be used for:

### 1. Crop Disease Detection

AI image classification models will analyze uploaded crop images and detect diseases.

### 2. Smart Farming Recommendations

AI will provide intelligent fertilizer and farming suggestions.

### 3. AI Chat Assistant

Gemini AI will answer farmer questions naturally.

### 4. Predictive Analysis

AI can predict possible crop risks using weather data.

Without AI, intelligent analysis and automation would not be possible.

---

# 🎯 Objectives

The main goals of this system are:

- Build an AI-powered farming assistant
- Detect crop diseases automatically
- Provide smart fertilizer recommendations
- Integrate AI chatbot support
- Provide weather and flood alerts
- Show market prices
- Support Bangla language
- Create a mobile-friendly platform

---

# 🚀 Main Features

| Feature | Description | Status |
|-----------|-------------|--------|
| AI Disease Detection | Detect crop diseases from uploaded images | ✅ Completed |
| AI Chat Assistant | Farming guidance using Gemini AI | Database Ready | ✅ Completed |
| Weather Alerts | Weather and flood notifications | ✅ Frontend Completed |
| Fertilizer Recommendation | Smart fertilizer suggestions | Database Ready | ✅ Completed |
| Market Price Tracking | Live crop market prices | ✅ Completed |
| User Authentication | Login & Registration system | ✅ Completed |
| Dashboard | User management panel | ✅ Completed |
| Bangla Support | Native Bangla interaction | ✅ Completed |
| Responsive Design | Mobile-friendly UI | ✅ Completed |
| Mobile app | A mobile application for farmers to access the system on-the-go | Planned |

---

# 🧠 Existing Systems Research

The team researched various systems through:

- Google
- GitHub
- YouTube
- Research Papers

### Existing Systems Reviewed

| System | Features | Limitations |
|----------|------------|-------------|
| Plantix | Disease detection | Limited Bangla support |
| PlantVillage | Image disease analysis | Limited localization |
| AgroAI | Agricultural support | Limited personalization |
| Traditional systems | General farming support | Limited AI capability |

---

# 🔍 Research Findings

After research, the team identified:

- Lack of Bangladesh-focused agricultural systems
- Limited AI recommendation capability
- Weak localization support
- Limited multilingual functionality
- Poor weather integration

---

# 💡 Innovation & Uniqueness

This project introduces:

✅ Bangladesh & Global-focused agriculture solution

✅ Bangla language support

✅ AI-powered disease detection

✅ Intelligent recommendations for fertilizer usage

✅ Mobile-first design

✅ Future IoT support

---

# 👥 Target Users

- Farmers
- Agricultural workers
- Rural communities
- Agricultural researchers
- Farming organizations

---

# ⚙️ Technology Stack

## Frontend

- React.js 18.2.x (with Hooks)
- Vite (build tool, fast bundling & HMR)
- Tailwind CSS 3.x (custom configuration)
- React Router v6 (with lazy loading)
- Axios (with interceptors for JWT handling)
- Context API + useReducer (state management, no Redux)
- React Hook Form + Zod (form handling & validation)
- Custom components + Headless UI
- Chart.js with react-chartjs-2 (charts & graphs)
- Custom error boundaries (HTTP status handling)
- JWT tokens for authentication

## Backend

- Django 5.2.14
- Django REST Framework 3.17.1
- Python
- PostgreSQL

## Database

- PostgreSQL (Neon)
- Django ORM with UUID primary keys

## AI & Machine Learning

- Python
- TensorFlow
- OpenCV
- Keras
- Gemini API

## Authentication & Security

- Custom JWT-style Bearer Token Authentication
- Django Password Hashing
- Token Revocation System

## Deployment

**Frontend:**
- Vercel

**Backend:**
- Render

**Database:**
- Neon PostgreSQL

## Version Control

- Git
- GitHub

---


# 📊 Database Design (Week 6)

## Database Tables Overview

### Core Tables Implemented

1. **users** - User account management with authentication
2. **revoked_tokens** - JWT token revocation for logout security
3. **chat_history** - Chatbot conversation storage
4. **disease_history** - Crop disease detection records
5. **fertilizer_recommendations** - Fertilizer suggestions linked to disease detection
6. **market_prices** - Crop market price tracking by region
7. **weather_data** - Weather information and flood risk assessment

### Database Features

- UUID primary keys for enhanced security and uniqueness
- Comprehensive One-to-Many relationships
- Foreign key constraints with CASCADE rules
- Field validations at application and database levels
- Efficient indexing for common query patterns
- Django ORM migrations for version control

### Data Validations

- Username: Unique, max 150 characters
- Email: Valid format, max 254 characters
- Password: Minimum 8 characters, securely hashed
- Disease Confidence: 0-100 percentage scale
- Temperature: -50 to 60 degrees Celsius
- Humidity: 0-100 percent
- Flood Risk: Only low/medium/high values

---

# 🔌 API Endpoints (Week 6)

**Base URL:** `http://127.0.0.1:8000/api/`

## Authentication APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/register/` | Register new user | No |
| POST | `/login/` | User login | No |
| POST | `/logout/` | User logout & token revocation | Yes |
| GET | `/profile/` | Get user profile | Yes |
| PUT | `/profile/` | Update user profile | Yes |

## Project-Specific APIs

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|----------------|
| GET/POST | `/chat-history/` | Chatbot history management | Yes |
| GET/POST | `/disease-history/` | Disease detection records | Yes |
| GET/POST | `/fertilizer-recommendations/` | Fertilizer suggestions | Yes |
| GET/POST | `/market-prices/` | Market price information | Yes |
| GET/POST | `/weather-data/` | Weather and flood risk data | Yes |

---

# 🖥️ Frontend Development Progress (Week 7)

## Completed Pages & Screens

A total of **12 distinct pages** has been implemented across **8 functional groups**, covering the full journey of a farmer from creating an account through to receiving AI-driven crop recommendations.

| Group | Screens |
|-------|---------|
| Authentication Pages | Login, Registration, Password Reset, Email Verification (OTP) |
| Main Dashboard | Home Dashboard, Navigation Bar, Sidebar Menu, Mobile Menu |
| User Profile Management | Profile Page, Edit Profile, Settings Page, Change Password |
| Crop Market Information | Crop Market Page, Crop Search, Price History, Export/Print |
| Weather Information | Weather Dashboard, Weather Forecast, Regional Weather, Weather Alerts |
| Disease Detection & Treatment | Disease Detection, Disease Information, Treatment Recommendation, Disease Report |
| AI Recommendations | Recommendation Dashboard, Crop Suggestion, Seasonal Guide, Notification Center |

## Frontend–Backend API Integration

All frontend pages are connected to backend Django REST APIs and use fully dynamic data — no hardcoded or dummy data is used anywhere in the application.

**Authentication:** `POST /api/register/`, `POST /api/login/`, `POST /api/logout/`, `POST /api/token/refresh/`

**User Profile:** `GET/PUT /api/profile/`, `POST /api/change-password/`

**Crop Market:** `GET /api/crops/`, `GET /api/crops/{id}/`, `GET /api/crops/search/?q=`

**Weather:** `GET /api/weather/`, `GET /api/weather/forecast/`, `GET /api/weather/{region}/`

**Disease:** `GET /api/diseases/`, `POST /api/diseases/report/`, `GET /api/diseases/{id}/`

**Recommendations:** `GET /api/recommendations/`, `POST /api/recommendations/generate/`

## Authentication Flow (Frontend)

1. User enters email and password on the login page
2. Frontend sends a POST request to `/api/login/` using Axios
3. Backend validates credentials and returns a JWT token
4. Frontend stores the token securely for session use
5. User is redirected to the dashboard with profile data loaded

A **Protected Route** component (built with React Router) checks for a valid JWT token before allowing access to protected pages, redirecting unauthenticated users to the login page. Axios interceptors automatically refresh expired tokens so users stay logged in seamlessly.

## Responsive Design

The application follows a mobile-first approach across all breakpoints:

- Mobile: < 640px (sm)
- Tablet: 640px – 1024px (md/lg)
- Desktop: > 1024px (xl/2xl)
- Large Desktop: > 1536px (2xl)

Responsive features include a hamburger menu on mobile vs. full navbar on desktop, adaptive grid layouts, responsive image sizing with lazy loading, single/multi-column forms, and scalable typography.

## Frontend Development Status

| Component | Status | Progress |
|-----------|--------|----------|
| Project Setup & Configuration | Complete | 100% |
| Reusable Components | Complete | 100% |
| Authentication Pages | Complete | 100% |
| Main Dashboard | Complete | 100% |
| API Integration | Complete | 100% |
| Crop Market Page | In Progress | 100% |
| Weather Dashboard | Complete | 100% |
| Disease Detection | In Progress | 100% |
| Recommendations Engine | In Progress | 100% |
| User Profile Management | Complete | 100% |
| Admin Panel | In Progress | 100% |
| Testing & Optimization | In Progress | 100% |

---

# 🔐 Authentication Workflow

1. **User Registration** - User submits registration data (username, email, password, phone, role)
2. **Validation** - Backend validates fields including unique username/email and password strength (min 8 characters)
3. **Password Hashing** - Password is securely hashed using Django's password hashing system
4. **User Creation** - User is saved in database with default role as 'farmer'
5. **Token Generation** - Bearer token is generated containing user ID, username, email, role, issue time, and expiry
6. **Authentication** - Client includes token in requests: `Authorization: Bearer <token>`
7. **Token Validation** - Protected endpoints verify token before allowing access
8. **Logout** - Token ID is saved in revoked_tokens table for security
9. **Revocation Check** - Future requests check if token is revoked before processing

---

# 📈 Current Development Progress (Week 7)

## Completed Features ✅

- Backend setup with Django 5.2.14
- Django app structure (users, chatbot, disease_detection, fertilizer, market, weather)
- User model with custom authentication
- Registration API with validation
- Login API with JWT tokens
- Logout API with token revocation
- Profile management APIs (GET, PUT)
- Chat history API
- Disease detection history API
- Fertilizer recommendation API
- Market price API
- Weather data API
- Database models and migrations
- API testing (7/7 tests passing - 100%)
- Postman API testing completed
- Error handling and validation
- GitHub repository with proper structure
- Frontend project setup & configuration (React.js + Vite + Tailwind)
- Reusable frontend component library
- Authentication pages (Login, Registration, Password Reset, Email Verification)
- Main dashboard with navigation, sidebar & mobile menu
- User profile management pages
- Weather information dashboard
- Frontend–backend API integration (fully dynamic, no dummy data)
- JWT-based authentication flow with protected routes & token refresh
- Mobile-first responsive design across all breakpoints

## In Progress 🔄

- Full AI model integration
- Disease detection model training (60%)
- Crop Market page (80%)
- AI Recommendations engine (90%)
- Admin panel (30%)
- Frontend testing & optimization (95%)
- Gemini AI integration

## Planned 📅

- Production deployment
- Bangla language support
- IoT sensor integration
- Mobile app optimization
- Offline AI support

---

# 🧪 Testing Results (Week 6)

## Automated Testing

**Command:** `python manage.py test apps.users`

**Result:** ✅ **7/7 tests passing (100% pass rate)**

**Tests Covered:**
- User registration endpoint
- User login endpoint
- Profile access without authentication (security test)
- Profile GET with valid token
- Profile UPDATE with valid token
- Logout and token revocation
- Chat history creation and listing

**Test Framework:** Django APITestCase

---

# 📅 Project Timeline

## Phase 1 — Planning & Research ✅ (Weeks 1-2)

- Requirement analysis
- Research existing systems
- Project proposal preparation
- GitHub repository setup

## Phase 2 — System Design ✅ (Weeks 3-4)

- Database design with ER diagram
- UI/UX design
- Frontend & backend architecture

## Phase 3 — Backend Development ✅ (Week 6 - Ongoing)

- ✅ Authentication system implemented
- 🔄 AI chatbot integration in progress
- 🔄 Disease detection module in progress
- ✅ API infrastructure completed

## Phase 4 — Frontend Development ✅ (Weeks 5-7)

- ✅ User interface implementation (12 pages across 8 functional groups)
- ✅ API integration with backend Django REST APIs
- ✅ Responsive, mobile-first design
- ✅ JWT-based authentication flow with protected routes

## Phase 5 — AI Integration 🔄 (Weeks 7-8)

- Model training/testing
- TensorFlow + OpenCV integration
- Gemini AI integration

## Phase 6 — Testing & Deployment 📅 (Week 9)

- Comprehensive testing
- Bug fixing
- Production deployment

## Phase 7 — Documentation 📅 (Week 10)

- Project report
- Presentation
- Final submission

---

# 📈 Expected Outcome

The project aims to:

- Reduce farming losses by 20-30% through early disease detection
- Improve productivity through smart recommendations
- Increase farmer awareness about modern farming techniques
- Support sustainable agriculture in Bangladesh
- Provide affordable AI technology for rural farmers

---

# 🔮 Future Expansion

Possible future improvements:

- IoT sensor integration for real-time crop monitoring
- Smart irrigation system automation
- Drone-based crop monitoring
- AI crop yield prediction models
- Farmer-to-buyer marketplace
- Offline AI support for areas with poor connectivity
- Multi-language support (Bangla priority)
- Mobile app (iOS & Android)

---

# 📦 Deliverables

## Completed ✅

- Team Information Sheet
- Preliminary Project Idea
- Official Team Name and GitHub Repository
- Team Member List with Student IDs
- Initial Technology Stack
- Project Proposal
- Database Design with ER Diagram (Week 6)
- Backend API Implementation (Week 6)
- Automated Testing Suite (Week 6)
- API Documentation (Week 6)
- Frontend Implementation - 12 pages, 8 functional groups (Week 7)
- Frontend–Backend API Integration (Week 7)
- JWT Authentication Flow on Frontend (Week 7)
- Responsive, Mobile-First UI (Week 7)

## Upcoming 📅

- AI Model Training & Integration
- Production Deployment
- Final Documentation & Presentation

---

# 📜 License

This project is developed for academic purposes under CSE4204 AI-Based Software Project Development at Northern University of Business and Technology Khulna.

---

# 📞 Contact & Support

- **GitHub:** https://github.com/sakib-foysal/CSE4204-8D-T03-Smart-Farmer-Assistant
- **Project Coordinator:** Md. Riaz Mahmud (Assistant Professor, CSE Department)
- **Institution:** Northern University of Business and Technology Khulna

---

### Made with ❤️ by Team CSE4204-8D-T03

**Last Updated:** 6th July 2026 (Week 8 Submission)

---

# Week 09 Progress and Integration Update

This section is added for the Week 09 progress review. The project has moved from separate modules to an integrated application where the frontend, backend, database, authentication, and AI services work together in the main user workflows.

## Feature Completion Checklist

| Major Feature | Week 09 Status | Current Implementation |
|---|---|---|
| User registration, login, logout, and protected access | Completed | Django APIs, bearer-token authentication, password hashing, token revocation, and frontend session handling are integrated. |
| User profile and avatar | Completed | Authenticated users can view and update their profile information. |
| Farmer dashboard | Completed | The dashboard links users to all major farmer workflows. |
| AI farming chat | Completed | Users submit questions from the frontend; the backend processes requests, stores conversations, and returns AI/fallback responses. |
| Image-based disease detection | Completed | Crop images are analyzed through the backend, with result/history storage and localized guidance. |
| Video-based disease analysis | In Progress | Video upload and analysis endpoint are implemented; further model-quality and real-device validation remain. |
| Fertilizer recommendation | Completed | Crop and disease context can generate and save fertilizer plans. |
| Weather forecast and farming alerts | Completed | Users can access forecast data and weather/flood-related farming alerts. |
| Market-price information | Completed | Farmers can view market prices; administrators can manage price records. |
| Admin dashboard and user management | Completed | Admin-only screens and APIs provide dashboard statistics and user management. |
| Bangla and English support | Completed | Fixed UI text and AI-related requests support both language modes. |
| Responsive design | Completed | The primary pages include responsive navigation and layouts. |
| Production deployment | Not Started | Live deployment and production verification remain outside the current Week 09 scope. |
| Comprehensive regression and model-accuracy testing | In Progress | Application-level tests exist; expanded browser, load, and model-accuracy testing remain for the next phase. |

## Frontend-Backend-Database Integration Status

- The React frontend calls Django REST APIs for registration, login, logout, profile updates, chat history, disease history, fertilizer recommendations, weather data, market prices, and administrative operations.
- PostgreSQL-backed Django models store user accounts, revoked tokens, chat conversations, disease analyses, fertilizer recommendations, weather records, and market-price data.
- Protected requests use Authorization: Bearer token authentication, and users can only access their own protected records.
- Form validation and API failures are shown as understandable user-facing feedback rather than raw technical errors.

## AI Integration Status

AI features are connected to real application workflows:

- **Disease analysis:** POST /api/disease-history/analyze/ accepts crop-image data, and POST /api/disease-history/analyze-video/ supports video analysis.
- **Fertilizer plan:** POST /api/fertilizer-recommendations/generate/ produces a crop/disease-aware fertilizer plan.
- **Farming assistant:** POST /api/chat-history/ask/ processes farming questions and saves conversation history.
- **Language support:** supported AI requests use English (en) or Bangla (bn) context.
- **Error handling:** provider/API failures use user-friendly fallback guidance where supported, while API credentials stay in environment variables.

## Major End-to-End Workflows

### Farmer workflow

1. Register or log in.
2. Open the protected dashboard.
3. Choose disease detection, fertilizer guidance, AI chat, weather, market prices, or history.
4. Submit an image, video, or farming question when required.
5. The frontend sends an authenticated request to the Django backend.
6. The backend processes database and AI operations.
7. The user receives a result, actionable guidance, and understandable error/fallback feedback in the selected language.

### Administrator workflow

1. Log in with an administrator account.
2. Open the admin dashboard.
3. Review database-backed activity and user statistics.
4. Manage users and market-price entries through protected admin features.

## Week 09 API Summary

| Area | Main Endpoints |
|---|---|
| Health | GET /api/health/ |
| Authentication | POST /api/register/, POST /api/login/, POST /api/logout/, GET/PUT /api/profile/ |
| Chat | GET/POST /api/chat-history/, POST /api/chat-history/ask/, conversation endpoints under /api/chat-history/conversations/ |
| Disease detection | GET/POST /api/disease-history/, POST /api/disease-history/analyze/, POST /api/disease-history/analyze-video/ |
| Fertilizer | GET/POST /api/fertilizer-recommendations/, POST /api/fertilizer-recommendations/generate/ |
| Weather | GET/POST /api/weather-data/, GET /api/weather-data/forecast/ |
| Market prices | GET/POST /api/market-prices/ |
| Administration | GET /api/admin/dashboard/, GET /api/admin/users/, PATCH/DELETE /api/admin/users/{id}/ |

## Week 09 Testing Focus

Before the progress review, the following visible workflows should be tested:

- new-user registration, existing-user login, logout, and protected pages;
- profile update and restored user session;
- disease-image submission, result display, and history;
- fertilizer-plan generation using crop/disease context;
- AI chat, saved conversations, and AI-service failure handling;
- weather forecast, alerts, and language switching;
- market-price viewing and administrator price management;
- invalid input, missing fields, unauthorized requests, and unavailable external services;
- mobile navigation and responsive layouts.

## Remaining Work

The next phase focuses on production deployment, broader regression testing, video/disease model-quality validation, final screenshots, and final project documentation.

**Week 09 Update Date:** 19 August 2026

