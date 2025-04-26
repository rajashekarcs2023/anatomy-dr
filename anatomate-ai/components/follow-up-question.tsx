"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, Loader2, MessageSquare } from "lucide-react"

interface FollowUpQuestionProps {
  onSubmit: (question: string) => void
  followUpHistory: Array<{ question: string; answer: string }>
}

export function FollowUpQuestion({ onSubmit, followUpHistory }: FollowUpQuestionProps) {
  const [question, setQuestion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit(question)
      setQuestion("")
    } finally {
      setIsSubmitting(false)
    }
  }

  const suggestedQuestions = [
    "What are the treatment options?",
    "How long will recovery take?",
    "What lifestyle changes should I make?",
    "Are there any complications I should watch for?",
  ]

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare size={18} className="mr-2" />
          Follow-up Questions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {followUpHistory.length > 0 && (
          <div className="mb-4 space-y-4">
            {followUpHistory.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">You asked:</p>
                  <p className="text-sm">{item.question}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">AnatoMate.ai:</p>
                  <p className="text-sm">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="follow-up" className="text-sm font-medium block mb-2">
              Still have questions? Ask here:
            </label>
            <Textarea
              id="follow-up"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your follow-up question..."
              className="min-h-[60px] w-full"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <Button
                key={i}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuestion(q)}
                className="text-xs"
              >
                {q}
              </Button>
            ))}
          </div>

          <Button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 w-full"
            disabled={isSubmitting || !question.trim()}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send size={16} className="mr-2" />}
            Ask Question
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
