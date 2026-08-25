const express = require('express');

const router = express.Router();

const conexao = require('../utils/db');

/* LOGIN*/
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


/* CADASTRO*/
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


/* BUSCAR PERFIL DO USUÁRIO*/

/* DADOS DO USUÁRIO*/
router.get('/:id', (req, res) => {

    console.log('========== NOVA ROTA USUARIO ==========');
    console.log('ID RECEBIDO:', req.params.id);

    const idUsuario = req.params.id;


    const sqlUsuario = `
        SELECT
            id,
            nome
        FROM usuarios
        WHERE id = ?
    `;

    conexao.query(
        sqlUsuario,
        [idUsuario],
        (erro, resultadoUsuario) => {

            if (erro) {

                console.log(
                    'Erro ao buscar usuário:',
                    erro
                );

                return res.status(500).json({
                    mensagem: 'Erro ao buscar usuário.',
                    erro: erro.message
                });

            }

            if (resultadoUsuario.length === 0) {

                return res.status(404).json({
                    mensagem: 'Usuário não encontrado.'
                });

            }

            const usuario = resultadoUsuario[0];

            const sqlEstatisticas = `

                SELECT

                    COALESCE(SUM(score), 0)
                        AS scoreAcumulado,

                    COALESCE(MAX(score), 0)
                        AS maiorScore,

                    COUNT(id)
                        AS partidasJogadas,

                    COALESCE(SUM(acertos), 0)
                        AS totalAcertos,

                    COALESCE(SUM(erros), 0)
                        AS totalErros,

                    COALESCE(AVG(score), 0)
                        AS mediaScore

                FROM partidas

                WHERE id_usuario = ?

            `;


            conexao.query(
                sqlEstatisticas,
                [idUsuario],
                (erro, estatisticas) => {

                    if (erro) {

                        console.log(
                            'Erro ao buscar estatísticas:',
                            erro
                        );

                        return res.status(500).json({
                            mensagem:
                                'Erro ao buscar estatísticas.',
                            erro: erro.message
                        });

                    }


                    /*
                     * Buscar histórico
                     */

                    const sqlPartidas = `

                        SELECT

                            p.id,
                            t.tema,
                            p.score,
                            p.acertos,
                            p.erros,
                            p.data_partida

                        FROM partidas p

                        INNER JOIN temas t
                            ON p.id_tema = t.id

                        WHERE p.id_usuario = ?

                        ORDER BY
                            p.data_partida DESC

                    `;


                    conexao.query(
                        sqlPartidas,
                        [idUsuario],
                        (erro, partidas) => {

                            if (erro) {

                                console.log(
                                    'Erro ao buscar partidas:',
                                    erro
                                );

                                return res.status(500).json({
                                    mensagem:
                                        'Erro ao buscar histórico.',
                                    erro: erro.message
                                });

                            }


                            const dados =
                                estatisticas[0];


                            /*
                             * Calcular percentual
                             */

                            const totalTentativas =
                                Number(dados.totalAcertos) +
                                Number(dados.totalErros);


                            let percentualAcertos = 0;


                            if (totalTentativas > 0) {

                                percentualAcertos =
                                    Math.round(
                                        (
                                            Number(
                                                dados.totalAcertos
                                            ) /
                                            totalTentativas
                                        ) * 100
                                    );

                            }


                            res.json({

                                id: usuario.id,

                                nome: usuario.nome,

                                scoreAcumulado:
                                    Number(
                                        dados.scoreAcumulado
                                    ),

                                maiorScore:
                                    Number(
                                        dados.maiorScore
                                    ),

                                partidasJogadas:
                                    Number(
                                        dados.partidasJogadas
                                    ),

                                totalAcertos:
                                    Number(
                                        dados.totalAcertos
                                    ),

                                totalErros:
                                    Number(
                                        dados.totalErros
                                    ),

                                percentualAcertos:
                                    percentualAcertos,

                                mediaScore:
                                    Math.round(
                                        Number(
                                            dados.mediaScore
                                        )
                                    ),

                                partidas: partidas
                            });
                        }
                    );
                }
            );
        }
    );
});

/* ALTERAR DADOS DO USUÁRIO*/
router.put('/:id', (req, res) => {

    const idUsuario = req.params.id;

    const { nome, senha } = req.body;


    if (!nome) {

        return res.status(400).json({

            mensagem: 'O nome de usuário é obrigatório.'

        });

    }

    let sql;
    let valores;

    /*
     * Se o usuário informou uma nova senha,
     * atualizamos nome e senha.
     */

    if (senha && senha.trim() !== '') {

        sql = `

            UPDATE usuarios

            SET
                nome = ?,
                senha = ?

            WHERE id = ?

        `;

        valores = [nome, senha, idUsuario];

    }

    /*
     * Caso contrário, alteramos somente o nome.
     */

    else {

        sql = `

            UPDATE usuarios

            SET nome = ?

            WHERE id = ?

        `;

        valores = [nome, idUsuario];

    }

    conexao.query(

        sql,

        valores,

        (erro) => {

            if (erro) {

                console.log(
                    'Erro ao atualizar usuário:',
                    erro
                );

                return res.status(500).json({

                    mensagem:
                        'Erro ao atualizar dados do usuário.'

                });

            }

            res.json({

                mensagem:
                    'Dados atualizados com sucesso!'

            });

        }

    );

});

/*SALVAR PARTIDA*/
router.post('/partidas', (req, res) => {

    const {
        id_usuario,
        id_jogo,
        acertos,
        erros,
        score
    } = req.body;

    console.log('DADOS RECEBIDOS:', req.body);

    if (!id_usuario || !id_jogo) {

        return res.status(400).json({
            mensagem: 'Usuário e jogo são obrigatórios.'
        });

    }

    const sqlTema = `
        SELECT id_tema
        FROM jogos
        WHERE id = ?
    `;

    conexao.query(
        sqlTema,
        [id_jogo],
        (erro, resultado) => {

            if (erro) {

                console.log('ERRO AO BUSCAR TEMA:', erro);

                return res.status(500).json({
                    mensagem: 'Erro ao buscar o tema.',
                    erro: erro.message
                });

            }

            console.log('JOGO ENCONTRADO:', resultado);

            if (resultado.length === 0) {

                return res.status(404).json({
                    mensagem: 'Jogo não encontrado.'
                });

            }

            const idTema = resultado[0].id_tema;

            const sqlPartida = `
                INSERT INTO partidas
                (
                    id_usuario,
                    id_tema,
                    acertos,
                    erros,
                    data_partida,
                    score
                )
                VALUES (?, ?, ?, ?, NOW(), ?)
            `;

            conexao.query(
                sqlPartida,
                [
                    id_usuario,
                    idTema,
                    acertos,
                    erros,
                    score
                ],
                (erro, resultado) => {

                    if (erro) {

                        console.log(
                            'ERRO AO INSERIR PARTIDA:',
                            erro
                        );

                        return res.status(500).json({
                            mensagem: 'Erro ao salvar partida.',
                            erro: erro.message
                        });

                    }

                    console.log(
                        'PARTIDA SALVA. ID:',
                        resultado.insertId
                    );

                    res.status(201).json({

                        mensagem:
                            'Partida salva com sucesso!',

                        id:
                            resultado.insertId

                    });

                }
            );

        }
    );

});

module.exports = router;