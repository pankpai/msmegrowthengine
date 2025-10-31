import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model";
import { ApiResponse } from "../../shared/Apiresponse";
import { asyncHandler } from "../../shared/asyncFunchandler";

const JWT_SECRET = process.env.JWT_SECRET || "";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "";
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? ("none" as const)
      : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function generateAccessToken(user: {
  id: string;
  email: string;
  role?: string;
  clientId?: string;
}) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

function generateRefreshToken(user: {
  id: string;
  email: string;
  role?: string;
  clientId?: string;
}) {
  return jwt.sign(user, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

function setRefreshCookie(res: Response, refreshToken: string) {
  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
}

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password, role, services } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json(new ApiResponse(false, "Email Id is already exist"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: services === "influencer" ? role : undefined,
      services,
    });
    const accessToken = generateAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      clientId: user.clientId,
    });
    const refreshToken = generateRefreshToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      clientId: user.clientId,
    });
    setRefreshCookie(res, refreshToken);
    res.status(201).json({
      success: true,
      message: "User registered",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        services: user.services,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json(new ApiResponse(false, "Invalid credentials"));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json(new ApiResponse(false, "Invalid credentials"));
    }
    const accessToken = generateAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      clientId: user.clientId,
    });
    const refreshToken = generateRefreshToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      clientId: user.clientId,
    });
    setRefreshCookie(res, refreshToken);
    res.status(200).json({
      success: true,
      message: "Signed in",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        services: user.services,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get User info....
export const handleGetuserInfo = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.user.id;
    const userInfo = await User.findById(id).select(
      "-__v -createdAt -updatedAt",
    );
    res.status(200).json(new ApiResponse(true, "", userInfo));
  },
);

export const signOut = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  });
  res.status(200).json(new ApiResponse(true, "Logout"));
});

// Refresh token endpoint
export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken =
      req.cookies?.refreshToken || req.headers.authorization.split(" ")[1];
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token missing" });
    }
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as {
      id: string;
      email: string;
      role?: string;
      clientId?: string;
    };
    const accessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      clientId: decoded.clientId,
    });
    res.status(200).json({ success: true, accessToken });
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }
};

export const updateServiceshandler = asyncHandler(async(req:Request,res:Response)=>{
  const {services,role} = req.body
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json(new ApiResponse(false, "User not found"));
  }
  if(user.services.includes(services)){
    return res.status(400).json(new ApiResponse(false, "Service already added"));
  }
  user.services.push(services);
  if(services === "influencer"){
    user.role = role
  }
  await user.save();
  res.status(200).json(new ApiResponse(true, "Service added successfully",user));
})



// export const updateCreditofUser = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { id, email, credit } = req.body;
//     const user = await User.findById(id);
//     if (!user) {
//       return res
//         .status(404)
//         .json(new ApiResponse(false, "Invalid request or user not exist"));
//     }
//     if (user.credit.remainingCredit < credit) {
//       return res.status(400).json(new ApiResponse(false, "your credit is ended!"));
//     }
//     user.credit.remainingCredit = user?.credit?.remainingCredit - credit;
//     await user.save();
//     res.status(200).json(new ApiResponse(true, "Token Deduct"));
//   },
// );

// export const signUp = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { name, email, password } = req.body;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(409)
//         .json(new ApiResponse(false, "Email Id is already exist"));
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email, password: hashedPassword });
//     const accessToken = generateAccessToken({
//       id: user._id.toString(),
//       email: user.email,
//       clientId: user.clientId,
//     });
//     const refreshToken = generateRefreshToken({
//       id: user._id.toString(),
//       email: user.email,
//       clientId: user.clientId,
//     });
//     setRefreshCookie(res, refreshToken);
//     res.status(201).json({
//       success: true,
//       message: "User registered",
//       accessToken,
//       refreshToken,
//       user: { id: user._id, name: user.name, email: user.email },
//     });
//   } catch (err) {
//     next(err);
//   }
// };
