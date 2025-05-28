import {
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
// import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import SignInOAuth from "./SignInSignOut";

const Topbar = () => {
  const { isAdmin } = useAuthStore();
  console.log({ isAdmin });

  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10">
      <div className="flex gap-2 items-center">
        <img src="/spotify.png" className="size-8" alt="spotify logo" />
        Spotify
      </div>
      <div className="flex gap-4 items-center">
        {isAdmin && (
          <Link
            to={"/admin"}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <LayoutDashboardIcon className="size-4  mr-2" />
            Admin Dashboard
          </Link>
        )}

        <SignedOut>
          <SignInOAuth />
        </SignedOut>

        <UserButton />
      </div>
    </div>
  );
};
export default Topbar;

// import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
// import { LayoutDashboardIcon } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useAuthStore } from "@/stores/useAuthStore";
// import { buttonVariants } from "./ui/button";
// import { cn } from "@/lib/utils";
// import { useState } from "react";
// import SignInOAuth from "./SignInSignOut";

// const Topbar = () => {
//   const { isAdmin } = useAuthStore();
//   const [showSignInModal, setShowSignInModal] = useState(false);

//   return (
//     <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10">
//       <div className="flex gap-2 items-center">
//         <img src="/spotify.png" className="size-8" alt="spotify logo" />
//         <span className="text-white font-semibold">Spotify</span>
//       </div>
//       <div className="flex gap-4 items-center">
//         {isAdmin && (
//           <Link
//             to={"/admin"}
//             className={cn(buttonVariants({ variant: "outline" }))}
//           >
//             <LayoutDashboardIcon className="size-4 mr-2" />
//             Admin Dashboard
//           </Link>
//         )}

//         <SignedOut>
//           <button
//             onClick={() => setShowSignInModal(true)}
//             className={cn(buttonVariants({ variant: "secondary" }), "h-10")}
//           >
//             Sign In
//           </button>
//         </SignedOut>

//         <SignedIn>
//           <UserButton />
//         </SignedIn>
//       </div>

//       {showSignInModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 h-screen">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
//             <button
//               onClick={() => setShowSignInModal(false)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               ✕
//             </button>
//             <SignInOAuth />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Topbar;
