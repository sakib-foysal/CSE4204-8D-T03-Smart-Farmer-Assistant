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
| AI Disease Detection | Detect crop diseases from uploaded images | In Progress |
| AI Chat Assistant | Farming guidance using Gemini AI | Database Ready |
| Weather Alerts | Weather and flood notifications | Database Ready |
| Fertilizer Recommendation | Smart fertilizer suggestions | Database Ready |
| Market Price Tracking | Live crop market prices | Database Ready |
| User Authentication | Login & Registration system | ✅ Completed |
| Dashboard | User management panel | In Progress |
| Bangla Support | Native Bangla interaction | Planned |
| Responsive Design | Mobile-friendly UI | In Progress |

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

✅ Bangladesh-focused agriculture solution

✅ Bangla language support

✅ AI-powered disease detection

✅ Intelligent recommendations

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

- React.js
- Tailwind CSS
- JavaScript
- Vite

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

# 📁 Project Folder Structure

```bash
CSE4204-8D-T03-Smart-Farmer-Assistant/
│
├── frontend/
│   └── [React.js application with Tailwind CSS]
│
├── backend/
│   ├── apps/
│   │   ├── users/          # User authentication & profiles
│   │   ├── chatbot/        # Chatbot history
│   │   ├── disease_detection/  # Disease detection API
│   │   ├── fertilizer/     # Fertilizer recommendations
│   │   ├── market/         # Market price tracking
│   │   └── weather/        # Weather data management
│   ├── config/             # Django settings
│   ├── manage.py
│   └── requirements.txt
│
├── ai_model/
│   └── [ML models and training scripts]
│
├── docs/
│   ├── database-design.pdf
│   └── backend-progress.pdf
│
├── README.md
├── .gitignore
└── LICENSE
```

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

# 📈 Current Development Progress (Week 6)

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

## In Progress 🔄

- Full AI model integration
- Frontend development
- Disease detection model training
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

## Phase 4 — Frontend Development 🔄 (Weeks 5-7)

- User interface implementation
- API integration
- Responsive design

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

## Upcoming 📅

- Frontend Implementation
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

**Last Updated:** 29th June 2026 (Week 6 Submission)
