const mongoose = require('mongoose');

const AnimeSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    estudio: { type: String },
    estado: { type: String, enum: ['Viendo', 'Completado', 'Pendiente'], required: true },
    episodiosVistos: { type: Number, default: 0 },
    puntuacion: { type: Number, min: 1, max: 10 },
    imagen: { type: String }
});

module.exports = mongoose.model('Anime', AnimeSchema);