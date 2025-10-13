const express = require('express');
const router = express.Router();
const Anime = require('../models/Anime');

async function getAnime(req, res, next) {
    let anime;
    try {
        anime = await Anime.findById(req.params.id);
        if (anime == null) {
            return res.status(404).json({ message: 'No se pudo encontrar el anime' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.anime = anime;
    next();
}

router.get('/', async (req, res) => {
    try {
        const animes = await Anime.find();
        res.json(animes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', getAnime, (req, res) => {
    res.json(res.anime);
});

router.post('/', async (req, res) => {
    const anime = new Anime({
        titulo: req.body.titulo,
        estado: req.body.estado,
        puntuacion: req.body.puntuacion,
        imagen: req.body.imagen
    });

    try {
        const newAnime = await anime.save();
        res.status(201).json(newAnime);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/:id', getAnime, async (req, res) => {
    if (req.body.titulo != null) res.anime.titulo = req.body.titulo;
    if (req.body.estado != null) res.anime.estado = req.body.estado;
    if (req.body.puntuacion != null) res.anime.puntuacion = req.body.puntuacion;
    if (req.body.imagen != null) res.anime.imagen = req.body.imagen;

    try {
        const updatedAnime = await res.anime.save();
        res.json(updatedAnime);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', getAnime, async (req, res) => {
    try {
        await res.anime.deleteOne();
        res.json({ message: 'Anime eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;