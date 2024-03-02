console.log("jay Shri Ram")

const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next))
    .catch((err) => next(err))
  }
}

export { asyncHandler }