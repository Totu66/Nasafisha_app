<<<<<<< HEAD
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
=======
export interface ApiResponse {}
>>>>>>> 3e83867f61750c832e15a66ca6a81072734dabd0
