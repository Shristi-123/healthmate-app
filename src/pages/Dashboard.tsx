import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { calculateHealthScore } from '@/lib/calculations'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Flame, Droplet, Moon, Dumbbell, TrendingUp, Activity, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface DailyStats {
  calories: number
  protein: number
  carbs: number
  fats: number
  water: number
  sleep: number
  workouts: number
}

interface UserProfile {
  age: number
  gender: string
  height: number
  weight: number
  activityLevel: string
  healthGoal: string
  tdee: number
  proteinGoal: number
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DailyStats>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    water: 0,
    sleep: 0,
    workouts: 0,
  })
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [healthScore, setHealthScore] = useState(75)
  const [loading, setLoading] = useState(true)
  const [weeklyData, setWeeklyData] = useState([])

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single()
      
      if (profileData) {
        setProfile(profileData)
      }

      // Load today's meals
      const today = new Date().toISOString().split('T')[0]
      const { data: mealsData } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today)

      if (mealsData) {
        const totalCalories = mealsData.reduce((sum, meal) => sum + meal.calories, 0)
        const totalProtein = mealsData.reduce((sum, meal) => sum + meal.protein, 0)
        const totalCarbs = mealsData.reduce((sum, meal) => sum + meal.carbs, 0)
        const totalFats = mealsData.reduce((sum, meal) => sum + meal.fats, 0)
        
        setStats(prev => ({
          ...prev,
          calories: totalCalories,
          protein: totalProtein,
          carbs: totalCarbs,
          fats: totalFats,
        }))
      }

      // Load water logs
      const { data: waterData } = await supabase
        .from('water_logs')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today)

      if (waterData) {
        const totalWater = waterData.reduce((sum, log) => sum + log.amount, 0)
        setStats(prev => ({
          ...prev,
          water: totalWater,
        }))
      }

      // Load sleep logs
      const { data: sleepData } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today)

      if (sleepData && sleepData.length > 0) {
        setStats(prev => ({
          ...prev,
          sleep: sleepData[0].duration,
        }))
      }

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

      // Calculate health score
      const score = calculateHealthScore({
        caloriesBurned: stats.calories,
        caloriesGoal: profileData?.tdee || 2000,
        protein: stats.protein,
        proteinGoal: profileData?.proteinGoal || 150,
        water: stats.water,
        waterGoal: 2000,
        sleep: stats.sleep,
        sleepGoal: 8,
      })
      setHealthScore(score)
    } catch (error) {
      console.error('Error loading dashboard:', error)
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

  const macroData = [
    { name: 'Protein', value: stats.protein * 4, fill: COLORS[0] },
    { name: 'Carbs', value: stats.carbs * 4, fill: COLORS[1] },
    { name: 'Fats', value: stats.fats * 9, fill: COLORS[2] },
  ]

  return (
    <div className="md:pl-64">
      <Navigation />
      <main className="pt-20 md:pt-8 p-4 md:p-8 min-h-screen">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user?.email?.split('@')[0]}!</h1>
          <p className="text-muted-foreground">Here's your health overview for today</p>
        </motion.div>

        {/* Health Score */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="mb-8">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary" />
                Daily Health Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <ProgressRing percentage={healthScore} radius={60}>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-primary">{healthScore}</span>
                    <p className="text-xs text-muted-foreground">/100</p>
                  </div>
                </ProgressRing>
                <div className="flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Calories</span>
                      <span className="font-semibold">{stats.calories} / {profile?.tdee || 2000}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Protein</span>
                      <span className="font-semibold">{stats.protein}g / {profile?.proteinGoal || 150}g</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Water</span>
                      <span className="font-semibold">{stats.water}ml / 2000ml</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Calories</p>
                  <p className="text-3xl font-bold text-foreground">{stats.calories}</p>
                </div>
                <Flame className="w-10 h-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Water Intake</p>
                  <p className="text-3xl font-bold text-foreground">{Math.round(stats.water / 100)}L</p>
                </div>
                <Droplet className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Sleep</p>
                  <p className="text-3xl font-bold text-foreground">{stats.sleep}h</p>
                </div>
                <Moon className="w-10 h-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Protein</p>
                  <p className="text-3xl font-bold text-foreground">{stats.protein}g</p>
                </div>
                <Dumbbell className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Calories Chart */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Weekly Calories</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgb(107, 114, 128)" />
                  <YAxis stroke="rgb(107, 114, 128)" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="calories" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Macro Distribution */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Macronutrient Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={macroData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
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
