const express = require('express');
const mongoose = require('mongoose');
const { login } = require('./controllers/login');
const { createUser } = require('./controllers/users');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { notFoundErrorStatus } = require('./utils');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

// Парсер данных

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// подключение к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// рутинг
app.post('/signin', login);
app.post('/signup', createUser);
// авторизация
app.use(auth);
// роуты, защищённые авторизацией
app.use('/users', usersRoutes);
app.use('/me', usersRoutes);
app.use('/cards', cardsRoutes);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
app.use((req, res) => {
  res.status(notFoundErrorStatus).send({ message: 'Запрашиваемая страница не найдена' });
});
