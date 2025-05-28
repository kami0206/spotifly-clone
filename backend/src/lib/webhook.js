import express from "express";
import { Webhook } from "svix";
import { connectDB } from "./db.js";
import bodyParser from "body-parser";
import { User } from "../models/user.model.js";

const router = express.Router();
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

router.use(bodyParser.raw({ type: "*/*" }));

router.post("/clerk-webhook", async (req, res) => {
  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(req.body, req.headers);
  } catch (err) {
    console.error("Invalid Clerk signature", err);
    return res.status(400).send("Invalid signature");
  }

  const { type, data } = evt;

  if (type === "user.created" || type === "user.signed_in") {
    await connectDB();

    const id = data.id;
    const fullName = `${data.first_name || ""} ${data.last_name || ""}`.trim();
    const imageUrl = data.image_url;

    const existingUser = await User.findOne({ clerkId: id });
    if (!existingUser) {
      await User.create({ clerkId: id, fullName, imageUrl });
    }
  }

  res.status(200).send("Webhook processed");
});

export default router;
