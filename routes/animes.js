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
  const { 
    titulo, estado, episodios, temporadas, genero, ovas, peliculas, comentarios, puntuacion,
    temporadaActual, episodioActual 
  } = req.body;
  
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
      comentarios,
      puntuacion,
      temporadaActual,
      episodioActual
    });
    const anime = await newAnime.save();
    res.json(anime);
  } catch (err) {
    console.error("¡¡ERROR AL CREAR ANIME!!:", err);
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
    res.status(400).json({ message: "Error al actualizar el anime." });
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