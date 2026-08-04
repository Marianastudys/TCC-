const express = require('express');

const router = express.Router();

const conexao = require('../utils/db');

router.post('/login', (req, res) => {

    const { nome, senha } = req.body;

    const sql = `
        SELECT *
        FROM usuarios
        WHERE nome = ?
        AND senha = ?
    `;

    conexao.query(

        sql,

        [nome, senha],

        (erro, resultado) => {

            if (erro) {

                return res.status(500).json(erro);

            }

            if (resultado.length === 0) {

                return res.status(401).json({

                    mensagem: 'Usuário ou senha inválidos.'

                });

            }

            res.json(resultado[0]);

        }

    );

});

module.exports = router;