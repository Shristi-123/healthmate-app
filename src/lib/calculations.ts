// BMI Calculation: weight (kg) / (height (cm) / 100)^2
export function calculateBMI(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100
  return weightKg / (heightM * heightM)
}

// BMR Calculation using Mifflin-St Jeor equation
export function calculateBMR(
  age: number,
  gender: 'male' | 'female' | 'other',
  heightCm: number,
  weightKg: number
): number {
  let bmr: number

  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5
  } else if (gender === 'female') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161
  } else {
    // Average for other
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 78
  }

  return bmr
}

// TDEE Calculation based on activity level
export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers: { [key: string]: number } = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }

  const multiplier = multipliers[activityLevel] || 1.55
  return Math.round(bmr * multiplier)
}

// Calculate macronutrient goals
export function calculateMacros(
  tdee: number,
  healthGoal: string
): { protein: number; carbs: number; fats: number } {
  let proteinPercent = 0.3
  let carbsPercent = 0.45
  let fatsPercent = 0.25

  if (healthGoal === 'lose_weight') {
    proteinPercent = 0.35 // Higher protein to preserve muscle
    carbsPercent = 0.4
    fatsPercent = 0.25
  } else if (healthGoal === 'gain_muscle') {
    proteinPercent = 0.35
    carbsPercent = 0.45
    fatsPercent = 0.2
  }

  const protein = Math.round((tdee * proteinPercent) / 4)
  const carbs = Math.round((tdee * carbsPercent) / 4)
  const fats = Math.round((tdee * fatsPercent) / 9)

  return { protein, carbs, fats }
}

// Water intake goal (simplified: weight * 35 ml)
export function calculateWaterGoal(weightKg: number): number {
  return Math.round(weightKg * 35)
}

// Calculate health score based on daily metrics
export function calculateHealthScore(metrics: {
  caloriesBurned: number
  caloriesGoal: number
  protein: number
  proteinGoal: number
  water: number
  waterGoal: number
  sleep: number
  sleepGoal: number
}): number {
  let score = 0

  // Calories (max 25 points)
  const calorieRatio = metrics.caloriesBurned / metrics.caloriesGoal
  if (calorieRatio >= 0.9 && calorieRatio <= 1.1) {
    score += 25
  } else if (calorieRatio >= 0.8 && calorieRatio <= 1.2) {
    score += 20
  } else if (calorieRatio >= 0.7 && calorieRatio <= 1.3) {
    score += 10
  }

  // Protein (max 25 points)
  const proteinRatio = metrics.protein / metrics.proteinGoal
  if (proteinRatio >= 0.9 && proteinRatio <= 1.1) {
    score += 25
  } else if (proteinRatio >= 0.8 && proteinRatio <= 1.2) {
    score += 20
  } else if (proteinRatio >= 0.7 && proteinRatio <= 1.3) {
    score += 10
  }

  // Water (max 25 points)
  const waterRatio = metrics.water / metrics.waterGoal
  if (waterRatio >= 0.9 && waterRatio <= 1.1) {
    score += 25
  } else if (waterRatio >= 0.7 && waterRatio <= 1.3) {
    score += 15
  } else if (waterRatio >= 0.5) {
    score += 10
  }

  // Sleep (max 25 points)
  const sleepRatio = metrics.sleep / metrics.sleepGoal
  if (sleepRatio >= 0.9 && sleepRatio <= 1.1) {
    score += 25
  } else if (sleepRatio >= 0.7 && sleepRatio <= 1.2) {
    score += 20
  } else if (sleepRatio >= 0.6) {
    score += 10
  }

  return Math.min(100, Math.max(0, score))
}
