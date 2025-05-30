import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Eye, EyeOff } from "lucide-react";

interface SignInFormProps {
  onClose: () => void;
}

const SignInForm = ({ onClose }: SignInFormProps) => {
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const [isSignIn, setIsSignIn] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  if (!isSignInLoaded || !isSignUpLoaded) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  // Email validation
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Password validation (minimum 8 characters)
  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  // Sign in with password
  const signInWithPassword = async () => {
    if (!username.trim()) {
      setError("Please enter your username.");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setIsLoading(true);
    try {
      const signInAttempt = await signIn.create({
        strategy: "password",
        identifier: username,
        password,
      });
      if (signInAttempt.status === "complete") {
        window.location.href = "/auth-callback";
      } else {
        setError("Incorrect username or password.");
      }
    } catch (err: any) {
      setError(
        err.errors?.[0]?.message || "Error signing in. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/auth-callback",
    });
  };

  // Sign up with email and password
  const signUpWithEmailAndPassword = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter both first name and last name.");
      return;
    }
    setIsLoading(true);
    try {
      const signUpAttempt = await signUp.create({
        emailAddress: email,
        username,
        password,
        firstName,
        lastName,
      });
      await signUpAttempt.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setShowCodeInput(true);
      setError("Verification code has been sent to your email!");
    } catch (err: any) {
      if (err.errors?.[0]?.code === "form_identifier_exists") {
        if (err.errors[0].meta?.paramName === "email_address") {
          setError("This email is already in use.");
        } else if (err.errors[0].meta?.paramName === "username") {
          setError("This username is already in use.");
        } else {
          setError("This account already exists.");
        }
        setShowCodeInput(false);
      } else {
        setError(
          err.errors?.[0]?.message || "Error signing up. Please try again."
        );
        setShowCodeInput(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Verify code and complete sign-up
  const verifyCodeAndSignUp = async () => {
    if (!code.trim()) {
      setError("Please enter the verification code.");
      return;
    }
    setIsLoading(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === "complete") {
        window.location.href = "/auth-callback";
      } else {
        setError("Invalid verification code.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Error verifying code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initiate password reset
  const initiatePasswordReset = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    setIsLoading(true);
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setShowCodeInput(true);
      setError("A code has been sent to your email!");
    } catch (err: any) {
      if (err.errors?.[0]?.code === "form_identifier_not_found") {
        setError("This email does not exist.");
      } else {
        setError(
          err.errors?.[0]?.message ||
            "Error sending reset code. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async () => {
    if (!code.trim()) {
      setError("Please enter the verification code.");
      return;
    }
    if (!validatePassword(newPassword)) {
      setError("New password must be at least 8 characters long.");
      return;
    }
    setIsLoading(true);
    try {
      const resetAttempt = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });
      if (resetAttempt.status === "complete") {
        window.location.href = "/auth-callback";
      } else {
        setError("Unable to reset password.");
      }
    } catch (err: any) {
      setError(
        err.errors?.[0]?.message ||
          "Error resetting password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reset entire form
  const resetForm = () => {
    setEmail("");
    setCode("");
    setUsername("");
    setPassword("");
    setNewPassword("");
    setShowCodeInput(false);
    setFirstName("");
    setLastName("");
    setIsSignIn(true);
    setIsForgotPassword(false);
    setError("");
    setShowPassword(false);
    setShowNewPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="relative flex flex-col gap-6 p-8 max-w-sm w-full bg-zinc-800 shadow-lg rounded-lg border-l-4 border-gradient-to-r from-green-400 to-teal-500">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
        aria-label="Close form"
      >
        ✕
      </button>
      {/* Header */}
      <div className="flex justify-center mb-4">
        <h2 className="text-3xl font-bold text-white">
          {isSignIn
            ? isForgotPassword
              ? "Reset Password"
              : "Sign In"
            : "Sign Up"}
        </h2>
      </div>

      {isSignIn && !isForgotPassword ? (
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-12 pl-4 bg-zinc-700 text-white border-gray-600 rounded-md focus:ring-0 focus:border-green-400"
            />
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 pl-4 pr-10 bg-zinc-700 text-white border-gray-600 rounded-md focus:ring-0 focus:border-green-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          <div className="text-right">
            <button
              onClick={() => {
                resetForm();
                setIsForgotPassword(true);
              }}
              className="text-sm text-gray-400 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <Button
            onClick={signInWithPassword}
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold rounded-full hover:from-green-500 hover:to-teal-600 transition-all"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          <div className="text-center text-gray-400 my-2">Or sign in with</div>
          <div className="flex justify-center gap-4">
            <Button
              onClick={signInWithGoogle}
              disabled={isLoading}
              className="w-12 h-12 bg-zinc-700 border border-gray-600 rounded-full flex items-center justify-center hover:bg-zinc-600 transition-colors"
            >
              <span className="text-2xl text-white">G</span>
            </Button>
          </div>
          <div className="text-center mt-4">
            <span className="text-gray-400">Or </span>
            <button
              onClick={() => {
                resetForm();
                setIsSignIn(false);
              }}
              className="text-green-400 text-sm hover:underline"
            >
              Sign Up
            </button>
          </div>
        </div>
      ) : isSignIn && isForgotPassword ? (
        <div className="flex flex-col gap-4">
          {!showCodeInput ? (
            <>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-4 bg-zinc-700 text-white border-gray-600 rounded-md focus:ring-0 focus:border-green-400"
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
              <Button
                onClick={initiatePasswordReset}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold rounded-full hover:from-green-500 hover:to-teal-600 transition-all"
              >
                {isLoading ? "Sending code..." : "Send Reset Code"}
              </Button>
            </>
          ) : (
            <>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter verification code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-12 pl-4 bg-zinc-700 text-white border-gray-600 rounded-md focus:ring-0 focus:border-green-400"
                />
              </div>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-12 pl-4 pr-10 bg-zinc-700 text-white border-gray-600 rounded-md focus:ring-0 focus:border-green-400"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                >
                  {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
              <Button
                onClick={resetPassword}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold rounded-full hover:from-green-500 hover:to-teal-600 transition-all"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
              <Button
                onClick={initiatePasswordReset}
                disabled={isLoading}
                className="w-full h-12 bg-zinc-700 text-white rounded-full hover:bg-zinc-600 transition-all"
              >
                {isLoading ? "Resending..." : "Resend Code"}
              </Button>
            </>
          )}
          <div className="text-center mt-4">
            <span className="text-gray-400">Or </span>
            <button
              onClick={resetForm}
              className="text-green-400 text-sm hover:underline"
            >
              Sign In
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full h-12 pl-4 bg-zinc-700 text-white border-gray-600 rounded-md focus:ring-0 focus:border-green-400"
            />
          </div>
          <div className="relative">
            <Input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full h-12 pl-4 bg-zinc-700 text-white border-gray-600 rounded-md focus:ring-0 focus:border-green-400"
            />
          </div>
          <div className="relative">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-12 pl-4 bg-zinc-700 text-white border-gray-600 rounded-md focus:ring-0 focus:border-green-400"
            />
          </div>
          <div className="relative">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 pl-4 bg-zinc-700 text-white border-gray-600 rounded-md focus:ring-0 focus:border-green-400"
            />
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 pl-4 pr-10 bg-zinc-700 text-white border-gray-600 rounded-md focus:ring-0 focus:border-green-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {!showCodeInput ? (
            <Button
              onClick={signUpWithEmailAndPassword}
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold rounded-full hover:from-green-500 hover:to-teal-600 transition-all"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          ) : (
            <>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter verification code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-12 pl-4 bg-zinc-700 text-white border-gray-600 rounded-md focus:ring-0 focus:border-green-400"
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
              <Button
                onClick={verifyCodeAndSignUp}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold rounded-full hover:from-green-500 hover:to-teal-600 transition-all"
              >
                {isLoading ? "Verifying..." : "Verify and Complete"}
              </Button>
            </>
          )}
          <div className="text-center mt-4">
            <span className="text-gray-400">Or </span>
            <button
              onClick={resetForm}
              className="text-green-400 text-sm hover:underline"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInForm;
