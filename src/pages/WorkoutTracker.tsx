import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { WorkoutSchema, type WorkoutInput } from '@/lib/validations'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Dumbbell, Plus, Trash2, Fire } from 'lucide-react'
import { motion } from 'framer-motion'

interface Workout {
  id: string
  name: string
  type: string
  duration: number
  caloriesBurned: number
  intensity: string
  date: string
}

export default function WorkoutTracker() {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [totalStats, setTotalStats] = useState({ duration: 0, calories: 0, workouts: 0 })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<WorkoutInput>({
    resolver: zodResolver(WorkoutSchema),
    defaultValues: {
      type: 'cardio',
      intensity: 'moderate',
      date: new Date(),
    },
  })

  const onSubmit = async (data: WorkoutInput) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('workouts')
        .insert([{
          user_id: user?.id,
          name: data.name,
          type: data.type,
          duration: data.duration,
          calories_burned: data.caloriesBurned,
          intensity: data.intensity,
          date: data.date.toISOString().split('T')[0],
        }])

      if (error) throw error

      const newWorkout: Workout = {
        id: Math.random().toString(),
        name: data.name,
        type: data.type,
        duration: data.duration,
        caloriesBurned: data.caloriesBurned,
        intensity: data.intensity,
        date: data.date.toISOString().split('T')[0],
      }

      setWorkouts([...workouts, newWorkout])
      updateTotals([...workouts, newWorkout])
      setIsModalOpen(false)
      reset()
    } catch (error) {
      console.error('Error adding workout:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateTotals = (workoutList: Workout[]) => {
    const totals = workoutList.reduce(
      (acc, workout) => ({
        duration: acc.duration + workout.duration,
        calories: acc.calories + workout.caloriesBurned,
        workouts: acc.workouts + 1,
      }),
      { duration: 0, calories: 0, workouts: 0 }
    )
    setTotalStats(totals)
  }

  const deleteWorkout = async (id: string) => {
    try {
      const updatedWorkouts = workouts.filter(w => w.id !== id)
      setWorkouts(updatedWorkouts)
      updateTotals(updatedWorkouts)
    } catch (error) {
      console.error('Error deleting workout:', error)
    }
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'light':
        return 'text-green-500 bg-green-500/10'
      case 'moderate':
        return 'text-yellow-500 bg-yellow-500/10'
      case 'high':
        return 'text-red-500 bg-red-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  return (
    <div className="md:pl-64">
      <Navigation />
      <main className="pt-20 md:pt-8 p-4 md:p-8 min-h-screen">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Dumbbell className="w-8 h-8 text-primary" />
                Workout Tracker
              </h1>
              <p className="text-muted-foreground">Log your exercises and track progress</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="w-5 h-5" />
              Add Workout
            </Button>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="glass">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Workouts</p>
                <p className="text-3xl font-bold text-primary">{totalStats.workouts}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Duration</p>
                <p className="text-3xl font-bold text-blue-500">{totalStats.duration}m</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Calories Burned</p>
                  <p className="text-3xl font-bold text-orange-500">{totalStats.calories}</p>
                </div>
                <Fire className="w-10 h-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Workouts List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          {workouts.length > 0 ? (
            workouts.map((workout, idx) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="glass hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{workout.name}</h3>
                        <div className="flex flex-wrap gap-3 mb-2">
                          <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full capitalize">
                            {workout.type}
                          </span>
                          <span className={`text-sm px-3 py-1 rounded-full capitalize font-medium ${getIntensityColor(workout.intensity)}`}>
                            {workout.intensity}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p className="text-xs uppercase tracking-wide mb-1">Duration</p>
                            <p className="text-lg font-semibold text-foreground">{workout.duration} min</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide mb-1">Calories</p>
                            <p className="text-lg font-semibold text-orange-500">{workout.caloriesBurned}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide mb-1">Date</p>
                            <p className="text-lg font-semibold text-foreground">{new Date(workout.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteWorkout(workout.id)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="glass">
              <CardContent className="pt-12 text-center pb-12">
                <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No workouts logged yet. Start your fitness journey!</p>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Add Workout Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Workout" size="md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Workout Name"
              placeholder="e.g., Morning Run"
              {...register('name')}
              error={errors.name?.message}
            />

            <Select
              label="Type"
              options={[
                { value: 'cardio', label: 'Cardio' },
                { value: 'strength', label: 'Strength' },
                { value: 'flexibility', label: 'Flexibility' },
                { value: 'sports', label: 'Sports' },
              ]}
              {...register('type')}
              error={errors.type?.message}
            />

            <Input
              label="Duration (minutes)"
              type="number"
              {...register('duration', { valueAsNumber: true })}
              error={errors.duration?.message}
            />

            <Input
              label="Calories Burned"
              type="number"
              {...register('caloriesBurned', { valueAsNumber: true })}
              error={errors.caloriesBurned?.message}
            />

            <Select
              label="Intensity"
              options={[
                { value: 'light', label: 'Light' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'high', label: 'High' },
              ]}
              {...register('intensity')}
              error={errors.intensity?.message}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Adding...' : 'Add Workout'}
            </Button>
          </form>
        </Modal>
      </main>
    </div>
  )
}
