require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch((err) => console.error('Error al conectar:', err));

app.use('/api/animes', require('./routes/animes'));

app.get('/', (req, res) => {
  res.send('Servidor Anime Tracker funcionando 🚀');
});


app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));