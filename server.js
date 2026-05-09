import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import upload from "./middleware/upload.js";

// 👇 MODELOS
import Story from "./models/Story.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

/* =========================
   MIDDLEWARES
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   DEBUG
========================= */

console.log("MONGO_URI =", process.env.MONGO_URI);

/* =========================
   MONGO
========================= */

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/darkstories";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Mongo conectado");
  })
  .catch((err) => {
    console.log("❌ Error Mongo:", err);
    process.exit(1);
  });

/* =========================
   USER MODEL
========================= */

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

/* =========================
   STORIES
========================= */

/* GET TODAS */
app.get("/stories", async (req, res) => {
  try {

    const stories = await Story.find();

    res.json(stories);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Error al obtener stories",
    });

  }
});

/* GET POR ID */
app.get("/stories/:id", async (req, res) => {
  try {

    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        error: "Historia no encontrada",
      });
    }

    res.json(story);

  } catch (err) {

    console.log(err);

    res.status(400).json({
      error: "ID inválido",
    });

  }
});

/* CREAR STORY */
app.post(
  "/stories",
  upload.single("cover"),
  async (req, res) => {

    try {

      console.log("BODY:", req.body);
      console.log("FILE:", req.file);

      const { title, synopsis, userId } = req.body;

      // 🔥 VALIDACIÓN
      if (!title || title.trim() === "") {
        return res.status(400).json({
          error: "El título es obligatorio",
        });
      }

      const nueva = new Story({

        title,

        synopsis: synopsis || "",

        cover: req.file
          ? req.file.path
          : "",

        userId: userId || null,

        chapters: [],

      });

      await nueva.save();

      res.status(201).json(nueva);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error: "Error al crear story",
      });

    }
  }
);

/* =========================
   USERS
========================= */

/* REGISTER */
app.post("/users", async (req, res) => {

  try {

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Faltan datos",
      });
    }

    const existe = await User.findOne({
      username,
    });

    if (existe) {
      return res.status(400).json({
        error: "Usuario ya existe",
      });
    }

    const nuevo = new User({
      username,
      password,
    });

    await nuevo.save();

    res.status(201).json(nuevo);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Error creando usuario",
    });

  }
});

/* LOGIN */
app.post("/login", async (req, res) => {

  try {

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Faltan datos",
      });
    }

    const user = await User.findOne({
      username,
    });

    if (!user) {
      return res.status(404).json({
        error: "Usuario no existe",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        error: "Contraseña incorrecta",
      });
    }

    res.json({
      message: "Login exitoso",

      user: {
        _id: user._id,
        username: user.username,
      },
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Error en login",
    });

  }
});

/* GET USERS */
app.get("/users", async (req, res) => {

  try {

    const users = await User.find();

    res.json(users);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Error al obtener usuarios",
    });

  }
});

/* =========================
   SERVER
========================= */

app.listen(PORT, () => {

  console.log(
    `🚀 Servidor en http://localhost:${PORT}`
  );

});