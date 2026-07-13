import { useState, useRef, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/contexts/AuthContext'
import { getChatCompletion, type ChatMessage, generateMealPlan, analyzeNutrition } from '@/lib/ai'
import { MessageCircle, Send, Loader } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ChatBot() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI health assistant. I can help you with meal planning, nutrition advice, workout recommendations, and general health questions. How can I assist you today?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: ChatMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Prepare context for the AI
      const conversationHistory = [...messages, userMessage]

      // Get AI response
      let response = ''

      // Check for specific commands
      if (input.toLowerCase().includes('meal plan')) {
        response = await generateMealPlan(
          { age: 25, weight: 75, height: 175, activityLevel: 'moderate', tdee: 2200, healthGoal: 'maintain' },
          { dietPreference: 'omnivore' }
        )
      } else if (input.toLowerCase().includes('analyze') || input.toLowerCase().includes('nutrition')) {
        response = await analyzeNutrition([
          { name: 'Breakfast', calories: 500, protein: 20, carbs: 60, fats: 15 },
          { name: 'Lunch', calories: 600, protein: 30, carbs: 70, fats: 20 },
        ])
      } else {
        response = await getChatCompletion(conversationHistory)
      }

      // Add assistant message
      const assistantMessage: ChatMessage = { role: 'assistant', content: response }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error getting response:', error)
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="md:pl-64">
      <Navigation />
      <main className="pt-20 md:pt-8 p-4 md:p-8 min-h-screen flex flex-col">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <MessageCircle className="w-8 h-8 text-primary" />
            AI Health Assistant
          </h1>
          <p className="text-muted-foreground">Get personalized health advice and meal recommendations</p>
        </motion.div>

        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Chat Messages */}
          <Card className="glass flex-1 flex flex-col mb-6">
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((message, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'glass rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="glass px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      <p className="text-sm text-muted-foreground">Thinking...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </CardContent>
          </Card>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              placeholder="Ask me about nutrition, workouts, or health..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              size="lg"
              className="px-6"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            <button
              onClick={() => setInput('Create a meal plan for me')}
              className="p-4 glass rounded-lg hover:bg-primary/10 transition-colors text-left"
            >
              <p className="font-medium text-foreground mb-1">🍽️ Meal Plan</p>
              <p className="text-sm text-muted-foreground">Get personalized meal recommendations</p>
            </button>
            <button
              onClick={() => setInput('What\'s a good workout routine for me?')}
              className="p-4 glass rounded-lg hover:bg-primary/10 transition-colors text-left"
            >
              <p className="font-medium text-foreground mb-1">💪 Workout Tips</p>
              <p className="text-sm text-muted-foreground">Get exercise recommendations</p>
            </button>
            <button
              onClick={() => setInput('How can I improve my nutrition?')}
              className="p-4 glass rounded-lg hover:bg-primary/10 transition-colors text-left"
            >
              <p className="font-medium text-foreground mb-1">🥗 Nutrition Advice</p>
              <p className="text-sm text-muted-foreground">Learn about balanced nutrition</p>
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
