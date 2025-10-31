import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, User, Mail, Lock, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { signUp } from "@/store/authSlice";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  services: string;
}

export default function SignUp() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { search } = useLocation();
  const navigate = useNavigate();
  const services = watch("services");


  const onSubmit = async (data: SignUpFormData) => {
    setServerError(null);
    if (data.password !== data.confirmPassword) {
      setServerError("Passwords do not match");
      return;
    }
    try {
      if(data.services==="review-sentiment"){
        if(data.role){
          delete data.role
        }
      }
      const res = await dispatch(signUp(data));
      if (res.meta.requestStatus === "fulfilled") {
        navigate("/login");
        // if (data?.role === "brand") {
        //   navigate("/login");
        // } else {
        //   navigate("/login");
        // }
      }
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || "Sign up failed. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-sans p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-purple-700 mb-2 font-sans">
            Create Account
          </h2>
          <p className="text-gray-600 text-sm">Join us today and get started</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                {...register("name", { required: "Name is required" })}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 font-sans ${errors.name
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-purple-200 focus:bg-white"
                  }`}
                placeholder="Enter your full name"
                autoComplete="name"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-sans flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 font-sans ${errors.email
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-purple-200 focus:bg-white"
                  }`}
                placeholder="Enter your email address"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-sans flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Services Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
              Select Services
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>

              <select
                {...register("services", { required: "Service is required" })}
                className={`w-full pl-10 pr-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 font-sans appearance-none ${errors.role
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-purple-200 focus:bg-white"
                  }`}
                defaultValue=""
              >
                <option value="" disabled>
                  Select your Services
                </option>
                <option value="review-sentiment">Review Sentiment</option>
                <option value="influencer">Influencer</option>
              </select>
            </div>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-sans flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.role.message}
              </p>
            )}
          </div>

          {services === 'influencer' && <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
              Select Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>

              <select
                {...register("role", { required: "Role is required" })}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 font-sans appearance-none ${errors.role
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-purple-200 focus:bg-white"
                  }`}
                defaultValue=""
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="brand">Brand</option>
                <option value="influencer">Influencer</option>
              </select>
            </div>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-sans flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.role.message}
              </p>
            )}
          </div>}

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 font-sans ${errors.password
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-purple-200 focus:bg-white"
                  }`}
                placeholder="Enter your password"
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-2 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-purple-500" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-purple-500" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-sans flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 font-sans ${errors.confirmPassword
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-purple-200 focus:bg-white"
                  }`}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 px-2 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors"
              >
                {showConfirmPassword ? (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-purple-500" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-purple-500" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-sans flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-sm text-center font-sans flex items-center justify-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                {serverError}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
        {/* <div className="my-6 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> OR{" "}
              <div className="h-px flex-1 bg-border" />
            </div> */}
        {/* <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 size-4" /> Google
              </Button>
              <Button variant="outline" className="w-full">
                <Github className="mr-2 size-4" /> GitHub
              </Button>
            </div> */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
