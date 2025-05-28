import{User} from '../models/user.model.js';

export const authCallback = async (req, res, next) => {
    try{
        const {id, firstName, lastName, imageUrl} =req.body;

        // kiểm tra xem người dùng đã tồn tại chưa
        const user = await User.findOne({clerkId: id});

        if(!user){
            await User.create({
                clerkId: id,
                fullName: `${firstName} ${lastName}`,
                imageUrl
            })
        }
        res.status(200).json({success:true})
    }catch(error){
    console.log("Error in auth callback", error);
    next(error);
    }
}
// import { clerkClient } from "@clerk/express";
// import { User } from "../models/user.model.js";

// export const authCallback = async (req, res, next) => {
//   try {
//     const { id, firstName, lastName, imageUrl } = req.body;
//     const user = await User.findOne({ clerkId: id });

//     if (!user) {
//       const clerkUser = await clerkClient.users.getUser(id);
//       const email = clerkUser.primaryEmailAddress?.emailAddress;

//       if (!email) {
//         return res.status(400).json({ message: "Email is required" });
//       }

//       await User.create({
//         clerkId: id,
//         fullName: `${firstName} ${lastName}`,
//         imageUrl,
//         email,
//       });
//     }
//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.log("Error in auth callback", error);
//     next(error);
//   }
// };
