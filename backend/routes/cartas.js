var express = require('express');

var router = express.Router();

var db = require('../utils/db');

router.get('/jogo/:id', function(req, res) {

    const idJogo = req.params.id;
    const dificuldade = req.query.dificuldade;

    console.log('ENTREI NA ROTA CARTAS/JOGO');
    console.log('ID do jogo:', idJogo);
    console.log('Dificuldade:', dificuldade);

    let quantidadePares;

    if (dificuldade === 'facil') {
        quantidadePares = 4;
    } 
    else if (dificuldade === 'medio') {
        quantidadePares = 6;
    } 
    else if (dificuldade === 'dificil') {
        quantidadePares = 8;
    } 
    else {
        quantidadePares = 4;
    }

    console.log('Quantidade de pares:', quantidadePares);

    const sql = `
        SELECT cartas.*, pares_lim.saiba_mais
        FROM cartas
        INNER JOIN (
            SELECT id, saiba_mais
            FROM pares
            WHERE id_jogo = ?
            ORDER BY RAND()
            LIMIT ${quantidadePares}
        ) pares_lim
        ON cartas.par_id = pares_lim.id;
    `;

    db.query(sql, [idJogo], function(erro, resultado) {

        if (erro) {

            console.log(erro);

            res.status(500).json({
                erro: 'Erro ao buscar cartas'
            });

        } else {

            console.log('Quantidade de cartas retornadas:', resultado.length);

            res.json(resultado);

        }

    });

});

module.exports = router;