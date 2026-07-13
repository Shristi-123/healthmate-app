import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Menu, X, Home, Utensils, Dumbbell, BarChart3, MessageCircle, User, LogOut, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
  { label: 'Food Tracker', path: '/food-tracker', icon: <Utensils className="w-5 h-5" /> },
  { label: 'Workouts', path: '/workout-tracker', icon: <Dumbbell className="w-5 h-5" /> },
  { label: 'Analytics', path: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'AI Chat', path: '/chat', icon: <MessageCircle className="w-5 h-5" /> },
]

export default function Navigation() {
  const navigate = useNavigate()
  const { signOut, user } = useAuth()
  const { theme, isDark, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const handleNavClick = (path: string) => {
    navigate(path)
    setIsOpen(false)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-screen w-64 glass flex-col border-r border-white/10">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            💚 HealthMate
          </h1>
        </div>
        
        <div className="flex-1 overflow-auto p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <button
            onClick={() => handleNavClick('/profile')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start gap-3"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-40 glass border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-primary">💚 HealthMate</h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/10 p-4 space-y-2"
            >
              {navItems.map(item => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
              
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={handleSignOut}
                className="w-full justify-start gap-3"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
