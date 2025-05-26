// import {
//   SignedOut,
//   UserButton,
// } from "@clerk/clerk-react";
// import { LayoutDashboardIcon } from "lucide-react";
// import { Link } from "react-router-dom";
// import SignInOAuthButtons from "./SignInOAuthButtons";
// import { useAuthStore } from "@/stores/useAuthStore";
// import { buttonVariants } from "./ui/button";
// import { cn } from "@/lib/utils";

// const Topbar = () => {
//   const { isAdmin } = useAuthStore();
//   console.log({ isAdmin });

//   return (
//     <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10">
//       <div className="flex gap-2 items-center">
//         <img src="/spotify.png" className="size-8" alt="spotify logo" />
//         Spotify
//       </div>
//       <div className="flex gap-4 items-center">
//         {isAdmin && (
//           <Link
//             to={"/admin"}
//             className={cn(buttonVariants({ variant: "outline" }))}
//           >
//             <LayoutDashboardIcon className="size-4  mr-2" />
//             Admin Dashboard
//           </Link>
//         )}
        

//         <SignedOut>
//           <SignInOAuthButtons />
//         </SignedOut>

//         <UserButton />
//       </div>
//     </div>
//   );
// };

// export default Topbar;


import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import SignInSignUp from "./SignInSignOut";
import { useState } from "react";

const Topbar = () => {
  const { isAdmin } = useAuthStore();
  const [showSignInModal, setShowSignInModal] = useState(false); // Trạng thái hiển thị modal

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
            <LayoutDashboardIcon className="size-4 mr-2" />
            Admin Dashboard
          </Link>
        )}

        <SignedOut>
          <button
            onClick={() => setShowSignInModal(true)}
            className={cn(buttonVariants({ variant: "outline" }), "text-white")}
          >
            Sign In
          </button>
        </SignedOut>

        <UserButton />

        {/* Hiển thị modal khi showSignInModal là true */}
        {showSignInModal && (
          <SignInSignUp onClose={() => setShowSignInModal(false)} />
        )}
      </div>
    </div>
  );
};

export default Topbar;
