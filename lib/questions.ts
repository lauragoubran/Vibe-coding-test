export const questions = [
  {
    id: 'q1',
    field: 'q1_answer',
    text: 'How excited are you about opening the Homs centre?',
    options: ['Very excited', 'Excited', 'Neutral', 'Not excited'],
  },
  {
    id: 'q2',
    field: 'q2_answer',
    text: 'How ready do you feel Alsama is to open the Homs centre?',
    options: ['Very ready', 'Mostly ready', 'Needs more preparation', 'Not ready'],
  },
  {
    id: 'q3',
    field: 'q3_answer',
    text: 'What best describes your main feeling about the Homs centre?',
    options: ['Hopeful', 'Proud', 'Cautious', 'Uncertain'],
  },
  {
    id: 'q4',
    field: 'q4_answer',
    text: 'How supported do you feel in your role related to the Homs centre?',
    options: ['Very supported', 'Supported', 'Could be better', 'Unsupported'],
  },
] as const

export type QuestionField = (typeof questions)[number]['field']
