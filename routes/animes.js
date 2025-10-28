const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Anime = require('../models/Anime');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.get('/', auth, async (req, res) => {
  try {
    const animes = await Anime.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(animes);
  } catch (err) {
    res.status(500).send('Error del servidor');
  }
});

router.post('/', auth, upload.single('imagen'), async (req, res) => {
  // 1. 'puntuacion' YA NO ESTÁ AQUÍ
  const { titulo, estado, episodios, temporadas, genero, ovas, peliculas, comentarios } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ message: 'La imagen es requerida' });
  }
  try {
    const newAnime = new Anime({
      user: req.user.id,
      titulo,
      estado,
      imagen: req.file.path,
      episodios,
      temporadas,
      genero,
      ovas,
      peliculas,
      comentarios
      // 2. 'puntuacion' YA NO ESTÁ AQUÍ
    });
    const anime = await newAnime.save();
    res.json(anime);
  } catch (err) {
    // Si quieres ver el error, añade esta línea:
    console.error("¡¡ERROR AL CREAR!!:", err); 
    res.status(500).send('Error del servidor');
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    let anime = await Anime.findById(req.params.id);
    if (!anime) return res.status(404).json({ message: 'Anime no encontrado' });
    if (anime.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }
    anime = await Anime.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(anime);
  } catch (err) {
    res.status(500).send('Error del servidor');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    let anime = await Anime.findById(req.params.id);
    if (!anime) return res.status(404).json({ message: 'Anime no encontrado' });
    if (anime.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }
    await Anime.findByIdAndDelete(req.params.id);
    res.json({ message: 'Anime eliminado' });
  } catch (err) {
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;