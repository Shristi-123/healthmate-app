# HealthMate - AI-Powered Personal Health & Nutrition Assistant

## 🏥 Overview

HealthMate is a modern, full-stack web application that combines AI technology with health tracking to provide personalized health and nutrition guidance. Built with React, TypeScript, and Supabase, it offers a comprehensive platform for users to monitor their fitness, nutrition, and overall wellness.

## ✨ Key Features

### 🔐 Authentication
- Secure user registration and login with Supabase Auth
- Password reset functionality
- Session management

### 📊 Dashboard
- Personalized health score calculation
- Daily nutrition overview (calories, protein, carbs, fats)
- Weekly calorie trends
- Macronutrient distribution charts
- Water intake and sleep tracking

### 🍽️ Food Tracker
- Log meals with nutritional information
- Organize meals by type (breakfast, lunch, dinner, snacks)
- Real-time macro calculation
- Daily nutrition summary

### 💪 Workout Tracker
- Log exercises with duration and intensity
- Track calories burned
- Monitor workout frequency
- Categorize by workout type (cardio, strength, flexibility, sports)

### 📈 Analytics & Insights
- Weekly and monthly calorie trends
- Meal type distribution
- Workout type distribution
- Key health metrics (BMI, TDEE, protein goals)
- Data visualization with interactive charts

### 🤖 AI Chat Assistant
- Personalized meal planning
- Nutrition analysis and recommendations
- Workout suggestions
- Health advice powered by GPT-3.5 or Gemini
- Context-aware conversations

### 👤 User Profile
- Complete health profile setup
- Automatic calculation of BMI, BMR, TDEE
- Macro distribution based on health goals
- Customizable dietary preferences and activity levels

### 🎨 User Experience
- Modern glassmorphism design
- Dark/Light theme support
- Responsive mobile and desktop layouts
- Smooth animations with Framer Motion
- Real-time data updates

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

### Backend & Database
- **Supabase** - Backend as a Service (PostgreSQL)
- **Supabase Auth** - Authentication

### Data & AI
- **React Query** - Data fetching and caching
- **OpenAI API** - GPT-3.5 for AI chat
- **Google Gemini API** - Alternative AI provider
- **Axios** - HTTP client

### Form & Validation
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Charts & Visualization
- **Recharts** - Data visualization
- **Lucide React** - Icons

## 📋 Prerequisites

- Node.js 16+ and npm/yarn
- Supabase account and project
- OpenAI or Gemini API key
- Modern web browser

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/healthmate-app.git
   cd healthmate-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   VITE_OPENAI_API_KEY=your_openai_key
   VITE_GEMINI_API_KEY=your_gemini_key
   VITE_APP_URL=http://localhost:5173
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── Navigation.tsx      # App navigation
│   └── ProtectedRoute.tsx  # Route protection
├── contexts/
│   ├── AuthContext.tsx     # Authentication state
│   └── ThemeContext.tsx    # Theme management
├── pages/
│   ├── Dashboard.tsx       # Main dashboard
│   ├── Profile.tsx         # User profile
│   ├── FoodTracker.tsx     # Meal logging
│   ├── WorkoutTracker.tsx  # Workout logging
│   ├── Analytics.tsx       # Data insights
│   ├── ChatBot.tsx         # AI assistant
│   ├── Login.tsx           # Login page
│   ├── Signup.tsx          # Registration page
│   └── NotFound.tsx        # 404 page
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── ai.ts               # AI integration
│   ├── calculations.ts     # Health calculations
│   ├── validations.ts      # Form validation schemas
│   └── utils.ts            # Utility functions
├── App.tsx                 # Main app component
├── main.tsx                # Entry point
└── index.css               # Global styles
```

## 🗄️ Database Schema

### Tables
- **profiles** - User health profiles
- **meals** - Food entries
- **workouts** - Exercise entries
- **water_logs** - Water intake tracking
- **sleep_logs** - Sleep tracking

## 🔒 Security

- Environment variables for sensitive keys
- Row-level security (RLS) policies in Supabase
- Protected routes for authenticated users
- Secure session management

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Supabase for backend infrastructure
- OpenAI and Google for AI APIs
- The React community for amazing libraries
- All contributors and users

## 📞 Support

For support, email support@healthmate.app or open an issue on GitHub.

## 🎯 Future Enhancements

- [ ] Mobile app with React Native
- [ ] Wearable device integration (Fitbit, Apple Watch)
- [ ] Social features (friend challenges, leaderboards)
- [ ] Meal planning with recipe integration
- [ ] Video workout tutorials
- [ ] Advanced health analytics
- [ ] Integration with health platforms (Apple Health, Google Fit)
- [ ] Push notifications for reminders
- [ ] Prescription and supplement tracking

---

**HealthMate** - Your Personal AI Health Companion 💚
