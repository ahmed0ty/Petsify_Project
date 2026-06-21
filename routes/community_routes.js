const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/community_controller");
const { verifyToken } = require("../middlewares/auth_middlware");
const { uploadImage } = require("../middlewares/imageMiddleware");

const upload = uploadImage("community");

// Posts
router.get("/feed", verifyToken, ctrl.getFeed);
router.post("/posts", verifyToken, upload.single("image"), ctrl.createPost);
router.delete("/posts/:postId", verifyToken, ctrl.deletePost);

// Likes
router.post("/posts/:postId/like", verifyToken, ctrl.toggleLike);
router.get("/posts/:postId/reacts", verifyToken, ctrl.getReacts);

// Comments
router.get("/posts/:postId/comments", verifyToken, ctrl.getComments);
router.post("/posts/:postId/comments", verifyToken, ctrl.addComment);
router.delete("/comments/:commentId", verifyToken, ctrl.deleteComment);

// Connections - static routes FIRST
router.get("/connections/requests", verifyToken, ctrl.getConnectionRequests);
router.get("/connections/suggestions", verifyToken, ctrl.getPeopleYouMayKnow);
router.get("/friends", verifyToken, ctrl.getFriends);

// Connections - dynamic routes AFTER
router.post("/connections/:receiverId", verifyToken, ctrl.sendConnectionRequest);
router.put("/connections/:connectionId", verifyToken, ctrl.respondToConnection);

// Notifications
router.get("/notifications", verifyToken, ctrl.getNotifications);
router.get("/notifications/unread-count", verifyToken, ctrl.getUnreadCount);
router.patch("/notifications/read", verifyToken, ctrl.markNotificationsRead);

module.exports = router;