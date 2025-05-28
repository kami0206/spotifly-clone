// import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI);
//     console.log(`Connected to MongoDB ${conn.connection.host}`);
//   } catch (error) {
//     console.log("Failed to connect to MongoDB", error);
//     process.exit(1); // 1 is failure, 0 is success
//   }

  
// };
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to MongoDB ${conn.connection.host}`);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Thoát nếu kết nối thất bại
  }
};