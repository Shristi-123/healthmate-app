import axios from 'axios'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface UserProfile {
  age: number
  weight: number
  height: number
  activityLevel: string
  tdee: number
  healthGoal: string
}

export interface UserPreferences {
  dietPreference: string
}

export interface MealEntry {
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

export async function getChatCompletion(messages: ChatMessage[]): Promise<string> {
  try {
    if (OPENAI_API_KEY) {
      return await getOpenAICompletion(messages)
    } else if (GEMINI_API_KEY) {
      return await getGeminiCompletion(messages)
    } else {
      throw new Error('No AI API key configured')
    }
  } catch (error) {
    console.error('Error getting chat completion:', error)
    throw error
  }
}

async function getOpenAICompletion(messages: ChatMessage[]): Promise<string> {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      max_tokens: 500,
    },
    {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  )

  return response.data.choices[0].message.content
}

async function getGeminiCompletion(messages: ChatMessage[]): Promise<string> {
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
    }
  )

  return response.data.candidates[0].content.parts[0].text
}

export async function generateMealPlan(
  profile: UserProfile,
  preferences: UserPreferences
): Promise<string> {
  const prompt = `Create a personalized daily meal plan for a ${profile.age}-year-old with ${profile.activityLevel} activity level and a ${preferences.dietPreference} diet. They need approximately ${profile.tdee} calories per day and their goal is to ${profile.healthGoal}. Provide specific meal recommendations with approximate calories and macros.`

  return getChatCompletion([{ role: 'user', content: prompt }])
}

export async function analyzeNutrition(meals: MealEntry[]): Promise<string> {
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0)
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0)
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0)
  const totalFats = meals.reduce((sum, meal) => sum + meal.fats, 0)

  const prompt = `Analyze the following daily nutrition intake and provide insights:

Meals:
${meals.map(meal => `- ${meal.name}: ${meal.calories} cal, ${meal.protein}g protein, ${meal.carbs}g carbs, ${meal.fats}g fat`).join('\n')}

Total: ${totalCalories} calories, ${totalProtein}g protein, ${totalCarbs}g carbs, ${totalFats}g fat

Provide a brief analysis of the macronutrient balance and any recommendations for improvement.`

  return getChatCompletion([{ role: 'user', content: prompt }])
}

export async function getHealthAdvice(topic: string): Promise<string> {
  const prompt = `As a health and fitness expert, provide brief, actionable advice about: ${topic}`
  return getChatCompletion([{ role: 'user', content: prompt }])
}
