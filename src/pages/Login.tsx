import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/AuthContext'
import { LoginSchema, type LoginInput } from '@/lib/validations'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setError(null)
    setIsLoading(true)
    
    try {
      await signIn(data.email, data.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <h1 className="text-3xl font-bold text-foreground">HealthMate</h1>
          </div>
          <p className="text-muted-foreground">Your AI-powered health companion</p>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
              
              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                {...register('email')}
                error={errors.email?.message}
              />
              
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
              />
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
