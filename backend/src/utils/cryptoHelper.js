import crypto from "crypto";

// Mã hóa ID bài hát thành một chuỗi ngắn hơn (có thể dùng cho URL)
export const encryptIdToTitle = (id, title) => {
  const cipher = crypto.createCipher("aes-256-cbc", "your-secret-key"); // Thay 'your-secret-key' bằng khóa bí mật của bạn
  let encrypted = cipher.update(id + title, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// Giải mã ID từ URL để lấy lại ID bài hát
export const decryptIdToSong = (encryptedString, title) => {
  const decipher = crypto.createDecipher("aes-256-cbc", "your-secret-key");
  let decrypted = decipher.update(encryptedString, "hex", "utf8");
  decrypted += decipher.final("utf8");
  const [songId] = decrypted.split(title); // Tách ID ra từ tên bài hát
  return songId;
};
