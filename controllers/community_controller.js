const knex = require("../config/db");
const path = require("path");
const fs = require("fs");

// ─── POSTS ───────────────────────────────────────────────

exports.createPost = async (req, res) => {
  try {
    console.log("Body:", req.body);      // ← أضف السطر ده
     console.log("File:", req.file);      // ← وده
    console.log("User:", req.user);      // ← وده
    const userId = req.user.id;
    const { content } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!content) return res.status(400).json({ message: "Content is required" });

    const [id] = await knex("community_posts").insert({ user_id: userId, content, image });
    const post = await knex("community_posts as p")
      .join("user as u", "u.id", "p.user_id")
      .where("p.id", id)
      .select("p.*", "u.fullName", "u.picture")
      .first();

    res.status(201).json({ message: "Post created", data: post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getFeed = async (req, res) => {
  try {
    console.log("getFeed called, user:", req.user);
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const posts = await knex("community_posts as p")
      .join("user as u", "u.id", "p.user_id")
      .select(
        "p.id", "p.content", "p.image", "p.created_at",
        "u.id as author_id", "u.fullName", "u.picture",
        knex.raw(`(SELECT COUNT(*) FROM community_likes WHERE post_id = p.id) as likes_count`),
        knex.raw(`(SELECT COUNT(*) FROM community_comments WHERE post_id = p.id AND parent_id IS NULL) as comments_count`),
        knex.raw(`EXISTS(SELECT 1 FROM community_likes WHERE post_id = p.id AND user_id = ?) as is_liked`, [userId])
      )
      .orderBy("p.created_at", "desc")
      .limit(limit)
      .offset(offset);

    console.log("posts:", posts); // ← أضف ده
    res.json({ data: posts, page, limit });
  } catch (err) {
    console.log("getFeed error:", err.message); // ← وده
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const post = await knex("community_posts").where({ id: postId, user_id: userId }).first();
    if (!post) return res.status(403).json({ message: "Not allowed" });

    if (post.image) {
      const imgPath = path.join(__dirname, "../uploads/community", post.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await knex("community_posts").where({ id: postId }).delete();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── LIKES ───────────────────────────────────────────────

exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const existing = await knex("community_likes").where({ post_id: postId, user_id: userId }).first();

    if (existing) {
      await knex("community_likes").where({ post_id: postId, user_id: userId }).delete();
      return res.json({ message: "Unliked", liked: false });
    }

    await knex("community_likes").insert({ post_id: postId, user_id: userId });

    // notification
    const post = await knex("community_posts").where("id", postId).first();
    if (post && post.user_id !== userId) {
      await knex("community_notifications").insert({
        user_id: post.user_id,
        actor_id: userId,
        type: "like",
        post_id: postId,
      });
    }

    res.json({ message: "Liked", liked: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReacts = async (req, res) => {
  try {
    const { postId } = req.params;
    const users = await knex("community_likes as l")
      .join("user as u", "u.id", "l.user_id")
      .where("l.post_id", postId)
      .select("u.id", "u.fullName", "u.picture");

    res.json({ data: users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const friends = await knex("community_connections as c")
      .where(function() {
        this.where({ sender_id: userId, status: "accepted" })
            .orWhere({ receiver_id: userId, status: "accepted" });
      })
      .join("user as u", function() {
        this.on("u.id", "=", knex.raw("CASE WHEN c.sender_id = ? THEN c.receiver_id ELSE c.sender_id END", [userId]));
      })
      .select("u.id", "u.fullName", "u.picture", "u.email", "c.id as connection_id");
    res.json({ data: friends });
  } catch (err) {
    console.log("getFriends error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ─── COMMENTS ────────────────────────────────────────────

exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await knex("community_comments as c")
      .join("user as u", "u.id", "c.user_id")
      .where("c.post_id", postId)
      .whereNull("c.parent_id")
      .select(
        "c.id", "c.content", "c.created_at", "c.parent_id",
        "u.id as author_id", "u.fullName", "u.picture",
        knex.raw(`(SELECT COUNT(*) FROM community_likes WHERE post_id = c.id) as likes_count`)
      )
      .orderBy("c.created_at", "asc");

    res.json({ data: comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;
    const { content, parent_id } = req.body;

    if (!content) return res.status(400).json({ message: "Content required" });

    const [id] = await knex("community_comments").insert({
      post_id: postId,
      user_id: userId,
      content,
      parent_id: parent_id || null,
    });

    const comment = await knex("community_comments as c")
      .join("user as u", "u.id", "c.user_id")
      .where("c.id", id)
      .select("c.*", "u.fullName", "u.picture")
      .first();

    // notification
    const post = await knex("community_posts").where("id", postId).first();
    if (post && post.user_id !== userId) {
      await knex("community_notifications").insert({
        user_id: post.user_id,
        actor_id: userId,
        type: parent_id ? "reply" : "comment",
        post_id: postId,
      });
    }

    res.status(201).json({ message: "Comment added", data: comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { commentId } = req.params;
    await knex("community_comments").where({ id: commentId, user_id: userId }).delete();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── CONNECTIONS ─────────────────────────────────────────

exports.sendConnectionRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.params;

    if (senderId == receiverId) return res.status(400).json({ message: "Cannot connect with yourself" });

    const existing = await knex("community_connections")
      .where({ sender_id: senderId, receiver_id: receiverId })
      .orWhere({ sender_id: receiverId, receiver_id: senderId })
      .first();

    if (existing) return res.status(400).json({ message: "Request already exists" });

    await knex("community_connections").insert({ sender_id: senderId, receiver_id: receiverId });

    await knex("community_notifications").insert({
      user_id: receiverId,
      actor_id: senderId,
      type: "connection_request",
    });

    res.status(201).json({ message: "Request sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.respondToConnection = async (req, res) => {
  try {
    const userId = req.user.id;
    const { connectionId } = req.params;
    const { status } = req.body; // accepted | rejected

    const conn = await knex("community_connections").where({ id: connectionId, receiver_id: userId }).first();
    if (!conn) return res.status(404).json({ message: "Request not found" });

    await knex("community_connections").where({ id: connectionId }).update({ status });

    if (status === "accepted") {
      await knex("community_notifications").insert({
        user_id: conn.sender_id,
        actor_id: userId,
        type: "connection_accepted",
      });
    }

    res.json({ message: `Request ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getConnectionRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await knex("community_connections as c")
      .join("user as u", "u.id", "c.sender_id")
      .where({ "c.receiver_id": userId, "c.status": "pending" })
      .select("c.id as connection_id", "u.id", "u.fullName", "u.picture");

    res.json({ data: requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getPeopleYouMayKnow = async (req, res) => {
  try {
    const userId = req.user.id;

    const connectedIds = await knex("community_connections")
      .where("sender_id", userId)
      .orWhere("receiver_id", userId)
      .select("sender_id", "receiver_id");

    const excludeIds = new Set([userId]);
    connectedIds.forEach((c) => {
      excludeIds.add(c.sender_id);
      excludeIds.add(c.receiver_id);
    });

    console.log("Excluding IDs:", [...excludeIds]); // للـ debugging

    const people = await knex("user")
      .whereNotIn("id", [...excludeIds])
      .select("id", "fullName", "picture")
      .limit(20);

    res.json({ data: people });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── NOTIFICATIONS ────────────────────────────────────────

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await knex("community_notifications as n")
      .join("user as u", "u.id", "n.actor_id")
      .where("n.user_id", userId)
      .select("n.*", "u.fullName", "u.picture")
      .orderBy("n.created_at", "desc")
      .limit(50);

    res.json({ data: notifications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markNotificationsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await knex("community_notifications").where({ user_id: userId, is_read: false }).update({ is_read: true });
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const [{ count }] = await knex("community_notifications")
      .where({ user_id: userId, is_read: false })
      .count("id as count");

    res.json({ count: parseInt(count) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};