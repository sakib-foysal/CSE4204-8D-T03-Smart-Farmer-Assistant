import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'bn';
type Dictionary = Record<string, string>;

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string, values?: Record<string, string | number>) => string;
  locale: string;
}

const en: Dictionary = {
  home: 'Home', 
  login: 'Login', 
  register: 'Register', 
  dashboard: 'Dashboard', 
  profile: 'Profile', 
  logout: 'Logout',
  diseaseDetection: 'Disease Detection', 
  aiChatbot: 'AI Chatbot', 
  weather: 'Weather & Flood Alert', 
  marketPrices: 'Market Prices', 
  fertilizer: 'Fertilizer Recommendation', 
  history: 'History',
  appTitle: 'Smart Farmer Assistant', 
  tagline: 'AI-Based Agriculture Support System', 
  heroTitle: 'Transform Your Farming with AI', 
  heroSubtitle: 'Get instant crop disease detection, weather alerts, market prices, and smart farming advice', 
  getStarted: 'Get Started', 
  learnMore: 'Learn More', 
  features: 'Features', 
  howItWorks: 'How It Works', 
  about: 'About',
  aiDisease: 'AI Disease Detection', 
  aiDiseaseDesc: 'Upload crop images and get an instant disease assessment with treatment guidance', 
  smartChatbot: 'Smart Chatbot', 
  smartChatbotDesc: 'An AI farming assistant for your questions in Bangla or English', 
  weatherAlerts: 'Weather & Flood Alerts', 
  weatherAlertsDesc: 'Weather forecasts and flood alerts based on your location', 
  livePrices: 'Live Market Prices', 
  livePricesDesc: 'Track crop prices by region to sell at better times', 
  fertilizerGuide: 'Fertilizer Guide', 
  fertilizerGuideDesc: 'Get AI-tailored fertilizer planning based on your crop and farm context', 
  historyTracking: 'History Tracking', 
  historyTrackingDesc: 'View your past disease assessments and chat conversations',
  email: 'Email', 
  password: 'Password', 
  name: 'Full Name', 
  username: 'Username', 
  phone: 'Phone Number', 
  confirmPassword: 'Confirm Password', 
  signIn: 'Sign In', 
  signUp: 'Sign Up', 
  dontHaveAccount: "Don't have an account?", 
  alreadyHaveAccount: 'Already have an account?',
  welcome: 'Welcome', 
  quickActions: 'Quick Actions', 
  recentActivity: 'Recent Activity', 
  statistics: 'Statistics', 
  accessFeatures: 'Access key features quickly', 
  noActivity: 'No activity yet. Start by using one of the quick actions.', 
  farmer: 'Farmer',
  uploadImage: 'Upload Crop Image', 
  selectImage: 'Select Image', 
  detectDisease: 'Detect Disease', 
  diseaseResult: 'Disease Detection Result', 
  confidence: 'Confidence', 
  treatment: 'Treatment Recommendations', 
  imageRequirements: 'PNG, JPG, or WEBP crop-leaf image, maximum 2 MB', 
  analyzeWithAi: 'Analyze with SF AI', 
  selectAnotherImage: 'Select another image', 
  visualAssessment: 'SF AI visually assesses your uploaded crop-leaf image; it is not a laboratory-confirmed diagnosis.',
  askQuestion: 'Ask a farming question...', 
  sendMessage: 'Send Message', 
  chatHistory: 'Chat History', 
  chatbotLiveDescription: 'Live SF AI farming guidance in Bangla or English', 
  aiPreparing: 'SF AI is preparing advice...', loginAgain: 'Please log in again to use the AI assistant.', 
  aiEmpty: 'The AI returned an empty response. Please try again.', aiUnavailable: 'AI service is temporarily unavailable. Please try again.', 
  greeting: 'Hello! I am your Smart Farmer Assistant. Ask about crops, pests, fertilizer, irrigation, or weather preparation.',
  currentWeather: 'Current Weather', 
  forecast: '7-Day Forecast', 
  floodAlert: 'Flood Alert', 
  temperature: 'Temperature', 
  humidity: 'Humidity', 
  rainfall: 'Rainfall', wind: 'Wind', 
  weatherUnavailable: 'Weather unavailable', 
  liveForecast: 'Live 7-day weather forecast', 
  viewAlerts: 'View alerts', 
  viewWeather: 'View weather', 
  weatherAlertsTitle: 'Weather-based alerts', weatherAlertsDescription: 'Advice generated from analysis of the coming 7-day forecast.', 
  preparingAlerts: 'Preparing alerts...', noAlerts: 'There are no significant weather alerts for the next 7 days.', 
  updated: 'Updated', loadingWeather: 'Loading live weather data...', 
  noWeatherData: 'No live weather data available.', dailyForecastDescription: 'Daily temperature, rain probability, rainfall and flood risk', 
  rain: 'Rain', 
  floodRisk: 'Flood risk', 
  do: 'What to do', 
  avoid: 'What to avoid', 
  thunderstorm: 'Thunderstorm', 
  rainExpected: 'Rain expected', 
  cloudy: 'Cloudy', 
  clearWeather: 'Clear',
  viewPrices: 'View Prices', 
  cropName: 'Crop Name', price: 'Price', unit: 'Unit', region: 'Region', lastUpdated: 'Last Updated', trend: 'Trend', live: 'Live', priceUp: 'Price up', priceDown: 'Price down', priceUnchanged: 'No change', newPrice: 'First price', noDataYet: 'No data yet', searchCropRegion: 'Search crop name or region...', searchCropPriceRegion: 'Search crop name, price, or region...', loadingPrices: 'Loading prices...', couldNotLoadPrices: 'Could not load market prices.',
  selectCrop: 'Select Crop', getFertilizerRecommendation: 'Get Recommendation', recommendations: 'Recommendations', dosage: 'Dosage', schedule: 'Application Schedule', selectedCrop: 'Selected crop', generateWithAi: 'Generate with SF AI', fertilizerIntro: 'Dynamic SF AI guidance based on the selected crop.', fertilizerChoose: 'Choose a crop for an AI-generated plan', fertilizerNotice: 'AI-generated guide; not a universal fertilizer prescription', suggestedPoints: 'Suggested planning points', applicationTips: 'Application tips', noRecommendation: 'Select a crop and generate a dynamic SF AI guide.',
  diseaseHistory: 'Disease Detection History', chatHistoryTitle: 'Chat Conversations', viewDetails: 'View Details', delete: 'Delete', diseaseHistoryDescription: 'Your past crop disease assessments', chatHistoryDescription: 'Your conversations with the AI assistant', loadingDiseaseHistory: 'Loading disease history...', loadingChatHistory: 'Loading chat history...', noDiseaseHistory: 'No disease detection history found.', noChatHistory: 'No chat history found.',
  adminPanel: 'Admin Panel', userManagement: 'User Management', marketPriceUpdate: 'Update Market Prices', totalUsers: 'Total Users', totalDetections: 'Total Detections', totalChats: 'Total Chats', systemActivity: 'System Activity',
  save: 'Save', cancel: 'Cancel', edit: 'Edit', submit: 'Submit', clear: 'Clear', search: 'Search', filter: 'Filter', loading: 'Loading...', noData: 'No data available', active: 'Active', inactive: 'Inactive', actions: 'Actions', status: 'Status', joined: 'Joined', role: 'Role', firstName: 'First name', lastName: 'Last name', details: 'Details',
  footerAbout: 'About Us', footerContact: 'Contact', footerPrivacy: 'Privacy Policy', footerTerms: 'Terms of Service', footerRights: 'All rights reserved', address: 'Northern University of Business & Technology, Khulna, Bangladesh',
  languageName: 'বাংলা', backendChecking: 'Checking server connection', backendUnavailable: 'Backend server is unavailable', backendHelp: 'Start the backend server, then refresh the frontend.', profileInformation: 'Profile Information', manageAccount: 'Manage your account information', farmerAccount: 'Farmer Account', memberSince: 'Member since', changePassword: 'Change Password', currentPassword: 'Current Password', newPassword: 'New Password', updatePassword: 'Update Password', passwordNotice: 'Update your password to keep your account secure',
  requiredLogin: 'Email/username and password are required.', loginSuccessful: 'Login successful.', loginFailed: 'Login failed. Please try again.', backendAccount: 'Use an account created in your backend database.', requiredFields: 'Please fill in all required fields.', validEmail: 'Please enter a valid email address.', passwordLength: 'Password must be at least 8 characters.', passwordMatch: 'Passwords do not match.', phoneDigitsError: 'Enter exactly {count} digits after {code}.', phoneDigitsHint: 'Enter {count} digits after {code}.', countryCode: 'Country code', registrationSuccessful: 'Registration successful.', registrationFailed: 'Registration failed. Please try again.', nameEmailRequired: 'Name and email are required.', profileUpdated: 'Profile updated successfully.', couldNotUpdateProfile: 'Could not update profile.',
  landingFeaturesDescription: 'Empowering farmers with AI-driven insights and real-time agricultural support', step1Title: 'Register Your Account', step1Description: 'Sign up with your basic information to get started.', step2Title: 'Upload Crop Images or Ask Questions', step2Description: 'Take a photo of your crop or ask the AI chatbot a farming question.', step3Title: 'Get AI-Powered Recommendations', step3Description: 'Receive disease assessment, treatment advice, fertilizer guidance, and more.', step4Title: 'Track Your Farming History', step4Description: 'Review past assessments and conversations to make better decisions.', aboutText1: 'Smart Farmer Assistant is an AI-powered platform designed to help Bangladeshi farmers make better agricultural decisions.', aboutText2: 'The platform combines crop-image assessment, an AI chatbot, weather forecasting, flood alerts, market prices, and fertilizer guidance in one responsive application.', ctaTitle: 'Ready to Transform Your Farming?', ctaText: 'Join farmers using AI to improve crop yield and reduce losses.',
};

const bn: Dictionary = {
  home: 'হোম', login: 'লগইন', register: 'নিবন্ধন', dashboard: 'ড্যাশবোর্ড', profile: 'প্রোফাইল', logout: 'লগআউট',
  diseaseDetection: 'রোগ শনাক্তকরণ', aiChatbot: 'এআই চ্যাটবট', weather: 'আবহাওয়া ও বন্যা সতর্কতা', marketPrices: 'বাজার মূল্য', fertilizer: 'সার পরামর্শ', history: 'ইতিহাস',
  appTitle: 'স্মার্ট ফার্মার অ্যাসিস্ট্যান্ট', tagline: 'এআই-ভিত্তিক কৃষি সহায়তা ব্যবস্থা', heroTitle: 'এআই দিয়ে আপনার কৃষিকে রূপান্তরিত করুন', heroSubtitle: 'তাৎক্ষণিক ফসলের রোগ শনাক্তকরণ, আবহাওয়ার সতর্কতা, বাজার মূল্য ও স্মার্ট কৃষি পরামর্শ পান', getStarted: 'শুরু করুন', learnMore: 'আরও জানুন', features: 'বৈশিষ্ট্য', howItWorks: 'এটি কীভাবে কাজ করে', about: 'সম্পর্কে',
  aiDisease: 'এআই রোগ শনাক্তকরণ', aiDiseaseDesc: 'ফসলের ছবি আপলোড করে চিকিৎসা নির্দেশনাসহ তাৎক্ষণিক রোগ মূল্যায়ন পান', smartChatbot: 'স্মার্ট চ্যাটবট', smartChatbotDesc: 'বাংলা বা ইংরেজিতে প্রশ্নের জন্য এআই কৃষি সহকারী', weatherAlerts: 'আবহাওয়া ও বন্যা সতর্কতা', weatherAlertsDesc: 'আপনার অবস্থানের আবহাওয়া পূর্বাভাস ও বন্যার ঝুঁকি সতর্কতা', livePrices: 'লাইভ বাজার মূল্য', livePricesDesc: 'ভালো সময়ে বিক্রির জন্য অঞ্চলভিত্তিক ফসলের দাম দেখুন', fertilizerGuide: 'সার নির্দেশিকা', fertilizerGuideDesc: 'ফসল ও খামারের অবস্থা অনুযায়ী এআই-ভিত্তিক সার পরিকল্পনা পান', historyTracking: 'ইতিহাস সংরক্ষণ', historyTrackingDesc: 'আগের রোগ মূল্যায়ন ও চ্যাট কথোপকথন দেখুন',
  email: 'ইমেইল', password: 'পাসওয়ার্ড', name: 'পূর্ণ নাম', username: 'ব্যবহারকারী নাম', phone: 'ফোন নম্বর', confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন', signIn: 'সাইন ইন', signUp: 'সাইন আপ', dontHaveAccount: 'অ্যাকাউন্ট নেই?', alreadyHaveAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
  welcome: 'স্বাগতম', quickActions: 'দ্রুত কার্যক্রম', recentActivity: 'সাম্প্রতিক কার্যক্রম', statistics: 'পরিসংখ্যান', accessFeatures: 'গুরুত্বপূর্ণ সুবিধাগুলো দ্রুত ব্যবহার করুন', noActivity: 'এখনো কোনো কার্যক্রম নেই। দ্রুত কার্যক্রম থেকে শুরু করুন।', farmer: 'কৃষক',
  uploadImage: 'ফসলের ছবি আপলোড করুন', selectImage: 'ছবি নির্বাচন করুন', detectDisease: 'রোগ শনাক্ত করুন', diseaseResult: 'রোগ শনাক্তকরণের ফলাফল', confidence: 'আত্মবিশ্বাস', treatment: 'চিকিৎসার পরামর্শ', imageRequirements: 'PNG, JPG বা WEBP ফসলের পাতার ছবি, সর্বোচ্চ ২ MB', analyzeWithAi: 'এসএফ এআই দিয়ে বিশ্লেষণ করুন', selectAnotherImage: 'অন্য ছবি নির্বাচন করুন', visualAssessment: 'এসএফ এআই আপনার আপলোড করা ফসলের পাতার ছবি মূল্যায়ন করে; এটি পরীক্ষাগার-নিশ্চিত রোগ নির্ণয় নয়।',
  askQuestion: 'কৃষি সম্পর্কিত প্রশ্ন করুন...', sendMessage: 'বার্তা পাঠান', chatHistory: 'চ্যাট ইতিহাস', chatbotLiveDescription: 'বাংলা বা ইংরেজিতে লাইভ এসএফ এআই কৃষি নির্দেশনা', aiPreparing: 'এসএফ এআই পরামর্শ তৈরি করছে...', loginAgain: 'এআই সহকারী ব্যবহারের জন্য আবার লগইন করুন।', aiEmpty: 'এআই কোনো উত্তর দেয়নি। আবার চেষ্টা করুন।', aiUnavailable: 'এআই সেবা সাময়িকভাবে অনুপলব্ধ। আবার চেষ্টা করুন।', greeting: 'স্বাগতম! আমি আপনার স্মার্ট ফার্মার অ্যাসিস্ট্যান্ট। ফসল, পোকামাকড়, সার, সেচ বা আবহাওয়া প্রস্তুতি নিয়ে প্রশ্ন করুন।',
  currentWeather: 'বর্তমান আবহাওয়া', forecast: '৭ দিনের পূর্বাভাস', floodAlert: 'বন্যা সতর্কতা', temperature: 'তাপমাত্রা', humidity: 'আর্দ্রতা', rainfall: 'বৃষ্টিপাত', wind: 'বাতাস', weatherUnavailable: 'আবহাওয়ার তথ্য পাওয়া যাচ্ছে না', liveForecast: 'লাইভ ৭ দিনের আবহাওয়ার পূর্বাভাস', viewAlerts: 'সতর্কতা দেখুন', viewWeather: 'আবহাওয়া দেখুন', weatherAlertsTitle: 'আবহাওয়া-ভিত্তিক সতর্কতা', weatherAlertsDescription: 'পরবর্তী ৭ দিনের পূর্বাভাস বিশ্লেষণ করে তৈরি করা পরামর্শ।', preparingAlerts: 'সতর্কতা তৈরি করা হচ্ছে...', noAlerts: 'আগামী ৭ দিনে উল্লেখযোগ্য আবহাওয়া সতর্কতা নেই।', updated: 'হালনাগাদ', loadingWeather: 'লাইভ আবহাওয়ার তথ্য লোড হচ্ছে...', noWeatherData: 'লাইভ আবহাওয়ার তথ্য পাওয়া যায়নি।', dailyForecastDescription: 'দৈনিক তাপমাত্রা, বৃষ্টির সম্ভাবনা, বৃষ্টিপাত ও বন্যার ঝুঁকি', rain: 'বৃষ্টি', floodRisk: 'বন্যার ঝুঁকি', do: 'করণীয়', avoid: 'বর্জনীয়', thunderstorm: 'বজ্রঝড়', rainExpected: 'বৃষ্টির সম্ভাবনা', cloudy: 'মেঘলা', clearWeather: 'পরিষ্কার',
  viewPrices: 'মূল্য দেখুন', cropName: 'ফসলের নাম', price: 'মূল্য', unit: 'একক', region: 'অঞ্চল', lastUpdated: 'সর্বশেষ হালনাগাদ', trend: 'ধারা', live: 'লাইভ', priceUp: 'দাম বেড়েছে', priceDown: 'দাম কমেছে', priceUnchanged: 'দাম অপরিবর্তিত', newPrice: 'প্রথম মূল্য', noDataYet: 'এখনো তথ্য নেই', searchCropRegion: 'ফসলের নাম বা অঞ্চল খুঁজুন...', searchCropPriceRegion: 'ফসলের নাম, মূল্য বা অঞ্চল খুঁজুন...', loadingPrices: 'মূল্য লোড হচ্ছে...', couldNotLoadPrices: 'বাজার মূল্য লোড করা যায়নি।',
  selectCrop: 'ফসল নির্বাচন করুন', getFertilizerRecommendation: 'পরামর্শ নিন', recommendations: 'পরামর্শ', dosage: 'পরিমাণ', schedule: 'প্রয়োগের সময়সূচি', selectedCrop: 'নির্বাচিত ফসল', generateWithAi: 'এসএফ এআই দিয়ে তৈরি করুন', fertilizerIntro: 'নির্বাচিত ফসলের ভিত্তিতে পরিবর্তনশীল এসএফ এআই নির্দেশনা।', fertilizerChoose: 'এআই-তৈরি পরিকল্পনার জন্য একটি ফসল নির্বাচন করুন', fertilizerNotice: 'এআই-তৈরি নির্দেশিকা; এটি সবার জন্য একক সার ব্যবস্থাপত্র নয়', suggestedPoints: 'পরিকল্পনার প্রস্তাবিত বিষয়', applicationTips: 'প্রয়োগের পরামর্শ', noRecommendation: 'একটি ফসল নির্বাচন করে পরিবর্তনশীল এসএফ এআই নির্দেশিকা তৈরি করুন।',
  diseaseHistory: 'রোগ শনাক্তকরণ ইতিহাস', chatHistoryTitle: 'চ্যাট কথোপকথন', viewDetails: 'বিস্তারিত দেখুন', delete: 'মুছুন', diseaseHistoryDescription: 'আপনার আগের ফসলের রোগ মূল্যায়ন', chatHistoryDescription: 'এআই সহকারীর সঙ্গে আপনার কথোপকথন', loadingDiseaseHistory: 'রোগ ইতিহাস লোড হচ্ছে...', loadingChatHistory: 'চ্যাট ইতিহাস লোড হচ্ছে...', noDiseaseHistory: 'কোনো রোগ শনাক্তকরণ ইতিহাস পাওয়া যায়নি।', noChatHistory: 'কোনো চ্যাট ইতিহাস পাওয়া যায়নি।',
  adminPanel: 'অ্যাডমিন প্যানেল', userManagement: 'ব্যবহারকারী ব্যবস্থাপনা', marketPriceUpdate: 'বাজার মূল্য হালনাগাদ', totalUsers: 'মোট ব্যবহারকারী', totalDetections: 'মোট শনাক্তকরণ', totalChats: 'মোট চ্যাট', systemActivity: 'সিস্টেম কার্যক্রম',
  save: 'সংরক্ষণ করুন', cancel: 'বাতিল', edit: 'সম্পাদনা', submit: 'জমা দিন', clear: 'পরিষ্কার', search: 'অনুসন্ধান', filter: 'ফিল্টার', loading: 'লোড হচ্ছে...', noData: 'কোনো তথ্য নেই', active: 'সক্রিয়', inactive: 'নিষ্ক্রিয়', actions: 'কাজ', status: 'অবস্থা', joined: 'যোগদানের তারিখ', role: 'ভূমিকা', firstName: 'নামের প্রথম অংশ', lastName: 'নামের শেষ অংশ', details: 'বিস্তারিত',
  footerAbout: 'আমাদের সম্পর্কে', footerContact: 'যোগাযোগ', footerPrivacy: 'গোপনীয়তা নীতি', footerTerms: 'সেবার শর্তাবলি', footerRights: 'সর্বস্বত্ব সংরক্ষিত', address: 'নর্দার্ন ইউনিভার্সিটি অব বিজনেস অ্যান্ড টেকনোলজি, খুলনা, বাংলাদেশ',
  languageName: 'English', backendChecking: 'সার্ভার সংযোগ যাচাই হচ্ছে', backendUnavailable: 'ব্যাকএন্ড সার্ভার চালু নেই', backendHelp: 'ব্যাকএন্ড সার্ভার চালু করে frontend রিফ্রেশ করুন।', profileInformation: 'প্রোফাইলের তথ্য', manageAccount: 'আপনার অ্যাকাউন্টের তথ্য পরিচালনা করুন', farmerAccount: 'কৃষক অ্যাকাউন্ট', memberSince: 'সদস্য হওয়ার তারিখ', changePassword: 'পাসওয়ার্ড পরিবর্তন', currentPassword: 'বর্তমান পাসওয়ার্ড', newPassword: 'নতুন পাসওয়ার্ড', updatePassword: 'পাসওয়ার্ড হালনাগাদ করুন', passwordNotice: 'অ্যাকাউন্ট সুরক্ষিত রাখতে পাসওয়ার্ড হালনাগাদ করুন',
  requiredLogin: 'ইমেইল/ব্যবহারকারী নাম ও পাসওয়ার্ড প্রয়োজন।', loginSuccessful: 'লগইন সফল হয়েছে।', loginFailed: 'লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।', backendAccount: 'ব্যাকএন্ড ডাটাবেজে তৈরি একটি অ্যাকাউন্ট ব্যবহার করুন।', requiredFields: 'সব প্রয়োজনীয় ঘর পূরণ করুন।', validEmail: 'সঠিক ইমেইল ঠিকানা দিন।', passwordLength: 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।', passwordMatch: 'পাসওয়ার্ড দুটি মিলেনি।', phoneDigitsError: '{code}-এর পরে অবশ্যই {count}টি সংখ্যা লিখুন।', phoneDigitsHint: '{code}-এর পরে {count}টি সংখ্যা লিখুন।', countryCode: 'দেশের কোড', registrationSuccessful: 'নিবন্ধন সফল হয়েছে।', registrationFailed: 'নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।', nameEmailRequired: 'নাম ও ইমেইল প্রয়োজন।', profileUpdated: 'প্রোফাইল সফলভাবে হালনাগাদ হয়েছে।', couldNotUpdateProfile: 'প্রোফাইল হালনাগাদ করা যায়নি।',
  landingFeaturesDescription: 'এআই-ভিত্তিক তথ্য ও তাৎক্ষণিক কৃষি সহায়তায় কৃষকদের ক্ষমতায়ন', step1Title: 'অ্যাকাউন্ট নিবন্ধন করুন', step1Description: 'শুরু করতে আপনার মৌলিক তথ্য দিয়ে নিবন্ধন করুন।', step2Title: 'ফসলের ছবি আপলোড করুন বা প্রশ্ন করুন', step2Description: 'ফসলের ছবি তুলুন অথবা এআই চ্যাটবটকে কৃষি প্রশ্ন করুন।', step3Title: 'এআই-ভিত্তিক পরামর্শ পান', step3Description: 'রোগ মূল্যায়ন, চিকিৎসা নির্দেশনা, সার পরামর্শ এবং আরও তথ্য পান।', step4Title: 'কৃষি ইতিহাস দেখুন', step4Description: 'ভালো সিদ্ধান্তের জন্য আগের মূল্যায়ন ও কথোপকথন দেখুন।', aboutText1: 'স্মার্ট ফার্মার অ্যাসিস্ট্যান্ট বাংলাদেশি কৃষকদের ভালো কৃষি সিদ্ধান্ত নিতে সহায়তা করার জন্য তৈরি একটি এআই-ভিত্তিক প্ল্যাটফর্ম।', aboutText2: 'এটি ফসলের ছবি মূল্যায়ন, এআই চ্যাটবট, আবহাওয়ার পূর্বাভাস, বন্যা সতর্কতা, বাজার মূল্য ও সার নির্দেশিকাকে একটি ব্যবহারবান্ধব অ্যাপে একত্র করে।', ctaTitle: 'আপনার কৃষিকে রূপান্তর করতে প্রস্তুত?', ctaText: 'ফসলের ফলন বাড়াতে এবং ক্ষতি কমাতে এআই ব্যবহার করা কৃষকদের সঙ্গে যুক্ত হন।',
};

const dictionaries: Record<Language, Dictionary> = { en, bn };
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const STORAGE_KEY = 'smart_farmer_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => sessionStorage.getItem(STORAGE_KEY) === 'bn' ? 'bn' : 'en');
  useEffect(() => { sessionStorage.setItem(STORAGE_KEY, language); document.documentElement.lang = language === 'bn' ? 'bn' : 'en'; }, [language]);
  const t = (key: string, values: Record<string, string | number> = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), dictionaries[language][key] ?? key);
  return <LanguageContext.Provider value={{ language, toggleLanguage: () => setLanguage(value => value === 'en' ? 'bn' : 'en'), t, locale: language === 'bn' ? 'bn-BD' : 'en-US' }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
