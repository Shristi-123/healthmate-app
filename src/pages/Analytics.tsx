import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { TrendingUp, Calendar, Trophy, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

export default function Analytics() {
  const { user } = useAuth()
  const [weeklyData, setWeeklyData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [mealTypeData, setMealTypeData] = useState([])
  const [workoutTypeData, setWorkoutTypeData] = useState([])
  const [healthMetrics, setHealthMetrics] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadAnalytics()
    }
  }, [user])

  const loadAnalytics = async () => {
    try {
      // Load weekly data
      const { data: weeklyMeals } = await supabase
        .from('meals')
        .select('date, calories')
        .eq('user_id', user?.id)
        .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

      if (weeklyMeals) {
        const grouped = weeklyMeals.reduce((acc: any, meal: any) => {
          const date = new Date(meal.date).toLocaleDateString('en-US', { weekday: 'short' })
          const existing = acc.find((d: any) => d.name === date)
          if (existing) {
            existing.calories += meal.calories
          } else {
            acc.push({ name: date, calories: meal.calories })
          }
          return acc
        }, [])
        setWeeklyData(grouped)
      }

      // Load monthly data
      const { data: monthlyMeals } = await supabase
        .from('meals')
        .select('date, calories')
        .eq('user_id', user?.id)
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      if (monthlyMeals) {
        const grouped = monthlyMeals.reduce((acc: any, meal: any) => {
          const date = new Date(meal.date).getDate()
          const existing = acc.find((d: any) => d.name === `Day ${date}`)
          if (existing) {
            existing.calories += meal.calories
          } else {
            acc.push({ name: `Day ${date}`, calories: meal.calories })
          }
          return acc
        }, [])
        setMonthlyData(grouped)
      }

      // Meal type distribution
      const { data: allMeals } = await supabase
        .from('meals')
        .select('meal_type')
        .eq('user_id', user?.id)

      if (allMeals) {
        const typeCount = allMeals.reduce((acc: any, meal: any) => {
          const existing = acc.find((d: any) => d.name === meal.meal_type)
          if (existing) {
            existing.value += 1
          } else {
            acc.push({ name: meal.meal_type, value: 1 })
          }
          return acc
        }, [])
        setMealTypeData(typeCount)
      }

      // Workout type distribution
      const { data: allWorkouts } = await supabase
        .from('workouts')
        .select('type')
        .eq('user_id', user?.id)

      if (allWorkouts) {
        const typeCount = allWorkouts.reduce((acc: any, workout: any) => {
          const existing = acc.find((d: any) => d.name === workout.type)
          if (existing) {
            existing.value += 1
          } else {
            acc.push({ name: workout.type, value: 1 })
          }
          return acc
        }, [])
        setWorkoutTypeData(typeCount)
      }

      // Health metrics
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (profile) {
        setHealthMetrics({
          bmi: profile.bmi,
          tdee: profile.tdee,
          protein: profile.protein_goal,
          water: profile.water_goal,
        })
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="md:pl-64">
      <Navigation />
      <main className="pt-20 md:pt-8 p-4 md:p-8 min-h-screen">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            Analytics & Insights
          </h1>
          <p className="text-muted-foreground">Track your health trends and progress</p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">BMI</p>
                  <p className="text-3xl font-bold text-primary">{healthMetrics.bmi?.toFixed(1)}</p>
                </div>
                <Trophy className="w-10 h-10 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Daily TDEE</p>
                <p className="text-3xl font-bold text-blue-500">{healthMetrics.tdee}</p>
                <p className="text-xs text-muted-foreground mt-1">kcal</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Protein Goal</p>
                <p className="text-3xl font-bold text-green-500">{healthMetrics.protein}</p>
                <p className="text-xs text-muted-foreground mt-1">grams</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Water Goal</p>
                  <p className="text-3xl font-bold text-cyan-500">{healthMetrics.water}</p>
                </div>
                <Zap className="w-10 h-10 text-cyan-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Calories */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Weekly Calorie Intake
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgb(107, 114, 128)" />
                  <YAxis stroke="rgb(107, 114, 128)" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="calories" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Monthly Calorie Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgb(107, 114, 128)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="rgb(107, 114, 128)" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="calories" stroke="#3b82f6" strokeWidth={2} isAnimationActive={true} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Distribution Charts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Meal Type Distribution */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Meal Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={mealTypeData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {mealTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Workout Type Distribution */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Workout Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={workoutTypeData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {workoutTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
