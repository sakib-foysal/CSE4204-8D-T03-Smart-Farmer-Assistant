# Smart Farmer Assistant Backend

This directory contains the Django REST backend for the Smart Farmer Assistant project. It provides authentication, chatbot history, disease detection history, fertilizer recommendations, market price data, and weather data APIs.

## Tech Stack

- Django 5.2
- Django REST Framework
- JWT-based authentication
- PostgreSQL
- python-dotenv for environment variables

## Apps

- users for register, login, logout, and profile endpoints
- chatbot for chat history
- disease_detection for disease history
- fertilizer for fertilizer recommendations
- market for market price data
- weather for weather data

## API Overview

The root endpoint returns a small status payload that confirms the API is running and lists the main routes.

- / - API status
- /api/register/
- /api/login/
- /api/logout/
- /api/profile/
- /api/chat-history/
- /api/disease-history/
- /api/fertilizer-recommendations/
- /api/market-prices/
- /api/weather-data/

## Environment Variables

Create a .env file in this folder and set the values used by the Django settings:

- SECRET_KEY
- DEBUG
- DB_NAME
- DB_USER
- DB_PASSWORD
- DB_HOST
- DB_PORT

## Local Setup

1. Create and activate a Python virtual environment.
2. Install dependencies:

	```bash
	pip install -r requirements.txt
	```

3. Add your .env file.
4. Run database migrations:

	```bash
	python manage.py migrate
	```

5. Start the development server:

	```bash
	python manage.py runserver
	```

## Notes

- The project uses a custom user model: users.User.
- Authentication is handled through apps.users.authentication.JWTAuthentication.
- Static files are collected into staticfiles/ and media uploads use media/.
