const express = require("express");
const cors = require("cors");
const supabase = require("./supabase");

const app = express();
app.use(express.json());
app.use(cors());

/**
 * REGISTER
 */
app.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json({ message: "User registered", user: data.user });
});

/**
 * LOGIN
 */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } =
    await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  res.json({
    message: "Successfully Logged In",
    user: data.user,
    token: data.session.access_token,
  });
});

/**
 * AUTH MIDDLEWARE (Supabase)
 */
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token" });

  const { data, error } = await supabase.auth.getUser(token);

  if (error) return res.status(401).json({ error: "Invalid token" });

  req.user = data.user;
  next();
};

/**
 * CREATE NOTE
 */
app.post("/notes", authMiddleware, async (req, res) => {
  console.log("RECEIVED BODY:", req.body);

  const { title, description } = req.body;

  const { error } = await supabase.from("notes").insert({
    title,
    content: description, // 🔥 FIX IS RIGHT HERE
    user_id: req.user.id,
  });

  if (error) {
    console.error("Insert error:", error);
    return res.status(400).json({ error: error.message });
  }

  res.json({ success: true });
});


/**
 * GET NOTES
 */
app.get("/notes", authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ notes: data });
});

// Edit Notes
/**
 * UPDATE NOTE
 */
/**
 * UPDATE NOTE (Supabase)
 */
app.put("/notes/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const { data, error } = await supabase
    .from("notes")
    .update({
      title,
      content: description,
    })
    .eq("id", id)
    .eq("user_id", req.user.id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ success: true, note: data });
});


// Delete Note
/**
 * DELETE NOTE (Supabase)
 */
/**
 * DELETE NOTE (Supabase)
 */
app.delete("/notes/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", req.user.id); // security: only delete own notes

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({
    success: true,
    message: "Note deleted successfully",
  });
});



app.listen(3002, () => {
  console.log("Server running on port 3002");
});