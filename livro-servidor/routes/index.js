var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Servidor',
    banco: 'http://localhost:3030/livros'
  });
});

module.exports = router;
