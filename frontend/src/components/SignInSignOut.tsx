import { SignInButton } from "@clerk/clerk-react";


const SignInOAuth = () => {
  return (
    <SignInButton mode="modal">
      <button>Sign In</button>
    </SignInButton>
  );
};

export default SignInOAuth;
