import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from './Button'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              onClick={e => e.stopPropagation()}
              className={`glass rounded-lg p-6 w-full ${sizeClasses[size]}`}
            >
              {title && (
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
