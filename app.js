const express = require('express');
const mongoose = require('mongoose');
const login = require('./controllers/login');
const createUser = require('./controllers/users');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { notFoundErrorStatus } = require('./utils');

const { PORT = 3000 } = process.env;

const app = express();

// Парсер данных

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// подключение к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// имитация авторизации

app.use((req, res, next) => {
  req.user = {
    _id: '6192a721c403c4b5a54e5e59',
  };

  next();
});

// рутинг
app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);
app.use((req, res) => {
  res.status(notFoundErrorStatus).send({ message: 'Запрашиваемая страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
