export interface ClassroomNavigationState {
  courseSlug: string
  level: number | null
  pointType: 'kanji' | 'grammar' | 'vocabulary' | ''
}