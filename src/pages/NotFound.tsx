import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <p className="text-muted-foreground mb-6">Page not found</p>
        <Link to="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </motion.div>
    </div>
  )
}
