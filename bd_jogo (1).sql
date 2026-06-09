-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 10/06/2026 às 01:13
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `bd_jogo`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `cartas`
--

CREATE TABLE `cartas` (
  `id` int(11) NOT NULL,
  `conteudo` varchar(300) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `par_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `cartas`
--

INSERT INTO `cartas` (`id`, `conteudo`, `descricao`, `par_id`) VALUES
(37, 'Mitocôndria', 'Organela responsável pela produção de ATP', 1),
(38, 'Produção de ATP', 'Função principal da mitocôndria', 1),
(39, 'Ribossomo', 'Organela que produz proteínas', 2),
(40, 'Síntese de proteínas', 'Função principal dos ribossomos', 2),
(41, 'Núcleo', 'Estrutura que abriga o DNA', 3),
(42, 'Armazena DNA', 'Função principal do núcleo', 3),
(43, 'Membrana plasmática', 'Envolve e protege a célula', 4),
(44, 'Permeabilidade seletiva', 'Característica da membrana plasmática', 4),
(45, 'Lisossomo', 'Organela de digestão celular', 5),
(46, 'Digestão celular', 'Função dos lisossomos', 5),
(47, 'DNA', 'Molécula que contém a informação genética', 6),
(48, 'Material genético', 'Definição de DNA', 6),
(49, 'Gene', 'Unidade básica da hereditariedade', 7),
(50, 'Hereditariedade', 'Função dos genes', 7),
(51, 'Cromossomo', 'Estrutura que contém genes', 8),
(52, 'Conjunto de genes', 'Característica dos cromossomos', 8),
(53, 'Genótipo', 'Conjunto de genes de um organismo', 9),
(54, 'Informação genética', 'Definição de genótipo', 9),
(55, 'Fenótipo', 'Características observáveis', 10),
(56, 'Expressão dos genes', 'Origem do fenótipo', 10),
(57, 'Produtores', 'Organismos que produzem seu próprio alimento', 11),
(58, 'Autótrofos', 'Outra denominação para produtores', 11),
(59, 'Consumidores', 'Obtêm energia alimentando-se de outros seres', 12),
(60, 'Heterótrofos', 'Outra denominação para consumidores', 12),
(61, 'Decompositores', 'Reciclam matéria orgânica', 13),
(62, 'Fungos e bactérias', 'Principais decompositores', 13),
(63, 'Habitat', 'Local onde vive uma espécie', 14),
(64, 'Ambiente natural', 'Definição de habitat', 14),
(65, 'Nicho ecológico', 'Função da espécie no ecossistema', 15),
(66, 'Papel ecológico', 'Definição de nicho ecológico', 15);

-- --------------------------------------------------------

--
-- Estrutura para tabela `jogos`
--

CREATE TABLE `jogos` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `id_tema` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `jogos`
--

INSERT INTO `jogos` (`id`, `nome`, `id_tema`) VALUES
(1, 'Jogo Biologia Celular', 1),
(2, 'Jogo Genética', 2),
(3, 'Jogo Ecologia', 3);

-- --------------------------------------------------------

--
-- Estrutura para tabela `pares`
--

CREATE TABLE `pares` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_jogo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pares`
--

INSERT INTO `pares` (`id`, `id_usuario`, `id_jogo`) VALUES
(1, NULL, 1),
(2, NULL, 1),
(3, NULL, 1),
(4, NULL, 1),
(5, NULL, 1),
(6, NULL, 2),
(7, NULL, 2),
(8, NULL, 2),
(9, NULL, 2),
(10, NULL, 2),
(11, NULL, 3),
(12, NULL, 3),
(13, NULL, 3),
(14, NULL, 3),
(15, NULL, 3);

-- --------------------------------------------------------

--
-- Estrutura para tabela `partidas`
--

CREATE TABLE `partidas` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_tema` int(11) DEFAULT NULL,
  `acertos` int(11) DEFAULT NULL,
  `erros` int(11) DEFAULT NULL,
  `data_partida` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `temas`
--

CREATE TABLE `temas` (
  `id` int(11) NOT NULL,
  `tema` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `temas`
--

INSERT INTO `temas` (`id`, `tema`) VALUES
(1, 'Biologia Celular'),
(2, 'Genética'),
(3, 'Ecologia');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `senha` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `cartas`
--
ALTER TABLE `cartas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `par_id` (`par_id`);

--
-- Índices de tabela `jogos`
--
ALTER TABLE `jogos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tema` (`id_tema`);

--
-- Índices de tabela `pares`
--
ALTER TABLE `pares`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `fk_jogo` (`id_jogo`);

--
-- Índices de tabela `partidas`
--
ALTER TABLE `partidas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_tema` (`id_tema`);

--
-- Índices de tabela `temas`
--
ALTER TABLE `temas`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `cartas`
--
ALTER TABLE `cartas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT de tabela `jogos`
--
ALTER TABLE `jogos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `pares`
--
ALTER TABLE `pares`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de tabela `partidas`
--
ALTER TABLE `partidas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `temas`
--
ALTER TABLE `temas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `cartas`
--
ALTER TABLE `cartas`
  ADD CONSTRAINT `cartas_ibfk_1` FOREIGN KEY (`par_id`) REFERENCES `pares` (`id`);

--
-- Restrições para tabelas `jogos`
--
ALTER TABLE `jogos`
  ADD CONSTRAINT `jogos_ibfk_1` FOREIGN KEY (`id_tema`) REFERENCES `temas` (`id`);

--
-- Restrições para tabelas `pares`
--
ALTER TABLE `pares`
  ADD CONSTRAINT `fk_jogo` FOREIGN KEY (`id_jogo`) REFERENCES `jogos` (`id`),
  ADD CONSTRAINT `pares_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`);

--
-- Restrições para tabelas `partidas`
--
ALTER TABLE `partidas`
  ADD CONSTRAINT `partidas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `partidas_ibfk_2` FOREIGN KEY (`id_tema`) REFERENCES `temas` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
