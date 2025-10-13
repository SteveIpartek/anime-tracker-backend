const express = require('express');
const router = express.Router();
const Anime = require('../models/Anime');

async function getAnime(req, res, next) {
  try {
    const anime = await Anime.findById(req.params.id);
    if (!anime) return res.status(404).json({ message: 'Anime no encontrado' });
    res.anime = anime;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

router.get('/', async (req, res) => {
  try {
    const animes = await Anime.find();
    res.json(animes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los animes' });
  }
});

router.get('/:id', getAnime, (req, res) => {
  res.json(res.anime);
});

router.post('/', async (req, res) => {
  const { titulo, estado, puntuacion, imagen } = req.body;
  const anime = new Anime({ titulo, estado, puntuacion, imagen });
  try {
    const nuevoAnime = await anime.save();
    res.status(201).json(nuevoAnime);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el anime' });
  }
});

router.patch('/:id', getAnime, async (req, res) => {
  const { titulo, estado, puntuacion, imagen } = req.body;
  if (titulo !== undefined) res.anime.titulo = titulo;
  if (estado !== undefined) res.anime.estado = estado;
  if (puntuacion !== undefined) res.anime.puntuacion = puntuacion;
  if (imagen !== undefined) res.anime.imagen = imagen;
  try {
    const animeActualizado = await res.anime.save();
    res.json(animeActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el anime' });
  }
});

router.delete('/:id', getAnime, async (req, res) => {
  try {
    await res.anime.deleteOne();
    res.json({ message: 'Anime eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el anime' });
  }
});

module.exports = router;