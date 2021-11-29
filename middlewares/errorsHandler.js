module.exports = (err, req, res) => {
  if (err.statusCode === 500) {
    res.status(err.statusCode).send({ message: `На сервере произошла ошибка ${err.name}: ${err.message}` });
    return;
  }
  res.status(err.statusCode).send({ message: err.message });
};
