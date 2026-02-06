export type * from './loan'

export interface ActionState {
  success: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
}
