const mongoose = require('mongoose');

const AnimeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  titulo: { type: String, required: true, trim: true },
  estado: { type: String, enum: ['Viendo', 'Completado', 'Pendiente'], required: true },
  imagen: { type: String, required: true },
  episodios: { type: Number, default: 0 },
  temporadas: { type: Number, default: 0 },
  
  genero: { type: String, trim: true, default: '' },

  ovas: { type: Number, default: 0 },
  peliculas: { type: Number, default: 0 },
  comentarios: { type: String, trim: true, default: '' },
  puntuacion: { type: Number, min: 0, max: 10, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Anime', AnimeSchema);