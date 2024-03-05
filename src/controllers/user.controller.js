console.log("Jay Shri Ram")
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'
import { User } from '../models/user.models.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { apiRespose } from '../utils/apiResponse.js'

const generateAccessAndRefreshToken = async (userId)=>{
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    return {accessToken, refreshToken}

    //! 25:00

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
}

const registerUser = asyncHandler( async (req, res)=>{

  const { username, email, password, fullname } = req.body
  console.log("email: ", email)

  if ([username, email, password, fullname].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required")
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) {
    throw new ApiError(400, "Avatar file required")
  }

  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || ""
  })

  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createUser) {
    throw new ApiError(500, "Something went wrong")
  }

  return res.status(201).json(
    new apiRespose(200, createUser, "User registered Saccessfully")
  )
})

const loginUser = asyncHandler( async (req, res)=>{
  const {username, password, email} = req.body

  if (!username || !email) {
    throw new ApiError(400, "username or email is required")
  }

  const user = await User.findOne({
    $or: [{username}, {email}],
  })

  if (!user) {
    throw new ApiError(404, "User does not exist")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401, "Password is wrong")
  }

})

export { 
  registerUser,
  loginUser
}