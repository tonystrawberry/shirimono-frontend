export interface ClassroomNavigationState {
  courseSlug: string
  pointType: string
  level: {
    id: number
    position: number
    title: string
  } | null
}