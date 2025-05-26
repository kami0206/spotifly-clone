// import{User} from '../models/user.model.js';

// export const authCallback = async (req, res, next) => {
//     try{
//         const {id, firstName, lastName, imageUrl} =req.body;
               
//         // kiểm tra xem người dùng đã tồn tại chưa
//         const user = await User.findOne({clerkId: id});

//         if(!user){
//             await User.create({
//                 clerkId: id,
//                 fullName: `${firstName} ${lastName}`,
//                 imageUrl
//             })
//         }
//         res.status(200).json({success:true})
//     }catch(error){
//     console.log("Error in auth callback", error);
//     next(error);
//     }
// }


import { User } from "../models/user.model.js"; // đường dẫn tuỳ cấu trúc dự án

export const authCallback = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl, username } = req.body;

    if (!id || !username) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin." });
    }

    let user = await User.findOne({ clerkId: id });

    if (!user) {
      user = await User.create({
        clerkId: id,
        fullName: firstName && lastName ? `${firstName} ${lastName}` : username,
        imageUrl: imageUrl || "https://placehold.co/100x100",
        username,
      });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Lỗi trong authCallback:", error);
    next(error);
  }
};
