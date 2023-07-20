'use strict';

const handle500 = (req, res) =>  {
  res.status(500).send({
    error: 500,
    route: req.path,
    message: 'ERROR 500: Something went wrong'
  });
};

module.exports = handle500;

