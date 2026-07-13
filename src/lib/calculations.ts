export function calculateBMI(height: number, weight: number): number {
  // height in cm, weight in kg
  return weight / ((height / 100) ** 2)
}

export function calculateBMR(age: number, gender: 'male' | 'female' | 'other', height: number, weight: number): number {
  // Mifflin-St Jeor equation
  let bmr: number
  
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else if (gender === 'female') {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  } else {
    bmr = (10 * weight + 6.25 * height - 5 * age + 5 + 10 * weight + 6.25 * height - 5 * age - 161) / 2
  }
  
  return bmr
}

export function calculateTDEE(bmr: number, activityLevel: string): number {
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }
  
  return bmr * (activityMultipliers[activityLevel] || 1.5)
}

export function calculateMacros(tdee: number, preference: string) {
  let proteinPercentage = 0.3
  let carbPercentage = 0.4
  let fatPercentage = 0.3

  // Adjust based on goal
  if (preference === 'gain_muscle') {
    proteinPercentage = 0.35
    carbPercentage = 0.45
    fatPercentage = 0.2
  } else if (preference === 'lose_weight') {
    proteinPercentage = 0.35
    carbPercentage = 0.35
    fatPercentage = 0.3
  } else if (preference === 'keto') {
    proteinPercentage = 0.25
    carbPercentage = 0.05
    fatPercentage = 0.7
  }

  return {
    protein: Math.round((tdee * proteinPercentage) / 4), // 4 cal per gram
    carbs: Math.round((tdee * carbPercentage) / 4),
    fats: Math.round((tdee * fatPercentage) / 9), // 9 cal per gram
  }
}

export function calculateWaterGoal(weight: number): number {
  // General recommendation: 30-35ml per kg of body weight
  return Math.round(weight * 35)
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function calculateHealthScore(data: {
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
  
  // Calorie balance (max 25 points)
  const calorieDiff = Math.abs(data.caloriesBurned - data.caloriesGoal)
  if (calorieDiff < data.caloriesGoal * 0.1) score += 25
  else if (calorieDiff < data.caloriesGoal * 0.2) score += 20
  else if (calorieDiff < data.caloriesGoal * 0.3) score += 15
  else score += 10
  
  // Protein (max 25 points)
  const proteinRatio = data.protein / data.proteinGoal
  if (proteinRatio >= 0.9 && proteinRatio <= 1.1) score += 25
  else if (proteinRatio >= 0.8 && proteinRatio <= 1.2) score += 20
  else if (proteinRatio >= 0.7 && proteinRatio <= 1.3) score += 15
  else score += 10
  
  // Water (max 25 points)
  const waterRatio = data.water / data.waterGoal
  if (waterRatio >= 0.8) score += 25
  else if (waterRatio >= 0.6) score += 20
  else if (waterRatio >= 0.4) score += 15
  else score += 10
  
  // Sleep (max 25 points)
  if (data.sleep >= data.sleepGoal * 0.9) score += 25
  else if (data.sleep >= data.sleepGoal * 0.8) score += 20
  else if (data.sleep >= data.sleepGoal * 0.6) score += 15
  else score += 10
  
  return Math.min(100, score)
}
