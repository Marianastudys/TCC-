var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

  res.json([
    { nome: 'Mariana' },
    { nome: 'João' },
    { nome: 'Carlos' }
  ]);

});

module.exports = router;