import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { MealSchema, type MealInput } from '@/lib/validations'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Utensils, Plus, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface Meal {
  id: string
  name: string
  mealType: string
  calories: number
  protein: number
  carbs: number
  fats: number
  date: string
}

export default function FoodTracker() {
  const { user } = useAuth()
  const [meals, setMeals] = useState<Meal[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [totalStats, setTotalStats] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MealInput>({
    resolver: zodResolver(MealSchema),
    defaultValues: {
      mealType: 'breakfast',
      date: new Date(),
    },
  })

  const onSubmit = async (data: MealInput) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('meals')
        .insert([{
          user_id: user?.id,
          name: data.name,
          meal_type: data.mealType,
          calories: data.calories,
          protein: data.protein,
          carbs: data.carbs,
          fats: data.fats,
          date: data.date.toISOString().split('T')[0],
        }])

      if (error) throw error

      // Add to local state
      const newMeal: Meal = {
        id: Math.random().toString(),
        name: data.name,
        mealType: data.mealType,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fats: data.fats,
        date: data.date.toISOString().split('T')[0],
      }

      setMeals([...meals, newMeal])
      updateTotals([...meals, newMeal])
      setIsModalOpen(false)
      reset()
    } catch (error) {
      console.error('Error adding meal:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateTotals = (mealList: Meal[]) => {
    const totals = mealList.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fats: acc.fats + meal.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    )
    setTotalStats(totals)
  }

  const deleteMeal = async (id: string) => {
    try {
      const updatedMeals = meals.filter(m => m.id !== id)
      setMeals(updatedMeals)
      updateTotals(updatedMeals)
    } catch (error) {
      console.error('Error deleting meal:', error)
    }
  }

  const groupedMeals = meals.reduce((acc: any, meal) => {
    if (!acc[meal.mealType]) acc[meal.mealType] = []
    acc[meal.mealType].push(meal)
    return acc
  }, {})

  return (
    <div className="md:pl-64">
      <Navigation />
      <main className="pt-20 md:pt-8 p-4 md:p-8 min-h-screen">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Utensils className="w-8 h-8 text-primary" />
                Food Tracker
              </h1>
              <p className="text-muted-foreground">Track your meals and monitor nutrition</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="w-5 h-5" />
              Add Meal
            </Button>
          </div>
        </motion.div>

        {/* Daily Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="glass">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Calories</p>
                <p className="text-3xl font-bold text-primary">{totalStats.calories}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Protein</p>
                <p className="text-3xl font-bold text-green-500">{totalStats.protein}g</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Carbs</p>
                <p className="text-3xl font-bold text-blue-500">{totalStats.carbs}g</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Fats</p>
                <p className="text-3xl font-bold text-yellow-500">{totalStats.fats}g</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Meals by Type */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
          {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => (
            <Card key={mealType} className="glass">
              <CardHeader>
                <CardTitle className="capitalize">{mealType}</CardTitle>
              </CardHeader>
              <CardContent>
                {groupedMeals[mealType]?.length > 0 ? (
                  <div className="space-y-3">
                    {groupedMeals[mealType].map((meal: Meal) => (
                      <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{meal.name}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                            <span>{meal.calories} cal</span>
                            <span>P: {meal.protein}g</span>
                            <span>C: {meal.carbs}g</span>
                            <span>F: {meal.fats}g</span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteMeal(meal.id)}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No meals added yet</p>
                )}
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Add Meal Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Meal" size="md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Meal Name"
              placeholder="e.g., Grilled Chicken Salad"
              {...register('name')}
              error={errors.name?.message}
            />

            <Select
              label="Meal Type"
              options={[
                { value: 'breakfast', label: 'Breakfast' },
                { value: 'lunch', label: 'Lunch' },
                { value: 'dinner', label: 'Dinner' },
                { value: 'snack', label: 'Snack' },
              ]}
              {...register('mealType')}
              error={errors.mealType?.message}
            />

            <Input
              label="Calories"
              type="number"
              {...register('calories', { valueAsNumber: true })}
              error={errors.calories?.message}
            />

            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Protein (g)"
                type="number"
                {...register('protein', { valueAsNumber: true })}
                error={errors.protein?.message}
              />
              <Input
                label="Carbs (g)"
                type="number"
                {...register('carbs', { valueAsNumber: true })}
                error={errors.carbs?.message}
              />
              <Input
                label="Fats (g)"
                type="number"
                {...register('fats', { valueAsNumber: true })}
                error={errors.fats?.message}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Adding...' : 'Add Meal'}
            </Button>
          </form>
        </Modal>
      </main>
    </div>
  )
}
