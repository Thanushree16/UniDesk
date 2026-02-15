import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { Notification } from "../models/Notification.js";

const router = express.Router();


// GET all notifications for logged user
router.get("/", protect, async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.json(notifications);
});


router.get("/unread-count", protect, async (req, res) => {
  const count = await Notification.countDocuments({
    user: req.user.id,
    isRead: false,
  });

  res.json({ count });
});


// mark single as read
router.put("/:id/read", protect, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ message: "Marked as read" });
});


router.put("/read-all", protect, async (req, res) => {
  await Notification.updateMany({ user: req.user.id }, { isRead: true });
  res.json({ message: "All marked as read" });
});


router.delete("/clear-all", protect, async (req, res) => {
  await Notification.deleteMany({ user: req.user.id });
  res.json({ message: "All notifications cleared" });
});


export default router;
