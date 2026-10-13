// Response envelope from SRS §5.3.
export interface ApiSuccess<T> {
  success: true
  data: T
  message?: string
}

export interface ApiFailure {
  success: false
  error: { code: string; message: string }
}
