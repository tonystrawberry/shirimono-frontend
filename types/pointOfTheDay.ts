export interface ExampleSentence {
  id: number
  sentence: string
  sentence_html: string
  translation: string
}

export interface BasePoint {
  id: number
  type: 'kanji' | 'vocabulary' | 'grammar'
  title: string
  meanings: string[]
  example_sentences: ExampleSentence[]
}

export interface KanjiPoint extends BasePoint {
  type: 'kanji'
  kunyomi_readings: string[]
  onyomi_readings: string[]
}

export interface VocabularyPoint extends BasePoint {
  type: 'vocabulary'
  kana: string
  types: string[]
}

export interface GrammarPoint extends BasePoint {
  type: 'grammar'
}

export interface PointOfTheDay {
  id: number
  featured_on: string
  point: KanjiPoint | VocabularyPoint | GrammarPoint
}

// Type guard functions to help with type narrowing
export function isKanjiPoint(point: BasePoint): point is KanjiPoint {
  return point.type === 'kanji'
}

export function isVocabularyPoint(point: BasePoint): point is VocabularyPoint {
  return point.type === 'vocabulary'
}

export function isGrammarPoint(point: BasePoint): point is GrammarPoint {
  return point.type === 'grammar'
}