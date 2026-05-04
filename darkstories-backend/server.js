const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const User = require("./models/User");
const Story = require("./models/Story");

const app = express();

/* =========================
   MIDDLEWARES
========================= */

app.use(cors());
app.use(express.json());

// 📁 carpeta de imágenes
app.use("/uploads", express.static("uploads"));

/* =========================
   MULTER (PORTADAS)
========================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* =========================
   MONGO
========================= */

mongoose
  .connect("mongodb+srv://project_db_user:<db_password>@cluster0.de8ktwf.mongodb.net/?appName=Cluster0")
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.log("❌ Error Mongo:", err));

/* =========================
   AUTH
========================= */

// REGISTER
app.post("/register", async (req, res) => {
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

    res.json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error en registro" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("🔐 Intento login:", username);

    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      console.log("❌ Login incorrecto");
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    console.log("✅ Login OK:", user.username);

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error en login" });
  }
});

/* =========================
   STORIES
========================= */

// CREAR HISTORIA
app.post("/stories", upload.single("cover"), async (req, res) => {
  try {
    const { title, userId, synopsis } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Falta userId" });
    }

    const nueva = new Story({
      title,
      userId,
      synopsis,
      cover: req.file ? "/uploads/" + req.file.filename : null,
      chapters: [],
    });

    await nueva.save();
    res.json(nueva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando historia" });
  }
});

// 🔥 TRAER TODAS (para pruebas)
app.get("/stories", async (req, res) => {
  try {
    const historias = await Story.find();
    res.json(historias);
  } catch (error) {
    res.status(500).json({ error: "Error al traer historias" });
  }
});

// 🔥 TRAER POR USUARIO
app.get("/stories/user/:userId", async (req, res) => {
  try {
    const historias = await Story.find({
      userId: req.params.userId,
    });

    res.json(historias);
  } catch (error) {
    res.status(500).json({ error: "Error al traer historias" });
  }
});

// OBTENER UNA HISTORIA
app.get("/story/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ error: "No existe" });
    }

    res.json(story);
  } catch (error) {
    res.status(500).json({ error: "Error al traer historia" });
  }
});

// ELIMINAR HISTORIA
app.delete("/stories/:id", async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.json({ message: "Historia eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando historia" });
  }
});

/* =========================
   CAPÍTULOS
========================= */

// AGREGAR CAPÍTULO
app.post("/stories/:id/chapters", async (req, res) => {
  try {
    const { title, content } = req.body;

    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ error: "Historia no encontrada" });
    }

    story.chapters.push({ title, content });

    await story.save();

    res.json(story);
  } catch (error) {
    res.status(500).json({ error: "Error agregando capítulo" });
  }
});

// ELIMINAR CAPÍTULO
app.delete("/stories/:id/chapters/:chapterId", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ error: "Historia no encontrada" });
    }

    story.chapters = story.chapters.filter(
      (c) => c._id.toString() !== req.params.chapterId
    );

    await story.save();

    res.json(story);
  } catch (error) {
    res.status(500).json({ error: "Error eliminando capítulo" });
  }
});



app.get("/api/hola", (req, res) => {
  res.json({ mensaje: "Hola mundo backend" });
});
/* =========================
   SERVER
========================= */

app.listen(3001, () => {
  console.log("Servidor en http://localhost:3001");
});