const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const InvalidDataError = require('../errors/invalid-data-err');
const AccessDeniedError = require('../errors/forbidden-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .orFail(new NotFoundError('Карточки не найдены'))
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        req.end();
        throw new AccessDeniedError('Карточку может удалить только владелец');
      }
      card.delete();
      res.status(200).send({ message: 'Пост удален' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new InvalidDataError('Невалидный id');
      }
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new InvalidDataError('Невалидный id');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new InvalidDataError('Введены неккорктные данные');
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new InvalidDataError('Введены неккорктные данные');
      }
    })
    .catch(next);
};
