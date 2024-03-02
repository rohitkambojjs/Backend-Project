class ApiError extends Error {
  constructor(
    statusCode,
    massage = "Something went wrong",
    error = [],
    statck = "",
  ){
    super(message)
    this.statusCode = statusCode
    this.data = null
    this.message = massage
    this.success = false
    this.errors = errors

    if (statck) {
      this.stack = statck
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export { ApiError }