'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, SurveyResponse } from '@/lib/supabase'
import { questions } from '@/lib/questions'

const STORAGE_KEY = 'homs_survey_submitted'

type Tally = Record<string, Record<string, number>>

function tally(responses: SurveyResponse[]): Tally {
  const result: Tally = {}
  for (const q of questions) {
    result[q.field] = {}
    for (const opt of q.options) {
      result[q.field][opt] = 0
    }
  }
  for (const r of responses) {
    for (const q of questions) {
      const val = r[q.field as keyof SurveyResponse] as string
      if (val && result[q.field][val] !== undefined) {
        result[q.field][val]++
      }
    }
  }
  return result
}

export default function ResultsPage() {
  const router = useRouter()
  const [data, setData] = useState<Tally | null>(null)
  const [total, setTotal] = useState(0)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchResults = useCallback(async () => {
    const { data: rows, error } = await supabase
      .from('responses')
      .select('*')
      .order('submitted_at', { ascending: true })

    if (error || !rows) return

    setData(tally(rows as SurveyResponse[]))
    setTotal(rows.length)
    setLastUpdated(new Date())
  }, [])

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      router.replace('/')
      return
    }
    fetchResults()
    const interval = setInterval(fetchResults, 10000)
    return () => clearInterval(interval)
  }, [router, fetchResults])

  if (!data) {
    return (
      <main className="min-h-screen bg-[#fdf8f3] flex items-center justify-center">
        <p className="text-[#a07050] text-sm animate-pulse">Loading results…</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fdf8f3] px-4 py-10">
      <div className="max-w-xl mx-auto">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#c2773a] mb-2">
            Alsama Project
          </p>
          <h1 className="text-3xl font-bold text-[#2d1f0f]">Survey Results</h1>
          <p className="mt-2 text-[#6b4c2a] text-sm">
            {total} {total === 1 ? 'response' : 'responses'} so far
          </p>
          {lastUpdated && (
            <p className="mt-1 text-xs text-[#b09070]">
              Live · refreshes every 10s · last updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="space-y-6">
          {questions.map((q, idx) => {
            const counts = data[q.field]
            const max = Math.max(...Object.values(counts), 1)

            return (
              <div key={q.id} className="bg-white rounded-2xl border border-[#f5d9bc] p-5 shadow-sm">
                <p className="text-xs font-semibold text-[#c2773a] uppercase tracking-wide mb-1">
                  Question {idx + 1}
                </p>
                <p className="font-semibold text-[#2d1f0f] mb-4 leading-snug">{q.text}</p>
                <div className="space-y-3">
                  {q.options.map((option) => {
                    const count = counts[option] ?? 0
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0
                    const isTop = count === max && count > 0

                    return (
                      <div key={option}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={`font-medium ${isTop ? 'text-[#8a4d1e]' : 'text-[#4a3020]'}`}>
                            {option}
                          </span>
                          <span className="text-[#a07050] tabular-nums">
                            {count} · {pct}%
                          </span>
                        </div>
                        <div className="h-3 bg-[#f5d9bc] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isTop ? 'bg-[#c2773a]' : 'bg-[#e8b98a]'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <p className="mt-8 text-center text-xs text-[#b09070]">
          Results update automatically. Thank you for sharing your voice.
        </p>
      </div>
    </main>
  )
}
