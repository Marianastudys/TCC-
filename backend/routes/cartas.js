var express = require('express');

var router = express.Router();

var db = require('../utils/db');

router.get('/jogo/:id', function(req, res) {

    const idJogo = req.params.id;

    const sql = `
SELECT cartas.*
FROM cartas
INNER JOIN (
    SELECT id
    FROM pares
    WHERE id_jogo = ?
    ORDER BY RAND()
    LIMIT 4
) pares_lim
ON cartas.par_id = pares_lim.id;`;

    db.query(sql, [idJogo], function(erro, resultado) {

        if (erro) {

            console.log(erro);

            res.status(500).json({
                erro: 'Erro ao buscar cartas'
            });

        } else {

            res.json(resultado);

        }

    });

});

module.exports = router;