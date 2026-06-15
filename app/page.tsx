'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { questions } from '@/lib/questions'

const STORAGE_KEY = 'homs_survey_submitted'

export default function SurveyPage() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) {
      router.replace('/results')
    }
  }, [router])

  function handleChange(field: string, value: string) {
    setAnswers((prev) => ({ ...prev, [field]: value }))
    setValidationError(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const unanswered = questions.some((q) => !answers[q.field])
    if (unanswered) {
      setValidationError(true)
      return
    }

    setSubmitting(true)
    setError(null)

    const { error: dbError } = await supabase.from('responses').insert([
      {
        q1_answer: answers.q1_answer,
        q2_answer: answers.q2_answer,
        q3_answer: answers.q3_answer,
        q4_answer: answers.q4_answer,
      },
    ])

    if (dbError) {
      setError('Something went wrong saving your response. Please try again.')
      setSubmitting(false)
      return
    }

    localStorage.setItem(STORAGE_KEY, '1')
    router.push('/results')
  }

  const answeredCount = questions.filter((q) => answers[q.field]).length

  return (
    <main className="min-h-screen bg-[#fdf8f3] px-4 py-10">
      <div className="max-w-xl mx-auto">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#c2773a] mb-2">
            Alsama Project
          </p>
          <h1 className="text-3xl font-bold text-[#2d1f0f] leading-snug">
            Homs Centre Survey
          </h1>
          <p className="mt-3 text-[#6b4c2a] text-sm">
            Share how you feel about the opening. All responses are anonymous.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-[#a07050] mb-1">
            <span>{answeredCount} of {questions.length} answered</span>
            <span>{answeredCount === questions.length ? 'Ready to submit ✓' : 'All questions required'}</span>
          </div>
          <div className="h-2 bg-[#f5d9bc] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c2773a] rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-6">
            {questions.map((q, idx) => {
              const answered = !!answers[q.field]
              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm transition-colors ${
                    validationError && !answered
                      ? 'border-red-300'
                      : answered
                      ? 'border-[#c2773a]/30'
                      : 'border-[#f5d9bc]'
                  }`}
                >
                  <p className="text-xs font-semibold text-[#c2773a] uppercase tracking-wide mb-1">
                    Question {idx + 1}
                  </p>
                  <p className="font-semibold text-[#2d1f0f] mb-4 leading-snug">
                    {q.text}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((option) => {
                      const selected = answers[q.field] === option
                      return (
                        <label
                          key={option}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer border transition-colors ${
                            selected
                              ? 'bg-[#faeee0] border-[#c2773a] text-[#8a4d1e]'
                              : 'border-[#f0e0cc] hover:bg-[#faeee0]/60 text-[#4a3020]'
                          }`}
                        >
                          <input
                            type="radio"
                            name={q.field}
                            value={option}
                            checked={selected}
                            onChange={() => handleChange(q.field, option)}
                            className="accent-[#c2773a] w-4 h-4 flex-shrink-0"
                          />
                          <span className="text-sm font-medium">{option}</span>
                        </label>
                      )
                    })}
                  </div>
                  {validationError && !answered && (
                    <p className="mt-2 text-xs text-red-500">Please select an answer.</p>
                  )}
                </div>
              )
            })}
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 w-full py-4 rounded-2xl bg-[#c2773a] text-white font-semibold text-base shadow-md hover:bg-[#a85f28] active:bg-[#8a4d1e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting…' : 'Submit Survey'}
          </button>

          <p className="mt-4 text-center text-xs text-[#a07050]">
            You can only submit once. Results are shared with the whole team.
          </p>
        </form>
      </div>
    </main>
  )
}
