import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface SignInSignUpProps {
  onClose: () => void; // Thêm prop để đóng modal
}

const SignInSignUp = ({ onClose }: SignInSignUpProps) => {
  const { signIn, isLoaded } = useSignIn();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  if (!isLoaded) {
    return null;
  }

  const signInWithGoogle = async () => {
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/auth-callback",
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (username.length < 4 || username.length > 64) {
      alert("Tên người dùng phải từ 4 đến 64 ký tự!");
      return;
    }
    console.log(isSignUp ? "Đăng ký" : "Đăng nhập", { username, password });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 h-screen">
      <div className="bg-zinc-800 rounded-lg  max-w-md w-full relative">
        {/* Nút đóng modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          <X className="size-5" />
        </button>
        <div className="flex flex-col items-center justify-center min-h-[400px] pt-12 pb-6">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            {isSignUp ? "Đăng ký" : "Đăng nhập"}
          </h2>
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">
                Tên người dùng
              </Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="text-black bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Mật khẩu
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-black bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md"
            >
              {isSignUp ? "Đăng ký" : "Đăng nhập"}
            </Button>
          </form>
          <div className="w-full max-w-sm space-y-4 mt-6">
            <Button
              onClick={signInWithGoogle}
              variant="secondary"
              className="w-full h-12 bg-white text-black hover:bg-gray-100 border border-gray-300 rounded-md font-semibold"
            >
              Tiếp tục với Google
            </Button>
            <p className="text-sm text-white text-center">
              {isSignUp ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-500 hover:underline"
              >
                {isSignUp ? "Đăng nhập" : "Đăng ký"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInSignUp;
