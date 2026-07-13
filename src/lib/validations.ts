import { z } from 'zod'

export const ProfileSchema = z.object({
  age: z.number().min(13).max(120),
  gender: z.enum(['male', 'female', 'other']),
  height: z.number().min(100).max(250),
  weight: z.number().min(30).max(500),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  dietPreference: z.enum(['omnivore', 'vegetarian', 'vegan', 'keto', 'low_carb']),
  healthGoal: z.enum(['lose_weight', 'gain_muscle', 'maintain', 'increase_strength']),
})

export type ProfileInput = z.infer<typeof ProfileSchema>

export const MealSchema = z.object({
  name: z.string().min(1, 'Meal name is required').max(255),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  calories: z.number().min(0).max(10000),
  protein: z.number().min(0).max(500),
  carbs: z.number().min(0).max(500),
  fats: z.number().min(0).max(500),
  date: z.date(),
})

export type MealInput = z.infer<typeof MealSchema>

export const WorkoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required').max(255),
  type: z.enum(['cardio', 'strength', 'flexibility', 'sports']),
  duration: z.number().min(1).max(480),
  caloriesBurned: z.number().min(0).max(5000),
  intensity: z.enum(['light', 'moderate', 'high']),
  date: z.date(),
})

export type WorkoutInput = z.infer<typeof WorkoutSchema>

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginInput = z.infer<typeof LoginSchema>

export const SignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type SignupInput = z.infer<typeof SignupSchema>
