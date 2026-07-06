import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    home: 'Home',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    profile: 'Profile',
    logout: 'Logout',
    
    // Features
    diseaseDetection: 'Disease Detection',
    aiChatbot: 'AI Chatbot',
    weather: 'Weather & Flood Alert',
    marketPrices: 'Market Prices',
    fertilizer: 'Fertilizer Recommendation',
    history: 'History',
    
    // Landing Page
    appTitle: 'Smart Farmer Assistant',
    tagline: 'AI-Based Agriculture Support System',
    heroTitle: 'Transform Your Farming with AI',
    heroSubtitle: 'Get instant crop disease detection, weather alerts, market prices, and smart farming advice',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    features: 'Features',
    howItWorks: 'How It Works',
    about: 'About',
    
    // Features
    aiDisease: 'AI Disease Detection',
    aiDiseaseDesc: 'Upload crop images and get instant disease diagnosis with treatment recommendations',
    smartChatbot: 'Smart Chatbot',
    smartChatbotDesc: '24/7 AI-powered farming assistant answering your questions in Bangla and English',
    weatherAlerts: 'Weather & Flood Alerts',
    weatherAlertsDesc: 'Real-time weather forecasts and flood risk notifications for your location',
    livePrices: 'Live Market Prices',
    livePricesDesc: 'Track real-time crop prices by region to sell at optimal times',
    fertilizerGuide: 'Fertilizer Guide',
    fertilizerGuideDesc: 'Get AI-tailored fertilizer recommendations based on your crop and soil conditions',
    historyTracking: 'History Tracking',
    historyTrackingDesc: 'View your past disease detections and chat conversations',
    
    // Auth
    email: 'Email',
    password: 'Password',
    name: 'Full Name',
    phone: 'Phone Number',
    confirmPassword: 'Confirm Password',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    
    // Dashboard
    welcome: 'Welcome',
    quickActions: 'Quick Actions',
    recentActivity: 'Recent Activity',
    statistics: 'Statistics',
    
    // Disease Detection
    uploadImage: 'Upload Crop Image',
    selectImage: 'Select Image',
    detectDisease: 'Detect Disease',
    diseaseResult: 'Disease Detection Result',
    confidence: 'Confidence',
    treatment: 'Treatment Recommendations',
    
    // Chatbot
    askQuestion: 'Ask a farming question...',
    sendMessage: 'Send Message',
    chatHistory: 'Chat History',
    
    // Weather
    currentWeather: 'Current Weather',
    forecast: '7-Day Forecast',
    floodAlert: 'Flood Alert',
    temperature: 'Temperature',
    humidity: 'Humidity',
    rainfall: 'Rainfall',
    
    // Market
    viewPrices: 'View Prices',
    cropName: 'Crop Name',
    price: 'Price',
    unit: 'Unit',
    region: 'Region',
    lastUpdated: 'Last Updated',
    
    // Fertilizer
    selectCrop: 'Select Crop',
    getFertilizerRecommendation: 'Get Recommendation',
    recommendations: 'Recommendations',
    dosage: 'Dosage',
    schedule: 'Application Schedule',
    
    // History
    diseaseHistory: 'Disease Detection History',
    chatHistoryTitle: 'Chat Conversations',
    viewDetails: 'View Details',
    delete: 'Delete',
    
    // Admin
    adminPanel: 'Admin Panel',
    userManagement: 'User Management',
    marketPriceUpdate: 'Update Market Prices',
    totalUsers: 'Total Users',
    totalDetections: 'Total Detections',
    totalChats: 'Total Chats',
    systemActivity: 'System Activity',
    
    // Footer
    footerAbout: 'About Us',
    footerContact: 'Contact',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms of Service',
    footerRights: 'All rights reserved',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    submit: 'Submit',
    clear: 'Clear',
    search: 'Search',
    filter: 'Filter',
    loading: 'Loading...',
    noData: 'No data available',
  },
  bn: {
    // Navigation
    home: 'হোম',
    login: 'লগইন',
    register: 'নিবন্ধন',
    dashboard: 'ড্যাশবোর্ড',
    profile: 'প্রোফাইল',
    logout: 'লগআউট',
    
    // Features
    diseaseDetection: 'রোগ শনাক্তকরণ',
    aiChatbot: 'এআই চ্যাটবট',
    weather: 'আবহাওয়া এবং বন্যা সতর্কতা',
    marketPrices: 'বাজার মূল্য',
    fertilizer: 'সার সুপারিশ',
    history: 'ইতিহাস',
    
    // Landing Page
    appTitle: 'স্মার্ট কৃষক সহায়ক',
    tagline: 'এআই-ভিত্তিক কৃষি সহায়তা ব্যবস্থা',
    heroTitle: 'এআই দিয়ে আপনার কৃষিকে রূপান্তরিত করুন',
    heroSubtitle: 'তাৎক্ষণিক ফসলের রোগ শনাক্তকরণ, আবহাওয়া সতর্কতা, বাজার মূল্য এবং স্মার্ট কৃষি পরামর্শ পান',
    getStarted: 'শুরু করুন',
    learnMore: 'আরও জানুন',
    features: 'বৈশিষ্ট্য',
    howItWorks: 'এটি কিভাবে কাজ করে',
    about: 'সম্পর্কে',
    
    // Features
    aiDisease: 'এআই রোগ শনাক্তকরণ',
    aiDiseaseDesc: 'ফসলের ছবি আপলোড করুন এবং চিকিৎসা সুপারিশসহ তাৎক্ষণিক রোগ নির্ণয় পান',
    smartChatbot: 'স্মার্ট চ্যাটবট',
    smartChatbotDesc: '২৪/৭ এআই-চালিত কৃষি সহায়ক বাংলা এবং ইংরেজিতে আপনার প্রশ্নের উত্তর দেয়',
    weatherAlerts: 'আবহাওয়া এবং বন্যা সতর্কতা',
    weatherAlertsDesc: 'আপনার অবস্থানের জন্য রিয়েল-টাইম আবহাওয়া পূর্বাভাস এবং বন্যার ঝুঁকি বিজ্ঞপ্তি',
    livePrices: 'লাইভ বাজার মূল্য',
    livePricesDesc: 'সর্বোত্তম সময়ে বিক্রয়ের জন্য অঞ্চল অনুসারে রিয়েল-টাইম ফসলের দাম ট্র্যাক করুন',
    fertilizerGuide: 'সার গাইড',
    fertilizerGuideDesc: 'আপনার ফসল এবং মাটির অবস্থার উপর ভিত্তি করে এআই-তৈরি সার সুপারিশ পান',
    historyTracking: 'ইতিহাস ট্র্যাকিং',
    historyTrackingDesc: 'আপনার অতীতের রোগ শনাক্তকরণ এবং চ্যাট কথোপকথন দেখুন',
    
    // Auth
    email: 'ইমেইল',
    password: 'পাসওয়ার্ড',
    name: 'পুরো নাম',
    phone: 'ফোন নম্বর',
    confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
    signIn: 'সাইন ইন',
    signUp: 'সাইন আপ',
    dontHaveAccount: 'অ্যাকাউন্ট নেই?',
    alreadyHaveAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
    
    // Dashboard
    welcome: 'স্বাগতম',
    quickActions: 'দ্রুত ক্রিয়া',
    recentActivity: 'সাম্প্রতিক কার্যকলাপ',
    statistics: 'পরিসংখ্যান',
    
    // Disease Detection
    uploadImage: 'ফসলের ছবি আপলোড করুন',
    selectImage: 'ছবি নির্বাচন করুন',
    detectDisease: 'রোগ শনাক্ত করুন',
    diseaseResult: 'রোগ শনাক্তকরণ ফলাফল',
    confidence: 'আস্থা',
    treatment: 'চিকিৎসা সুপারিশ',
    
    // Chatbot
    askQuestion: 'কৃষি সম্পর্কিত প্রশ্ন করুন...',
    sendMessage: 'বার্তা পাঠান',
    chatHistory: 'চ্যাট ইতিহাস',
    
    // Weather
    currentWeather: 'বর্তমান আবহাওয়া',
    forecast: '৭-দিনের পূর্বাভাস',
    floodAlert: 'বন্যা সতর্কতা',
    temperature: 'তাপমাত্রা',
    humidity: 'আর্দ্রতা',
    rainfall: 'বৃষ্টিপাত',
    
    // Market
    viewPrices: 'মূল্য দেখুন',
    cropName: 'ফসলের নাম',
    price: 'মূল্য',
    unit: 'একক',
    region: 'অঞ্চল',
    lastUpdated: 'সর্বশেষ আপডেট',
    
    // Fertilizer
    selectCrop: 'ফসল নির্বাচন করুন',
    getFertilizerRecommendation: 'সুপারিশ পান',
    recommendations: 'সুপারিশ',
    dosage: 'ডোজ',
    schedule: 'প্রয়োগের সময়সূচী',
    
    // History
    diseaseHistory: 'রোগ শনাক্তকরণ ইতিহাস',
    chatHistoryTitle: 'চ্যাট কথোপকথন',
    viewDetails: 'বিস্তারিত দেখুন',
    delete: 'মুছুন',
    
    // Admin
    adminPanel: 'অ্যাডমিন প্যানেল',
    userManagement: 'ব্যবহারকারী ব্যবস্থাপনা',
    marketPriceUpdate: 'বাজার মূল্য আপডেট',
    totalUsers: 'মোট ব্যবহারকারী',
    totalDetections: 'মোট শনাক্তকরণ',
    totalChats: 'মোট চ্যাট',
    systemActivity: 'সিস্টেম কার্যকলাপ',
    
    // Footer
    footerAbout: 'আমাদের সম্পর্কে',
    footerContact: 'যোগাযোগ',
    footerPrivacy: 'গোপনীয়তা নীতি',
    footerTerms: 'সেবার শর্তাবলী',
    footerRights: 'সর্বস্বত্ব সংরক্ষিত',
    
    // Common
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল',
    edit: 'সম্পাদনা',
    submit: 'জমা দিন',
    clear: 'পরিষ্কার',
    search: 'অনুসন্ধান',
    filter: 'ফিল্টার',
    loading: 'লোড হচ্ছে...',
    noData: 'কোনো তথ্য নেই',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'bn' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
