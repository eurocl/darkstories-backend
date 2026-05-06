import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// 👇 IMPORTAR MODELOS
import Story from "./models/Story.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

/* =========================
   🔍 DEBUG ENV
========================= */

console.log("MONGO_URI =", process.env.MONGO_URI);

/* =========================
   🔌 CONEXIÓN A MONGO
========================= */

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/darkstories";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Mongo conectado"))
  .catch((err) => {
    console.log("❌ Error Mongo:", err);
    process.exit(1);
  });

/* =========================
   👤 USER MODEL
========================= */

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

/* =========================
   📌 STORIES ROUTES
========================= */

// GET todas las stories
app.get("/stories", async (req, res) => {
  try {
    const stories = await Story.find();
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener stories" });
  }
});

// GET story por ID
app.get("/stories/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ error: "No encontrado" });
    }

    res.json(story);
  } catch {
    res.status(400).json({ error: "ID inválido" });
  }
});

// POST story
app.post("/stories", async (req, res) => {
  try {
    if (!req.body.title) {
      return res
        .status(400)
        .json({ error: "El título es obligatorio" });
    }

    const nueva = new Story({
      title: req.body.title,
      synopsis: req.body.synopsis || "",
      cover: req.body.cover || "",
      userId: req.body.userId || null,
      chapters: req.body.chapters || [],
    });

    await nueva.save();
    res.status(201).json(nueva);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error al crear story" });
  }
});

/* =========================
   👤 USERS ROUTES
========================= */

// REGISTER
app.post("/users", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const existe = await User.findOne({ username });
    if (existe) {
      return res.status(400).json({ error: "Usuario ya existe" });
    }

    const nuevo = new User({ username, password });
    await nuevo.save();

    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: "Error creando usuario" });
  }
});

// 🔥 LOGIN (NUEVO)
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "Usuario no existe" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({
      message: "Login exitoso",
      user: {
        _id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Error en login" });
  }
});

// GET usuarios
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

/* =========================
   🚀 START SERVER
========================= */

app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});