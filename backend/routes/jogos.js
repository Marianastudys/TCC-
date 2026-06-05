var express = require('express');

var router = express.Router();

var db = require('../utils/db');

router.get('/:idTema', function(req, res) {

    const idTema = req.params.idTema;

    const sql = `
    
    SELECT *
    
    FROM jogos
    
    WHERE id_tema = ?
    
    `;

    db.query(sql, [idTema], function(erro, resultado) {

        if (erro) {

            console.log(erro);

            res.status(500).json({
                erro: 'Erro ao buscar jogos'
            });

        } else {

            res.json(resultado);

        }

    });

});

module.exports = router;