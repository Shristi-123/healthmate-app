import axios from 'axios'

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
})

const geminiClient = axios.create({
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/models',
})

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function getChatCompletion(messages: ChatMessage[], model: 'openai' | 'gemini' = 'openai') {
  try {
    if (model === 'openai') {
      const response = await openaiClient.post('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      })
      return response.data.choices[0].message.content
    } else {
      const response = await geminiClient.post(
        `/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          })),
        }
      )
      return response.data.candidates[0].content.parts[0].text
    }
  } catch (error) {
    console.error('AI API error:', error)
    throw error
  }
}

export async function generateMealPlan(userProfile: any, preferences: any) {
  const prompt = `Generate a personalized meal plan for a user with the following profile:
- Age: ${userProfile.age}
- Weight: ${userProfile.weight}kg
- Height: ${userProfile.height}cm
- Activity Level: ${userProfile.activityLevel}
- Diet Preference: ${preferences.dietPreference}
- Health Goal: ${userProfile.healthGoal}
- Daily Calorie Goal: ${userProfile.tdee}

Provide meal recommendations for breakfast, lunch, dinner, and snacks with estimated calories and macros.`

  return getChatCompletion([{ role: 'user', content: prompt }])
}

export async function analyzeNutrition(meals: any[]) {
  const mealsData = meals.map(m => `${m.name}: ${m.calories}cal, P:${m.protein}g, C:${m.carbs}g, F:${m.fats}g`).join('\n')
  const prompt = `Analyze the following meals and provide nutritional insights:
${mealsData}

Provide analysis on:
1. Macro balance
2. Protein sufficiency
3. Calorie alignment with daily goal
4. Suggestions for improvement`

  return getChatCompletion([{ role: 'user', content: prompt }])
}
