export interface ClassroomNavigationState {
  courseSlug: string | null
  position: number | null
  pointType: 'kanji' | 'grammar' | 'vocabulary' | null
}