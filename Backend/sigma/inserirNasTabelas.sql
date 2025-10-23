USE SIGMA;

-- =================================================================
-- 1. PESSOAS (100 registros)
-- =================================================================

-- Pessoas que serão Funcionários (IDs 1-35)
INSERT INTO Pessoa (id_pessoa, nome, email, rua, numero, bairro, cidade, cep) VALUES
                                                                                  (1, 'João Pedro Silva', 'joao.silva@sigma.com', 'Rua das Flores', '123', 'Centro', 'São Paulo', '01310-100'),
                                                                                  (2, 'Maria Santos', 'maria.santos@sigma.com', 'Av. Paulista', '1500', 'Bela Vista', 'São Paulo', '01310-200'),
                                                                                  (3, 'Carlos Oliveira', 'carlos.oliveira@sigma.com', 'Rua Augusta', '789', 'Consolação', 'São Paulo', '01305-100'),
                                                                                  (4, 'Ana Paula Costa', 'ana.costa@sigma.com', 'Rua Oscar Freire', '456', 'Jardins', 'São Paulo', '01426-001'),
                                                                                  (5, 'Pedro Henrique Lima', 'pedro.lima@sigma.com', 'Rua Haddock Lobo', '321', 'Cerqueira César', 'São Paulo', '01414-001'),
                                                                                  (6, 'Juliana Ferreira', 'juliana.ferreira@sigma.com', 'Rua Teodoro Sampaio', '654', 'Pinheiros', 'São Paulo', '05405-000'),
                                                                                  (7, 'Roberto Alves', 'roberto.alves@sigma.com', 'Rua da Consolação', '987', 'Consolação', 'São Paulo', '01301-000'),
                                                                                  (8, 'Fernanda Rodrigues', 'fernanda.rodrigues@sigma.com', 'Av. Faria Lima', '2000', 'Itaim Bibi', 'São Paulo', '01452-000'),
                                                                                  (9, 'Lucas Martins', 'lucas.martins@sigma.com', 'Rua Estados Unidos', '1500', 'Jardins', 'São Paulo', '01427-001'),
                                                                                  (10, 'Patricia Souza', 'patricia.souza@sigma.com', 'Rua Bela Cintra', '800', 'Consolação', 'São Paulo', '01415-000'),
                                                                                  (11, 'Rodrigo Mendes', 'rodrigo.mendes@sigma.com', 'Av. Rebouças', '2500', 'Pinheiros', 'São Paulo', '05402-100'),
                                                                                  (12, 'Carla Dias', 'carla.dias@sigma.com', 'Rua Frei Caneca', '890', 'Consolação', 'São Paulo', '01307-002'),
                                                                                  (13, 'Marcelo Pereira', 'marcelo.pereira@sigma.com', 'Alameda Santos', '2100', 'Jardins', 'São Paulo', '01419-002'),
                                                                                  (14, 'Renata Silva', 'renata.silva@sigma.com', 'Rua Augusta', '3000', 'Consolação', 'São Paulo', '01412-001'),
                                                                                  (15, 'Thiago Costa', 'thiago.costa@sigma.com', 'Av. Angélica', '2000', 'Santa Cecília', 'São Paulo', '01227-300'),
                                                                                  (16, 'Vanessa Lima', 'vanessa.lima@sigma.com', 'Rua Pamplona', '700', 'Jardins', 'São Paulo', '01405-001'),
                                                                                  (17, 'André Santos', 'andre.santos@sigma.com', 'Av. Brigadeiro', '3000', 'Bela Vista', 'São Paulo', '01402-001'),
                                                                                  (18, 'Silvia Rocha', 'silvia.rocha@sigma.com', 'Rua Barão de Capanema', '200', 'Cerqueira César', 'São Paulo', '01411-020'),
                                                                                  (19, 'Eduardo Alves', 'eduardo.alves@sigma.com', 'Rua Bela Cintra', '2000', 'Consolação', 'São Paulo', '01415-003'),
                                                                                  (20, 'Mônica Ferreira', 'monica.ferreira@sigma.com', 'Rua Estados Unidos', '3000', 'Jardins', 'São Paulo', '01427-003'),
                                                                                  (21, 'Paulo Henrique', 'paulo.henrique@sigma.com', 'Rua da Consolação', '1500', 'Consolação', 'São Paulo', '01302-002'),
                                                                                  (22, 'Daniela Martins', 'daniela.martins@sigma.com', 'Av. Paulista', '3500', 'Bela Vista', 'São Paulo', '01310-400'),
                                                                                  (23, 'Fábio Rodrigues', 'fabio.rodrigues@sigma.com', 'Rua Oscar Freire', '1200', 'Jardins', 'São Paulo', '01426-002'),
                                                                                  (24, 'Cristina Souza', 'cristina.souza@sigma.com', 'Rua Haddock Lobo', '900', 'Cerqueira César', 'São Paulo', '01414-003'),
                                                                                  (25, 'Márcio Oliveira', 'marcio.oliveira@sigma.com', 'Rua Augusta', '4000', 'Consolação', 'São Paulo', '01412-002'),
                                                                                  (26, 'Adriana Costa', 'adriana.costa@sigma.com', 'Av. Faria Lima', '4000', 'Itaim Bibi', 'São Paulo', '01452-001'),
                                                                                  (27, 'Bruno Silva', 'bruno.silva@sigma.com', 'Rua Teodoro Sampaio', '1000', 'Pinheiros', 'São Paulo', '05405-001'),
                                                                                  (28, 'Tatiana Lima', 'tatiana.lima@sigma.com', 'Av. Rebouças', '4000', 'Pinheiros', 'São Paulo', '05402-200'),
                                                                                  (29, 'Vitor Pereira', 'vitor.pereira@sigma.com', 'Rua Frei Caneca', '1200', 'Consolação', 'São Paulo', '01307-003'),
                                                                                  (30, 'Camila Dias', 'camila.dias@sigma.com', 'Alameda Santos', '3000', 'Jardins', 'São Paulo', '01419-003'),
                                                                                  (31, 'Leonardo Mendes', 'leonardo.mendes@sigma.com', 'Rua Pamplona', '900', 'Jardins', 'São Paulo', '01405-002'),
                                                                                  (32, 'Aline Ferreira', 'aline.ferreira@sigma.com', 'Av. Angélica', '3000', 'Santa Cecília', 'São Paulo', '01227-400'),
                                                                                  (33, 'Rafael Costa', 'rafael.costa@sigma.com', 'Rua Barão de Capanema', '300', 'Cerqueira César', 'São Paulo', '01411-030'),
                                                                                  (34, 'Priscila Santos', 'priscila.santos@sigma.com', 'Rua Bela Cintra', '3000', 'Consolação', 'São Paulo', '01415-004'),
                                                                                  (35, 'Guilherme Alves', 'guilherme.alves@sigma.com', 'Rua Estados Unidos', '4000', 'Jardins', 'São Paulo', '01427-004');

-- Pessoas que serão Clientes Pessoa Física (IDs 36-75 = 40 clientes PF)
INSERT INTO Pessoa (id_pessoa, nome, email, rua, numero, bairro, cidade, cep) VALUES
                                                                                  (36, 'Ricardo Mendes', 'ricardo.mendes@email.com', 'Rua das Palmeiras', '234', 'Santa Cecília', 'São Paulo', '01246-000'),
                                                                                  (37, 'Camila Rocha', 'camila.rocha@email.com', 'Av. Rebouças', '3000', 'Pinheiros', 'São Paulo', '05402-000'),
                                                                                  (38, 'Felipe Santos', 'felipe.santos@email.com', 'Rua Frei Caneca', '569', 'Consolação', 'São Paulo', '01307-001'),
                                                                                  (39, 'Mariana Lima', 'mariana.lima@email.com', 'Rua Alameda Santos', '1000', 'Jardins', 'São Paulo', '01419-001'),
                                                                                  (40, 'Bruno Costa', 'bruno.costa2@email.com', 'Rua Augusta', '2000', 'Consolação', 'São Paulo', '01412-000'),
                                                                                  (41, 'Gabriela Ferreira', 'gabriela.ferreira@email.com', 'Av. Angélica', '1500', 'Santa Cecília', 'São Paulo', '01227-200'),
                                                                                  (42, 'Thiago Oliveira', 'thiago.oliveira2@email.com', 'Rua Oscar Freire', '900', 'Jardins', 'São Paulo', '01426-001'),
                                                                                  (43, 'Amanda Silva', 'amanda.silva@email.com', 'Rua Haddock Lobo', '700', 'Cerqueira César', 'São Paulo', '01414-002'),
                                                                                  (44, 'Rafael Souza', 'rafael.souza2@email.com', 'Av. Paulista', '2500', 'Bela Vista', 'São Paulo', '01310-300'),
                                                                                  (45, 'Beatriz Alves', 'beatriz.alves@email.com', 'Rua da Consolação', '1200', 'Consolação', 'São Paulo', '01302-001'),
                                                                                  (46, 'Gustavo Martins', 'gustavo.martins@email.com', 'Rua Pamplona', '500', 'Jardins', 'São Paulo', '01405-000'),
                                                                                  (47, 'Larissa Rodrigues', 'larissa.rodrigues@email.com', 'Av. Brigadeiro Luis Antonio', '2000', 'Bela Vista', 'São Paulo', '01402-000'),
                                                                                  (48, 'Vinícius Costa', 'vinicius.costa@email.com', 'Rua Barão de Capanema', '100', 'Cerqueira César', 'São Paulo', '01411-010'),
                                                                                  (49, 'Carolina Santos', 'carolina.santos@email.com', 'Rua Bela Cintra', '1500', 'Consolação', 'São Paulo', '01415-002'),
                                                                                  (50, 'Daniel Lima', 'daniel.lima@email.com', 'Rua Estados Unidos', '2000', 'Jardins', 'São Paulo', '01427-002'),
                                                                                  (51, 'Isabela Pereira', 'isabela.pereira@email.com', 'Av. Faria Lima', '5000', 'Itaim Bibi', 'São Paulo', '01452-002'),
                                                                                  (52, 'Henrique Dias', 'henrique.dias@email.com', 'Rua Teodoro Sampaio', '2000', 'Pinheiros', 'São Paulo', '05405-002'),
                                                                                  (53, 'Natália Rocha', 'natalia.rocha@email.com', 'Av. Rebouças', '5000', 'Pinheiros', 'São Paulo', '05402-300'),
                                                                                  (54, 'Diego Silva', 'diego.silva@email.com', 'Rua Frei Caneca', '2000', 'Consolação', 'São Paulo', '01307-004'),
                                                                                  (55, 'Letícia Costa', 'leticia.costa@email.com', 'Alameda Santos', '4000', 'Jardins', 'São Paulo', '01419-004'),
                                                                                  (56, 'Fernando Alves', 'fernando.alves@email.com', 'Rua Augusta', '5000', 'Consolação', 'São Paulo', '01412-003'),
                                                                                  (57, 'Bruna Santos', 'bruna.santos@email.com', 'Av. Angélica', '4000', 'Santa Cecília', 'São Paulo', '01227-500'),
                                                                                  (58, 'Mateus Lima', 'mateus.lima@email.com', 'Rua Oscar Freire', '1500', 'Jardins', 'São Paulo', '01426-003'),
                                                                                  (59, 'Julia Ferreira', 'julia.ferreira@email.com', 'Rua Haddock Lobo', '1200', 'Cerqueira César', 'São Paulo', '01414-004'),
                                                                                  (60, 'Caio Mendes', 'caio.mendes@email.com', 'Av. Paulista', '4000', 'Bela Vista', 'São Paulo', '01310-500'),
                                                                                  (61, 'Lívia Rodrigues', 'livia.rodrigues@email.com', 'Rua da Consolação', '2000', 'Consolação', 'São Paulo', '01302-003'),
                                                                                  (62, 'André Martins', 'andre.martins2@email.com', 'Rua Pamplona', '1200', 'Jardins', 'São Paulo', '01405-003'),
                                                                                  (63, 'Bianca Costa', 'bianca.costa@email.com', 'Av. Brigadeiro', '4000', 'Bela Vista', 'São Paulo', '01402-002'),
                                                                                  (64, 'Marcelo Souza', 'marcelo.souza@email.com', 'Rua Barão de Capanema', '400', 'Cerqueira César', 'São Paulo', '01411-040'),
                                                                                  (65, 'Renata Lima', 'renata.lima@email.com', 'Rua Bela Cintra', '4000', 'Consolação', 'São Paulo', '01415-005'),
                                                                                  (66, 'Paulo Silva', 'paulo.silva@email.com', 'Rua Estados Unidos', '5000', 'Jardins', 'São Paulo', '01427-005'),
                                                                                  (67, 'Vanessa Santos', 'vanessa.santos@email.com', 'Av. Faria Lima', '6000', 'Itaim Bibi', 'São Paulo', '01452-003'),
                                                                                  (68, 'Roberto Costa', 'roberto.costa@email.com', 'Rua Teodoro Sampaio', '3000', 'Pinheiros', 'São Paulo', '05405-003'),
                                                                                  (69, 'Patrícia Oliveira', 'patricia.oliveira@email.com', 'Av. Rebouças', '6000', 'Pinheiros', 'São Paulo', '05402-400'),
                                                                                  (70, 'Anderson Lima', 'anderson.lima@email.com', 'Rua Frei Caneca', '3000', 'Consolação', 'São Paulo', '01307-005'),
                                                                                  (71, 'Fernanda Dias', 'fernanda.dias@email.com', 'Alameda Santos', '5000', 'Jardins', 'São Paulo', '01419-005'),
                                                                                  (72, 'Marcos Pereira', 'marcos.pereira@email.com', 'Rua Augusta', '6000', 'Consolação', 'São Paulo', '01412-004'),
                                                                                  (73, 'Adriana Rocha', 'adriana.rocha@email.com', 'Av. Angélica', '5000', 'Santa Cecília', 'São Paulo', '01227-600'),
                                                                                  (74, 'Rodrigo Alves', 'rodrigo.alves@email.com', 'Rua Oscar Freire', '2000', 'Jardins', 'São Paulo', '01426-004'),
                                                                                  (75, 'Tatiane Ferreira', 'tatiane.ferreira@email.com', 'Rua Haddock Lobo', '1500', 'Cerqueira César', 'São Paulo', '01414-005');

-- Pessoas que serão Clientes Pessoa Jurídica (IDs 76-100 = 25 empresas)
INSERT INTO Pessoa (id_pessoa, nome, email, rua, numero, bairro, cidade, cep) VALUES
                                                                                  (76, 'Tech Solutions LTDA', 'contato@techsolutions.com.br', 'Av. Faria Lima', '3000', 'Itaim Bibi', 'São Paulo', '01451-000'),
                                                                                  (77, 'Comercial Alvorada LTDA', 'vendas@alvorada.com.br', 'Rua Vergueiro', '5000', 'Vila Mariana', 'São Paulo', '04101-000'),
                                                                                  (78, 'Distribuidora São Jorge', 'contato@saojorge.com.br', 'Av. do Estado', '3000', 'Brás', 'São Paulo', '03003-000'),
                                                                                  (79, 'Supermercado Bom Preço', 'compras@bompreco.com.br', 'Rua 25 de Março', '1000', 'Centro', 'São Paulo', '01021-000'),
                                                                                  (80, 'Restaurante Sabor & Arte', 'gerencia@saborarte.com.br', 'Rua Avanhandava', '234', 'Bela Vista', 'São Paulo', '01306-000'),
                                                                                  (81, 'Industrias Reunidas XYZ', 'comercial@xyz.com.br', 'Av. Industrial', '5000', 'Brás', 'São Paulo', '03003-100'),
                                                                                  (82, 'Papelaria Moderna', 'vendas@papmoderna.com.br', 'Rua do Comércio', '890', 'Centro', 'São Paulo', '01022-000'),
                                                                                  (83, 'Lanchonete Fast Food', 'pedidos@fastfood.com.br', 'Av. Paulista', '5000', 'Bela Vista', 'São Paulo', '01310-600'),
                                                                                  (84, 'Informática Brasil', 'suporte@infobrasil.com.br', 'Rua Augusta', '7000', 'Consolação', 'São Paulo', '01412-005'),
                                                                                  (85, 'Padaria Pão Quente', 'contato@paoquente.com.br', 'Rua da Mooca', '1500', 'Mooca', 'São Paulo', '03104-000'),
                                                                                  (86, 'Distribuidora Central', 'vendas@distcentral.com.br', 'Av. do Estado', '5000', 'Brás', 'São Paulo', '03003-200'),
                                                                                  (87, 'Farmácia Saúde Total', 'comercial@saudetotal.com.br', 'Rua Vergueiro', '7000', 'Vila Mariana', 'São Paulo', '04101-100'),
                                                                                  (88, 'Materiais de Construção Silva', 'vendas@matsilva.com.br', 'Av. Morumbi', '2000', 'Morumbi', 'São Paulo', '05651-000'),
                                                                                  (89, 'Pet Shop Amigo Fiel', 'contato@amigofiel.com.br', 'Rua Oscar Freire', '2500', 'Jardins', 'São Paulo', '01426-005'),
                                                                                  (90, 'Academia Corpo Perfeito', 'matricula@corpoperfeito.com.br', 'Av. Faria Lima', '7000', 'Itaim Bibi', 'São Paulo', '01452-004'),
                                                                                  (91, 'Ótica Visão Clara', 'vendas@visaoclara.com.br', 'Rua Augusta', '8000', 'Consolação', 'São Paulo', '01412-006'),
                                                                                  (92, 'Sorveteria Sabor Gelado', 'pedidos@saborgelado.com.br', 'Rua Haddock Lobo', '2000', 'Cerqueira César', 'São Paulo', '01414-006'),
                                                                                  (93, 'Floricultura Jardim Encantado', 'vendas@jardimencantado.com.br', 'Rua Pamplona', '1500', 'Jardins', 'São Paulo', '01405-004'),
                                                                                  (94, 'Lavanderia Lava Rápido', 'contato@lavarapido.com.br', 'Av. Rebouças', '7000', 'Pinheiros', 'São Paulo', '05402-500'),
                                                                                  (95, 'Escola Infantil Pequenos Gênios', 'secretaria@pequenosgenios.com.br', 'Rua Bela Cintra', '5000', 'Consolação', 'São Paulo', '01415-006'),
                                                                                  (96, 'Clínica Odontológica Sorriso', 'agendamento@clinicasorriso.com.br', 'Av. Paulista', '6000', 'Bela Vista', 'São Paulo', '01310-700'),
                                                                                  (97, 'Advocacia & Consultoria Legal', 'contato@advocacialegal.com.br', 'Rua Estados Unidos', '6000', 'Jardins', 'São Paulo', '01427-006'),
                                                                                  (98, 'Construtora Edificar', 'projetos@edificar.com.br', 'Av. Faria Lima', '8000', 'Itaim Bibi', 'São Paulo', '01452-005'),
                                                                                  (99, 'Agência de Turismo Viajar Bem', 'reservas@viajarbem.com.br', 'Rua da Consolação', '3000', 'Consolação', 'São Paulo', '01302-004'),
                                                                                  (100, 'Gráfica Impressão Perfeita', 'orcamento@impressaoperfeita.com.br', 'Rua Teodoro Sampaio', '4000', 'Pinheiros', 'São Paulo', '05405-004');

-- =================================================================
-- 2. TELEFONES (150+ registros)
-- =================================================================

INSERT INTO Telefone (id_pessoa, numero, tipo) VALUES
-- Funcionários (IDs 1-35) - cada um tem pelo menos 1 telefone
(1, '(11) 98765-4321', 'CELULAR'),
(1, '(11) 3456-7890', 'RESIDENCIAL'),
(2, '(11) 99876-5432', 'CELULAR'),
(3, '(11) 97654-3210', 'CELULAR'),
(4, '(11) 96543-2109', 'CELULAR'),
(5, '(11) 95432-1098', 'CELULAR'),
(6, '(11) 94321-0987', 'CELULAR'),
(7, '(11) 93210-9876', 'CELULAR'),
(8, '(11) 92109-8765', 'CELULAR'),
(9, '(11) 91098-7654', 'CELULAR'),
(10, '(11) 90987-6543', 'CELULAR'),
(11, '(11) 98111-0001', 'CELULAR'),
(12, '(11) 98111-0002', 'CELULAR'),
(13, '(11) 98111-0003', 'CELULAR'),
(14, '(11) 98111-0004', 'CELULAR'),
(15, '(11) 98111-0005', 'CELULAR'),
(16, '(11) 98111-0006', 'CELULAR'),
(17, '(11) 98111-0007', 'CELULAR'),
(18, '(11) 98111-0008', 'CELULAR'),
(19, '(11) 98111-0009', 'CELULAR'),
(20, '(11) 98111-0010', 'CELULAR'),
(21, '(11) 98111-0011', 'CELULAR'),
(22, '(11) 98111-0012', 'CELULAR'),
(23, '(11) 98111-0013', 'CELULAR'),
(24, '(11) 98111-0014', 'CELULAR'),
(25, '(11) 98111-0015', 'CELULAR'),
(26, '(11) 98111-0016', 'CELULAR'),
(27, '(11) 98111-0017', 'CELULAR'),
(28, '(11) 98111-0018', 'CELULAR'),
(29, '(11) 98111-0019', 'CELULAR'),
(30, '(11) 98111-0020', 'CELULAR'),
(31, '(11) 98111-0021', 'CELULAR'),
(32, '(11) 98111-0022', 'CELULAR'),
(33, '(11) 98111-0023', 'CELULAR'),
(34, '(11) 98111-0024', 'CELULAR'),
(35, '(11) 98111-0025', 'CELULAR'),
-- Clientes PF (IDs 36-75)
(36, '(11) 98222-0001', 'CELULAR'),
(37, '(11) 98222-0002', 'CELULAR'),
(38, '(11) 98222-0003', 'CELULAR'),
(39, '(11) 98222-0004', 'CELULAR'),
(40, '(11) 98222-0005', 'CELULAR'),
(41, '(11) 98222-0006', 'CELULAR'),
(42, '(11) 98222-0007', 'CELULAR'),
(43, '(11) 98222-0008', 'CELULAR'),
(44, '(11) 98222-0009', 'CELULAR'),
(45, '(11) 98222-0010', 'CELULAR'),
(46, '(11) 98222-0011', 'CELULAR'),
(47, '(11) 98222-0012', 'CELULAR'),
(48, '(11) 98222-0013', 'CELULAR'),
(49, '(11) 98222-0014', 'CELULAR'),
(50, '(11) 98222-0015', 'CELULAR'),
(51, '(11) 98222-0016', 'CELULAR'),
(52, '(11) 98222-0017', 'CELULAR'),
(53, '(11) 98222-0018', 'CELULAR'),
(54, '(11) 98222-0019', 'CELULAR'),
(55, '(11) 98222-0020', 'CELULAR'),
(56, '(11) 98222-0021', 'CELULAR'),
(57, '(11) 98222-0022', 'CELULAR'),
(58, '(11) 98222-0023', 'CELULAR'),
(59, '(11) 98222-0024', 'CELULAR'),
(60, '(11) 98222-0025', 'CELULAR'),
(61, '(11) 98222-0026', 'CELULAR'),
(62, '(11) 98222-0027', 'CELULAR'),
(63, '(11) 98222-0028', 'CELULAR'),
(64, '(11) 98222-0029', 'CELULAR'),
(65, '(11) 98222-0030', 'CELULAR'),
(66, '(11) 98222-0031', 'CELULAR'),
(67, '(11) 98222-0032', 'CELULAR'),
(68, '(11) 98222-0033', 'CELULAR'),
(69, '(11) 98222-0034', 'CELULAR'),
(70, '(11) 98222-0035', 'CELULAR'),
(71, '(11) 98222-0036', 'CELULAR'),
(72, '(11) 98222-0037', 'CELULAR'),
(73, '(11) 98222-0038', 'CELULAR'),
(74, '(11) 98222-0039', 'CELULAR'),
(75, '(11) 98222-0040', 'CELULAR'),
-- Clientes PJ (IDs 76-100) - cada empresa tem 2 telefones
(76, '(11) 3100-1000', 'COMERCIAL'),
(76, '(11) 97777-7777', 'CELULAR'),
(77, '(11) 3200-2000', 'COMERCIAL'),
(77, '(11) 97777-7778', 'CELULAR'),
(78, '(11) 3300-3000', 'COMERCIAL'),
(78, '(11) 97777-7779', 'CELULAR'),
(79, '(11) 3400-4000', 'COMERCIAL'),
(79, '(11) 97777-7780', 'CELULAR'),
(80, '(11) 3500-5000', 'COMERCIAL'),
(80, '(11) 97777-7781', 'CELULAR'),
(81, '(11) 3600-6000', 'COMERCIAL'),
(81, '(11) 97777-7782', 'CELULAR'),
(82, '(11) 3700-7000', 'COMERCIAL'),
(82, '(11) 97777-7783', 'CELULAR'),
(83, '(11) 3800-8000', 'COMERCIAL'),
(83, '(11) 97777-7784', 'CELULAR'),
(84, '(11) 3900-9000', 'COMERCIAL'),
(84, '(11) 97777-7785', 'CELULAR'),
(85, '(11) 3100-2000', 'COMERCIAL'),
(85, '(11) 97777-7786', 'CELULAR'),
(86, '(11) 3200-3000', 'COMERCIAL'),
(86, '(11) 97777-7787', 'CELULAR'),
(87, '(11) 3300-4000', 'COMERCIAL'),
(87, '(11) 97777-7788', 'CELULAR'),
(88, '(11) 3400-5000', 'COMERCIAL'),
(88, '(11) 97777-7789', 'CELULAR'),
(89, '(11) 3500-6000', 'COMERCIAL'),
(89, '(11) 97777-7790', 'CELULAR'),
(90, '(11) 3600-7000', 'COMERCIAL'),
(90, '(11) 97777-7791', 'CELULAR'),
(91, '(11) 3700-8000', 'COMERCIAL'),
(91, '(11) 97777-7792', 'CELULAR'),
(92, '(11) 3800-9000', 'COMERCIAL'),
(92, '(11) 97777-7793', 'CELULAR'),
(93, '(11) 3900-1000', 'COMERCIAL'),
(93, '(11) 97777-7794', 'CELULAR'),
(94, '(11) 3100-3000', 'COMERCIAL'),
(94, '(11) 97777-7795', 'CELULAR'),
(95, '(11) 3200-4000', 'COMERCIAL'),
(95, '(11) 97777-7796', 'CELULAR'),
(96, '(11) 3300-5000', 'COMERCIAL'),
(96, '(11) 97777-7797', 'CELULAR'),
(97, '(11) 3400-6000', 'COMERCIAL'),
(97, '(11) 97777-7798', 'CELULAR'),
(98, '(11) 3500-7000', 'COMERCIAL'),
(98, '(11) 97777-7799', 'CELULAR'),
(99, '(11) 3600-8000', 'COMERCIAL'),
(99, '(11) 97777-7800', 'CELULAR'),
(100, '(11) 3700-9000', 'COMERCIAL'),
(100, '(11) 97777-7801', 'CELULAR');

-- =================================================================
-- 3. FUNCIONÁRIOS (35 registros)
-- =================================================================

INSERT INTO Funcionario (id_pessoa, matricula, salario, cargo, setor, id_supervisor, status, data_admissao) VALUES
                                                                                                                (1, 'FUNC001', 8000.00, 'Gerente Geral', 'Administração', NULL, 'ATIVO', '2020-01-15'),
                                                                                                                (2, 'FUNC002', 6500.00, 'Gerente de Vendas', 'Vendas', 1, 'ATIVO', '2020-03-10'),
                                                                                                                (3, 'FUNC003', 6000.00, 'Gerente de Estoque', 'Logística', 1, 'ATIVO', '2020-04-20'),
                                                                                                                (4, 'FUNC004', 4500.00, 'Vendedor Sênior', 'Vendas', 2, 'ATIVO', '2021-02-01'),
                                                                                                                (5, 'FUNC005', 4000.00, 'Vendedor Pleno', 'Vendas', 2, 'ATIVO', '2021-06-15'),
                                                                                                                (6, 'FUNC006', 3500.00, 'Vendedor Junior', 'Vendas', 2, 'ATIVO', '2022-01-10'),
                                                                                                                (7, 'FUNC007', 4200.00, 'Estoquista Sênior', 'Logística', 3, 'ATIVO', '2021-03-05'),
                                                                                                                (8, 'FUNC008', 3800.00, 'Estoquista Pleno', 'Logística', 3, 'ATIVO', '2021-08-20'),
                                                                                                                (9, 'FUNC009', 5000.00, 'Analista de Sistemas', 'TI', 1, 'ATIVO', '2020-11-01'),
                                                                                                                (10, 'FUNC010', 4500.00, 'Analista Financeiro', 'Financeiro', 1, 'ATIVO', '2021-05-12'),
                                                                                                                (11, 'FUNC011', 3800.00, 'Vendedor Junior', 'Vendas', 2, 'ATIVO', '2022-03-15'),
                                                                                                                (12, 'FUNC012', 3900.00, 'Vendedor Junior', 'Vendas', 2, 'ATIVO', '2022-05-20'),
                                                                                                                (13, 'FUNC013', 4100.00, 'Vendedor Pleno', 'Vendas', 2, 'ATIVO', '2021-09-10'),
                                                                                                                (14, 'FUNC014', 4200.00, 'Vendedor Pleno', 'Vendas', 2, 'ATIVO', '2021-11-25'),
                                                                                                                (15, 'FUNC015', 3600.00, 'Estoquista Junior', 'Logística', 3, 'ATIVO', '2022-06-01'),
                                                                                                                (16, 'FUNC016', 3700.00, 'Estoquista Junior', 'Logística', 3, 'ATIVO', '2022-07-15'),
                                                                                                                (17, 'FUNC017', 4000.00, 'Estoquista Pleno', 'Logística', 3, 'ATIVO', '2021-12-01'),
                                                                                                                (18, 'FUNC018', 4300.00, 'Supervisor de Estoque', 'Logística', 3, 'ATIVO', '2021-04-10'),
                                                                                                                (19, 'FUNC019', 4800.00, 'Supervisor de Vendas', 'Vendas', 2, 'ATIVO', '2021-01-20'),
                                                                                                                (20, 'FUNC020', 4600.00, 'Analista de RH', 'RH', 1, 'ATIVO', '2021-07-05'),
                                                                                                                (21, 'FUNC021', 3500.00, 'Auxiliar Administrativo', 'Administração', 1, 'ATIVO', '2022-08-10'),
                                                                                                                (22, 'FUNC022', 3600.00, 'Auxiliar Administrativo', 'Administração', 1, 'ATIVO', '2022-09-15'),
                                                                                                                (23, 'FUNC023', 4700.00, 'Contador', 'Financeiro', 1, 'ATIVO', '2020-12-01'),
                                                                                                                (24, 'FUNC024', 4400.00, 'Assistente Financeiro', 'Financeiro', 10, 'ATIVO', '2021-10-20'),
                                                                                                                (25, 'FUNC025', 3400.00, 'Recepcionista', 'Administração', 1, 'ATIVO', '2022-10-01'),
                                                                                                                (26, 'FUNC026', 5200.00, 'Coordenador de TI', 'TI', 9, 'ATIVO', '2020-08-15'),
                                                                                                                (27, 'FUNC027', 4500.00, 'Desenvolvedor', 'TI', 26, 'ATIVO', '2021-03-20'),
                                                                                                                (28, 'FUNC028', 4000.00, 'Suporte Técnico', 'TI', 26, 'ATIVO', '2022-02-10'),
                                                                                                                (29, 'FUNC029', 3800.00, 'Vendedor Junior', 'Vendas', 19, 'ATIVO', '2022-11-05'),
                                                                                                                (30, 'FUNC030', 3900.00, 'Vendedor Junior', 'Vendas', 19, 'ATIVO', '2022-12-01'),
                                                                                                                (31, 'FUNC031', 4100.00, 'Comprador', 'Logística', 3, 'ATIVO', '2021-05-25'),
                                                                                                                (32, 'FUNC032', 3700.00, 'Auxiliar de Estoque', 'Logística', 18, 'ATIVO', '2023-01-10'),
                                                                                                                (33, 'FUNC033', 3600.00, 'Auxiliar de Estoque', 'Logística', 18, 'ATIVO', '2023-02-15'),
                                                                                                                (34, 'FUNC034', 4200.00, 'Analista de Marketing', 'Marketing', 1, 'ATIVO', '2021-08-05'),
                                                                                                                (35, 'FUNC035', 3800.00, 'Assistente de Marketing', 'Marketing', 34, 'ATIVO', '2022-04-20');

-- =================================================================
-- 4. USUÁRIOS DO SISTEMA (35 registros - todos os funcionários)
-- =================================================================

INSERT INTO Usuario (id_pessoa, username, password, role, status) VALUES
                                                                      (1, 'joao.silva', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 'ATIVO'),
                                                                      (2, 'maria.santos', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 'ATIVO'),
                                                                      (3, 'carlos.oliveira', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 'ATIVO'),
                                                                      (4, 'ana.costa', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (5, 'pedro.lima', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (6, 'juliana.ferreira', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (7, 'roberto.alves', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (8, 'fernanda.rodrigues', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (9, 'lucas.martins', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 'ATIVO'),
                                                                      (10, 'patricia.souza', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (11, 'rodrigo.mendes', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (12, 'carla.dias', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (13, 'marcelo.pereira', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (14, 'renata.silva', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (15, 'thiago.costa', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (16, 'vanessa.lima', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (17, 'andre.santos', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (18, 'silvia.rocha', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (19, 'eduardo.alves', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (20, 'monica.ferreira', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (21, 'paulo.henrique', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (22, 'daniela.martins', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (23, 'fabio.rodrigues', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (24, 'cristina.souza', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (25, 'marcio.oliveira', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (26, 'adriana.costa', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 'ATIVO'),
                                                                      (27, 'bruno.silva', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (28, 'tatiana.lima', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (29, 'vitor.pereira', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (30, 'camila.dias', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (31, 'leonardo.mendes', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (32, 'aline.ferreira', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (33, 'rafael.costa', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (34, 'priscila.santos', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO'),
                                                                      (35, 'guilherme.alves', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATIVO');

-- =================================================================
-- 5. CLIENTES (65 registros: 40 PF + 25 PJ)
-- =================================================================

-- Clientes Pessoa Física (IDs 36-75)
INSERT INTO Cliente (id_pessoa, tipo_pessoa, ativo, ranking, total_gasto, data_ultima_compra) VALUES
                                                                                                  (36, 'FISICA', TRUE, 3, 2500.00, '2025-09-15'),
                                                                                                  (37, 'FISICA', TRUE, 5, 8500.00, '2025-09-28'),
                                                                                                  (38, 'FISICA', TRUE, 2, 1200.00, '2025-09-10'),
                                                                                                  (39, 'FISICA', TRUE, 4, 5400.00, '2025-09-25'),
                                                                                                  (40, 'FISICA', TRUE, 3, 3200.00, '2025-09-20'),
                                                                                                  (41, 'FISICA', TRUE, 2, 1800.00, '2025-09-05'),
                                                                                                  (42, 'FISICA', TRUE, 5, 9200.00, '2025-09-29'),
                                                                                                  (43, 'FISICA', TRUE, 3, 4100.00, '2025-09-22'),
                                                                                                  (44, 'FISICA', TRUE, 4, 6300.00, '2025-09-27'),
                                                                                                  (45, 'FISICA', TRUE, 2, 1500.00, '2025-08-30'),
                                                                                                  (46, 'FISICA', TRUE, 1, 500.00, '2025-07-15'),
                                                                                                  (47, 'FISICA', TRUE, 3, 3800.00, '2025-09-18'),
                                                                                                  (48, 'FISICA', TRUE, 2, 2100.00, '2025-09-12'),
                                                                                                  (49, 'FISICA', TRUE, 4, 5900.00, '2025-09-26'),
                                                                                                  (50, 'FISICA', TRUE, 3, 4500.00, '2025-09-23'),
                                                                                                  (51, 'FISICA', TRUE, 5, 10200.00, '2025-09-30'),
                                                                                                  (52, 'FISICA', TRUE, 2, 1900.00, '2025-09-08'),
                                                                                                  (53, 'FISICA', TRUE, 3, 3600.00, '2025-09-19'),
                                                                                                  (54, 'FISICA', TRUE, 4, 7100.00, '2025-09-28'),
                                                                                                  (55, 'FISICA', TRUE, 2, 2300.00, '2025-09-14'),
                                                                                                  (56, 'FISICA', TRUE, 3, 4800.00, '2025-09-24'),
                                                                                                  (57, 'FISICA', TRUE, 1, 800.00, '2025-08-20'),
                                                                                                  (58, 'FISICA', TRUE, 4, 6800.00, '2025-09-27'),
                                                                                                  (59, 'FISICA', TRUE, 3, 3900.00, '2025-09-21'),
                                                                                                  (60, 'FISICA', TRUE, 5, 11500.00, '2025-09-30'),
                                                                                                  (61, 'FISICA', TRUE, 2, 1600.00, '2025-09-06'),
                                                                                                  (62, 'FISICA', TRUE, 3, 4300.00, '2025-09-22'),
                                                                                                  (63, 'FISICA', TRUE, 4, 5700.00, '2025-09-26'),
                                                                                                  (64, 'FISICA', TRUE, 2, 2000.00, '2025-09-11'),
                                                                                                  (65, 'FISICA', TRUE, 3, 3400.00, '2025-09-17'),
                                                                                                  (66, 'FISICA', TRUE, 1, 700.00, '2025-08-25'),
                                                                                                  (67, 'FISICA', TRUE, 5, 9800.00, '2025-09-29'),
                                                                                                  (68, 'FISICA', TRUE, 3, 4600.00, '2025-09-23'),
                                                                                                  (69, 'FISICA', TRUE, 4, 7400.00, '2025-09-28'),
                                                                                                  (70, 'FISICA', TRUE, 2, 2200.00, '2025-09-13'),
                                                                                                  (71, 'FISICA', TRUE, 3, 3700.00, '2025-09-19'),
                                                                                                  (72, 'FISICA', TRUE, 4, 6100.00, '2025-09-25'),
                                                                                                  (73, 'FISICA', TRUE, 2, 1700.00, '2025-09-07'),
                                                                                                  (74, 'FISICA', TRUE, 5, 10500.00, '2025-09-30'),
                                                                                                  (75, 'FISICA', TRUE, 3, 4400.00, '2025-09-22');

-- Clientes Pessoa Jurídica (IDs 76-100)
INSERT INTO Cliente (id_pessoa, tipo_pessoa, ativo, ranking, total_gasto, data_ultima_compra) VALUES
                                                                                                  (76, 'JURIDICA', TRUE, 5, 45000.00, '2025-09-28'),
                                                                                                  (77, 'JURIDICA', TRUE, 4, 32000.00, '2025-09-25'),
                                                                                                  (78, 'JURIDICA', TRUE, 5, 58000.00, '2025-09-29'),
                                                                                                  (79, 'JURIDICA', TRUE, 5, 67000.00, '2025-09-30'),
                                                                                                  (80, 'JURIDICA', TRUE, 4, 28000.00, '2025-09-24'),
                                                                                                  (81, 'JURIDICA', TRUE, 5, 75000.00, '2025-09-30'),
                                                                                                  (82, 'JURIDICA', TRUE, 3, 18000.00, '2025-09-20'),
                                                                                                  (83, 'JURIDICA', TRUE, 4, 35000.00, '2025-09-26'),
                                                                                                  (84, 'JURIDICA', TRUE, 5, 52000.00, '2025-09-29'),
                                                                                                  (85, 'JURIDICA', TRUE, 3, 22000.00, '2025-09-21'),
                                                                                                  (86, 'JURIDICA', TRUE, 5, 63000.00, '2025-09-30'),
                                                                                                  (87, 'JURIDICA', TRUE, 4, 41000.00, '2025-09-27'),
                                                                                                  (88, 'JURIDICA', TRUE, 3, 25000.00, '2025-09-22'),
                                                                                                  (89, 'JURIDICA', TRUE, 4, 38000.00, '2025-09-26'),
                                                                                                  (90, 'JURIDICA', TRUE, 5, 49000.00, '2025-09-28'),
                                                                                                  (91, 'JURIDICA', TRUE, 3, 20000.00, '2025-09-19'),
                                                                                                  (92, 'JURIDICA', TRUE, 4, 33000.00, '2025-09-25'),
                                                                                                  (93, 'JURIDICA', TRUE, 3, 17000.00, '2025-09-18'),
                                                                                                  (94, 'JURIDICA', TRUE, 4, 31000.00, '2025-09-24'),
                                                                                                  (95, 'JURIDICA', TRUE, 5, 55000.00, '2025-09-29'),
                                                                                                  (96, 'JURIDICA', TRUE, 4, 42000.00, '2025-09-27'),
                                                                                                  (97, 'JURIDICA', TRUE, 5, 71000.00, '2025-09-30'),
                                                                                                  (98, 'JURIDICA', TRUE, 5, 82000.00, '2025-09-30'),
                                                                                                  (99, 'JURIDICA', TRUE, 4, 36000.00, '2025-09-26'),
                                                                                                  (100, 'JURIDICA', TRUE, 3, 24000.00, '2025-09-21');

-- =================================================================
-- 6. CLIENTES PESSOA FÍSICA (40 registros)
-- =================================================================

INSERT INTO ClienteFisico (id_pessoa, cpf, data_nascimento) VALUES
                                                                (36, '123.456.789-01', '1985-03-15'),
                                                                (37, '234.567.890-12', '1990-07-22'),
                                                                (38, '345.678.901-23', '1988-11-05'),
                                                                (39, '456.789.012-34', '1992-02-18'),
                                                                (40, '567.890.123-45', '1987-09-30'),
                                                                (41, '678.901.234-56', '1995-04-12'),
                                                                (42, '789.012.345-67', '1983-12-25'),
                                                                (43, '890.123.456-78', '1991-06-08'),
                                                                (44, '901.234.567-89', '1986-10-14'),
                                                                (45, '012.345.678-90', '1993-01-20'),
                                                                (46, '111.222.333-44', '1989-05-17'),
                                                                (47, '222.333.444-55', '1994-08-29'),
                                                                (48, '333.444.555-66', '1984-03-03'),
                                                                (49, '444.555.666-77', '1996-11-11'),
                                                                (50, '555.666.777-88', '1982-07-07'),
                                                                (51, '666.777.888-99', '1991-01-25'),
                                                                (52, '777.888.999-00', '1988-09-12'),
                                                                (53, '888.999.000-11', '1993-04-18'),
                                                                (54, '999.000.111-22', '1985-12-08'),
                                                                (55, '100.111.222-33', '1990-06-30'),
                                                                (56, '211.222.333-44', '1987-03-15'),
                                                                (57, '322.333.444-55', '1994-11-22'),
                                                                (58, '433.444.555-66', '1986-08-05'),
                                                                (59, '544.555.666-77', '1992-02-28'),
                                                                (60, '655.666.777-88', '1984-10-14'),
                                                                (61, '766.777.888-99', '1989-07-07'),
                                                                (62, '877.888.999-00', '1995-01-31'),
                                                                (63, '988.999.000-11', '1983-09-19'),
                                                                (64, '099.000.111-22', '1991-05-25'),
                                                                (65, '200.111.222-33', '1988-12-12'),
                                                                (66, '311.222.333-44', '1996-03-08'),
                                                                (67, '422.333.444-55', '1982-11-15'),
                                                                (68, '533.444.555-66', '1990-07-21'),
                                                                (69, '644.555.666-77', '1985-04-17'),
                                                                (70, '755.666.777-88', '1993-10-09'),
                                                                (71, '866.777.888-99', '1987-06-03'),
                                                                (72, '977.888.999-00', '1994-02-26'),
                                                                (73, '088.999.000-11', '1986-12-20'),
                                                                (74, '199.000.111-22', '1992-08-14'),
                                                                (75, '300.111.222-33', '1984-05-06');

-- =================================================================
-- 7. CLIENTES PESSOA JURÍDICA (25 registros)
-- =================================================================

INSERT INTO ClienteJuridico (id_pessoa, cnpj, razao_social, inscricao_estadual) VALUES
                                                                                    (76, '12.345.678/0001-90', 'Tech Solutions Tecnologia LTDA', '123.456.789.012'),
                                                                                    (77, '23.456.789/0001-01', 'Comercial Alvorada Importação e Exportação LTDA', '234.567.890.123'),
                                                                                    (78, '34.567.890/0001-12', 'Distribuidora São Jorge Comércio LTDA', '345.678.901.234'),
                                                                                    (79, '45.678.901/0001-23', 'Supermercado Bom Preço Varejo LTDA', '456.789.012.345'),
                                                                                    (80, '56.789.012/0001-34', 'Restaurante Sabor & Arte Gastronomia LTDA', '567.890.123.456'),
                                                                                    (81, '67.890.123/0001-45', 'Industrias Reunidas XYZ LTDA', '678.901.234.567'),
                                                                                    (82, '78.901.234/0001-56', 'Papelaria Moderna Comércio LTDA', '789.012.345.678'),
                                                                                    (83, '89.012.345/0001-67', 'Lanchonete Fast Food Alimentação LTDA', '890.123.456.789'),
                                                                                    (84, '90.123.456/0001-78', 'Informática Brasil Tecnologia LTDA', '901.234.567.890'),
                                                                                    (85, '01.234.567/0001-89', 'Padaria Pão Quente Panificação LTDA', '012.345.678.901'),
                                                                                    (86, '12.345.678/0002-90', 'Distribuidora Central Alimentos LTDA', '123.456.789.013'),
                                                                                    (87, '23.456.789/0002-01', 'Farmácia Saúde Total Medicamentos LTDA', '234.567.890.124'),
                                                                                    (88, '34.567.890/0002-12', 'Materiais de Construção Silva LTDA', '345.678.901.235'),
                                                                                    (89, '45.678.901/0002-23', 'Pet Shop Amigo Fiel LTDA', '456.789.012.346'),
                                                                                    (90, '56.789.012/0002-34', 'Academia Corpo Perfeito LTDA', '567.890.123.457'),
                                                                                    (91, '67.890.123/0002-45', 'Ótica Visão Clara LTDA', '678.901.234.568'),
                                                                                    (92, '78.901.234/0002-56', 'Sorveteria Sabor Gelado LTDA', '789.012.345.679'),
                                                                                    (93, '89.012.345/0002-67', 'Floricultura Jardim Encantado LTDA', '890.123.456.780'),
                                                                                    (94, '90.123.456/0002-78', 'Lavanderia Lava Rápido Serviços LTDA', '901.234.567.891'),
                                                                                    (95, '01.234.567/0002-89', 'Escola Infantil Pequenos Gênios LTDA', '012.345.678.902'),
                                                                                    (96, '12.345.678/0003-90', 'Clínica Odontológica Sorriso LTDA', '123.456.789.014'),
                                                                                    (97, '23.456.789/0003-01', 'Advocacia & Consultoria Legal LTDA', '234.567.890.125'),
                                                                                    (98, '34.567.890/0003-12', 'Construtora Edificar Engenharia LTDA', '345.678.901.236'),
                                                                                    (99, '45.678.901/0003-23', 'Agência de Turismo Viajar Bem LTDA', '456.789.012.347'),
                                                                                    (100, '56.789.012/0003-34', 'Gráfica Impressão Perfeita LTDA', '567.890.123.458');

-- =================================================================
-- 8. FORNECEDORES (35 registros)
-- =================================================================

INSERT INTO Fornecedor (nome_fantasia, razao_social, cnpj, email, telefone, endereco_completo, contato_principal, status) VALUES
                                                                                                                              ('Distribuidora Nacional', 'Distribuidora Nacional de Alimentos LTDA', '10.111.222/0001-33', 'comercial@distnacional.com.br', '(11) 4100-1000', 'Av. Industrial, 1000 - São Paulo/SP', 'José Carlos', 'ATIVO'),
                                                                                                                              ('Eletrônicos Prime', 'Prime Eletrônicos Importação LTDA', '20.222.333/0001-44', 'vendas@eletronicosprime.com.br', '(11) 4200-2000', 'Rua Comercial, 500 - São Paulo/SP', 'Ana Beatriz', 'ATIVO'),
                                                                                                                              ('Alimentos Frescos', 'Alimentos Frescos Distribuidora LTDA', '30.333.444/0001-55', 'pedidos@alimentosfrescos.com.br', '(11) 4300-3000', 'Av. dos Alimentos, 2000 - Guarulhos/SP', 'Ricardo Gomes', 'ATIVO'),
                                                                                                                              ('Bebidas & Cia', 'Bebidas e Companhia Distribuidora LTDA', '40.444.555/0001-66', 'comercial@bebidasecia.com.br', '(11) 4400-4000', 'Rua das Bebidas, 300 - Osasco/SP', 'Mariana Souza', 'ATIVO'),
                                                                                                                              ('Higiene Total', 'Higiene Total Produtos de Limpeza LTDA', '50.555.666/0001-77', 'vendas@higienetotal.com.br', '(11) 4500-5000', 'Av. Limpeza, 1500 - São Caetano/SP', 'Fernando Lima', 'ATIVO'),
                                                                                                                              ('Tech Import', 'Tech Import Eletrônicos LTDA', '60.666.777/0001-88', 'importacao@techimport.com.br', '(11) 4600-6000', 'Rua Tecnologia, 800 - São Paulo/SP', 'Patricia Costa', 'ATIVO'),
                                                                                                                              ('Hortifruti Verde', 'Verde Hortifruti Distribuidora LTDA', '70.777.888/0001-99', 'vendas@hortifrutiverde.com.br', '(11) 4700-7000', 'Av. das Frutas, 400 - Guarulhos/SP', 'Marcos Silva', 'ATIVO'),
                                                                                                                              ('Laticínios União', 'União Laticínios LTDA', '80.888.999/0001-00', 'comercial@laticiniosuniao.com.br', '(11) 4800-8000', 'Rua do Leite, 600 - Barueri/SP', 'Juliana Santos', 'ATIVO'),
                                                                                                                              ('Carnes Premium', 'Premium Carnes e Frios LTDA', '90.999.000/0001-11', 'pedidos@carnespremium.com.br', '(11) 4900-9000', 'Av. dos Frigoríficos, 1200 - Osasco/SP', 'Roberto Alves', 'ATIVO'),
                                                                                                                              ('Padaria Indústria', 'Indústria de Pães e Massas LTDA', '01.000.111/0001-22', 'vendas@padariaindustria.com.br', '(11) 5000-1000', 'Rua das Massas, 800 - São Paulo/SP', 'Carla Dias', 'ATIVO'),
                                                                                                                              ('Doces e Guloseimas', 'Doces e Guloseimas Distribuidora LTDA', '11.111.222/0001-33', 'comercial@doceseguloseimas.com.br', '(11) 5100-2000', 'Av. dos Doces, 500 - Guarulhos/SP', 'Paulo Mendes', 'ATIVO'),
                                                                                                                              ('Mercearia Atacado', 'Mercearia Atacado Distribuidora LTDA', '22.222.333/0001-44', 'vendas@merceariaatacado.com.br', '(11) 5200-3000', 'Rua Atacadista, 1500 - São Paulo/SP', 'Fernanda Costa', 'ATIVO'),
                                                                                                                              ('Congelados Express', 'Express Congelados LTDA', '33.333.444/0001-55', 'pedidos@congeladosexpress.com.br', '(11) 5300-4000', 'Av. Refrigerada, 900 - Barueri/SP', 'André Souza', 'ATIVO'),
                                                                                                                              ('Importadora Global', 'Global Importadora LTDA', '44.444.555/0001-66', 'comercial@importadoraglobal.com.br', '(11) 5400-5000', 'Rua Internacional, 700 - São Paulo/SP', 'Marina Oliveira', 'ATIVO'),
                                                                                                                              ('Móveis e Utilidades', 'Móveis e Utilidades LTDA', '55.555.666/0001-77', 'vendas@moveiseutilidades.com.br', '(11) 5500-6000', 'Av. dos Móveis, 1100 - Osasco/SP', 'Ricardo Lima', 'ATIVO'),
                                                                                                                              ('Papelaria Distribuidora', 'Distribuidora de Papelaria LTDA', '66.666.777/0001-88', 'comercial@papelariadist.com.br', '(11) 5600-7000', 'Rua do Papel, 600 - São Paulo/SP', 'Tatiana Rocha', 'ATIVO'),
                                                                                                                              ('Brinquedos Alegria', 'Alegria Brinquedos LTDA', '77.777.888/0001-99', 'vendas@brinquedosalegria.com.br', '(11) 5700-8000', 'Av. da Criança, 400 - Guarulhos/SP', 'Gustavo Santos', 'ATIVO'),
                                                                                                                              ('Perfumaria Essência', 'Essência Perfumaria LTDA', '88.888.999/0001-00', 'comercial@perfumariaessencia.com.br', '(11) 5800-9000', 'Rua dos Perfumes, 300 - São Paulo/SP', 'Beatriz Alves', 'ATIVO'),
                                                                                                                              ('Cosméticos Beleza', 'Beleza Cosméticos LTDA', '99.999.000/0001-11', 'vendas@cosmeticosbeleza.com.br', '(11) 5900-1000', 'Av. da Beleza, 800 - Barueri/SP', 'Daniela Costa', 'ATIVO'),
                                                                                                                              ('Produtos de Limpeza Brilho', 'Brilho Produtos de Limpeza LTDA', '00.000.111/0001-22', 'comercial@brilholimpeza.com.br', '(11) 6000-2000', 'Rua Limpeza Total, 1000 - Osasco/SP', 'Márcio Silva', 'ATIVO'),
                                                                                                                              ('Embalagens Práticas', 'Práticas Embalagens LTDA', '11.222.333/0001-44', 'vendas@embalagenspraticas.com.br', '(11) 6100-3000', 'Av. das Embalagens, 600 - São Paulo/SP', 'Vanessa Lima', 'ATIVO'),
                                                                                                                              ('Ferramentas e Equipamentos', 'Ferramentas e Equipamentos LTDA', '22.333.444/0001-55', 'comercial@ferramentaseequip.com.br', '(11) 6200-4000', 'Rua Industrial, 900 - Guarulhos/SP', 'Leonardo Dias', 'ATIVO'),
                                                                                                                              ('Produtos Veterinários', 'Veterinários Produtos LTDA', '33.444.555/0001-66', 'vendas@produtosvet.com.br', '(11) 6300-5000', 'Av. dos Animais, 500 - São Paulo/SP', 'Priscila Santos', 'ATIVO'),
                                                                                                                              ('Artigos Esportivos', 'Esportivos Artigos LTDA', '44.555.666/0001-77', 'comercial@artigosesportivos.com.br', '(11) 6400-6000', 'Rua do Esporte, 700 - Barueri/SP', 'Vitor Pereira', 'ATIVO'),
                                                                                                                              ('Livros e Revistas', 'Livros e Revistas Distribuidora LTDA', '55.666.777/0001-88', 'vendas@livroserevistas.com.br', '(11) 6500-7000', 'Av. Cultural, 400 - São Paulo/SP', 'Camila Ferreira', 'ATIVO'),
                                                                                                                              ('Informática Tech', 'Tech Informática LTDA', '66.777.888/0001-99', 'comercial@informaticatech.com.br', '(11) 6600-8000', 'Rua da Tecnologia, 1200 - Osasco/SP', 'Rafael Martins', 'ATIVO'),
                                                                                                                              ('Celulares e Acessórios', 'Celulares e Acessórios LTDA', '77.888.999/0001-00', 'vendas@celularesacess.com.br', '(11) 6700-9000', 'Av. Mobile, 800 - São Paulo/SP', 'Aline Costa', 'ATIVO'),
                                                                                                                              ('Áudio e Vídeo Pro', 'Pro Áudio e Vídeo LTDA', '88.999.000/0001-11', 'comercial@audiovideipro.com.br', '(11) 6800-1000', 'Rua Multimídia, 600 - Guarulhos/SP', 'Bruno Oliveira', 'ATIVO'),
                                                                                                                              ('Iluminação LED', 'LED Iluminação LTDA', '99.000.111/0001-22', 'vendas@iluminacaoled.com.br', '(11) 6900-2000', 'Av. das Luzes, 500 - São Paulo/SP', 'Silvia Rocha', 'ATIVO'),
                                                                                                                              ('Climatização e Ventilação', 'Climatização Ventilação LTDA', '00.111.222/0001-33', 'comercial@climatizacao.com.br', '(11) 7000-3000', 'Rua do Ar, 900 - Barueri/SP', 'Eduardo Alves', 'ATIVO'),
                                                                                                                              ('Fogões e Eletrodomésticos', 'Eletrodomésticos LTDA', '11.222.333/0002-44', 'vendas@fogoeseletro.com.br', '(11) 7100-4000', 'Av. dos Eletros, 1100 - Osasco/SP', 'Mônica Santos', 'ATIVO'),
                                                                                                                              ('Jardinagem Verde', 'Verde Jardinagem LTDA', '22.333.444/0002-55', 'comercial@jardinavgemverde.com.br', '(11) 7200-5000', 'Rua do Jardim, 700 - São Paulo/SP', 'Paulo Costa', 'ATIVO'),
                                                                                                                              ('Decoração Casa Bela', 'Casa Bela Decoração LTDA', '33.444.555/0002-66', 'vendas@decoracaocasabela.com.br', '(11) 7300-6000', 'Av. da Decoração, 600 - Guarulhos/SP', 'Adriana Lima', 'ATIVO'),
                                                                                                                              ('Têxtil Lar', 'Lar Têxtil LTDA', '44.555.666/0002-77', 'comercial@textillar.com.br', '(11) 7400-7000', 'Rua dos Tecidos, 800 - São Paulo/SP', 'Guilherme Silva', 'ATIVO'),
                                                                                                                              ('Cama Mesa e Banho', 'Cama Mesa Banho LTDA', '55.666.777/0002-88', 'vendas@camamesabanho.com.br', '(11) 7500-8000', 'Av. do Lar, 1000 - Barueri/SP', 'Cristina Dias', 'ATIVO');

-- =================================================================
-- 9. CATEGORIAS (35 registros)
-- =================================================================

INSERT INTO Categoria (nome, descricao, status) VALUES
                                                    ('Eletrônicos', 'Produtos eletrônicos e tecnologia', 'ATIVA'),
                                                    ('Alimentos', 'Alimentos perecíveis e não perecíveis', 'ATIVA'),
                                                    ('Bebidas', 'Bebidas em geral', 'ATIVA'),
                                                    ('Limpeza', 'Produtos de limpeza e higiene', 'ATIVA'),
                                                    ('Higiene Pessoal', 'Produtos de higiene e cuidados pessoais', 'ATIVA'),
                                                    ('Papelaria', 'Produtos de papelaria e escritório', 'ATIVA'),
                                                    ('Utensílios Domésticos', 'Utensílios para casa', 'ATIVA'),
                                                    ('Brinquedos', 'Brinquedos e jogos', 'ATIVA'),
                                                    ('Informática', 'Produtos de informática e acessórios', 'ATIVA'),
                                                    ('Celulares', 'Celulares e acessórios mobile', 'ATIVA'),
                                                    ('Móveis', 'Móveis e mobiliário', 'ATIVA'),
                                                    ('Decoração', 'Artigos de decoração', 'ATIVA'),
                                                    ('Cama Mesa Banho', 'Produtos para cama, mesa e banho', 'ATIVA'),
                                                    ('Ferramentas', 'Ferramentas e equipamentos', 'ATIVA'),
                                                    ('Jardinagem', 'Produtos para jardinagem', 'ATIVA'),
                                                    ('Pet Shop', 'Produtos para animais de estimação', 'ATIVA'),
                                                    ('Esportes', 'Artigos esportivos', 'ATIVA'),
                                                    ('Livros', 'Livros e publicações', 'ATIVA'),
                                                    ('Áudio e Vídeo', 'Equipamentos de áudio e vídeo', 'ATIVA'),
                                                    ('Iluminação', 'Produtos de iluminação', 'ATIVA'),
                                                    ('Climatização', 'Ar condicionado e ventilação', 'ATIVA'),
                                                    ('Eletrodomésticos', 'Eletrodomésticos em geral', 'ATIVA'),
                                                    ('Perfumaria', 'Perfumes e fragrâncias', 'ATIVA'),
                                                    ('Cosméticos', 'Cosméticos e maquiagem', 'ATIVA'),
                                                    ('Automotivo', 'Produtos automotivos', 'ATIVA'),
                                                    ('Construção', 'Materiais de construção', 'ATIVA'),
                                                    ('Embalagens', 'Embalagens e materiais de empacotamento', 'ATIVA'),
                                                    ('Hortifruti', 'Frutas, verduras e legumes', 'ATIVA'),
                                                    ('Congelados', 'Produtos congelados', 'ATIVA'),
                                                    ('Laticínios', 'Leite e derivados', 'ATIVA'),
                                                    ('Padaria', 'Pães e produtos de padaria', 'ATIVA'),
                                                    ('Doces', 'Doces e guloseimas', 'ATIVA'),
                                                    ('Carnes', 'Carnes e frios', 'ATIVA'),
                                                    ('Mercearia', 'Produtos de mercearia', 'ATIVA'),
                                                    ('Importados', 'Produtos importados', 'ATIVA');

-- =================================================================
-- 10. PRODUTOS (80 registros)
-- =================================================================

INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, localizacao_prateleira, codigo_barras, status) VALUES
-- Eletrônicos (15 produtos)
('Smart TV 50 polegadas', 'Samsung', 'Smart TV LED 50" 4K', 1, 2, 1800.00, 2499.00, 25, 5, 50, 'A1', '7891234567890', 'ATIVO'),
('Notebook Core i5', 'Dell', 'Notebook 8GB RAM, SSD 256GB', 1, 2, 2200.00, 3199.00, 20, 5, 40, 'A2', '7891234567891', 'ATIVO'),
('Smartphone Android', 'Motorola', 'Smartphone 128GB, 6GB RAM', 10, 2, 800.00, 1299.00, 35, 10, 70, 'A3', '7891234567892', 'ATIVO'),
('Fone Bluetooth', 'JBL', 'Fone de ouvido sem fio', 1, 6, 120.00, 199.00, 60, 15, 120, 'A4', '7891234567893', 'ATIVO'),
('Mouse Gamer', 'Logitech', 'Mouse óptico RGB', 9, 6, 80.00, 149.00, 50, 15, 100, 'A5', '7891234567894', 'ATIVO'),
('Teclado Mecânico', 'Razer', 'Teclado mecânico RGB', 9, 26, 300.00, 499.00, 30, 10, 60, 'A6', '7891234567895', 'ATIVO'),
('Webcam HD', 'Logitech', 'Webcam 1080p', 9, 26, 150.00, 249.00, 40, 12, 80, 'A7', '7891234567896', 'ATIVO'),
('Tablet Android', 'Samsung', 'Tablet 10" 64GB', 1, 2, 600.00, 999.00, 25, 8, 50, 'A8', '7891234567897', 'ATIVO'),
('Smartwatch', 'Xiaomi', 'Relógio inteligente', 1, 27, 250.00, 399.00, 45, 15, 90, 'A9', '7891234567898', 'ATIVO'),
('Carregador Wireless', 'Anker', 'Carregador sem fio 15W', 10, 27, 60.00, 99.00, 80, 20, 160, 'A10', '7891234567899', 'ATIVO'),
('Caixa de Som Bluetooth', 'JBL', 'Caixa portátil 20W', 19, 28, 180.00, 299.00, 35, 10, 70, 'A11', '7891234567900', 'ATIVO'),
('Câmera Digital', 'Canon', 'Câmera 24MP', 1, 2, 1200.00, 1899.00, 15, 5, 30, 'A12', '7891234567901', 'ATIVO'),
('Monitor LED 24"', 'LG', 'Monitor Full HD', 1, 6, 500.00, 799.00, 28, 8, 56, 'A13', '7891234567902', 'ATIVO'),
('Impressora Multifuncional', 'Epson', 'Impressora jato de tinta', 9, 26, 400.00, 649.00, 22, 6, 44, 'A14', '7891234567903', 'ATIVO'),
('HD Externo 1TB', 'Seagate', 'HD portátil USB 3.0', 9, 26, 180.00, 289.00, 50, 15, 100, 'A15', '7891234567904', 'ATIVO'),

-- Alimentos (20 produtos)
('Arroz Tipo 1 5kg', 'Tio João', 'Arroz branco tipo 1', 2, 1, 15.00, 24.90, 150, 40, 300, 'B1', '7891234567905', 'ATIVO'),
('Feijão Preto 1kg', 'Camil', 'Feijão preto especial', 2, 1, 6.00, 9.90, 180, 50, 360, 'B2', '7891234567906', 'ATIVO'),
('Macarrão 500g', 'Barilla', 'Macarrão espaguete', 2, 1, 3.50, 6.90, 200, 60, 400, 'B3', '7891234567907', 'ATIVO'),
('Óleo de Soja 900ml', 'Liza', 'Óleo de soja refinado', 2, 3, 4.50, 7.90, 120, 35, 240, 'B4', '7891234567908', 'ATIVO'),
('Açúcar Cristal 1kg', 'União', 'Açúcar cristal', 2, 3, 2.80, 4.90, 140, 40, 280, 'B5', '7891234567909', 'ATIVO'),
('Café 500g', 'Pilão', 'Café torrado e moído', 2, 3, 10.00, 16.90, 90, 25, 180, 'B6', '7891234567910', 'ATIVO'),
('Leite Integral 1L', 'Parmalat', 'Leite UHT integral', 30, 8, 3.20, 5.50, 160, 50, 320, 'B7', '7891234567911', 'ATIVO'),
('Farinha de Trigo 1kg', 'Dona Benta', 'Farinha de trigo especial', 31, 10, 3.00, 5.50, 130, 40, 260, 'B8', '7891234567912', 'ATIVO'),
('Sal Refinado 1kg', 'Cisne', 'Sal refinado iodado', 2, 12, 1.50, 2.90, 170, 50, 340, 'B9', '7891234567913', 'ATIVO'),
('Molho de Tomate 340g', 'Pomarola', 'Molho de tomate tradicional', 2, 12, 2.50, 4.50, 140, 40, 280, 'B10', '7891234567914', 'ATIVO'),
('Biscoito Recheado', 'Oreo', 'Biscoito chocolate 140g', 32, 11, 2.80, 4.90, 200, 60, 400, 'B11', '7891234567915', 'ATIVO'),
('Chocolate em Barra', 'Nestlé', 'Chocolate ao leite 100g', 32, 11, 3.50, 5.90, 180, 50, 360, 'B12', '7891234567916', 'ATIVO'),
('Maionese 500g', 'Hellmann´s', 'Maionese tradicional', 2, 12, 4.00, 6.90, 110, 30, 220, 'B13', '7891234567917', 'ATIVO'),
('Ketchup 400g', 'Heinz', 'Ketchup tradicional', 2, 12, 3.50, 5.90, 120, 35, 240, 'B14', '7891234567918', 'ATIVO'),
('Extrato de Tomate', 'Elefante', 'Extrato de tomate 340g', 2, 12, 2.00, 3.90, 150, 45, 300, 'B15', '7891234567919', 'ATIVO'),
('Sardinha em Lata', 'Gomes da Costa', 'Sardinha em óleo 125g', 2, 12, 4.50, 7.90, 100, 30, 200, 'B16', '7891234567920', 'ATIVO'),
('Atum em Lata', 'Gomes da Costa', 'Atum em óleo 170g', 2, 12, 5.50, 9.90, 90, 25, 180, 'B17', '7891234567921', 'ATIVO'),
('Ervilha em Conserva', 'Quero', 'Ervilha em conserva 200g', 2, 12, 2.20, 3.90, 160, 45, 320, 'B18', '7891234567922', 'ATIVO'),
('Milho em Conserva', 'Quero', 'Milho em conserva 200g', 2, 12, 2.20, 3.90, 160, 45, 320, 'B19', '7891234567923', 'ATIVO'),
('Achocolatado em Pó', 'Nescau', 'Achocolatado 400g', 2, 11, 6.00, 10.90, 130, 35, 260, 'B20', '7891234567924', 'ATIVO'),

-- Bebidas (15 produtos)
('Refrigerante Cola 2L', 'Coca-Cola', 'Refrigerante sabor cola', 3, 4, 4.00, 7.90, 200, 60, 400, 'C1', '7891234567925', 'ATIVO'),
('Suco de Laranja 1L', 'Del Valle', 'Suco néctar de laranja', 3, 4, 3.50, 6.50, 120, 40, 240, 'C2', '7891234567926', 'ATIVO'),
('Água Mineral 1,5L', 'Crystal', 'Água mineral sem gás', 3, 4, 1.20, 2.50, 300, 100, 600, 'C3', '7891234567927', 'ATIVO'),
('Cerveja Lata 350ml', 'Brahma', 'Cerveja pilsen', 3, 4, 2.20, 3.90, 250, 80, 500, 'C4', '7891234567928', 'ATIVO'),
('Refrigerante Guaraná 2L', 'Antarctica', 'Refrigerante guaraná', 3, 4, 3.80, 7.50, 180, 60, 360, 'C5', '7891234567929', 'ATIVO'),
('Suco de Uva 1L', 'Del Valle', 'Suco néctar de uva', 3, 4, 3.50, 6.50, 110, 35, 220, 'C6', '7891234567930', 'ATIVO'),
('Água de Coco 1L', 'Sococo', 'Água de coco natural', 3, 4, 4.00, 7.90, 140, 40, 280, 'C7', '7891234567931', 'ATIVO'),
('Energético 250ml', 'Red Bull', 'Bebida energética', 3, 4, 5.00, 9.90, 160, 50, 320, 'C8', '7891234567932', 'ATIVO'),
('Chá Gelado 1L', 'Lipton', 'Chá gelado limão', 3, 4, 3.00, 5.90, 130, 40, 260, 'C9', '7891234567933', 'ATIVO'),
('Refrigerante Laranja 2L', 'Fanta', 'Refrigerante sabor laranja', 3, 4, 3.80, 7.50, 170, 55, 340, 'C10', '7891234567934', 'ATIVO'),
('Isotônico 500ml', 'Gatorade', 'Bebida isotônica', 3, 4, 3.50, 6.50, 150, 45, 300, 'C11', '7891234567935', 'ATIVO'),
('Vinho Tinto 750ml', 'Concha Y Toro', 'Vinho tinto suave', 3, 14, 18.00, 32.90, 60, 20, 120, 'C12', '7891234567936', 'ATIVO'),
('Suco Integral 1L', 'Maguary', 'Suco integral maçã', 3, 4, 5.50, 9.90, 100, 30, 200, 'C13', '7891234567937', 'ATIVO'),
('Refrigerante Zero 2L', 'Coca-Cola', 'Refrigerante cola zero', 3, 4, 4.20, 8.50, 140, 45, 280, 'C14', '7891234567938', 'ATIVO'),
('Cerveja Long Neck', 'Heineken', 'Cerveja 330ml', 3, 4, 3.50, 6.90, 180, 60, 360, 'C15', '7891234567939', 'ATIVO'),

-- Limpeza (15 produtos)
('Detergente 500ml', 'Ypê', 'Detergente líquido neutro', 4, 5, 1.50, 2.90, 200, 60, 400, 'D1', '7891234567940', 'ATIVO'),
('Sabão em Pó 1kg', 'Omo', 'Sabão em pó multiação', 4, 5, 8.00, 14.90, 120, 35, 240, 'D2', '7891234567941', 'ATIVO'),
('Desinfetante 2L', 'Pinho Sol', 'Desinfetante perfumado', 4, 5, 6.00, 11.90, 100, 30, 200, 'D3', '7891234567942', 'ATIVO'),
('Água Sanitária 1L', 'Qboa', 'Água sanitária alvejante', 4, 5, 2.50, 4.90, 150, 45, 300, 'D4', '7891234567943', 'ATIVO'),
('Esponja de Aço', 'Bombril', 'Esponja de aço pacote c/8', 4, 5, 3.00, 5.50, 180, 55, 360, 'D5', '7891234567944', 'ATIVO'),
('Amaciante 2L', 'Comfort', 'Amaciante concentrado', 4, 5, 7.00, 12.90, 110, 35, 220, 'D6', '7891234567945', 'ATIVO'),
('Limpa Vidros 500ml', 'Veja', 'Limpa vidros spray', 4, 20, 4.50, 8.90, 140, 40, 280, 'D7', '7891234567946', 'ATIVO'),
('Alvejante 1L', 'Omo', 'Alvejante sem cloro', 4, 5, 5.00, 9.50, 130, 40, 260, 'D8', '7891234567947', 'ATIVO'),
('Sabão em Barra 200g', 'Ype', 'Sabão em barra neutro', 4, 5, 2.00, 3.90, 170, 50, 340, 'D9', '7891234567948', 'ATIVO'),
('Limpador Multiuso 500ml', 'Veja', 'Limpador multiuso spray', 4, 20, 4.00, 7.90, 150, 45, 300, 'D10', '7891234567949', 'ATIVO'),
('Sabonete Líquido 250ml', 'Protex', 'Sabonete líquido antibacteriano', 4, 5, 6.00, 10.90, 120, 35, 240, 'D11', '7891234567950', 'ATIVO'),
('Desengordurante 500ml', 'Veja', 'Desengordurante spray', 4, 20, 5.50, 10.50, 100, 30, 200, 'D12', '7891234567951', 'ATIVO'),
('Lã de Aço Fina', 'Assolan', 'Lã de aço fina pacote', 4, 20, 2.50, 4.50, 160, 50, 320, 'D13', '7891234567952', 'ATIVO'),
('Cloro Ativo 1L', 'Candida', 'Cloro ativo concentrado', 4, 5, 3.00, 5.90, 140, 40, 280, 'D14', '7891234567953', 'ATIVO'),
('Sapólio Líquido 300ml', 'Bombril', 'Sapólio cremoso', 4, 5, 3.50, 6.50, 130, 40, 260, 'D15', '7891234567954', 'ATIVO'),

-- Higiene Pessoal (15 produtos)
('Shampoo 400ml', 'Dove', 'Shampoo hidratação', 5, 5, 12.00, 19.90, 80, 25, 160, 'E1', '7891234567955', 'ATIVO'),
('Sabonete 90g', 'Lux', 'Sabonete em barra', 5, 5, 1.80, 3.50, 200, 60, 400, 'E2', '7891234567956', 'ATIVO'),
('Pasta de Dente 90g', 'Colgate', 'Creme dental tripla ação', 5, 5, 4.50, 7.90, 150, 45, 300, 'E3', '7891234567957', 'ATIVO'),
('Papel Higiênico 4 rolos', 'Personal', 'Papel higiênico folha dupla', 5, 5, 6.00, 10.90, 120, 35, 240, 'E4', '7891234567958', 'ATIVO'),
('Condicionador 400ml', 'Dove', 'Condicionador hidratação', 5, 5, 12.00, 19.90, 75, 25, 150, 'E5', '7891234567959', 'ATIVO'),
('Desodorante 150ml', 'Rexona', 'Desodorante aerosol', 5, 19, 8.00, 14.90, 140, 40, 280, 'E6', '7891234567960', 'ATIVO'),
('Escova de Dentes', 'Oral-B', 'Escova dental macia', 5, 5, 5.00, 9.50, 160, 50, 320, 'E7', '7891234567961', 'ATIVO'),
('Fio Dental 50m', 'Oral-B', 'Fio dental encerado', 5, 5, 4.00, 7.90, 130, 40, 260, 'E8', '7891234567962', 'ATIVO'),
('Absorvente 8 unidades', 'Always', 'Absorvente com abas', 5, 5, 3.50, 6.90, 180, 55, 360, 'E9', '7891234567963', 'ATIVO'),
('Sabonete Líquido 250ml', 'Dove', 'Sabonete líquido hidratante', 5, 5, 8.00, 14.90, 110, 35, 220, 'E10', '7891234567964', 'ATIVO'),
('Lâmina de Barbear', 'Gillette', 'Lâmina descartável pacote c/4', 5, 5, 6.00, 11.90, 140, 40, 280, 'E11', '7891234567965', 'ATIVO'),
('Lenço de Papel', 'Kleenex', 'Lenço de papel 50 folhas', 5, 5, 2.50, 4.90, 170, 50, 340, 'E12', '7891234567966', 'ATIVO'),
('Creme Dental Branqueador', 'Colgate', 'Creme dental branqueador 70g', 5, 5, 6.00, 10.90, 120, 35, 240, 'E13', '7891234567967', 'ATIVO'),
('Enxaguante Bucal 500ml', 'Listerine', 'Enxaguante bucal menta', 5, 5, 12.00, 21.90, 90, 25, 180, 'E14', '7891234567968', 'ATIVO'),
('Cotonete 75 unidades', 'Johnson', 'Cotonetes hastes flexíveis', 5, 5, 3.00, 5.90, 150, 45, 300, 'E15', '7891234567969', 'ATIVO');

-- Continuando com mais produtos para completar 80...
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, localizacao_prateleira, codigo_barras, status) VALUES
-- Papelaria (15 produtos)
('Caderno 200 folhas', 'Tilibra', 'Caderno universitário', 6, 16, 12.00, 22.90, 60, 20, 120, 'F1', '7891234567970', 'ATIVO'),
('Caneta Azul', 'BIC', 'Caneta esferográfica', 6, 16, 1.00, 2.50, 300, 100, 600, 'F2', '7891234567971', 'ATIVO'),
('Lápis HB', 'Faber-Castell', 'Lápis grafite', 6, 16, 0.80, 1.90, 250, 80, 500, 'F3', '7891234567972', 'ATIVO'),
('Borracha Branca', 'Faber-Castell', 'Borracha macia', 6, 16, 0.60, 1.50, 280, 90, 560, 'F4', '7891234567973', 'ATIVO'),
('Apontador', 'Faber-Castell', 'Apontador com depósito', 6, 16, 1.50, 3.50, 200, 60, 400, 'F5', '7891234567974', 'ATIVO'),
('Cola Branca 90g', 'Tenaz', 'Cola escolar', 6, 16, 2.00, 4.50, 180, 55, 360, 'F6', '7891234567975', 'ATIVO'),
('Tesoura Escolar', 'Mundial', 'Tesoura ponta redonda', 6, 16, 8.00, 15.90, 90, 30, 180, 'F7', '7891234567976', 'ATIVO'),
('Régua 30cm', 'Waleu', 'Régua plástica transparente', 6, 16, 1.50, 3.90, 160, 50, 320, 'F8', '7891234567977', 'ATIVO'),
('Pasta com Elástico', 'Polibras', 'Pasta plástica A4', 6, 16, 3.00, 6.90, 140, 45, 280, 'F9', '7891234567978', 'ATIVO'),
('Marcador de Texto', 'Stabilo', 'Marca texto amarelo', 6, 16, 2.50, 5.50, 170, 50, 340, 'F10', '7891234567979', 'ATIVO'),
('Corretivo Líquido', 'BIC', 'Corretivo líquido 18ml', 6, 16, 3.50, 7.90, 150, 45, 300, 'F11', '7891234567980', 'ATIVO'),
('Papel Sulfite A4 500 folhas', 'Chamex', 'Papel sulfite 75g', 6, 16, 18.00, 32.90, 80, 25, 160, 'F12', '7891234567981', 'ATIVO'),
('Estojo Escolar', 'Tilibra', 'Estojo duplo', 6, 16, 15.00, 29.90, 70, 20, 140, 'F13', '7891234567982', 'ATIVO'),
('Mochila Escolar', 'Sestini', 'Mochila de costas média', 6, 16, 45.00, 89.90, 50, 15, 100, 'F14', '7891234567983', 'ATIVO'),
('Calculadora Científica', 'Casio', 'Calculadora 240 funções', 6, 26, 35.00, 69.90, 40, 12, 80, 'F15', '7891234567984', 'ATIVO');

-- =================================================================
-- 11. FORNECIMENTO (80+ registros)
-- =================================================================

INSERT INTO Fornece (id_fornecedor, id_produto, quantidade_recebida, valor_de_compra, data_da_compra, numero_nota_fiscal) VALUES
-- Compras de Eletrônicos
(2, 1, 50, 1800.00, '2025-07-15 09:00:00', 'NF-2025-0715-001'),
(2, 2, 40, 2200.00, '2025-07-15 09:00:00', 'NF-2025-0715-001'),
(2, 3, 70, 800.00, '2025-08-10 11:00:00', 'NF-2025-0810-001'),
(6, 4, 120, 120.00, '2025-07-20 10:00:00', 'NF-2025-0720-001'),
(6, 5, 100, 80.00, '2025-07-20 10:00:00', 'NF-2025-0720-001'),
(26, 6, 60, 300.00, '2025-08-05 14:00:00', 'NF-2025-0805-001'),
(26, 7, 80, 150.00, '2025-08-05 14:00:00', 'NF-2025-0805-001'),
(2, 8, 50, 600.00, '2025-08-15 10:30:00', 'NF-2025-0815-001'),
(27, 9, 90, 250.00, '2025-08-18 11:00:00', 'NF-2025-0818-001'),
(27, 10, 160, 60.00, '2025-08-18 11:00:00', 'NF-2025-0818-001'),
(28, 11, 70, 180.00, '2025-08-20 09:30:00', 'NF-2025-0820-001'),
(2, 12, 30, 1200.00, '2025-07-25 15:00:00', 'NF-2025-0725-001'),
(6, 13, 56, 500.00, '2025-08-22 10:00:00', 'NF-2025-0822-001'),
(26, 14, 44, 400.00, '2025-08-25 14:30:00', 'NF-2025-0825-001'),
(26, 15, 100, 180.00, '2025-08-28 11:00:00', 'NF-2025-0828-001'),

-- Compras de Alimentos
(1, 16, 300, 15.00, '2025-08-01 08:00:00', 'NF-2025-0801-001'),
(1, 17, 360, 6.00, '2025-08-01 08:00:00', 'NF-2025-0801-001'),
(1, 18, 400, 3.50, '2025-08-02 09:00:00', 'NF-2025-0802-001'),
(3, 19, 240, 4.50, '2025-08-03 10:00:00', 'NF-2025-0803-001'),
(3, 20, 280, 2.80, '2025-08-03 10:00:00', 'NF-2025-0803-001'),
(3, 21, 180, 10.00, '2025-08-05 08:30:00', 'NF-2025-0805-002'),
(8, 22, 320, 3.20, '2025-08-06 09:00:00', 'NF-2025-0806-001'),
(10, 23, 260, 3.00, '2025-08-08 10:00:00', 'NF-2025-0808-001'),
(12, 24, 340, 1.50, '2025-08-10 08:00:00', 'NF-2025-0810-002'),
(12, 25, 280, 2.50, '2025-08-10 08:00:00', 'NF-2025-0810-002'),
(11, 26, 400, 2.80, '2025-08-12 11:00:00', 'NF-2025-0812-001'),
(11, 27, 360, 3.50, '2025-08-12 11:00:00', 'NF-2025-0812-001'),
(12, 28, 220, 4.00, '2025-08-14 09:30:00', 'NF-2025-0814-001'),
(12, 29, 240, 3.50, '2025-08-14 09:30:00', 'NF-2025-0814-001'),
(12, 30, 300, 2.00, '2025-08-15 10:00:00', 'NF-2025-0815-002'),
(12, 31, 200, 4.50, '2025-08-16 08:30:00', 'NF-2025-0816-001'),
(12, 32, 180, 5.50, '2025-08-16 08:30:00', 'NF-2025-0816-001'),
(12, 33, 320, 2.20, '2025-08-18 09:00:00', 'NF-2025-0818-002'),
(12, 34, 320, 2.20, '2025-08-18 09:00:00', 'NF-2025-0818-002'),
(11, 35, 260, 6.00, '2025-08-20 10:30:00', 'NF-2025-0820-002'),

-- Compras de Bebidas
(4, 36, 400, 4.00, '2025-08-05 13:00:00', 'NF-2025-0805-003'),
(4, 37, 240, 3.50, '2025-08-05 13:00:00', 'NF-2025-0805-003'),
(4, 38, 600, 1.20, '2025-08-06 14:00:00', 'NF-2025-0806-002'),
(4, 39, 500, 2.20, '2025-08-08 13:30:00', 'NF-2025-0808-002'),
(4, 40, 360, 3.80, '2025-08-10 14:00:00', 'NF-2025-0810-003'),
(4, 41, 220, 3.50, '2025-08-12 13:00:00', 'NF-2025-0812-002'),
(4, 42, 280, 4.00, '2025-08-14 14:30:00', 'NF-2025-0814-002'),
(4, 43, 320, 5.00, '2025-08-15 13:00:00', 'NF-2025-0815-003'),
(4, 44, 260, 3.00, '2025-08-16 14:00:00', 'NF-2025-0816-002'),
(4, 45, 340, 3.80, '2025-08-18 13:30:00', 'NF-2025-0818-003'),
(4, 46, 300, 3.50, '2025-08-20 14:00:00', 'NF-2025-0820-003'),
(14, 47, 120, 18.00, '2025-08-22 15:00:00', 'NF-2025-0822-002'),
(4, 48, 200, 5.50, '2025-08-24 13:00:00', 'NF-2025-0824-001'),
(4, 49, 280, 4.20, '2025-08-25 14:30:00', 'NF-2025-0825-002'),
(4, 50, 360, 3.50, '2025-08-26 13:00:00', 'NF-2025-0826-001'),

-- Compras de Limpeza
(5, 51, 400, 1.50, '2025-08-08 10:00:00', 'NF-2025-0808-003'),
(5, 52, 240, 8.00, '2025-08-08 10:00:00', 'NF-2025-0808-003'),
(5, 53, 200, 6.00, '2025-08-10 11:00:00', 'NF-2025-0810-004'),
(5, 54, 300, 2.50, '2025-08-10 11:00:00', 'NF-2025-0810-004'),
(5, 55, 360, 3.00, '2025-08-12 10:30:00', 'NF-2025-0812-003'),
(5, 56, 220, 7.00, '2025-08-14 11:00:00', 'NF-2025-0814-003'),
(20, 57, 280, 4.50, '2025-08-15 10:00:00', 'NF-2025-0815-004'),
(5, 58, 260, 5.00, '2025-08-16 11:30:00', 'NF-2025-0816-003'),
(5, 59, 340, 2.00, '2025-08-18 10:00:00', 'NF-2025-0818-004'),
(20, 60, 300, 4.00, '2025-08-20 11:00:00', 'NF-2025-0820-004'),
(5, 61, 240, 6.00, '2025-08-22 10:30:00', 'NF-2025-0822-003'),
(20, 62, 200, 5.50, '2025-08-24 11:00:00', 'NF-2025-0824-002'),
(20, 63, 320, 2.50, '2025-08-25 10:00:00', 'NF-2025-0825-003'),
(5, 64, 280, 3.00, '2025-08-26 11:30:00', 'NF-2025-0826-002'),
(5, 65, 260, 3.50, '2025-08-28 10:00:00', 'NF-2025-0828-002'),

-- Compras de Higiene Pessoal
(5, 66, 160, 12.00, '2025-08-06 09:00:00', 'NF-2025-0806-003'),
(5, 67, 400, 1.80, '2025-08-06 09:00:00', 'NF-2025-0806-003'),
(5, 68, 300, 4.50, '2025-08-08 10:00:00', 'NF-2025-0808-004'),
(5, 69, 240, 6.00, '2025-08-08 10:00:00', 'NF-2025-0808-004'),
(5, 70, 150, 12.00, '2025-08-10 09:30:00', 'NF-2025-0810-005'),
(19, 71, 280, 8.00, '2025-08-12 10:00:00', 'NF-2025-0812-004'),
(5, 72, 320, 5.00, '2025-08-14 09:00:00', 'NF-2025-0814-004'),
(5, 73, 260, 4.00, '2025-08-15 10:30:00', 'NF-2025-0815-005'),
(5, 74, 360, 3.50, '2025-08-16 09:00:00', 'NF-2025-0816-004'),
(5, 75, 220, 8.00, '2025-08-18 10:00:00', 'NF-2025-0818-005'),
(5, 76, 280, 6.00, '2025-08-20 09:30:00', 'NF-2025-0820-005'),
(5, 77, 340, 2.50, '2025-08-22 10:00:00', 'NF-2025-0822-004'),
(5, 78, 240, 6.00, '2025-08-24 09:00:00', 'NF-2025-0824-003'),
(5, 79, 180, 12.00, '2025-08-25 10:30:00', 'NF-2025-0825-004'),
(5, 80, 300, 3.00, '2025-08-26 09:00:00', 'NF-2025-0826-003'),

-- Compras de Papelaria
(16, 81, 120, 12.00, '2025-08-04 11:00:00', 'NF-2025-0804-001'),
(16, 82, 600, 1.00, '2025-08-04 11:00:00', 'NF-2025-0804-001'),
(16, 83, 500, 0.80, '2025-08-06 10:30:00', 'NF-2025-0806-004'),
(16, 84, 560, 0.60, '2025-08-06 10:30:00', 'NF-2025-0806-004'),
(16, 85, 400, 1.50, '2025-08-08 11:00:00', 'NF-2025-0808-005'),
(16, 86, 360, 2.00, '2025-08-10 10:00:00', 'NF-2025-0810-006'),
(16, 87, 180, 8.00, '2025-08-12 11:30:00', 'NF-2025-0812-005'),
(16, 88, 320, 1.50, '2025-08-14 10:00:00', 'NF-2025-0814-005'),
(16, 89, 280, 3.00, '2025-08-15 11:00:00', 'NF-2025-0815-006'),
(16, 90, 340, 2.50, '2025-08-16 10:30:00', 'NF-2025-0816-005'),
(16, 91, 300, 3.50, '2025-08-18 11:00:00', 'NF-2025-0818-006'),
(16, 92, 160, 18.00, '2025-08-20 10:00:00', 'NF-2025-0820-006'),
(16, 93, 140, 15.00, '2025-08-22 11:30:00', 'NF-2025-0822-005'),
(16, 94, 100, 45.00, '2025-08-24 10:00:00', 'NF-2025-0824-004'),
(26, 95, 80, 35.00, '2025-08-25 11:00:00', 'NF-2025-0825-005');

-- =================================================================
-- 12. PRATELEIRAS (35 registros)
-- =================================================================

INSERT INTO Prateleira (localizacao, id_categoria, capacidade_maxima) VALUES
                                                                          ('Corredor A - Seção 1', 1, 100),  -- Eletrônicos
                                                                          ('Corredor A - Seção 2', 1, 100),
                                                                          ('Corredor A - Seção 3', 9, 150),  -- Informática
                                                                          ('Corredor A - Seção 4', 10, 150), -- Celulares
                                                                          ('Corredor B - Seção 1', 2, 500),  -- Alimentos
                                                                          ('Corredor B - Seção 2', 2, 500),
                                                                          ('Corredor B - Seção 3', 34, 400), -- Mercearia
                                                                          ('Corredor B - Seção 4', 31, 300), -- Padaria
                                                                          ('Corredor C - Seção 1', 3, 400),  -- Bebidas
                                                                          ('Corredor C - Seção 2', 3, 400),
                                                                          ('Corredor D - Seção 1', 4, 300),  -- Limpeza
                                                                          ('Corredor D - Seção 2', 4, 300),
                                                                          ('Corredor E - Seção 1', 5, 200),  -- Higiene Pessoal
                                                                          ('Corredor E - Seção 2', 5, 200),
                                                                          ('Corredor F - Seção 1', 6, 250),  -- Papelaria
                                                                          ('Corredor F - Seção 2', 6, 250),
                                                                          ('Corredor G - Seção 1', 7, 200),  -- Utensílios
                                                                          ('Corredor G - Seção 2', 11, 150), -- Móveis
                                                                          ('Corredor H - Seção 1', 8, 180),  -- Brinquedos
                                                                          ('Corredor H - Seção 2', 12, 180), -- Decoração
                                                                          ('Corredor I - Seção 1', 13, 200), -- Cama Mesa Banho
                                                                          ('Corredor I - Seção 2', 19, 150), -- Áudio Vídeo
                                                                          ('Corredor J - Seção 1', 20, 160), -- Iluminação
                                                                          ('Corredor J - Seção 2', 21, 140), -- Climatização
                                                                          ('Corredor K - Seção 1', 22, 120), -- Eletrodomésticos
                                                                          ('Corredor K - Seção 2', 14, 130), -- Ferramentas
                                                                          ('Corredor L - Seção 1', 15, 180), -- Jardinagem
                                                                          ('Corredor L - Seção 2', 16, 160), -- Pet Shop
                                                                          ('Corredor M - Seção 1', 17, 170), -- Esportes
                                                                          ('Corredor M - Seção 2', 18, 200), -- Livros
                                                                          ('Corredor N - Seção 1', 23, 150), -- Perfumaria
                                                                          ('Corredor N - Seção 2', 24, 150), -- Cosméticos
                                                                          ('Corredor O - Seção 1', 28, 300), -- Hortifruti
                                                                          ('Corredor O - Seção 2', 30, 250), -- Laticínios
                                                                          ('Corredor P - Seção 1', 32, 300); -- Doces

-- =================================================================
-- 13. GUARDADO (100+ registros)
-- =================================================================

INSERT INTO Guardado (id_prateleira, id_produto, quantidade_em_prateleira) VALUES
-- Prateleiras de Eletrônicos
(1, 1, 25),
(1, 2, 20),
(1, 8, 25),
(2, 3, 35),
(2, 12, 15),
(3, 5, 50),
(3, 6, 30),
(3, 14, 22),
(3, 15, 50),
(4, 4, 60),
(4, 9, 45),
(4, 10, 80),
(4, 13, 28),
(2, 11, 35),
(1, 7, 40),

-- Prateleiras de Alimentos
(5, 16, 150),
(5, 17, 180),
(5, 18, 200),
(6, 19, 120),
(6, 20, 140),
(6, 21, 90),
(7, 22, 160),
(7, 24, 170),
(7, 25, 140),
(7, 28, 110),
(8, 23, 130),
(8, 31, 90),
(8, 32, 180),
(5, 29, 120),
(5, 30, 150),
(6, 33, 160),
(6, 34, 160),
(7, 35, 130),
(5, 26, 200),
(5, 27, 180),

-- Prateleiras de Bebidas
(9, 36, 200),
(9, 37, 120),
(9, 38, 300),
(9, 39, 250),
(10, 40, 180),
(10, 41, 110),
(10, 42, 140),
(10, 43, 160),
(9, 44, 130),
(9, 45, 170),
(10, 46, 150),
(10, 47, 60),
(9, 48, 100),
(10, 49, 140),
(10, 50, 180),

-- Prateleiras de Limpeza
(11, 51, 200),
(11, 52, 120),
(11, 53, 100),
(11, 54, 150),
(12, 55, 180),
(12, 56, 110),
(12, 57, 140),
(12, 58, 130),
(11, 59, 170),
(11, 60, 150),
(12, 61, 120),
(12, 62, 100),
(11, 63, 160),
(12, 64, 140),
(12, 65, 130),

-- Prateleiras de Higiene Pessoal
(13, 66, 80),
(13, 67, 200),
(13, 68, 150),
(13, 69, 120),
(14, 70, 75),
(14, 71, 140),
(14, 72, 160),
(14, 73, 130),
(13, 74, 180),
(13, 75, 110),
(14, 76, 140),
(14, 77, 120),
(13, 78, 120),
(14, 79, 90),
(14, 80, 150),

-- Prateleiras de Papelaria
(15, 81, 60),
(15, 82, 300),
(15, 83, 250),
(15, 84, 280),
(16, 85, 200),
(16, 86, 180),
(16, 87, 90),
(16, 88, 160),
(15, 89, 140),
(15, 90, 170),
(16, 91, 150),
(16, 92, 80),
(15, 93, 70),
(16, 94, 50),
(16, 95, 40);

-- =================================================================
-- 14. VENDAS (50 registros)
-- =================================================================

INSERT INTO Venda (id_cliente, id_funcionario, data_venda, valor_total, desconto, valor_final, metodo_pagamento, status) VALUES
-- Vendas de Agosto
(36, 4, '2025-08-15 10:30:00', 850.00, 50.00, 800.00, 'Dinheiro', 'CONCLUIDA'),
(76, 2, '2025-08-18 11:00:00', 15000.00, 500.00, 14500.00, 'Boleto', 'CONCLUIDA'),
(37, 5, '2025-08-20 14:15:00', 2499.00, 100.00, 2399.00, 'PIX', 'CONCLUIDA'),
(79, 2, '2025-08-22 09:00:00', 25000.00, 1000.00, 24000.00, 'Boleto', 'CONCLUIDA'),
(40, 6, '2025-08-25 16:20:00', 450.00, 0.00, 450.00, 'Cartão de Débito', 'CONCLUIDA'),

-- Vendas de Setembro (45 vendas)
(42, 4, '2025-09-01 10:00:00', 3500.00, 200.00, 3300.00, 'Cartão de Crédito', 'CONCLUIDA'),
(38, 5, '2025-09-02 15:30:00', 1200.00, 0.00, 1200.00, 'PIX', 'CONCLUIDA'),
(78, 2, '2025-09-03 09:00:00', 32000.00, 1500.00, 30500.00, 'Boleto', 'CONCLUIDA'),
(44, 4, '2025-09-04 13:45:00', 2800.00, 150.00, 2650.00, 'Cartão de Crédito', 'CONCLUIDA'),
(47, 6, '2025-09-05 11:30:00', 950.00, 0.00, 950.00, 'Dinheiro', 'CONCLUIDA'),
(77, 2, '2025-09-06 10:15:00', 18000.00, 800.00, 17200.00, 'Boleto', 'CONCLUIDA'),
(36, 5, '2025-09-07 14:00:00', 1700.00, 0.00, 1700.00, 'PIX', 'CONCLUIDA'),
(49, 4, '2025-09-08 16:45:00', 3200.00, 100.00, 3100.00, 'Cartão de Crédito', 'CONCLUIDA'),
(43, 6, '2025-09-09 12:00:00', 2100.00, 0.00, 2100.00, 'Cartão de Débito', 'CONCLUIDA'),
(39, 4, '2025-09-10 10:30:00', 3199.00, 0.00, 3199.00, 'Cartão de Crédito', 'CONCLUIDA'),
(51, 5, '2025-09-11 15:00:00', 5200.00, 300.00, 4900.00, 'PIX', 'CONCLUIDA'),
(48, 6, '2025-09-12 11:45:00', 1800.00, 0.00, 1800.00, 'Dinheiro', 'CONCLUIDA'),
(81, 2, '2025-09-13 09:30:00', 42000.00, 2000.00, 40000.00, 'Boleto', 'CONCLUIDA'),
(54, 4, '2025-09-14 14:15:00', 4500.00, 200.00, 4300.00, 'Cartão de Crédito', 'CONCLUIDA'),
(52, 5, '2025-09-15 10:00:00', 1600.00, 100.00, 1500.00, 'PIX', 'CONCLUIDA'),
(82, 2, '2025-09-16 11:00:00', 12000.00, 500.00, 11500.00, 'Boleto', 'CONCLUIDA'),
(56, 6, '2025-09-17 16:30:00', 2800.00, 0.00, 2800.00, 'Cartão de Débito', 'CONCLUIDA'),
(58, 4, '2025-09-18 13:00:00', 4200.00, 150.00, 4050.00, 'Cartão de Crédito', 'CONCLUIDA'),
(84, 2, '2025-09-19 09:00:00', 28000.00, 1200.00, 26800.00, 'Boleto', 'CONCLUIDA'),
(60, 5, '2025-09-20 15:30:00', 6800.00, 400.00, 6400.00, 'PIX', 'CONCLUIDA'),
(62, 6, '2025-09-21 11:15:00', 2500.00, 0.00, 2500.00, 'Dinheiro', 'CONCLUIDA'),
(86, 2, '2025-09-22 10:00:00', 35000.00, 1500.00, 33500.00, 'Boleto', 'CONCLUIDA'),
(50, 4, '2025-09-23 14:45:00', 3800.00, 200.00, 3600.00, 'Cartão de Crédito', 'CONCLUIDA'),
(63, 5, '2025-09-24 12:30:00', 3100.00, 100.00, 3000.00, 'PIX', 'CONCLUIDA'),
(88, 2, '2025-09-25 09:30:00', 22000.00, 1000.00, 21000.00, 'Boleto', 'CONCLUIDA'),
(65, 6, '2025-09-26 16:00:00', 2200.00, 0.00, 2200.00, 'Cartão de Débito', 'CONCLUIDA'),
(67, 4, '2025-09-27 13:30:00', 5500.00, 300.00, 5200.00, 'Cartão de Crédito', 'CONCLUIDA'),
(90, 2, '2025-09-28 10:15:00', 38000.00, 1800.00, 36200.00, 'Boleto', 'CONCLUIDA'),
(69, 5, '2025-09-29 15:00:00', 4800.00, 250.00, 4550.00, 'PIX', 'CONCLUIDA'),
(92, 2, '2025-09-30 09:00:00', 25000.00, 1000.00, 24000.00, 'Boleto', 'CONCLUIDA'),
(41, 6, '2025-09-01 11:45:00', 1500.00, 0.00, 1500.00, 'Dinheiro', 'CONCLUIDA'),
(53, 4, '2025-09-03 14:30:00', 3300.00, 100.00, 3200.00, 'Cartão de Crédito', 'CONCLUIDA'),
(83, 2, '2025-09-04 10:00:00', 30000.00, 1300.00, 28700.00, 'Boleto', 'CONCLUIDA'),
(55, 5, '2025-09-06 13:15:00', 2400.00, 100.00, 2300.00, 'PIX', 'CONCLUIDA'),
(45, 6, '2025-09-08 15:45:00', 1200.00, 0.00, 1200.00, 'Dinheiro', 'CONCLUIDA'),
(85, 2, '2025-09-09 09:30:00', 19000.00, 800.00, 18200.00, 'Boleto', 'CONCLUIDA'),
(57, 4, '2025-09-11 14:00:00', 3600.00, 150.00, 3450.00, 'Cartão de Crédito', 'CONCLUIDA'),
(87, 2, '2025-09-12 10:30:00', 33000.00, 1400.00, 31600.00, 'Boleto', 'CONCLUIDA'),
(59, 5, '2025-09-14 16:15:00', 2900.00, 100.00, 2800.00, 'PIX', 'CONCLUIDA'),
(89, 2, '2025-09-15 09:00:00', 27000.00, 1100.00, 25900.00, 'Boleto', 'CONCLUIDA'),
(61, 6, '2025-09-17 13:45:00', 1400.00, 0.00, 1400.00, 'Cartão de Débito', 'CONCLUIDA'),
(91, 2, '2025-09-18 10:15:00', 16000.00, 700.00, 15300.00, 'Boleto', 'CONCLUIDA'),
(64, 4, '2025-09-20 14:30:00', 2100.00, 100.00, 2000.00, 'Cartão de Crédito', 'CONCLUIDA'),
(93, 2, '2025-09-21 09:45:00', 14000.00, 600.00, 13400.00, 'Boleto', 'CONCLUIDA'),
(66, 5, '2025-09-23 15:30:00', 800.00, 100.00, 700.00, 'PIX', 'CONCLUIDA'),
(95, 2, '2025-09-24 10:00:00', 45000.00, 2000.00, 43000.00, 'Boleto', 'CONCLUIDA'),
(68, 6, '2025-09-26 13:00:00', 3200.00, 100.00, 3100.00, 'Cartão de Débito', 'CONCLUIDA'),
(97, 2, '2025-09-27 09:30:00', 55000.00, 2500.00, 52500.00, 'Boleto', 'CONCLUIDA'),
(70, 4, '2025-09-29 14:15:00', 1900.00, 100.00, 1800.00, 'Cartão de Crédito', 'CONCLUIDA'),
(99, 2, '2025-09-30 10:45:00', 29000.00, 1200.00, 27800.00, 'Boleto', 'CONCLUIDA');

-- =================================================================
-- 15. ITENS DAS VENDAS (200+ registros)
-- =================================================================

INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
-- Venda 1
(1, 16, 5, 24.90, 0.00, 124.50),
(1, 17, 10, 9.90, 0.00, 99.00),
(1, 36, 20, 7.90, 0.00, 158.00),
(1, 51, 15, 2.90, 0.00, 43.50),
(1, 66, 10, 19.90, 0.00, 199.00),
(1, 67, 20, 3.50, 0.00, 70.00),
(1, 68, 15, 7.90, 7.50, 110.85),

-- Venda 2
(2, 1, 5, 2499.00, 100.00, 12395.00),
(2, 3, 10, 1299.00, 50.00, 12890.00),

-- Venda 3
(3, 1, 1, 2499.00, 100.00, 2399.00),

-- Venda 4
(4, 16, 200, 24.90, 200.00, 4780.00),
(4, 17, 250, 9.90, 150.00, 2325.00),
(4, 36, 300, 7.90, 370.00, 2000.00),
(4, 38, 500, 2.50, 250.00, 1000.00),
(4, 51, 400, 2.90, 160.00, 1000.00),
(4, 52, 100, 14.90, 100.00, 1390.00),

-- Venda 5
(5, 18, 20, 6.90, 0.00, 138.00),
(5, 19, 10, 7.90, 0.00, 79.00),
(5, 20, 15, 4.90, 0.00, 73.50),
(5, 21, 10, 16.90, 0.00, 169.00),

-- Venda 6
(6, 2, 1, 3199.00, 150.00, 3049.00),
(6, 4, 1, 199.00, 0.00, 199.00),
(6, 5, 1, 149.00, 0.00, 149.00),

-- Venda 7
(7, 16, 10, 24.90, 0.00, 249.00),
(7, 17, 20, 9.90, 0.00, 198.00),
(7, 18, 30, 6.90, 0.00, 207.00),
(7, 19, 20, 7.90, 0.00, 158.00),
(7, 36, 50, 7.90, 0.00, 395.00),

-- Venda 8
(8, 16, 300, 24.90, 470.00, 7000.00),
(8, 17, 400, 9.90, 460.00, 3500.00),
(8, 18, 500, 6.90, 450.00, 3000.00),
(8, 36, 600, 7.90, 740.00, 4000.00),
(8, 38, 1000, 2.50, 500.00, 2000.00),
(8, 51, 800, 2.90, 320.00, 2000.00),

-- Venda 9
(9, 3, 2, 1299.00, 100.00, 2498.00),
(9, 4, 1, 199.00, 0.00, 199.00),

-- Venda 10
(10, 22, 50, 5.50, 0.00, 275.00),
(10, 36, 30, 7.90, 0.00, 237.00),
(10, 51, 50, 2.90, 0.00, 145.00),
(10, 52, 20, 14.90, 0.00, 298.00),

-- Venda 11
(11, 2, 1, 3199.00, 0.00, 3199.00),

-- Venda 12
(12, 1, 2, 2499.00, 200.00, 4798.00),
(12, 9, 1, 399.00, 0.00, 399.00),

-- Venda 13
(13, 18, 50, 6.90, 0.00, 345.00),
(13, 20, 60, 4.90, 0.00, 294.00),
(13, 36, 100, 7.90, 0.00, 790.00),
(13, 38, 100, 2.50, 0.00, 250.00),

-- Venda 14
(14, 6, 1, 499.00, 0.00, 499.00),
(14, 7, 1, 249.00, 0.00, 249.00),
(14, 15, 2, 289.00, 0.00, 578.00),
(14, 81, 5, 22.90, 50.00, 64.50),
(14, 82, 50, 2.50, 0.00, 125.00),

-- Venda 15
(15, 36, 20, 7.90, 0.00, 158.00),
(15, 37, 15, 6.50, 0.00, 97.50),
(15, 51, 30, 2.90, 0.00, 87.00),
(15, 66, 5, 19.90, 0.00, 99.50),
(15, 68, 15, 7.90, 0.00, 118.50),

-- Vendas 16-50 (produtos variados)
(16, 16, 80, 24.90, 300.00, 1692.00),
(16, 17, 100, 9.90, 200.00, 790.00),
(16, 36, 150, 7.90, 185.00, 1000.00),
(16, 51, 200, 2.90, 80.00, 500.00),

-- Venda 17
(17, 18, 80, 6.90, 0.00, 552.00),
(17, 19, 50, 7.90, 0.00, 395.00),
(17, 20, 70, 4.90, 0.00, 343.00),
(17, 36, 60, 7.90, 0.00, 474.00),
(17, 51, 80, 2.90, 0.00, 232.00),

-- Venda 18
(18, 1, 3, 2499.00, 200.00, 7297.00),
(18, 3, 5, 1299.00, 150.00, 6345.00),
(18, 4, 5, 199.00, 50.00, 945.00),

-- Venda 19
(19, 22, 100, 5.50, 0.00, 550.00),
(19, 36, 80, 7.90, 0.00, 632.00),
(19, 51, 100, 2.90, 0.00, 290.00),
(19, 66, 20, 19.90, 0.00, 398.00),
(19, 81, 10, 22.90, 0.00, 229.00),

-- Venda 20
(20, 2, 2, 3199.00, 300.00, 6098.00),
(20, 9, 1, 399.00, 0.00, 399.00),

-- Venda 21
(21, 16, 50, 24.90, 0.00, 1245.00),
(21, 17, 60, 9.90, 0.00, 594.00),
(21, 36, 40, 7.90, 0.00, 316.00),
(21, 51, 50, 2.90, 0.00, 145.00),

-- Venda 22
(22, 1, 8, 2499.00, 600.00, 19392.00),
(22, 3, 12, 1299.00, 400.00, 15188.00),

-- Venda 23
(23, 18, 100, 6.90, 0.00, 690.00),
(23, 20, 120, 4.90, 0.00, 588.00),
(23, 36, 150, 7.90, 0.00, 1185.00),
(23, 38, 200, 2.50, 0.00, 500.00),
(23, 51, 150, 2.90, 0.00, 435.00),

-- Venda 24
(24, 66, 30, 19.90, 0.00, 597.00),
(24, 67, 100, 3.50, 0.00, 350.00),
(24, 68, 50, 7.90, 0.00, 395.00),
(24, 81, 20, 22.90, 0.00, 458.00),
(24, 82, 100, 2.50, 0.00, 250.00),

-- Venda 25
(25, 16, 150, 24.90, 335.00, 3400.00),
(25, 17, 200, 9.90, 280.00, 1700.00),
(25, 36, 250, 7.90, 475.00, 1500.00),
(25, 38, 300, 2.50, 150.00, 600.00),

-- Venda 26
(26, 36, 50, 7.90, 0.00, 395.00),
(26, 51, 60, 2.90, 0.00, 174.00),
(26, 66, 15, 19.90, 0.00, 298.50),
(26, 67, 50, 3.50, 0.00, 175.00),

-- Venda 27
(27, 1, 2, 2499.00, 200.00, 4798.00),
(27, 8, 1, 999.00, 0.00, 999.00),

-- Venda 28
(28, 16, 200, 24.90, 480.00, 4500.00),
(28, 17, 300, 9.90, 570.00, 2400.00),
(28, 36, 400, 7.90, 960.00, 2200.00),
(28, 38, 500, 2.50, 250.00, 1000.00),
(28, 51, 350, 2.90, 315.00, 700.00),

-- Venda 29
(29, 2, 1, 3199.00, 150.00, 3049.00),
(29, 4, 2, 199.00, 0.00, 398.00),
(29, 5, 2, 149.00, 0.00, 298.00),

-- Venda 30
(30, 16, 180, 24.90, 482.00, 4000.00),
(30, 17, 250, 9.90, 475.00, 2000.00),
(30, 36, 300, 7.90, 370.00, 2000.00),
(30, 38, 400, 2.50, 0.00, 1000.00),

-- Venda 31
(31, 18, 40, 6.90, 0.00, 276.00),
(31, 36, 50, 7.90, 0.00, 395.00),
(31, 51, 60, 2.90, 0.00, 174.00),
(31, 66, 15, 19.90, 0.00, 298.50),
(31, 81, 8, 22.90, 0.00, 183.20),

-- Venda 32
(32, 1, 1, 2499.00, 100.00, 2399.00),
(32, 9, 1, 399.00, 0.00, 399.00),
(32, 10, 5, 99.00, 0.00, 495.00),

-- Venda 33
(33, 16, 250, 24.90, 525.00, 5700.00),
(33, 17, 350, 9.90, 615.00, 2850.00),
(33, 36, 400, 7.90, 760.00, 2400.00),
(33, 38, 500, 2.50, 250.00, 1000.00),

-- Venda 34
(34, 18, 50, 6.90, 0.00, 345.00),
(34, 20, 80, 4.90, 0.00, 392.00),
(34, 36, 100, 7.90, 0.00, 790.00),
(34, 51, 80, 2.90, 0.00, 232.00),
(34, 66, 15, 19.90, 0.00, 298.50),

-- Venda 35
(35, 22, 30, 5.50, 0.00, 165.00),
(35, 36, 40, 7.90, 0.00, 316.00),
(35, 51, 50, 2.90, 0.00, 145.00),
(35, 66, 10, 19.90, 0.00, 199.00),
(35, 81, 12, 22.90, 0.00, 274.80),

-- Venda 36
(36, 16, 120, 24.90, 288.00, 2700.00),
(36, 17, 180, 9.90, 342.00, 1440.00),
(36, 36, 200, 7.90, 380.00, 1200.00),
(36, 38, 250, 2.50, 125.00, 500.00),

-- Venda 37
(37, 1, 1, 2499.00, 100.00, 2399.00),
(37, 6, 1, 499.00, 0.00, 499.00),
(37, 11, 1, 299.00, 0.00, 299.00),
(37, 81, 5, 22.90, 0.00, 114.50),

-- Venda 38
(38, 16, 280, 24.90, 572.00, 6400.00),
(38, 17, 400, 9.90, 760.00, 3200.00),
(38, 36, 450, 7.90, 855.00, 2700.00),
(38, 38, 600, 2.50, 300.00, 1200.00),

-- Venda 39
(39, 18, 70, 6.90, 0.00, 483.00),
(39, 20, 90, 4.90, 0.00, 441.00),
(39, 36, 120, 7.90, 0.00, 948.00),
(39, 51, 100, 2.90, 0.00, 290.00),
(39, 66, 20, 19.90, 0.00, 398.00),

-- Venda 40
(40, 16, 200, 24.90, 480.00, 4500.00),
(40, 17, 280, 9.90, 552.00, 2220.00),
(40, 36, 350, 7.90, 665.00, 2100.00),
(40, 38, 450, 2.50, 225.00, 900.00),

-- Vendas 41-50 continuam com produtos diversos
(41, 22, 40, 5.50, 0.00, 220.00),
(41, 36, 50, 7.90, 0.00, 395.00),
(41, 51, 60, 2.90, 0.00, 174.00),
(41, 66, 15, 19.90, 0.00, 298.50),
(41, 81, 10, 22.90, 0.00, 229.00),

(42, 3, 1, 1299.00, 50.00, 1249.00),
(42, 8, 1, 999.00, 0.00, 999.00),
(42, 9, 1, 399.00, 0.00, 399.00),
(42, 81, 15, 22.90, 0.00, 343.50),

(43, 16, 150, 24.90, 360.00, 3375.00),
(43, 17, 220, 9.90, 418.00, 1760.00),
(43, 36, 250, 7.90, 475.00, 1500.00),
(43, 38, 350, 2.50, 175.00, 700.00),

(44, 18, 60, 6.90, 0.00, 414.00),
(44, 20, 80, 4.90, 0.00, 392.00),
(44, 36, 100, 7.90, 0.00, 790.00),
(44, 51, 90, 2.90, 0.00, 261.00),
(44, 66, 18, 19.90, 0.00, 358.20),

(45, 36, 40, 7.90, 0.00, 316.00),
(45, 51, 50, 2.90, 0.00, 145.00),
(45, 66, 12, 19.90, 0.00, 238.80),
(45, 81, 10, 22.90, 0.00, 229.00),
(45, 82, 100, 2.50, 0.00, 250.00),

(46, 16, 140, 24.90, 348.00, 3138.00),
(46, 17, 200, 9.90, 380.00, 1600.00),
(46, 36, 220, 7.90, 418.00, 1320.00),
(46, 38, 300, 2.50, 150.00, 600.00),

(47, 1, 1, 2499.00, 100.00, 2399.00),
(47, 4, 2, 199.00, 0.00, 398.00),
(47, 81, 15, 22.90, 0.00, 343.50),

(48, 16, 280, 24.90, 572.00, 6400.00),
(48, 17, 400, 9.90, 760.00, 3200.00),
(48, 36, 450, 7.90, 855.00, 2700.00),
(48, 38, 550, 2.50, 275.00, 1100.00),

(49, 18, 50, 6.90, 0.00, 345.00),
(49, 20, 70, 4.90, 0.00, 343.00),
(49, 36, 80, 7.90, 0.00, 632.00),
(49, 51, 75, 2.90, 0.00, 217.50),
(49, 66, 16, 19.90, 0.00, 318.40),

(50, 16, 220, 24.90, 478.00, 5000.00),
(50, 17, 300, 9.90, 570.00, 2400.00),
(50, 36, 350, 7.90, 665.00, 2100.00),
(50, 38, 450, 2.50, 225.00, 900.00);

-- =================================================================
-- 16. MOVIMENTAÇÃO DE ESTOQUE (100+ registros)
-- =================================================================

INSERT INTO MovimentacaoEstoque (id_produto, id_usuario, data_movimentacao, tipo, quantidade, estoque_anterior, estoque_atual, observacao) VALUES
-- Entradas de produtos em Agosto
(1, 3, '2025-07-15 10:00:00', 'ENTRADA', 50, 0, 50, 'Compra inicial de TVs'),
(2, 3, '2025-07-15 10:00:00', 'ENTRADA', 40, 0, 40, 'Compra inicial de Notebooks'),
(3, 3, '2025-08-10 11:00:00', 'ENTRADA', 70, 0, 70, 'Reposição de smartphones'),
(4, 3, '2025-07-20 10:00:00', 'ENTRADA', 120, 0, 120, 'Compra de fones bluetooth'),
(5, 3, '2025-07-20 10:00:00', 'ENTRADA', 100, 0, 100, 'Compra de mouse gamer'),
(6, 3, '2025-08-05 14:00:00', 'ENTRADA', 60, 0, 60, 'Compra de teclados'),
(7, 3, '2025-08-05 14:00:00', 'ENTRADA', 80, 0, 80, 'Compra de webcams'),
(8, 3, '2025-08-15 10:30:00', 'ENTRADA', 50, 0, 50, 'Compra de tablets'),
(9, 3, '2025-08-18 11:00:00', 'ENTRADA', 90, 0, 90, 'Compra de smartwatches'),
(10, 3, '2025-08-18 11:00:00', 'ENTRADA', 160, 0, 160, 'Compra de carregadores wireless'),
(11, 3, '2025-08-20 09:30:00', 'ENTRADA', 70, 0, 70, 'Compra de caixas de som'),
(12, 3, '2025-07-25 15:00:00', 'ENTRADA', 30, 0, 30, 'Compra de câmeras digitais'),
(13, 3, '2025-08-22 10:00:00', 'ENTRADA', 56, 0, 56, 'Compra de monitores'),
(14, 3, '2025-08-25 14:30:00', 'ENTRADA', 44, 0, 44, 'Compra de impressoras'),
(15, 3, '2025-08-28 11:00:00', 'ENTRADA', 100, 0, 100, 'Compra de HDs externos'),

-- Entradas de alimentos
(16, 3, '2025-08-01 08:00:00', 'ENTRADA', 300, 0, 300, 'Compra de arroz'),
(17, 3, '2025-08-01 08:00:00', 'ENTRADA', 360, 0, 360, 'Compra de feijão'),
(18, 3, '2025-08-02 09:00:00', 'ENTRADA', 400, 0, 400, 'Compra de macarrão'),
(19, 3, '2025-08-03 10:00:00', 'ENTRADA', 240, 0, 240, 'Compra de óleo'),
(20, 3, '2025-08-03 10:00:00', 'ENTRADA', 280, 0, 280, 'Compra de açúcar'),
(21, 3, '2025-08-05 08:30:00', 'ENTRADA', 180, 0, 180, 'Compra de café'),
(22, 3, '2025-08-06 09:00:00', 'ENTRADA', 320, 0, 320, 'Compra de leite'),
(23, 3, '2025-08-08 10:00:00', 'ENTRADA', 260, 0, 260, 'Compra de farinha'),
(24, 3, '2025-08-10 08:00:00', 'ENTRADA', 340, 0, 340, 'Compra de sal'),
(25, 3, '2025-08-10 08:00:00', 'ENTRADA', 280, 0, 280, 'Compra de molho tomate'),

-- Entradas de bebidas
(36, 3, '2025-08-05 13:00:00', 'ENTRADA', 400, 0, 400, 'Compra de refrigerante cola'),
(37, 3, '2025-08-05 13:00:00', 'ENTRADA', 240, 0, 240, 'Compra de suco laranja'),
(38, 3, '2025-08-06 14:00:00', 'ENTRADA', 600, 0, 600, 'Compra de água mineral'),
(39, 3, '2025-08-08 13:30:00', 'ENTRADA', 500, 0, 500, 'Compra de cerveja'),

-- Entradas de limpeza
(51, 3, '2025-08-08 10:00:00', 'ENTRADA', 400, 0, 400, 'Compra de detergente'),
(52, 3, '2025-08-08 10:00:00', 'ENTRADA', 240, 0, 240, 'Compra de sabão pó'),
(53, 3, '2025-08-10 11:00:00', 'ENTRADA', 200, 0, 200, 'Compra de desinfetante'),
(54, 3, '2025-08-10 11:00:00', 'ENTRADA', 300, 0, 300, 'Compra de água sanitária'),

-- Entradas de higiene pessoal
(66, 3, '2025-08-06 09:00:00', 'ENTRADA', 160, 0, 160, 'Compra de shampoo'),
(67, 3, '2025-08-06 09:00:00', 'ENTRADA', 400, 0, 400, 'Compra de sabonete'),
(68, 3, '2025-08-08 10:00:00', 'ENTRADA', 300, 0, 300, 'Compra de pasta de dente'),
(69, 3, '2025-08-08 10:00:00', 'ENTRADA', 240, 0, 240, 'Compra de papel higiênico'),

-- Entradas de papelaria
(81, 3, '2025-08-04 11:00:00', 'ENTRADA', 120, 0, 120, 'Compra de cadernos'),
(82, 3, '2025-08-04 11:00:00', 'ENTRADA', 600, 0, 600, 'Compra de canetas'),
(83, 3, '2025-08-06 10:30:00', 'ENTRADA', 500, 0, 500, 'Compra de lápis'),

-- Saídas por vendas (Setembro) - primeiras 30 movimentações
(1, 1, '2025-08-18 11:00:00', 'SAIDA_VENDA', 5, 50, 45, 'Venda ID 2'),
(3, 1, '2025-08-18 11:00:00', 'SAIDA_VENDA', 10, 70, 60, 'Venda ID 2'),

(1, 1, '2025-08-20 14:15:00', 'SAIDA_VENDA', 1, 45, 44, 'Venda ID 3'),

(16, 1, '2025-08-22 09:00:00', 'SAIDA_VENDA', 200, 300, 100, 'Venda ID 4'),
(17, 1, '2025-08-22 09:00:00', 'SAIDA_VENDA', 250, 360, 110, 'Venda ID 4'),
(36, 1, '2025-08-22 09:00:00', 'SAIDA_VENDA', 300, 400, 100, 'Venda ID 4'),
(38, 1, '2025-08-22 09:00:00', 'SAIDA_VENDA', 500, 600, 100, 'Venda ID 4'),

(18, 1, '2025-08-25 16:20:00', 'SAIDA_VENDA', 20, 400, 380, 'Venda ID 5'),
(19, 1, '2025-08-25 16:20:00', 'SAIDA_VENDA', 10, 240, 230, 'Venda ID 5'),

(2, 1, '2025-09-01 10:00:00', 'SAIDA_VENDA', 1, 40, 39, 'Venda ID 6'),
(4, 1, '2025-09-01 10:00:00', 'SAIDA_VENDA', 1, 120, 119, 'Venda ID 6'),

(16, 1, '2025-09-02 15:30:00', 'SAIDA_VENDA', 10, 100, 90, 'Venda ID 7'),
(17, 1, '2025-09-02 15:30:00', 'SAIDA_VENDA', 20, 110, 90, 'Venda ID 7'),

(16, 1, '2025-09-03 09:00:00', 'SAIDA_VENDA', 300, 90, -210, 'Venda ID 8 - Necessita reposição'),
(17, 1, '2025-09-03 09:00:00', 'SAIDA_VENDA', 400, 90, -310, 'Venda ID 8 - Necessita reposição'),

-- Reposição emergencial
(16, 3, '2025-09-04 08:00:00', 'ENTRADA', 250, -210, 40, 'Reposição emergencial'),
(17, 3, '2025-09-04 08:00:00', 'ENTRADA', 400, -310, 90, 'Reposição emergencial'),

(3, 1, '2025-09-04 13:45:00', 'SAIDA_VENDA', 2, 60, 58, 'Venda ID 9'),

(22, 1, '2025-09-05 11:30:00', 'SAIDA_VENDA', 50, 320, 270, 'Venda ID 10'),
(36, 1, '2025-09-05 11:30:00', 'SAIDA_VENDA', 30, 100, 70, 'Venda ID 10'),

(2, 1, '2025-09-10 10:30:00', 'SAIDA_VENDA', 1, 39, 38, 'Venda ID 11'),

(1, 1, '2025-09-11 15:00:00', 'SAIDA_VENDA', 2, 44, 42, 'Venda ID 12'),

(18, 1, '2025-09-12 11:45:00', 'SAIDA_VENDA', 50, 380, 330, 'Venda ID 13'),
(20, 1, '2025-09-12 11:45:00', 'SAIDA_VENDA', 60, 280, 220, 'Venda ID 13'),

-- Ajustes de estoque
(3, 3, '2025-09-15 10:00:00', 'AJUSTE_NEGATIVO', 3, 58, 55, 'Produtos danificados'),
(36, 3, '2025-09-16 08:30:00', 'AJUSTE_POSITIVO', 30, 70, 100, 'Correção inventário'),

-- Mais saídas por vendas
(16, 1, '2025-09-20 10:00:00', 'SAIDA_VENDA', 80, 40, -40, 'Venda ID 16'),
(17, 1, '2025-09-20 10:00:00', 'SAIDA_VENDA', 100, 90, -10, 'Venda ID 16'),

-- Nova reposição
(16, 3, '2025-09-21 09:00:00', 'ENTRADA', 200, -40, 160, 'Reposição estoque'),
(17, 3, '2025-09-21 09:00:00', 'ENTRADA', 200, -10, 190, 'Reposição estoque'),

-- Devoluções
(3, 1, '2025-09-25 15:00:00', 'DEVOLUCAO', 2, 55, 57, 'Devolução cliente - defeito'),
(9, 1, '2025-09-26 10:00:00', 'DEVOLUCAO', 1, 90, 91, 'Devolução cliente - arrependimento'),

-- Continuação de saídas
(18, 1, '2025-09-14 14:15:00', 'SAIDA_VENDA', 80, 330, 250, 'Venda ID 14'),
(19, 1, '2025-09-14 14:15:00', 'SAIDA_VENDA', 50, 230, 180, 'Venda ID 14'),
(36, 1, '2025-09-15 10:00:00', 'SAIDA_VENDA', 20, 100, 80, 'Venda ID 15'),
(51, 1, '2025-09-15 10:00:00', 'SAIDA_VENDA', 30, 400, 370, 'Venda ID 15'),
(66, 1, '2025-09-15 10:00:00', 'SAIDA_VENDA', 5, 160, 155, 'Venda ID 15'),

-- Mais movimentações para completar 100+
(1, 1, '2025-09-18 13:00:00', 'SAIDA_VENDA', 3, 42, 39, 'Venda ID 18'),
(3, 1, '2025-09-18 13:00:00', 'SAIDA_VENDA', 5, 57, 52, 'Venda ID 18'),
(2, 1, '2025-09-20 15:30:00', 'SAIDA_VENDA', 2, 38, 36, 'Venda ID 20'),
(16, 1, '2025-09-22 10:00:00', 'SAIDA_VENDA', 200, 160, -40, 'Venda ID 22'),
(16, 3, '2025-09-23 08:00:00', 'ENTRADA', 150, -40, 110, 'Reposição'),
(17, 1, '2025-09-23 14:45:00', 'SAIDA_VENDA', 100, 190, 90, 'Venda ID 23'),
(18, 1, '2025-09-23 14:45:00', 'SAIDA_VENDA', 100, 250, 150, 'Venda ID 23'),
(66, 1, '2025-09-24 12:30:00', 'SAIDA_VENDA', 30, 155, 125, 'Venda ID 24'),
(67, 1, '2025-09-24 12:30:00', 'SAIDA_VENDA', 100, 400, 300, 'Venda ID 24'),
(68, 1, '2025-09-24 12:30:00', 'SAIDA_VENDA', 50, 300, 250, 'Venda ID 24'),
(16, 1, '2025-09-25 09:30:00', 'SAIDA_VENDA', 150, 110, -40, 'Venda ID 25'),
(16, 3, '2025-09-26 08:00:00', 'ENTRADA', 200, -40, 160, 'Reposição'),
(17, 1, '2025-09-25 09:30:00', 'SAIDA_VENDA', 200, 90, -110, 'Venda ID 25'),
(17, 3, '2025-09-26 08:30:00', 'ENTRADA', 300, -110, 190, 'Reposição'),
(36, 1, '2025-09-26 16:00:00', 'SAIDA_VENDA', 50, 80, 30, 'Venda ID 26'),
(1, 1, '2025-09-27 13:30:00', 'SAIDA_VENDA', 2, 39, 37, 'Venda ID 27'),
(8, 1, '2025-09-27 13:30:00', 'SAIDA_VENDA', 1, 50, 49, 'Venda ID 27'),
(16, 1, '2025-09-28 10:15:00', 'SAIDA_VENDA', 200, 160, -40, 'Venda ID 28'),
(16, 3, '2025-09-29 07:00:00', 'ENTRADA', 200, -40, 160, 'Reposição'),
(2, 1, '2025-09-29 15:00:00', 'SAIDA_VENDA', 1, 36, 35, 'Venda ID 29'),
(16, 1, '2025-09-30 09:00:00', 'SAIDA_VENDA', 180, 160, -20, 'Venda ID 30'),
(16, 3, '2025-09-30 11:00:00', 'ENTRADA', 170, -20, 150, 'Reposição final do mês');

-- =================================================================
-- 17. PROMOÇÕES (35 registros)
-- =================================================================

INSERT INTO Promocao (nome, descricao, percentual_desconto, data_inicio, data_fim, status) VALUES
                                                                                               ('Black Friday 2025', 'Descontos especiais para Black Friday', 30.00, '2025-11-24', '2025-11-30', 'AGENDADA'),
                                                                                               ('Volta às Aulas 2025', 'Promoção de material escolar', 15.00, '2026-01-15', '2026-02-28', 'AGENDADA'),
                                                                                               ('Liquidação de Verão', 'Descontos em produtos selecionados', 20.00, '2025-09-01', '2025-09-30', 'ATIVA'),
                                                                                               ('Natal 2025', 'Promoções de fim de ano', 25.00, '2025-12-01', '2025-12-25', 'AGENDADA'),
                                                                                               ('Aniversário da Loja', 'Comemorando 5 anos', 35.00, '2025-10-15', '2025-10-20', 'AGENDADA'),
                                                                                               ('Dia das Mães 2026', 'Presentes especiais', 18.00, '2026-05-01', '2026-05-10', 'AGENDADA'),
                                                                                               ('Dia dos Pais 2026', 'Presentes para pais', 18.00, '2026-08-01', '2026-08-09', 'AGENDADA'),
                                                                                               ('Páscoa 2026', 'Promoção de chocolates', 22.00, '2026-03-20', '2026-04-05', 'AGENDADA'),
                                                                                               ('Carnaval 2026', 'Bebidas e produtos para festas', 15.00, '2026-02-13', '2026-02-17', 'AGENDADA'),
                                                                                               ('Dia do Consumidor', 'Ofertas especiais', 25.00, '2026-03-15', '2026-03-15', 'AGENDADA'),
                                                                                               ('Ano Novo 2026', 'Queima de estoque', 28.00, '2025-12-26', '2025-12-31', 'AGENDADA'),
                                                                                               ('Inauguração Setor Tech', 'Nova seção de tecnologia', 20.00, '2025-10-01', '2025-10-10', 'AGENDADA'),
                                                                                               ('Semana do Brasil', 'Promoções especiais', 12.00, '2025-09-01', '2025-09-07', 'ATIVA'),
                                                                                               ('Cyber Monday', 'Ofertas online', 35.00, '2025-11-25', '2025-11-25', 'AGENDADA'),
                                                                                               ('Dia das Crianças 2025', 'Brinquedos e jogos', 30.00, '2025-10-12', '2025-10-12', 'AGENDADA'),
                                                                                               ('Promoção Inverno', 'Produtos para o frio', 18.00, '2026-06-20', '2026-07-20', 'AGENDADA'),
                                                                                               ('Queima de Estoque', 'Últimas unidades', 40.00, '2025-11-01', '2025-11-10', 'AGENDADA'),
                                                                                               ('Dia do Cliente', 'Descontos exclusivos', 25.00, '2025-09-15', '2025-09-15', 'ATIVA'),
                                                                                               ('Semana da Tecnologia', 'Eletrônicos em oferta', 22.00, '2025-10-20', '2025-10-27', 'AGENDADA'),
                                                                                               ('Festival de Limpeza', 'Produtos de higiene', 15.00, '2025-10-05', '2025-10-12', 'AGENDADA'),
                                                                                               ('Especial Bebidas', 'Cervejas e refrigerantes', 18.00, '2025-12-15', '2025-12-22', 'AGENDADA'),
                                                                                               ('Super Quarta', 'Promoção semanal', 10.00, '2025-10-01', '2025-10-31', 'AGENDADA'),
                                                                                               ('Feirão de Alimentos', 'Economia na despensa', 12.00, '2025-11-15', '2025-11-22', 'AGENDADA'),
                                                                                               ('Mês da Saúde', 'Produtos de higiene pessoal', 20.00, '2025-10-01', '2025-10-31', 'AGENDADA'),
                                                                                               ('Especial Escritório', 'Papelaria com desconto', 15.00, '2026-02-01', '2026-02-15', 'AGENDADA'),
                                                                                               ('Promoção Relâmpago', 'Apenas hoje', 35.00, '2025-09-20', '2025-09-20', 'INATIVA'),
                                                                                               ('Aniversário São Paulo', 'Celebrando a cidade', 25.00, '2026-01-25', '2026-01-25', 'AGENDADA'),
                                                                                               ('Dia do Trabalhador', 'Ofertas especiais', 18.00, '2026-05-01', '2026-05-01', 'AGENDADA'),
                                                                                               ('Dia da Independência', 'Promoções patrióticas', 19.00, '2025-09-07', '2025-09-07', 'ATIVA'),
                                                                                               ('Halloween', 'Doces e guloseimas', 22.00, '2025-10-31', '2025-10-31', 'AGENDADA'),
                                                                                               ('Semana do Meio Ambiente', 'Produtos sustentáveis', 15.00, '2026-06-01', '2026-06-07', 'AGENDADA'),
                                                                                               ('Festival Junino', 'Comidas típicas', 20.00, '2026-06-20', '2026-06-30', 'AGENDADA'),
                                                                                               ('Promoção Primavera', 'Flores e decoração', 18.00, '2025-09-22', '2025-10-05', 'ATIVA'),
                                                                                               ('Mega Oferta Semanal', 'Produtos selecionados', 25.00, '2025-09-25', '2025-10-01', 'ATIVA'),
                                                                                               ('Especial Pet Shop', 'Produtos para pets', 20.00, '2025-10-04', '2025-10-11', 'AGENDADA');

-- =================================================================
-- 18. PRODUTOS EM PROMOÇÃO (100+ registros)
-- =================================================================

INSERT INTO PromocaoProduto (id_promocao, id_produto) VALUES
-- Liquidação de Verão (ATIVA - id 3)
(3, 1),  -- Smart TV
(3, 2),  -- Notebook
(3, 3),  -- Smartphone
(3, 4),  -- Fone Bluetooth
(3, 5),  -- Mouse
(3, 66), -- Shampoo
(3, 81), -- Caderno

-- Black Friday (AGENDADA - id 1)
(1, 1),  -- Smart TV
(1, 2),  -- Notebook
(1, 3),  -- Smartphone
(1, 4),  -- Fone
(1, 5),  -- Mouse
(1, 6),  -- Teclado
(1, 7),  -- Webcam
(1, 8),  -- Tablet
(1, 9),  -- Smartwatch
(1, 10), -- Carregador
(1, 11), -- Caixa de Som
(1, 12), -- Câmera
(1, 13), -- Monitor
(1, 14), -- Impressora
(1, 15), -- HD Externo

-- Volta às Aulas (AGENDADA - id 2)
(2, 81), -- Caderno
(2, 82), -- Caneta
(2, 83), -- Lápis
(2, 84), -- Borracha
(2, 85), -- Apontador
(2, 86), -- Cola
(2, 87), -- Tesoura
(2, 88), -- Régua
(2, 89), -- Pasta
(2, 90), -- Marcador
(2, 91), -- Corretivo
(2, 92), -- Papel Sulfite
(2, 93), -- Estojo
(2, 94), -- Mochila
(2, 95), -- Calculadora

-- Natal (AGENDADA - id 4)
(4, 1),
(4, 2),
(4, 3),
(4, 8),
(4, 26), -- Biscoito
(4, 27), -- Chocolate

-- Aniversário da Loja (AGENDADA - id 5)
(5, 16), -- Arroz
(5, 17), -- Feijão
(5, 36), -- Refrigerante
(5, 51), -- Detergente
(5, 66), -- Shampoo
(5, 81), -- Caderno

-- Dia das Mães (id 6)
(6, 66), -- Shampoo
(6, 70), -- Condicionador
(6, 75), -- Sabonete Líquido
(6, 4),  -- Fone Bluetooth
(6, 9),  -- Smartwatch

-- Dia dos Pais (id 7)
(7, 2),  -- Notebook
(7, 3),  -- Smartphone
(7, 5),  -- Mouse
(7, 6),  -- Teclado
(7, 76), -- Lâmina de Barbear

-- Páscoa (id 8)
(8, 26), -- Biscoito
(8, 27), -- Chocolate

-- Carnaval (id 9)
(9, 36), -- Refrigerante
(9, 39), -- Cerveja
(9, 40), -- Refrigerante Guaraná
(9, 43), -- Energético
(9, 50), -- Cerveja Long Neck

-- Dia do Consumidor (id 10)
(10, 1),
(10, 2),
(10, 3),
(10, 16),
(10, 17),
(10, 36),
(10, 51),
(10, 66),

-- Ano Novo (id 11)
(11, 36), -- Refrigerante
(11, 39), -- Cerveja
(11, 47), -- Vinho
(11, 50), -- Cerveja Long Neck

-- Inauguração Setor Tech (id 12)
(12, 1),
(12, 2),
(12, 3),
(12, 4),
(12, 5),
(12, 6),
(12, 7),
(12, 8),
(12, 9),
(12, 10),

-- Semana do Brasil (ATIVA - id 13)
(13, 16),
(13, 17),
(13, 18),
(13, 19),
(13, 20),
(13, 21),

-- Cyber Monday (id 14)
(14, 1),
(14, 2),
(14, 3),
(14, 4),
(14, 5),
(14, 6),
(14, 7),
(14, 8),
(14, 9),
(14, 10),
(14, 11),
(14, 12),
(14, 13),
(14, 14),
(14, 15),

-- Dia das Crianças (id 15)
(15, 81), -- Caderno
(15, 82), -- Caneta
(15, 94), -- Mochila

-- Promoção Inverno (id 16)
(16, 21), -- Café
(16, 35), -- Achocolatado

-- Queima de Estoque (id 17)
(17, 1),
(17, 2),
(17, 3),
(17, 16),
(17, 17),
(17, 36),
(17, 51),
(17, 66),
(17, 81),

-- Dia do Cliente (ATIVA - id 18)
(18, 1),
(18, 2),
(18, 3),
(18, 4),
(18, 5),

-- Semana da Tecnologia (id 19)
(19, 1),
(19, 2),
(19, 3),
(19, 4),
(19, 5),
(19, 6),
(19, 7),
(19, 8),
(19, 9),
(19, 10),
(19, 11),
(19, 12),
(19, 13),
(19, 14),
(19, 15),

-- Festival de Limpeza (id 20)
(20, 51),
(20, 52),
(20, 53),
(20, 54),
(20, 55),
(20, 56),
(20, 57),
(20, 58),
(20, 59),
(20, 60),

-- Especial Bebidas (id 21)
(21, 36),
(21, 37),
(21, 39),
(21, 40),
(21, 43),
(21, 47),
(21, 50),

-- Super Quarta (id 22)
(22, 16),
(22, 17),
(22, 36),
(22, 51),

-- Feirão de Alimentos (id 23)
(23, 16),
(23, 17),
(23, 18),
(23, 19),
(23, 20),
(23, 21),
(23, 22),
(23, 23),

-- Mês da Saúde (id 24)
(24, 66),
(24, 67),
(24, 68),
(24, 69),
(24, 70),
(24, 71),
(24, 72),
(24, 73),
(24, 74),
(24, 75),

-- Especial Escritório (id 25)
(25, 81),
(25, 82),
(25, 83),
(25, 84),
(25, 85),
(25, 86),
(25, 87),
(25, 88),
(25, 89),
(25, 90),
(25, 91),
(25, 92),
(25, 93),
(25, 94),
(25, 95),

-- Promoção Relâmpago (id 26)
(26, 1),
(26, 2),
(26, 3),

-- Aniversário São Paulo (id 27)
(27, 1),
(27, 16),
(27, 36),
(27, 51),

-- Dia do Trabalhador (id 28)
(28, 16),
(28, 17),
(28, 36),

-- Dia da Independência (ATIVA - id 29)
(29, 16),
(29, 17),
(29, 36),
(29, 39),

-- Halloween (id 30)
(30, 26),
(30, 27),

-- Semana do Meio Ambiente (id 31)
(31, 51),
(31, 52),
(31, 53),

-- Festival Junino (id 32)
(32, 16),
(32, 17),
(32, 21),

-- Promoção Primavera (ATIVA - id 33)
(33, 66),
(33, 67),
(33, 68),

-- Mega Oferta Semanal (ATIVA - id 34)
(34, 1),
(34, 2),
(34, 16),
(34, 17),
(34, 36),
(34, 51),
(34, 66),

-- Especial Pet Shop (id 35)
(35, 16),
(35, 17);

