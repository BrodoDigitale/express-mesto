const Card = require('../models/card');
const { notFoundErrorStatus, generalErrorStatus, invalidDataErrorStatus } = require('../utils')

module.exports.getCards = (req, res) => {
  Card.find({})
    .orFail(new Error ('Not found'))
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(notFoundErrorStatus).send({ message: 'Карточки не найдены'});
        return;
      }
      res.status(generalErrorStatus).send({ message: `Произошла ошибка ${err.name}: ${err.message}`});
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(new Error ('Not found'))
    .then((card) => {
        card.delete();
        return res.status(200).send({ message: 'Пост удален' })
      })
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(notFoundErrorStatus).send({ message: 'Карточка не найдена'});
        return;
      }
      if (err.name === "CastError") {
        res.status(invalidDataErrorStatus).send({ message: 'Невалидный id'});
        return;
      }
      res.status(generalErrorStatus).send({ message: `Произошла ошибка ${err.name}: ${err.message}`});
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner }, { runValidators: true })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(invalidDataErrorStatus).send({ message: 'Введены некорректные данные'});
        return;
      }
      res.status(generalErrorStatus).send({ message: `Произошла ошибка ${err.name}: ${err.message}`});
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error ('Not found'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(notFoundErrorStatus).send({ message: 'Карточка не найдена' });
        return;
      }
      if (err.name === "CastError") {
        res.status(invalidDataErrorStatus).send({ message: 'Введены некорректные данные'});
        return;
      }
      res.status(generalErrorStatus).send({ message: `Произошла ошибка ${err.name}: ${err.message}`});
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error ('Not found'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(notFoundErrorStatus).send({ message: 'Карточка не найдена' });
        return;
      }
      if (err.name === "CastError") {
        res.status(invalidDataErrorStatus).send({ message: 'Введены некорректные данные'});
        return;
      }
      res.status(generalErrorStatus).send({ message: `Произошла ошибка ${err.name}: ${err.message}`});
    });
};