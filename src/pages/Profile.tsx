import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { ProfileSchema, type ProfileInput } from '@/lib/validations'
import { calculateBMI, calculateBMR, calculateTDEE, calculateMacros, calculateWaterGoal } from '@/lib/calculations'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Heart, Save } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Profile() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [calculations, setCalculations] = useState<any>({})

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      age: 25,
      gender: 'male',
      height: 175,
      weight: 75,
      activityLevel: 'moderate',
      dietPreference: 'omnivore',
      healthGoal: 'maintain',
    },
  })

  const formValues = watch()

  // Update calculations when form values change
  useEffect(() => {
    if (formValues.age && formValues.height && formValues.weight && formValues.gender && formValues.activityLevel) {
      const bmi = calculateBMI(formValues.height, formValues.weight)
      const bmr = calculateBMR(formValues.age, formValues.gender as any, formValues.height, formValues.weight)
      const tdee = calculateTDEE(bmr, formValues.activityLevel)
      const macros = calculateMacros(tdee, formValues.healthGoal)
      const waterGoal = calculateWaterGoal(formValues.weight)

      setCalculations({
        bmi: bmi.toFixed(1),
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        ...macros,
        waterGoal,
      })
    }
  }, [formValues])

  // Load existing profile
  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (data) {
        setValue('age', data.age)
        setValue('gender', data.gender)
        setValue('height', data.height)
        setValue('weight', data.weight)
        setValue('activityLevel', data.activity_level)
        setValue('dietPreference', data.diet_preference)
        setValue('healthGoal', data.health_goal)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const onSubmit = async (data: ProfileInput) => {
    setLoading(true)
    setSuccess(false)

    try {
      const profileData = {
        user_id: user?.id,
        age: data.age,
        gender: data.gender,
        height: data.height,
        weight: data.weight,
        activity_level: data.activityLevel,
        diet_preference: data.dietPreference,
        health_goal: data.healthGoal,
        bmi: parseFloat(calculations.bmi),
        bmr: calculations.bmr,
        tdee: calculations.tdee,
        protein_goal: calculations.protein,
        carbs_goal: calculations.carbs,
        fats_goal: calculations.fats,
        water_goal: calculations.waterGoal,
        updated_at: new Date(),
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData)

      if (error) throw error

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="md:pl-64">
      <Navigation />
      <main className="pt-20 md:pt-8 p-4 md:p-8 min-h-screen max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary" />
            Health Profile
          </h1>
          <p className="text-muted-foreground">Update your personal information for personalized recommendations</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-600 p-4 rounded-lg">
              Profile updated successfully!
            </div>
          )}

          {/* Personal Information */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic health profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Age"
                  type="number"
                  min="13"
                  max="120"
                  {...register('age', { valueAsNumber: true })}
                  error={errors.age?.message}
                />
                
                <Select
                  label="Gender"
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                  ]}
                  {...register('gender')}
                  error={errors.gender?.message}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Height (cm)"
                  type="number"
                  min="100"
                  max="250"
                  {...register('height', { valueAsNumber: true })}
                  error={errors.height?.message}
                />
                
                <Input
                  label="Weight (kg)"
                  type="number"
                  min="30"
                  max="500"
                  {...register('weight', { valueAsNumber: true })}
                  error={errors.weight?.message}
                />
              </div>
            </CardContent>
          </Card>

          {/* Health Parameters */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Health Parameters</CardTitle>
              <CardDescription>Your activity level and health goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Activity Level"
                options={[
                  { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
                  { value: 'light', label: 'Light (1-3 days/week)' },
                  { value: 'moderate', label: 'Moderate (3-5 days/week)' },
                  { value: 'active', label: 'Active (6-7 days/week)' },
                  { value: 'very_active', label: 'Very Active (intense exercise)' },
                ]}
                {...register('activityLevel')}
                error={errors.activityLevel?.message}
              />
              
              <Select
                label="Diet Preference"
                options={[
                  { value: 'omnivore', label: 'Omnivore' },
                  { value: 'vegetarian', label: 'Vegetarian' },
                  { value: 'vegan', label: 'Vegan' },
                  { value: 'keto', label: 'Keto' },
                  { value: 'low_carb', label: 'Low Carb' },
                ]}
                {...register('dietPreference')}
                error={errors.dietPreference?.message}
              />
              
              <Select
                label="Health Goal"
                options={[
                  { value: 'lose_weight', label: 'Lose Weight' },
                  { value: 'gain_muscle', label: 'Gain Muscle' },
                  { value: 'maintain', label: 'Maintain Weight' },
                  { value: 'increase_strength', label: 'Increase Strength' },
                ]}
                {...register('healthGoal')}
                error={errors.healthGoal?.message}
              />
            </CardContent>
          </Card>

          {/* Calculated Metrics */}
          <Card className="glass bg-primary/5">
            <CardHeader>
              <CardTitle>Your Health Metrics</CardTitle>
              <CardDescription>Calculated based on your information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-background/50">
                  <p className="text-sm text-muted-foreground mb-1">BMI</p>
                  <p className="text-2xl font-bold text-primary">{calculations.bmi}</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50">
                  <p className="text-sm text-muted-foreground mb-1">BMR (kcal)</p>
                  <p className="text-2xl font-bold text-primary">{calculations.bmr}</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50">
                  <p className="text-sm text-muted-foreground mb-1">TDEE (kcal)</p>
                  <p className="text-2xl font-bold text-primary">{calculations.tdee}</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50">
                  <p className="text-sm text-muted-foreground mb-1">Protein (g)</p>
                  <p className="text-2xl font-bold text-green-500">{calculations.protein}</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50">
                  <p className="text-sm text-muted-foreground mb-1">Carbs (g)</p>
                  <p className="text-2xl font-bold text-blue-500">{calculations.carbs}</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50">
                  <p className="text-sm text-muted-foreground mb-1">Fats (g)</p>
                  <p className="text-2xl font-bold text-yellow-500">{calculations.fats}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            <Save className="w-5 h-5 mr-2" />
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </motion.form>
      </main>
    </div>
  )
}
