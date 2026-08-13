const express = require('express');

const router = express.Router();

const conexao = require('../utils/db');


/* ============================
   LOGIN
============================ */

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


/* ============================
   CADASTRO
============================ */

router.post('/cadastro', (req, res) => {

    const { nome, senha } = req.body;


    if (!nome || !senha) {

        return res.status(400).json({

            mensagem: 'Preencha todos os campos.'

        });

    }


    const sql = `
        INSERT INTO usuarios
        (nome, senha)
        VALUES (?, ?)
    `;


    conexao.query(

        sql,

        [nome, senha],

        (erro, resultado) => {

            if (erro) {

                console.log('Erro ao cadastrar:', erro);

                return res.status(500).json({

                    mensagem: 'Erro ao cadastrar usuário.'

                });

            }


            res.status(201).json({

                mensagem: 'Usuário cadastrado com sucesso!',

                id: resultado.insertId

            });

        }

    );

});


module.exports = router;