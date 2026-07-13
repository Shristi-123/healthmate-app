import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const SignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const ProfileSchema = z.object({
  age: z.number().min(13).max(120),
  gender: z.enum(['male', 'female', 'other']),
  height: z.number().min(100).max(250), // in cm
  weight: z.number().min(30).max(500), // in kg
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  dietPreference: z.enum(['omnivore', 'vegetarian', 'vegan', 'keto', 'low_carb']),
  healthGoal: z.enum(['lose_weight', 'gain_muscle', 'maintain', 'increase_strength']),
})

export const MealSchema = z.object({
  name: z.string().min(1),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  calories: z.number().positive(),
  protein: z.number().non-negative(),
  carbs: z.number().non-negative(),
  fats: z.number().non-negative(),
  date: z.date(),
})

export const WorkoutSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['cardio', 'strength', 'flexibility', 'sports']),
  duration: z.number().positive(), // in minutes
  caloriesBurned: z.number().positive(),
  intensity: z.enum(['light', 'moderate', 'high']),
  date: z.date(),
})

export const WaterLogSchema = z.object({
  amount: z.number().positive(), // in ml
  date: z.date(),
})

export const SleepLogSchema = z.object({
  duration: z.number().positive(), // in hours
  quality: z.enum(['poor', 'fair', 'good', 'excellent']),
  date: z.date(),
})

export type LoginInput = z.infer<typeof LoginSchema>
export type SignupInput = z.infer<typeof SignupSchema>
export type ProfileInput = z.infer<typeof ProfileSchema>
export type MealInput = z.infer<typeof MealSchema>
export type WorkoutInput = z.infer<typeof WorkoutSchema>
export type WaterLogInput = z.infer<typeof WaterLogSchema>
export type SleepLogInput = z.infer<typeof SleepLogSchema>
