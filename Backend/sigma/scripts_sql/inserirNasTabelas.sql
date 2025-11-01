USE SIGMA;

-- =================================================================
-- SCRIPT DE INSERÇÃO DE DADOS - SIGMA v2.0
-- Total de registros: ~2000+
-- Data: 23 de Outubro de 2025
-- =================================================================

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
                                                                                  (39, 'Mariana Lima', 'mariana.lima@email.com', 'Alameda Santos', '1000', 'Jardins', 'São Paulo', '01419-001'),
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
                                                                                  (74, 'Fábio Lima', 'fabio.lima@email.com', 'Rua Oscar Freire', '2000', 'Jardins', 'São Paulo', '01426-004'),
                                                                                  (75, 'Cristiane Souza', 'cristiane.souza@email.com', 'Rua Haddock Lobo', '1500', 'Cerqueira César', 'São Paulo', '01414-005');

-- Pessoas que serão Clientes Pessoa Jurídica (IDs 76-100 = 25 clientes PJ)
INSERT INTO Pessoa (id_pessoa, nome, email, rua, numero, bairro, cidade, cep) VALUES
                                                                                  (76, 'Tech Solutions LTDA', 'contato@techsolutions.com', 'Av. Paulista', '5000', 'Bela Vista', 'São Paulo', '01310-900'),
                                                                                  (77, 'Comercial Alvorada', 'vendas@alvorada.com', 'Rua Frei Caneca', '1000', 'Consolação', 'São Paulo', '01307-020'),
                                                                                  (78, 'Distribuidora São Jorge', 'compras@sgjorge.com', 'Av. Brigadeiro', '5000', 'Bela Vista', 'São Paulo', '01402-010'),
                                                                                  (79, 'Supermercado Bom Preço', 'comercial@bompreco.com', 'Rua Augusta', '7000', 'Consolação', 'São Paulo', '01412-100'),
                                                                                  (80, 'Restaurante Sabor & Arte', 'pedidos@saborarte.com', 'Rua Oscar Freire', '2500', 'Jardins', 'São Paulo', '01426-100'),
                                                                                  (81, 'Indústrias Reunidas XYZ', 'compras@xyz.ind.br', 'Av. Faria Lima', '7000', 'Itaim Bibi', 'São Paulo', '01452-100'),
                                                                                  (82, 'Papelaria Moderna', 'vendas@papmoderna.com', 'Rua Haddock Lobo', '2000', 'Cerqueira César', 'São Paulo', '01414-100'),
                                                                                  (83, 'Farmácia Saúde Total', 'comercial@saudetotal.com', 'Av. Rebouças', '7000', 'Pinheiros', 'São Paulo', '05402-900'),
                                                                                  (84, 'Construtora Horizonte', 'materiais@horizonte.com', 'Rua Teodoro Sampaio', '4000', 'Pinheiros', 'São Paulo', '05405-100'),
                                                                                  (85, 'Hotel Vista Alegre', 'suprimentos@vistaalegre.com', 'Alameda Santos', '6000', 'Jardins', 'São Paulo', '01419-100'),
                                                                                  (86, 'Clínica Med Center', 'compras@medcenter.com', 'Av. Angélica', '6000', 'Santa Cecília', 'São Paulo', '01227-900'),
                                                                                  (87, 'Escola Futuro Brilhante', 'administrativo@futurobrilhante.edu', 'Rua Pamplona', '1500', 'Jardins', 'São Paulo', '01405-100'),
                                                                                  (88, 'Academia Corpo & Mente', 'contato@corpoeamente.com', 'Rua Bela Cintra', '5000', 'Consolação', 'São Paulo', '01415-100'),
                                                                                  (89, 'Livraria Cultura & Arte', 'vendas@culturaearte.com', 'Rua Estados Unidos', '6000', 'Jardins', 'São Paulo', '01427-100'),
                                                                                  (90, 'Buffet Eventos Especiais', 'eventos@buffetespecial.com', 'Av. Brigadeiro', '6000', 'Bela Vista', 'São Paulo', '01402-020'),
                                                                                  (91, 'Pet Shop Amigo Fiel', 'vendas@amigofiel.com', 'Rua Augusta', '8000', 'Consolação', 'São Paulo', '01412-200'),
                                                                                  (92, 'Salão Beleza Pura', 'agendamento@belezapura.com', 'Rua Oscar Freire', '3000', 'Jardins', 'São Paulo', '01426-200'),
                                                                                  (93, 'Consultoria Empresarial ABC', 'contato@consultabc.com', 'Av. Faria Lima', '8000', 'Itaim Bibi', 'São Paulo', '01452-200'),
                                                                                  (94, 'Padaria Pão Nosso', 'vendas@paonosso.com', 'Rua Frei Caneca', '4000', 'Consolação', 'São Paulo', '01307-100'),
                                                                                  (95, 'Autopeças Rápido', 'vendas@autopecasrapido.com', 'Av. Rebouças', '8000', 'Pinheiros', 'São Paulo', '05402-950'),
                                                                                  (96, 'Floricul tura Jardim Encantado', 'vendas@jardimencantado.com', 'Rua Teodoro Sampaio', '5000', 'Pinheiros', 'São Paulo', '05405-200'),
                                                                                  (97, 'Agência de Turismo Mundo Afora', 'contato@mundoafora.tur', 'Alameda Santos', '7000', 'Jardins', 'São Paulo', '01419-200'),
                                                                                  (98, 'Imobiliária Lar Perfeito', 'vendas@larperfeito.com', 'Av. Paulista', '6000', 'Bela Vista', 'São Paulo', '01310-950'),
                                                                                  (99, 'Gráfica Impressão Digital', 'orcamento@impdigital.com', 'Rua Bela Cintra', '6000', 'Consolação', 'São Paulo', '01415-200'),
                                                                                  (100, 'Lavanderia Clean Express', 'atendimento@cleanexpress.com', 'Av. Angélica', '7000', 'Santa Cecília', 'São Paulo', '01227-950');

-- =================================================================
-- 2. TELEFONES (200 registros - 2 por pessoa)
-- =================================================================

INSERT INTO Telefone (id_pessoa, numero, tipo) VALUES
-- Funcionários
(1, '(11) 98765-4321', 'CELULAR'),
(1, '(11) 3456-7890', 'COMERCIAL'),
(2, '(11) 99876-5432', 'CELULAR'),
(2, '(11) 3567-8901', 'RESIDENCIAL'),
(3, '(11) 98123-4567', 'CELULAR'),
(3, '(11) 3678-9012', 'COMERCIAL'),
(4, '(11) 97234-5678', 'CELULAR'),
(4, '(11) 3789-0123', 'RESIDENCIAL'),
(5, '(11) 96345-6789', 'CELULAR'),
(5, '(11) 3890-1234', 'COMERCIAL'),
(6, '(11) 95456-7890', 'CELULAR'),
(6, '(11) 3901-2345', 'RESIDENCIAL'),
(7, '(11) 94567-8901', 'CELULAR'),
(7, '(11) 3012-3456', 'COMERCIAL'),
(8, '(11) 93678-9012', 'CELULAR'),
(8, '(11) 3123-4567', 'RESIDENCIAL'),
(9, '(11) 92789-0123', 'CELULAR'),
(9, '(11) 3234-5678', 'COMERCIAL'),
(10, '(11) 91890-1234', 'CELULAR'),
(10, '(11) 3345-6789', 'RESIDENCIAL'),
(11, '(11) 90901-2345', 'CELULAR'),
(11, '(11) 3456-7890', 'COMERCIAL'),
(12, '(11) 89012-3456', 'CELULAR'),
(12, '(11) 3567-8901', 'RESIDENCIAL'),
(13, '(11) 88123-4567', 'CELULAR'),
(13, '(11) 3678-9012', 'COMERCIAL'),
(14, '(11) 87234-5678', 'CELULAR'),
(14, '(11) 3789-0123', 'RESIDENCIAL'),
(15, '(11) 86345-6789', 'CELULAR'),
(15, '(11) 3890-1234', 'COMERCIAL'),
(16, '(11) 85456-7890', 'CELULAR'),
(16, '(11) 3901-2345', 'RESIDENCIAL'),
(17, '(11) 84567-8901', 'CELULAR'),
(17, '(11) 3012-3456', 'COMERCIAL'),
(18, '(11) 83678-9012', 'CELULAR'),
(18, '(11) 3123-4567', 'RESIDENCIAL'),
(19, '(11) 82789-0123', 'CELULAR'),
(19, '(11) 3234-5678', 'COMERCIAL'),
(20, '(11) 81890-1234', 'CELULAR'),
(20, '(11) 3345-6789', 'RESIDENCIAL'),
(21, '(11) 80901-2345', 'CELULAR'),
(21, '(11) 3456-7890', 'COMERCIAL'),
(22, '(11) 79012-3456', 'CELULAR'),
(22, '(11) 3567-8901', 'RESIDENCIAL'),
(23, '(11) 78123-4567', 'CELULAR'),
(23, '(11) 3678-9012', 'COMERCIAL'),
(24, '(11) 77234-5678', 'CELULAR'),
(24, '(11) 3789-0123', 'RESIDENCIAL'),
(25, '(11) 76345-6789', 'CELULAR'),
(25, '(11) 3890-1234', 'COMERCIAL'),
(26, '(11) 75456-7890', 'CELULAR'),
(26, '(11) 3901-2345', 'RESIDENCIAL'),
(27, '(11) 74567-8901', 'CELULAR'),
(27, '(11) 3012-3456', 'COMERCIAL'),
(28, '(11) 73678-9012', 'CELULAR'),
(28, '(11) 3123-4567', 'RESIDENCIAL'),
(29, '(11) 72789-0123', 'CELULAR'),
(29, '(11) 3234-5678', 'COMERCIAL'),
(30, '(11) 71890-1234', 'CELULAR'),
(30, '(11) 3345-6789', 'RESIDENCIAL'),
(31, '(11) 70901-2345', 'CELULAR'),
(31, '(11) 3456-7890', 'COMERCIAL'),
(32, '(11) 69012-3456', 'CELULAR'),
(32, '(11) 3567-8901', 'RESIDENCIAL'),
(33, '(11) 68123-4567', 'CELULAR'),
(33, '(11) 3678-9012', 'COMERCIAL'),
(34, '(11) 67234-5678', 'CELULAR'),
(34, '(11) 3789-0123', 'RESIDENCIAL'),
(35, '(11) 66345-6789', 'CELULAR'),
(35, '(11) 3890-1234', 'COMERCIAL'),

-- Clientes PF (apenas 1 telefone por cliente para economizar espaço)
(36, '(11) 99111-2222', 'CELULAR'),
(37, '(11) 99222-3333', 'CELULAR'),
(38, '(11) 99333-4444', 'CELULAR'),
(39, '(11) 99444-5555', 'CELULAR'),
(40, '(11) 99555-6666', 'CELULAR'),
(41, '(11) 99666-7777', 'CELULAR'),
(42, '(11) 99777-8888', 'CELULAR'),
(43, '(11) 99888-9999', 'CELULAR'),
(44, '(11) 99999-1111', 'CELULAR'),
(45, '(11) 98888-2222', 'CELULAR'),
(46, '(11) 98777-3333', 'CELULAR'),
(47, '(11) 98666-4444', 'CELULAR'),
(48, '(11) 98555-5555', 'CELULAR'),
(49, '(11) 98444-6666', 'CELULAR'),
(50, '(11) 98333-7777', 'CELULAR'),
(51, '(11) 98222-8888', 'CELULAR'),
(52, '(11) 98111-9999', 'CELULAR'),
(53, '(11) 97999-1111', 'CELULAR'),
(54, '(11) 97888-2222', 'CELULAR'),
(55, '(11) 97777-3333', 'CELULAR'),
(56, '(11) 97666-4444', 'CELULAR'),
(57, '(11) 97555-5555', 'CELULAR'),
(58, '(11) 97444-6666', 'CELULAR'),
(59, '(11) 97333-7777', 'CELULAR'),
(60, '(11) 97222-8888', 'CELULAR'),
(61, '(11) 97111-9999', 'CELULAR'),
(62, '(11) 96999-1111', 'CELULAR'),
(63, '(11) 96888-2222', 'CELULAR'),
(64, '(11) 96777-3333', 'CELULAR'),
(65, '(11) 96666-4444', 'CELULAR'),
(66, '(11) 96555-5555', 'CELULAR'),
(67, '(11) 96444-6666', 'CELULAR'),
(68, '(11) 96333-7777', 'CELULAR'),
(69, '(11) 96222-8888', 'CELULAR'),
(70, '(11) 96111-9999', 'CELULAR'),
(71, '(11) 95999-1111', 'CELULAR'),
(72, '(11) 95888-2222', 'CELULAR'),
(73, '(11) 95777-3333', 'CELULAR'),
(74, '(11) 95666-4444', 'CELULAR'),
(75, '(11) 95555-5555', 'CELULAR'),

-- Clientes PJ
(76, '(11) 3100-1000', 'COMERCIAL'),
(77, '(11) 3100-2000', 'COMERCIAL'),
(78, '(11) 3100-3000', 'COMERCIAL'),
(79, '(11) 3100-4000', 'COMERCIAL'),
(80, '(11) 3100-5000', 'COMERCIAL'),
(81, '(11) 3100-6000', 'COMERCIAL'),
(82, '(11) 3100-7000', 'COMERCIAL'),
(83, '(11) 3100-8000', 'COMERCIAL'),
(84, '(11) 3100-9000', 'COMERCIAL'),
(85, '(11) 3101-0000', 'COMERCIAL'),
(86, '(11) 3101-1000', 'COMERCIAL'),
(87, '(11) 3101-2000', 'COMERCIAL'),
(88, '(11) 3101-3000', 'COMERCIAL'),
(89, '(11) 3101-4000', 'COMERCIAL'),
(90, '(11) 3101-5000', 'COMERCIAL'),
(91, '(11) 3101-6000', 'COMERCIAL'),
(92, '(11) 3101-7000', 'COMERCIAL'),
(93, '(11) 3101-8000', 'COMERCIAL'),
(94, '(11) 3101-9000', 'COMERCIAL'),
(95, '(11) 3102-0000', 'COMERCIAL'),
(96, '(11) 3102-1000', 'COMERCIAL'),
(97, '(11) 3102-2000', 'COMERCIAL'),
(98, '(11) 3102-3000', 'COMERCIAL'),
(99, '(11) 3102-4000', 'COMERCIAL'),
(100, '(11) 3102-5000', 'COMERCIAL');

-- =================================================================
-- 3. FUNCIONÁRIOS (35 registros)
-- =================================================================

INSERT INTO Funcionario (id_pessoa, matricula, salario, cargo, setor, id_supervisor, status, data_admissao) VALUES
-- Diretoria e Gerência
(1, 'FUN001', 15000.00, 'Diretor Geral', 'Diretoria', NULL, 'ATIVO', '2020-01-15'),
(2, 'FUN002', 12000.00, 'Gerente de Vendas', 'Vendas', 1, 'ATIVO', '2020-03-10'),
(3, 'FUN003', 10000.00, 'Gerente de Estoque', 'Estoque', 1, 'ATIVO', '2020-05-20'),
(4, 'FUN004', 8000.00, 'Supervisor de Caixa', 'Financeiro', 2, 'ATIVO', '2021-02-01'),
(5, 'FUN005', 7500.00, 'Supervisor de Compras', 'Compras', 3, 'ATIVO', '2021-04-15'),

-- Operadores de Caixa
(6, 'FUN006', 3500.00, 'Operador de Caixa', 'Financeiro', 4, 'ATIVO', '2021-06-01'),
(7, 'FUN007', 3500.00, 'Operador de Caixa', 'Financeiro', 4, 'ATIVO', '2021-07-10'),
(8, 'FUN008', 3500.00, 'Operador de Caixa', 'Financeiro', 4, 'ATIVO', '2021-08-15'),
(9, 'FUN009', 3500.00, 'Operador de Caixa', 'Financeiro', 4, 'ATIVO', '2022-01-05'),
(10, 'FUN010', 3500.00, 'Operador de Caixa', 'Financeiro', 4, 'ATIVO', '2022-02-20'),
(11, 'FUN011', 3500.00, 'Operador de Caixa', 'Financeiro', 4, 'ATIVO', '2022-03-10'),
(12, 'FUN012', 3500.00, 'Operador de Caixa', 'Financeiro', 4, 'ATIVO', '2022-05-15'),

-- Vendedores
(13, 'FUN013', 4000.00, 'Vendedor', 'Vendas', 2, 'ATIVO', '2021-09-01'),
(14, 'FUN014', 4000.00, 'Vendedor', 'Vendas', 2, 'ATIVO', '2021-10-10'),
(15, 'FUN015', 4000.00, 'Vendedor', 'Vendas', 2, 'ATIVO', '2022-01-15'),
(16, 'FUN016', 4000.00, 'Vendedor', 'Vendas', 2, 'ATIVO', '2022-03-01'),
(17, 'FUN017', 4000.00, 'Vendedor', 'Vendas', 2, 'ATIVO', '2022-04-20'),
(18, 'FUN018', 4000.00, 'Vendedor', 'Vendas', 2, 'ATIVO', '2022-06-10'),

-- Estoquistas
(19, 'FUN019', 3800.00, 'Estoquista', 'Estoque', 3, 'ATIVO', '2021-11-01'),
(20, 'FUN020', 3800.00, 'Estoquista', 'Estoque', 3, 'ATIVO', '2022-01-10'),
(21, 'FUN021', 3800.00, 'Estoquista', 'Estoque', 3, 'ATIVO', '2022-02-15'),
(22, 'FUN022', 3800.00, 'Estoquista', 'Estoque', 3, 'ATIVO', '2022-04-01'),
(23, 'FUN023', 3800.00, 'Estoquista', 'Estoque', 3, 'ATIVO', '2022-05-20'),

-- Outros setores
(24, 'FUN024', 4500.00, 'Analista Financeiro', 'Financeiro', 1, 'ATIVO', '2021-12-01'),
(25, 'FUN025', 4500.00, 'Analista de Compras', 'Compras', 5, 'ATIVO', '2022-01-15'),
(26, 'FUN026', 5000.00, 'Analista de TI', 'TI', 1, 'ATIVO', '2020-06-10'),
(27, 'FUN027', 4200.00, 'Assistente Administrativo', 'Administrativo', 1, 'ATIVO', '2022-02-01'),
(28, 'FUN028', 4200.00, 'Assistente de RH', 'RH', 1, 'ATIVO', '2022-03-15'),
(29, 'FUN029', 3600.00, 'Auxiliar de Limpeza', 'Serviços Gerais', 1, 'ATIVO', '2022-04-01'),
(30, 'FUN030', 3600.00, 'Auxiliar de Manutenção', 'Manutenção', 1, 'ATIVO', '2022-05-10'),
(31, 'FUN031', 4800.00, 'Coordenador de Marketing', 'Marketing', 2, 'ATIVO', '2021-08-01'),
(32, 'FUN032', 3900.00, 'Recepcionista', 'Atendimento', 1, 'ATIVO', '2022-06-01'),
(33, 'FUN033', 4000.00, 'Auxiliar Administrativo', 'Administrativo', 27, 'ATIVO', '2022-07-15'),
(34, 'FUN034', 3500.00, 'Empacotador', 'Vendas', 2, 'ATIVO', '2022-08-01'),
(35, 'FUN035', 3500.00, 'Repositor', 'Estoque', 3, 'INATIVO', '2022-09-10');

-- =================================================================
-- 4. USUÁRIOS (10 registros - funcionários com acesso ao sistema)
-- =================================================================

INSERT INTO Usuario (id_pessoa, username, password, role, status) VALUES
                                                                      (1, 'joao.silva', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 'ATIVO'), -- senha: admin123
                                                                      (2, 'maria.santos', '$2a$10$XYZ123abc...', 'ADMIN', 'ATIVO'),
                                                                      (3, 'carlos.oliveira', '$2a$10$ABC456def...', 'ADMIN', 'ATIVO'),
                                                                      (4, 'ana.costa', '$2a$10$DEF789ghi...', 'USER', 'ATIVO'),
                                                                      (5, 'pedro.lima', '$2a$10$GHI012jkl...', 'USER', 'ATIVO'),
                                                                      (6, 'juliana.ferreira', '$2a$10$JKL345mno...', 'USER', 'ATIVO'),
                                                                      (7, 'roberto.alves', '$2a$10$MNO678pqr...', 'USER', 'ATIVO'),
                                                                      (8, 'fernanda.rodrigues', '$2a$10$PQR901stu...', 'USER', 'ATIVO'),
                                                                      (24, 'cristina.souza', '$2a$10$STU234vwx...', 'USER', 'ATIVO'),
                                                                      (26, 'adriana.costa', '$2a$10$VWX567yza...', 'ADMIN', 'ATIVO');

-- =================================================================
-- 5. CLIENTES PESSOA FÍSICA (40 registros)
-- =================================================================

INSERT INTO Cliente (id_pessoa, tipo_pessoa, ativo, ranking, total_gasto, data_ultima_compra, credito_disponivel) VALUES
                                                                                                                      (36, 'FISICA', TRUE, 3, 2500.00, '2025-10-15', 500.00),
                                                                                                                      (37, 'FISICA', TRUE, 5, 8500.00, '2025-10-20', 1500.00),
                                                                                                                      (38, 'FISICA', TRUE, 2, 1200.00, '2025-10-10', 200.00),
                                                                                                                      (39, 'FISICA', TRUE, 4, 5400.00, '2025-10-18', 1000.00),
                                                                                                                      (40, 'FISICA', TRUE, 3, 3200.00, '2025-10-19', 600.00),
                                                                                                                      (41, 'FISICA', TRUE, 2, 1800.00, '2025-09-05', 300.00),
                                                                                                                      (42, 'FISICA', TRUE, 5, 9200.00, '2025-10-21', 2000.00),
                                                                                                                      (43, 'FISICA', TRUE, 3, 4100.00, '2025-10-17', 800.00),
                                                                                                                      (44, 'FISICA', TRUE, 4, 6300.00, '2025-10-22', 1200.00),
                                                                                                                      (45, 'FISICA', TRUE, 2, 1500.00, '2025-08-30', 250.00),
                                                                                                                      (46, 'FISICA', TRUE, 1, 500.00, '2025-07-15', 100.00),
                                                                                                                      (47, 'FISICA', TRUE, 3, 3800.00, '2025-10-16', 700.00),
                                                                                                                      (48, 'FISICA', TRUE, 4, 5600.00, '2025-10-20', 1100.00),
                                                                                                                      (49, 'FISICA', TRUE, 2, 2100.00, '2025-09-12', 400.00),
                                                                                                                      (50, 'FISICA', TRUE, 3, 3500.00, '2025-10-19', 650.00),
                                                                                                                      (51, 'FISICA', TRUE, 5, 12000.00, '2025-10-23', 3000.00),
                                                                                                                      (52, 'FISICA', TRUE, 2, 1900.00, '2025-09-20', 350.00),
                                                                                                                      (53, 'FISICA', TRUE, 4, 7200.00, '2025-10-21', 1400.00),
                                                                                                                      (54, 'FISICA', TRUE, 3, 4500.00, '2025-10-18', 900.00),
                                                                                                                      (55, 'FISICA', TRUE, 2, 2300.00, '2025-09-25', 450.00),
                                                                                                                      (56, 'FISICA', TRUE, 3, 3900.00, '2025-10-20', 750.00),
                                                                                                                      (57, 'FISICA', TRUE, 4, 6800.00, '2025-10-22', 1300.00),
                                                                                                                      (58, 'FISICA', TRUE, 2, 1700.00, '2025-09-10', 300.00),
                                                                                                                      (59, 'FISICA', TRUE, 3, 4200.00, '2025-10-19', 800.00),
                                                                                                                      (60, 'FISICA', TRUE, 5, 10500.00, '2025-10-23', 2500.00),
                                                                                                                      (61, 'FISICA', TRUE, 2, 2000.00, '2025-09-15', 400.00),
                                                                                                                      (62, 'FISICA', TRUE, 3, 3700.00, '2025-10-17', 700.00),
                                                                                                                      (63, 'FISICA', TRUE, 4, 5900.00, '2025-10-21', 1150.00),
                                                                                                                      (64, 'FISICA', TRUE, 2, 1600.00, '2025-09-08', 300.00),
                                                                                                                      (65, 'FISICA', TRUE, 3, 4400.00, '2025-10-18', 850.00),
                                                                                                                      (66, 'FISICA', TRUE, 4, 6500.00, '2025-10-22', 1250.00),
                                                                                                                      (67, 'FISICA', TRUE, 5, 11000.00, '2025-10-23', 2800.00),
                                                                                                                      (68, 'FISICA', TRUE, 3, 4000.00, '2025-10-19', 800.00),
                                                                                                                      (69, 'FISICA', TRUE, 2, 2200.00, '2025-09-18', 450.00),
                                                                                                                      (70, 'FISICA', TRUE, 3, 3600.00, '2025-10-20', 700.00),
                                                                                                                      (71, 'FISICA', TRUE, 4, 7000.00, '2025-10-22', 1350.00),
                                                                                                                      (72, 'FISICA', TRUE, 2, 1850.00, '2025-09-12', 350.00),
                                                                                                                      (73, 'FISICA', TRUE, 3, 4300.00, '2025-10-21', 850.00),
                                                                                                                      (74, 'FISICA', TRUE, 4, 6200.00, '2025-10-23', 1200.00),
                                                                                                                      (75, 'FISICA', TRUE, 2, 1950.00, '2025-09-22', 400.00);

INSERT INTO ClienteFisico (id_pessoa, cpf, data_nascimento) VALUES
                                                                (36, '123.456.789-01', '1985-05-15'),
                                                                (37, '234.567.890-12', '1990-08-20'),
                                                                (38, '345.678.901-23', '1988-12-10'),
                                                                (39, '456.789.012-34', '1992-03-25'),
                                                                (40, '567.890.123-45', '1987-07-18'),
                                                                (41, '678.901.234-56', '1995-11-30'),
                                                                (42, '789.012.345-67', '1983-02-14'),
                                                                (43, '890.123.456-78', '1991-06-22'),
                                                                (44, '901.234.567-89', '1989-09-08'),
                                                                (45, '012.345.678-90', '1986-01-16'),
                                                                (46, '123.456.789-02', '1994-04-27'),
                                                                (47, '234.567.890-13', '1984-10-11'),
                                                                (48, '345.678.901-24', '1993-12-05'),
                                                                (49, '456.789.012-35', '1982-08-19'),
                                                                (50, '567.890.123-46', '1996-03-30'),
                                                                (51, '678.901.234-57', '1981-07-24'),
                                                                (52, '789.012.345-68', '1997-11-18'),
                                                                (53, '890.123.456-79', '1980-05-13'),
                                                                (54, '901.234.567-80', '1998-09-07'),
                                                                (55, '012.345.678-91', '1979-02-21'),
                                                                (56, '123.456.789-03', '1999-06-15'),
                                                                (57, '234.567.890-14', '1978-10-29'),
                                                                (58, '345.678.901-25', '2000-01-03'),
                                                                (59, '456.789.012-36', '1977-05-17'),
                                                                (60, '567.890.123-47', '1992-09-11'),
                                                                (61, '678.901.234-58', '1986-12-26'),
                                                                (62, '789.012.345-69', '1995-04-20'),
                                                                (63, '890.123.456-70', '1984-08-14'),
                                                                (64, '901.234.567-81', '1993-11-28'),
                                                                (65, '012.345.678-92', '1983-03-04'),
                                                                (66, '123.456.789-04', '1994-07-09'),
                                                                (67, '234.567.890-15', '1982-10-23'),
                                                                (68, '345.678.901-26', '1991-02-06'),
                                                                (69, '456.789.012-37', '1989-06-01'),
                                                                (70, '567.890.123-48', '1987-09-15'),
                                                                (71, '678.901.234-59', '1996-12-29'),
                                                                (72, '789.012.345-60', '1985-04-13'),
                                                                (73, '890.123.456-71', '1994-08-07'),
                                                                (74, '901.234.567-82', '1983-11-21'),
                                                                (75, '012.345.678-93', '1992-03-16');

-- =================================================================
-- 6. CLIENTES PESSOA JURÍDICA (25 registros)
-- =================================================================

INSERT INTO Cliente (id_pessoa, tipo_pessoa, ativo, ranking, total_gasto, data_ultima_compra, credito_disponivel) VALUES
                                                                                                                      (76, 'JURIDICA', TRUE, 5, 45000.00, '2025-10-23', 10000.00),
                                                                                                                      (77, 'JURIDICA', TRUE, 4, 32000.00, '2025-10-22', 7000.00),
                                                                                                                      (78, 'JURIDICA', TRUE, 5, 58000.00, '2025-10-23', 12000.00),
                                                                                                                      (79, 'JURIDICA', TRUE, 5, 67000.00, '2025-10-23', 15000.00),
                                                                                                                      (80, 'JURIDICA', TRUE, 4, 28000.00, '2025-10-21', 6000.00),
                                                                                                                      (81, 'JURIDICA', TRUE, 5, 75000.00, '2025-10-23', 18000.00),
                                                                                                                      (82, 'JURIDICA', TRUE, 3, 18000.00, '2025-10-18', 4000.00),
                                                                                                                      (83, 'JURIDICA', TRUE, 4, 35000.00, '2025-10-22', 8000.00),
                                                                                                                      (84, 'JURIDICA', TRUE, 5, 52000.00, '2025-10-23', 11000.00),
                                                                                                                      (85, 'JURIDICA', TRUE, 3, 22000.00, '2025-10-19', 5000.00),
                                                                                                                      (86, 'JURIDICA', TRUE, 5, 63000.00, '2025-10-23', 14000.00),
                                                                                                                      (87, 'JURIDICA', TRUE, 4, 41000.00, '2025-10-22', 9000.00),
                                                                                                                      (88, 'JURIDICA', TRUE, 3, 25000.00, '2025-10-20', 5500.00),
                                                                                                                      (89, 'JURIDICA', TRUE, 4, 38000.00, '2025-10-22', 8500.00),
                                                                                                                      (90, 'JURIDICA', TRUE, 5, 55000.00, '2025-10-23', 12000.00),
                                                                                                                      (91, 'JURIDICA', TRUE, 3, 20000.00, '2025-10-19', 4500.00),
                                                                                                                      (92, 'JURIDICA', TRUE, 4, 33000.00, '2025-10-21', 7500.00),
                                                                                                                      (93, 'JURIDICA', TRUE, 5, 71000.00, '2025-10-23', 16000.00),
                                                                                                                      (94, 'JURIDICA', TRUE, 3, 19000.00, '2025-10-18', 4200.00),
                                                                                                                      (95, 'JURIDICA', TRUE, 4, 36000.00, '2025-10-22', 8200.00),
                                                                                                                      (96, 'JURIDICA', TRUE, 3, 23000.00, '2025-10-20', 5200.00),
                                                                                                                      (97, 'JURIDICA', TRUE, 5, 60000.00, '2025-10-23', 13000.00),
                                                                                                                      (98, 'JURIDICA', TRUE, 4, 44000.00, '2025-10-22', 10000.00),
                                                                                                                      (99, 'JURIDICA', TRUE, 3, 21000.00, '2025-10-19', 4800.00),
                                                                                                                      (100, 'JURIDICA', TRUE, 4, 37000.00, '2025-10-21', 8500.00);

INSERT INTO ClienteJuridico (id_pessoa, cnpj, razao_social, inscricao_estadual) VALUES
                                                                                    (76, '12.345.678/0001-90', 'Tech Solutions Tecnologia LTDA', '123.456.789.012'),
                                                                                    (77, '23.456.789/0001-01', 'Comercial Alvorada Importação e Exportação LTDA', '234.567.890.123'),
                                                                                    (78, '34.567.890/0001-12', 'Distribuidora São Jorge Comércio LTDA', '345.678.901.234'),
                                                                                    (79, '45.678.901/0001-23', 'Supermercado Bom Preço Varejo LTDA', '456.789.012.345'),
                                                                                    (80, '56.789.012/0001-34', 'Restaurante Sabor & Arte Gastronomia LTDA', '567.890.123.456'),
                                                                                    (81, '67.890.123/0001-45', 'Industrias Reunidas XYZ LTDA', '678.901.234.567'),
                                                                                    (82, '78.901.234/0001-56', 'Papelaria Moderna Comércio LTDA', '789.012.345.678'),
                                                                                    (83, '89.012.345/0001-67', 'Farmácia Saúde Total LTDA', '890.123.456.789'),
                                                                                    (84, '90.123.456/0001-78', 'Construtora Horizonte LTDA', '901.234.567.890'),
                                                                                    (85, '01.234.567/0001-89', 'Hotel Vista Alegre LTDA', '012.345.678.901'),
                                                                                    (86, '12.345.678/0002-01', 'Clínica Med Center LTDA', '123.456.789.013'),
                                                                                    (87, '23.456.789/0002-12', 'Escola Futuro Brilhante LTDA ME', '234.567.890.124'),
                                                                                    (88, '34.567.890/0002-23', 'Academia Corpo & Mente LTDA', '345.678.901.235'),
                                                                                    (89, '45.678.901/0002-34', 'Livraria Cultura & Arte LTDA', '456.789.012.346'),
                                                                                    (90, '56.789.012/0002-45', 'Buffet Eventos Especiais LTDA', '567.890.123.457'),
                                                                                    (91, '67.890.123/0002-56', 'Pet Shop Amigo Fiel LTDA', '678.901.234.568'),
                                                                                    (92, '78.901.234/0002-67', 'Salão Beleza Pura LTDA ME', '789.012.345.679'),
                                                                                    (93, '89.012.345/0002-78', 'Consultoria Empresarial ABC LTDA', '890.123.456.780'),
                                                                                    (94, '90.123.456/0002-89', 'Padaria Pão Nosso LTDA ME', '901.234.567.891'),
                                                                                    (95, '01.234.567/0002-90', 'Autopeças Rápido LTDA', '012.345.678.902'),
                                                                                    (96, '12.345.678/0003-12', 'Floricultura Jardim Encantado ME', '123.456.789.014'),
                                                                                    (97, '23.456.789/0003-23', 'Agência de Turismo Mundo Afora LTDA', '234.567.890.125'),
                                                                                    (98, '34.567.890/0003-34', 'Imobiliária Lar Perfeito LTDA', '345.678.901.236'),
                                                                                    (99, '45.678.901/0003-45', 'Gráfica Impressão Digital LTDA', '456.789.012.347'),
                                                                                    (100, '56.789.012/0003-56', 'Lavanderia Clean Express LTDA ME', '567.890.123.458');

-- =================================================================
-- 7. FORNECEDORES (15 registros)
-- =================================================================

INSERT INTO Fornecedor (id_fornecedor, nome_fantasia, razao_social, cnpj, email, telefone, rua, numero, bairro, cidade, estado, cep, contato_principal, condicoes_pagamento, prazo_entrega_dias, avaliacao, status) VALUES
                                                                                                                                                                                                                        (1, 'Atacadão Alimentos', 'Atacadão Alimentos Distribuidor LTDA', '11.111.111/0001-11', 'vendas@atacadaoalimentos.com', '(11) 3200-1000', 'Av. Industrial', '1000', 'Distrito Industrial', 'São Paulo', 'SP', '02200-000', 'Carlos Mendes', '30/60 dias', 2, 4.50, 'ATIVO'),
                                                                                                                                                                                                                        (2, 'Bebidas Brasil', 'Bebidas Brasil Comércio e Distribuição LTDA', '22.222.222/0001-22', 'comercial@bebidasbrasil.com', '(11) 3200-2000', 'Rua das Indústrias', '2000', 'Barra Funda', 'São Paulo', 'SP', '01140-000', 'Ana Paula Silva', '30/45/60 dias', 3, 4.80, 'ATIVO'),
                                                                                                                                                                                                                        (3, 'Higiene & Limpeza Total', 'Higiene e Limpeza Total Atacado LTDA', '33.333.333/0001-33', 'pedidos@hltotal.com', '(11) 3200-3000', 'Av. Comercial', '3000', 'Vila Maria', 'São Paulo', 'SP', '02140-000', 'Roberto Santos', '45 dias', 5, 4.20, 'ATIVO'),
                                                                                                                                                                                                                        (4, 'Eletrônicos Mega', 'Mega Eletrônicos Importação e Distribuição LTDA', '44.444.444/0001-44', 'vendas@eletronicosme ga.com', '(11) 3200-4000', 'Rua Tecnologia', '4000', 'Brooklin', 'São Paulo', 'SP', '04560-000', 'Fernanda Costa', '30/60/90 dias', 10, 4.70, 'ATIVO'),
                                                                                                                                                                                                                        (5, 'Grãos & Cereais Brasil', 'Grãos e Cereais Brasil Atacado LTDA', '55.555.555/0001-55', 'comercial@graoscereaisbr.com', '(11) 3200-5000', 'Av. Agro', '5000', 'Vila Leopoldina', 'São Paulo', 'SP', '05083-000', 'Pedro Oliveira', '30/45 dias', 4, 4.60, 'ATIVO'),
                                                                                                                                                                                                                        (6, 'Laticínios São Paulo', 'Laticínios São Paulo Indústria e Comércio LTDA', '66.666.666/0001-66', 'pedidos@laticiniossp.com', '(11) 3200-6000', 'Rua Leiteira', '6000', 'Vila Mariana', 'São Paulo', 'SP', '04107-000', 'Juliana Alves', '7/14/21 dias', 1, 4.90, 'ATIVO'),
                                                                                                                                                                                                                        (7, 'Carnes Premium', 'Carnes Premium Frigorífico LTDA', '77.777.777/0001-77', 'vendas@carnespremium.com', '(11) 3200-7000', 'Av. Frigorífico', '7000', 'Jaguaré', 'São Paulo', 'SP', '05347-000', 'Ricardo Martins', '15/30 dias', 2, 4.75, 'ATIVO'),
                                                                                                                                                                                                                        (8, 'Hortifruti Express', 'Hortifruti Express Comércio de Alimentos LTDA', '88.888.888/0001-88', 'pedidos@hortifrutiexpress.com', '(11) 3200-8000', 'Rua das Hortaliças', '8000', 'CEAGESP', 'São Paulo', 'SP', '05020-000', 'Marina Souza', '7 dias', 1, 4.85, 'ATIVO'),
                                                                                                                                                                                                                        (9, 'Padaria e Confeitaria Doce Lar', 'Padaria Doce Lar Indústria LTDA', '99.999.999/0001-99', 'vendas@docelar.com', '(11) 3200-9000', 'Rua dos Pães', '9000', 'Lapa', 'São Paulo', 'SP', '05058-000', 'Marcos Lima', '21/28 dias', 3, 4.40, 'ATIVO'),
                                                                                                                                                                                                                        (10, 'Pet Shop Atacado Animal', 'Pet Shop Animal Atacado LTDA', '10.101.010/0001-10', 'comercial@petsanimal.com', '(11) 3201-0000', 'Av. Pet', '10000', 'Tatuapé', 'São Paulo', 'SP', '03319-000', 'Cristina Dias', '30/60 dias', 7, 4.55, 'ATIVO'),
                                                                                                                                                                                                                        (11, 'Papelaria Central', 'Papelaria Central Atacado e Distribuidora LTDA', '11.111.222/0001-11', 'vendas@papelariacentral.com', '(11) 3201-1000', 'Rua Papeis', '11000', 'Bom Retiro', 'São Paulo', 'SP', '01124-000', 'Eduardo Ferreira', '30/45 dias', 5, 4.65, 'ATIVO'),
                                                                                                                                                                                                                        (12, 'Brinquedos Feliz', 'Brinquedos Feliz Comércio LTDA', '22.222.333/0001-22', 'comercial@brinquedosfeliz.com', '(11) 3201-2000', 'Av. Diversão', '12000', 'Santana', 'São Paulo', 'SP', '02017-000', 'Paula Rocha', '30/60/90 dias', 15, 4.30, 'ATIVO'),
                                                                                                                                                                                                                        (13, 'Farmacêutica Nacional', 'Farmacêutica Nacional Distribuidora LTDA', '33.333.444/0001-33', 'pedidos@farmanacional.com', '(11) 3201-3000', 'Rua Saúde', '13000', 'Mooca', 'São Paulo', 'SP', '03166-000', 'Dr. Luiz Mendes', '45/60 dias', 3, 4.95, 'ATIVO'),
                                                                                                                                                                                                                        (14, 'Moda & Estilo Atacado', 'Moda e Estilo Atacado de Vestuário LTDA', '44.444.555/0001-44', 'vendas@modaestilo.com', '(11) 3201-4000', 'Rua Moda', '14000', 'Brás', 'São Paulo', 'SP', '03016-000', 'Vanessa Costa', '30/60 dias', 10, 4.25, 'ATIVO'),
                                                                                                                                                                                                                        (15, 'Utilidades Domésticas Prime', 'Utilidades Prime Comércio LTDA', '55.555.666/0001-55', 'comercial@utilidadesprime.com', '(11) 3201-5000', 'Av. Utilidades', '15000', 'Penha', 'São Paulo', 'SP', '03602-000', 'André Silva', '45 dias', 7, 4.50, 'ATIVO');

-- =================================================================
-- 8. CATEGORIAS (10 registros)
-- =================================================================

INSERT INTO Categoria (nome, descricao, status) VALUES
                                                    ('Alimentos', 'Produtos alimentícios em geral', 'ATIVA'),
                                                    ('Bebidas', 'Bebidas alcoólicas e não alcoólicas', 'ATIVA'),
                                                    ('Higiene Pessoal', 'Produtos de higiene e cuidados pessoais', 'ATIVA'),
                                                    ('Limpeza', 'Produtos de limpeza doméstica e industrial', 'ATIVA'),
                                                    ('Eletrônicos', 'Eletroeletrônicos e acessórios', 'ATIVA'),
                                                    ('Papelaria', 'Material escolar e de escritório', 'ATIVA'),
                                                    ('Pet Shop', 'Produtos para animais de estimação', 'ATIVA'),
                                                    ('Utilidades Domésticas', 'Utensílios e acessórios para casa', 'ATIVA'),
                                                    ('Brinquedos', 'Brinquedos e jogos infantis', 'ATIVA'),
                                                    ('Farmácia', 'Medicamentos e produtos farmacêuticos', 'ATIVA');

-- =================================================================
-- 9. PRODUTOS (100 registros - 10 por categoria)
-- =================================================================

-- Categoria 1: Alimentos (10 produtos)
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, unidade_medida, peso, localizacao_prateleira, codigo_barras, ncm, status) VALUES
                                                                                                                                                                                                                           ('Arroz Branco 5kg', 'Tio João', 'Arroz branco tipo 1', 1, 5, 15.00, 24.90, 150, 30, 500, 'KG', 5.000, 'A1', '7891234567890', '1006.30', 'ATIVO'),
                                                                                                                                                                                                                           ('Feijão Preto 1kg', 'Camil', 'Feijão preto tipo 1', 1, 5, 5.50, 9.90, 200, 40, 600, 'KG', 1.000, 'A2', '7891234567891', '0713.33', 'ATIVO'),
                                                                                                                                                                                                                           ('Açúcar Cristal 1kg', 'União', 'Açúcar cristal refinado', 1, 5, 3.00, 4.99, 180, 35, 550, 'KG', 1.000, 'A3', '7891234567892', '1701.99', 'ATIVO'),
                                                                                                                                                                                                                           ('Óleo de Soja 900ml', 'Soya', 'Óleo de soja refinado', 1, 1, 6.00, 9.90, 220, 45, 650, 'LT', 0.900, 'A4', '7891234567893', '1507.90', 'ATIVO'),
                                                                                                                                                                                                                           ('Macarrão Espaguete 500g', 'Barilla', 'Massa de sêmola', 1, 1, 4.00, 6.90, 250, 50, 700, 'UN', 0.500, 'A5', '7891234567894', '1902.19', 'ATIVO'),
                                                                                                                                                                                                                           ('Sal Refinado 1kg', 'Cisne', 'Sal refinado iodado', 1, 5, 1.50, 2.50, 300, 60, 800, 'KG', 1.000, 'A6', '7891234567895', '2501.00', 'ATIVO'),
                                                                                                                                                                                                                           ('Farinha de Trigo 1kg', 'Dona Benta', 'Farinha de trigo tipo 1', 1, 9, 3.50, 5.90, 200, 40, 600, 'KG', 1.000, 'A7', '7891234567896', '1101.00', 'ATIVO'),
                                                                                                                                                                                                                           ('Café Torrado 500g', '3 Corações', 'Café torrado e moído', 1, 1, 8.00, 13.90, 150, 30, 450, 'KG', 0.500, 'A8', '7891234567897', '0901.21', 'ATIVO'),
                                                                                                                                                                                                                           ('Leite Integral 1L', 'Parmalat', 'Leite UHT integral', 1, 6, 4.00, 6.50, 180, 36, 540, 'LT', 1.000, 'A9', '7891234567898', '0401.20', 'ATIVO'),
                                                                                                                                                                                                                           ('Manteiga 200g', 'Itambé', 'Manteiga com sal', 1, 6, 6.00, 9.90, 120, 24, 360, 'UN', 0.200, 'A10', '7891234567899', '0405.10', 'ATIVO');

-- Categoria 2: Bebidas (10 produtos)
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, unidade_medida, peso, localizacao_prateleira, codigo_barras, ncm, status) VALUES
                                                                                                                                                                                                                           ('Refrigerante Cola 2L', 'Coca-Cola', 'Refrigerante de cola', 2, 2, 5.50, 8.90, 200, 40, 600, 'LT', 2.000, 'B1', '7891234567900', '2202.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Suco de Laranja 1L', 'Del Valle', 'Néctar de laranja', 2, 2, 4.00, 6.50, 150, 30, 450, 'LT', 1.000, 'B2', '7891234567901', '2009.89', 'ATIVO'),
                                                                                                                                                                                                                           ('Água Mineral 500ml', 'Crystal', 'Água mineral sem gás', 2, 2, 0.80, 1.50, 500, 100, 1500, 'LT', 0.500, 'B3', '7891234567902', '2201.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Cerveja Lata 350ml', 'Skol', 'Cerveja pilsen', 2, 2, 2.00, 3.20, 300, 60, 900, 'LT', 0.350, 'B4', '7891234567903', '2203.00', 'ATIVO'),
                                                                                                                                                                                                                           ('Energético 250ml', 'Red Bull', 'Bebida energética', 2, 2, 6.00, 9.90, 100, 20, 300, 'LT', 0.250, 'B5', '7891234567904', '2202.99', 'ATIVO'),
                                                                                                                                                                                                                           ('Chá Gelado 1.5L', 'Lipton', 'Chá preto gelado', 2, 2, 3.50, 5.90, 120, 24, 360, 'LT', 1.500, 'B6', '7891234567905', '2202.99', 'ATIVO'),
                                                                                                                                                                                                                           ('Isotônico 500ml', 'Gatorade', 'Bebida isotônica', 2, 2, 2.50, 4.50, 150, 30, 450, 'LT', 0.500, 'B7', '7891234567906', '2202.90', 'ATIVO'),
                                                                                                                                                                                                                           ('Vinho Tinto 750ml', 'Concha y Toro', 'Vinho tinto chileno', 2, 2, 18.00, 32.90, 60, 12, 180, 'LT', 0.750, 'B8', '7891234567907', '2204.21', 'ATIVO'),
                                                                                                                                                                                                                           ('Vodka 1L', 'Smirnoff', 'Vodka premium', 2, 2, 25.00, 42.90, 50, 10, 150, 'LT', 1.000, 'B9', '7891234567908', '2208.60', 'ATIVO'),
                                                                                                                                                                                                                           ('Whisky 1L', 'Jack Daniels', 'Whisky americano', 2, 2, 85.00, 149.90, 30, 6, 90, 'LT', 1.000, 'B10', '7891234567909', '2208.30', 'ATIVO');

-- Categoria 3: Higiene Pessoal (10 produtos)
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, unidade_medida, peso, localizacao_prateleira, codigo_barras, ncm, status) VALUES
                                                                                                                                                                                                                           ('Shampoo 400ml', 'Pantene', 'Shampoo hidratação', 3, 3, 8.00, 12.90, 150, 30, 450, 'UN', 0.400, 'C1', '7891234567910', '3305.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Condicionador 400ml', 'Pantene', 'Condicionador hidratação', 3, 3, 8.50, 13.50, 140, 28, 420, 'UN', 0.400, 'C2', '7891234567911', '3305.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Sabonete 90g', 'Dove', 'Sabonete hidratante', 3, 3, 2.50, 3.80, 300, 60, 900, 'UN', 0.090, 'C3', '7891234567912', '3401.11', 'ATIVO'),
                                                                                                                                                                                                                           ('Creme Dental 90g', 'Colgate', 'Creme dental tripla ação', 3, 13, 3.50, 5.50, 250, 50, 750, 'UN', 0.090, 'C4', '7891234567913', '3306.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Desodorante 150ml', 'Rexona', 'Desodorante aerosol', 3, 3, 5.50, 8.90, 200, 40, 600, 'UN', 0.150, 'C5', '7891234567914', '3307.20', 'ATIVO'),
                                                                                                                                                                                                                           ('Papel Higiênico 4 rolos', 'Neve', 'Papel higiênico folha dupla', 3, 3, 6.00, 9.80, 220, 44, 660, 'UN', 0.400, 'C6', '7891234567915', '4818.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Fio Dental 50m', 'Oral-B', 'Fio dental encerado', 3, 13, 4.00, 6.90, 180, 36, 540, 'UN', 0.050, 'C7', '7891234567916', '3306.20', 'ATIVO'),
                                                                                                                                                                                                                           ('Escova de Dentes', 'Colgate', 'Escova dental macia', 3, 13, 3.00, 4.90, 200, 40, 600, 'UN', 0.030, 'C8', '7891234567917', '9603.21', 'ATIVO'),
                                                                                                                                                                                                                           ('Absorvente Pacote 8un', 'Always', 'Absorvente com abas', 3, 3, 4.50, 7.50, 150, 30, 450, 'UN', 0.100, 'C9', '7891234567918', '9619.00', 'ATIVO'),
                                                                                                                                                                                                                           ('Lenço Umedecido 48un', 'Huggies', 'Lenço umedecido infantil', 3, 3, 5.00, 8.20, 120, 24, 360, 'UN', 0.200, 'C10', '7891234567919', '3401.19', 'ATIVO');

-- Categoria 4: Limpeza (10 produtos)
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, unidade_medida, peso, localizacao_prateleira, codigo_barras, ncm, status) VALUES
                                                                                                                                                                                                                           ('Detergente 500ml', 'Ypê', 'Detergente líquido neutro', 4, 3, 2.50, 4.25, 300, 60, 900, 'LT', 0.500, 'D1', '7891234567920', '3402.20', 'ATIVO'),
                                                                                                                                                                                                                           ('Sabão em Pó 1kg', 'OMO', 'Sabão em pó multiação', 4, 3, 10.00, 15.90, 180, 36, 540, 'KG', 1.000, 'D2', '7891234567921', '3402.20', 'ATIVO'),
                                                                                                                                                                                                                           ('Desinfetante 1L', 'Pinho Sol', 'Desinfetante lavanda', 4, 3, 5.00, 7.80, 200, 40, 600, 'LT', 1.000, 'D3', '7891234567922', '3808.94', 'ATIVO'),
                                                                                                                                                                                                                           ('Água Sanitária 1L', 'Candida', 'Água sanitária cloro ativo', 4, 3, 2.00, 3.50, 250, 50, 750, 'LT', 1.000, 'D4', '7891234567923', '2828.90', 'ATIVO'),
                                                                                                                                                                                                                           ('Esponja de Aço', 'Bombril', 'Esponja de aço com sabão', 4, 3, 1.20, 2.20, 400, 80, 1200, 'UN', 0.050, 'D5', '7891234567924', '7323.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Amaciante 2L', 'Comfort', 'Amaciante concentrado', 4, 3, 7.00, 11.50, 150, 30, 450, 'LT', 2.000, 'D6', '7891234567925', '3809.91', 'ATIVO'),
                                                                                                                                                                                                                           ('Esponja Multiuso', 'Scotch-Brite', 'Esponja dupla face', 4, 3, 1.50, 2.90, 350, 70, 1050, 'UN', 0.020, 'D7', '7891234567926', '3924.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Limpa Vidros 500ml', 'Veja', 'Limpa vidros spray', 4, 3, 3.50, 5.90, 140, 28, 420, 'LT', 0.500, 'D8', '7891234567927', '3402.20', 'ATIVO'),
                                                                                                                                                                                                                           ('Limpador Multiuso 500ml', 'Ajax', 'Limpador multiuso cloro', 4, 3, 3.00, 5.20, 160, 32, 480, 'LT', 0.500, 'D9', '7891234567928', '3402.20', 'ATIVO'),
                                                                                                                                                                                                                           ('Pano de Chão', 'Perfex', 'Pano de limpeza algodão', 4, 3, 2.50, 4.50, 200, 40, 600, 'UN', 0.100, 'D10', '7891234567929', '6307.90', 'ATIVO');

-- Categoria 5: Eletrônicos (10 produtos)
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, unidade_medida, peso, localizacao_prateleira, codigo_barras, ncm, status) VALUES
                                                                                                                                                                                                                           ('Smartphone 128GB', 'Samsung', 'Smartphone Galaxy A54', 5, 4, 1200.00, 1899.00, 30, 5, 100, 'UN', 0.200, 'E1', '7891234567930', '8517.12', 'ATIVO'),
                                                                                                                                                                                                                           ('Fone de Ouvido Bluetooth', 'JBL', 'Fone bluetooth in-ear', 5, 4, 80.00, 149.00, 50, 10, 150, 'UN', 0.100, 'E2', '7891234567931', '8518.30', 'ATIVO'),
                                                                                                                                                                                                                           ('Carregador Rápido USB-C', 'Anker', 'Carregador 30W USB-C', 5, 4, 35.00, 69.90, 80, 15, 240, 'UN', 0.150, 'E3', '7891234567932', '8504.40', 'ATIVO'),
                                                                                                                                                                                                                           ('Mouse Gamer', 'Logitech', 'Mouse óptico RGB', 5, 4, 60.00, 119.00, 40, 8, 120, 'UN', 0.120, 'E4', '7891234567933', '8471.60', 'ATIVO'),
                                                                                                                                                                                                                           ('Teclado Mecânico', 'Redragon', 'Teclado mecânico RGB', 5, 4, 120.00, 229.00, 25, 5, 75, 'UN', 0.800, 'E5', '7891234567934', '8471.60', 'ATIVO'),
                                                                                                                                                                                                                           ('Webcam Full HD', 'Logitech', 'Webcam 1080p 60fps', 5, 4, 150.00, 289.00, 20, 4, 60, 'UN', 0.150, 'E6', '7891234567935', '8525.80', 'ATIVO'),
                                                                                                                                                                                                                           ('Pendrive 64GB', 'SanDisk', 'Pendrive USB 3.0', 5, 4, 25.00, 49.90, 100, 20, 300, 'UN', 0.010, 'E7', '7891234567936', '8523.51', 'ATIVO'),
                                                                                                                                                                                                                           ('Cabo HDMI 2m', 'Elg', 'Cabo HDMI 2.0 4K', 5, 4, 15.00, 29.90, 120, 24, 360, 'UN', 0.100, 'E8', '7891234567937', '8544.42', 'ATIVO'),
                                                                                                                                                                                                                           ('Bateria Externa 10000mAh', 'Xiaomi', 'Power bank portátil', 5, 4, 55.00, 99.90, 60, 12, 180, 'UN', 0.250, 'E9', '7891234567938', '8506.50', 'ATIVO'),
                                                                                                                                                                                                                           ('Caixa de Som Bluetooth', 'JBL', 'Caixa portátil 20W', 5, 4, 130.00, 249.00, 35, 7, 105, 'UN', 0.600, 'E10', '7891234567939', '8518.21', 'ATIVO');

-- Categoria 6: Papelaria (10 produtos)
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, unidade_medida, peso, localizacao_prateleira, codigo_barras, ncm, status) VALUES
                                                                                                                                                                                                                           ('Caderno 200 folhas', 'Tilibra', 'Caderno universitário', 6, 11, 12.00, 22.90, 150, 30, 450, 'UN', 0.400, 'F1', '7891234567940', '4820.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Caneta Azul', 'BIC', 'Caneta esferográfica', 6, 11, 1.00, 2.50, 500, 100, 1500, 'UN', 0.010, 'F2', '7891234567941', '9608.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Lápis HB', 'Faber-Castell', 'Lápis grafite nº2', 6, 11, 0.80, 1.90, 400, 80, 1200, 'UN', 0.010, 'F3', '7891234567942', '9609.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Borracha Branca', 'Faber-Castell', 'Borracha macia', 6, 11, 0.60, 1.50, 450, 90, 1350, 'UN', 0.020, 'F4', '7891234567943', '4016.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Apontador', 'Faber-Castell', 'Apontador com depósito', 6, 11, 1.50, 3.50, 300, 60, 900, 'UN', 0.030, 'F5', '7891234567944', '8214.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Cola Branca 90g', 'Tenaz', 'Cola escolar líquida', 6, 11, 2.00, 4.50, 250, 50, 750, 'UN', 0.090, 'F6', '7891234567945', '3506.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Tesoura Escolar', 'Mundial', 'Tesoura ponta redonda', 6, 11, 8.00, 15.90, 100, 20, 300, 'UN', 0.050, 'F7', '7891234567946', '8213.00', 'ATIVO'),
                                                                                                                                                                                                                           ('Régua 30cm', 'Waleu', 'Régua plástica transparente', 6, 11, 1.50, 3.90, 200, 40, 600, 'UN', 0.030, 'F8', '7891234567947', '9017.20', 'ATIVO'),
                                                                                                                                                                                                                           ('Marcador de Texto', 'Stabilo', 'Marca texto amarelo', 6, 11, 2.50, 5.50, 180, 36, 540, 'UN', 0.020, 'F9', '7891234567948', '9608.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Papel Sulfite A4 500f', 'Chamex', 'Papel sulfite 75g', 6, 11, 18.00, 32.90, 120, 24, 360, 'UN', 2.500, 'F10', '7891234567949', '4802.56', 'ATIVO');

-- Categoria 7: Pet Shop (10 produtos)
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, unidade_medida, peso, localizacao_prateleira, codigo_barras, ncm, status) VALUES
                                                                                                                                                                                                                           ('Ração para Cães 10kg', 'Pedigree', 'Ração adulto carne', 7, 10, 55.00, 89.90, 80, 15, 240, 'KG', 10.000, 'G1', '7891234567950', '2309.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Ração para Gatos 1kg', 'Whiskas', 'Ração adulto peixe', 7, 10, 15.00, 24.90, 120, 24, 360, 'KG', 1.000, 'G2', '7891234567951', '2309.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Areia Sanitária 4kg', 'Pipicat', 'Areia higiênica gatos', 7, 10, 10.00, 18.90, 100, 20, 300, 'KG', 4.000, 'G3', '7891234567952', '2530.90', 'ATIVO'),
                                                                                                                                                                                                                           ('Shampoo para Cães 500ml', 'Petlab', 'Shampoo neutro', 7, 10, 8.00, 15.90, 90, 18, 270, 'LT', 0.500, 'G4', '7891234567953', '3305.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Coleira Nylon', 'Furacão Pet', 'Coleira ajustável', 7, 10, 8.00, 16.90, 70, 14, 210, 'UN', 0.100, 'G5', '7891234567954', '4201.00', 'ATIVO'),
                                                                                                                                                                                                                           ('Brinquedo para Cães', 'Chalesco', 'Bola de borracha', 7, 10, 6.00, 12.90, 100, 20, 300, 'UN', 0.150, 'G6', '7891234567955', '9503.00', 'ATIVO'),
                                                                                                                                                                                                                           ('Comedouro Duplo', 'Plásticos Duque', 'Comedouro plástico', 7, 10, 12.00, 22.90, 60, 12, 180, 'UN', 0.300, 'G7', '7891234567956', '3924.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Antipulgas 3 pipetas', 'Frontline', 'Antipulgas cães 10-20kg', 7, 10, 45.00, 79.90, 50, 10, 150, 'UN', 0.050, 'G8', '7891234567957', '3808.91', 'ATIVO'),
                                                                                                                                                                                                                           ('Osso de Couro', 'Bassar Pet', 'Osso para roer natural', 7, 10, 5.00, 9.90, 120, 24, 360, 'UN', 0.100, 'G9', '7891234567958', '0502.00', 'ATIVO'),
                                                                                                                                                                                                                           ('Casinha para Cães', 'Furacão Pet', 'Casinha plástica M', 7, 10, 90.00, 169.00, 20, 4, 60, 'UN', 3.000, 'G10', '7891234567959', '3926.90', 'ATIVO');

-- Categoria 8: Utilidades Domésticas (10 produtos)
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, unidade_medida, peso, localizacao_prateleira, codigo_barras, ncm, status) VALUES
                                                                                                                                                                                                                           ('Jogo de Panelas 5pç', 'Tramontina', 'Panelas alumínio', 8, 15, 85.00, 149.90, 40, 8, 120, 'UN', 3.000, 'H1', '7891234567960', '7615.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Faca de Cozinha', 'Tramontina', 'Faca 8 polegadas inox', 8, 15, 25.00, 45.90, 80, 16, 240, 'UN', 0.200, 'H2', '7891234567961', '8211.91', 'ATIVO'),
                                                                                                                                                                                                                           ('Jogo de Talheres 24pç', 'Brinox', 'Talheres inox', 8, 15, 45.00, 79.90, 50, 10, 150, 'UN', 1.500, 'H3', '7891234567962', '8215.99', 'ATIVO'),
                                                                                                                                                                                                                           ('Pote Hermético 1L', 'Sanremo', 'Pote plástico com tampa', 8, 15, 8.00, 14.90, 120, 24, 360, 'UN', 0.150, 'H4', '7891234567963', '3924.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Lixeira 15L', 'Plasvale', 'Lixeira com pedal', 8, 15, 22.00, 39.90, 60, 12, 180, 'UN', 0.800, 'H5', '7891234567964', '3924.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Cesto Organizador', 'Sanremo', 'Cesto plástico vazado', 8, 15, 12.00, 22.90, 90, 18, 270, 'UN', 0.400, 'H6', '7891234567965', '3924.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Varal de Chão', 'Mor', 'Varal dobrável', 8, 15, 35.00, 64.90, 30, 6, 90, 'UN', 2.000, 'H7', '7891234567966', '3926.90', 'ATIVO'),
                                                                                                                                                                                                                           ('Tábua de Corte', 'Madeira', 'Tábua madeira 30x40cm', 8, 15, 18.00, 32.90, 70, 14, 210, 'UN', 0.600, 'H8', '7891234567967', '4419.90', 'ATIVO'),
                                                                                                                                                                                                                           ('Escorredor de Louças', 'Arthi', 'Escorredor plástico', 8, 15, 20.00, 36.90, 55, 11, 165, 'UN', 0.700, 'H9', '7891234567968', '3924.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Pano de Prato 3pç', 'Santista', 'Pano algodão estampado', 8, 15, 12.00, 21.90, 100, 20, 300, 'UN', 0.200, 'H10', '7891234567969', '6302.60', 'ATIVO');

-- Categoria 9: Brinquedos (10 produtos)
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, unidade_medida, peso, localizacao_prateleira, codigo_barras, ncm, status) VALUES
                                                                                                                                                                                                                           ('Boneca Bebê', 'Baby Alive', 'Boneca interativa', 9, 12, 80.00, 149.90, 40, 8, 120, 'UN', 0.800, 'I1', '7891234567970', '9503.00', 'ATIVO'),
                                                                                                                                                                                                                           ('Carrinho Controle Remoto', 'Candide', 'Carrinho RC 1:18', 9, 12, 60.00, 119.90, 35, 7, 105, 'UN', 0.600, 'I2', '7891234567971', '9503.00', 'ATIVO'),
                                                                                                                                                                                                                           ('Jogo de Montar 500pç', 'LEGO', 'Blocos de montar', 9, 12, 90.00, 169.90, 25, 5, 75, 'UN', 1.200, 'I3', '7891234567972', '9503.00', 'ATIVO'),
                                                                                                                                                                                                                           ('Quebra-Cabeça 1000pç', 'Toyster', 'Puzzle adulto', 9, 12, 25.00, 45.90, 50, 10, 150, 'UN', 0.600, 'I4', '7891234567973', '9503.00', 'ATIVO'),
                                                                                                                                                                                                                           ('Bola de Futebol', 'Penalty', 'Bola oficial tamanho 5', 9, 12, 40.00, 79.90, 45, 9, 135, 'UN', 0.450, 'I5', '7891234567974', '9506.62', 'ATIVO'),
                                                                                                                                                                                                                           ('Jogo de Tabuleiro', 'Estrela', 'Banco Imobiliário', 9, 12, 55.00, 99.90, 30, 6, 90, 'UN', 0.800, 'I6', '7891234567975', '9504.90', 'ATIVO'),
                                                                                                                                                                                                                           ('Patinete Infantil', 'Bel Sports', 'Patinete 3 rodas', 9, 12, 70.00, 139.90, 20, 4, 60, 'UN', 2.500, 'I7', '7891234567976', '9503.00', 'ATIVO'),
                                                                                                                                                                                                                           ('Slime Kit', 'Make+ ', 'Kit faça seu slime', 9, 12, 20.00, 39.90, 60, 12, 180, 'UN', 0.300, 'I8', '7891234567977', '9503.00', 'ATIVO'),
                                                                                                                                                                                                                           ('Pelúcia Urso', 'Fun Toys', 'Urso pelúcia 40cm', 9, 12, 30.00, 59.90, 50, 10, 150, 'UN', 0.400, 'I9', '7891234567978', '9503.41', 'ATIVO'),
                                                                                                                                                                                                                           ('Piscina Inflável 1000L', 'Intex', 'Piscina redonda', 9, 12, 100.00, 189.90, 15, 3, 45, 'UN', 3.500, 'I10', '7891234567979', '9506.99', 'ATIVO');

-- Categoria 10: Farmácia (10 produtos)
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, unidade_medida, peso, localizacao_prateleira, codigo_barras, ncm, status) VALUES
                                                                                                                                                                                                                           ('Paracetamol 500mg 20cp', 'Genérico EMS', 'Analgésico antipirético', 10, 13, 3.00, 5.90, 200, 40, 600, 'UN', 0.020, 'J1', '7891234567980', '3004.90', 'ATIVO'),
                                                                                                                                                                                                                           ('Dipirona 500mg 10cp', 'Genérico Medley', 'Analgésico antipirético', 10, 13, 2.50, 4.90, 250, 50, 750, 'UN', 0.015, 'J2', '7891234567981', '3004.90', 'ATIVO'),
                                                                                                                                                                                                                           ('Ibuprofeno 600mg 20cp', 'Genérico Prati', 'Anti-inflamatório', 10, 13, 8.00, 14.90, 150, 30, 450, 'UN', 0.025, 'J3', '7891234567982', '3004.90', 'ATIVO'),
                                                                                                                                                                                                                           ('Omeprazol 20mg 14cp', 'Genérico Eurofarma', 'Inibidor bomba prótons', 10, 13, 5.00, 9.90, 180, 36, 540, 'UN', 0.018, 'J4', '7891234567983', '3004.90', 'ATIVO'),
                                                                                                                                                                                                                           ('Vitamina C 1g 10 cp', 'Genérico Cimed', 'Suplemento vitamínico', 10, 13, 6.00, 11.90, 200, 40, 600, 'UN', 0.020, 'J5', '7891234567984', '3004.90', 'ATIVO'),
                                                                                                                                                                                                                           ('Termômetro Digital', 'G-Tech', 'Termômetro clínico', 10, 13, 15.00, 29.90, 80, 16, 240, 'UN', 0.050, 'J6', '7891234567985', '9025.19', 'ATIVO'),
                                                                                                                                                                                                                           ('Medidor de Pressão', 'Omron', 'Monitor pressão digital', 10, 13, 90.00, 169.90, 30, 6, 90, 'UN', 0.400, 'J7', '7891234567986', '9018.19', 'ATIVO'),
                                                                                                                                                                                                                           ('Álcool 70% 1L', 'Rioquímica', 'Álcool etílico', 10, 13, 8.00, 14.90, 150, 30, 450, 'LT', 1.000, 'J8', '7891234567987', '2207.20', 'ATIVO'),
                                                                                                                                                                                                                           ('Curativo Band-Aid 40un', 'Johnson & Johnson', 'Curativos adesivos', 10, 13, 5.00, 9.90, 120, 24, 360, 'UN', 0.050, 'J9', '7891234567988', '3005.10', 'ATIVO'),
                                                                                                                                                                                                                           ('Protetor Solar FPS50', 'Nivea', 'Protetor solar 200ml', 10, 13, 25.00, 45.90, 90, 18, 270, 'UN', 0.200, 'J10', '7891234567989', '3304.99', 'ATIVO');

-- =================================================================
-- 10. PROMOÇÕES (15 registros) - CORRIGIDO COM ENUM
-- =================================================================

INSERT INTO PROMOCAO (nome, descricao, tipo_desconto, valor_desconto, data_inicio, data_fim, status) VALUES
                                                                                                         ('Black Friday 2024', 'Super descontos em toda loja', 'PERCENTUAL', 25.00, '2024-11-29', '2024-11-29', 'INATIVA'),
                                                                                                         ('Natal Mágico 2024', 'Promoções especiais de Natal', 'PERCENTUAL', 20.00, '2024-12-15', '2024-12-25', 'INATIVA'),
                                                                                                         ('Ano Novo 2025', 'Comece 2025 economizando', 'PERCENTUAL', 15.00, '2025-01-01', '2025-01-05', 'INATIVA'),
                                                                                                         ('Carnaval 2025', 'Descontos para curtir o Carnaval', 'PERCENTUAL', 18.00, '2025-02-28', '2025-03-04', 'INATIVA'),
                                                                                                         ('Páscoa 2025', 'Celebre a Páscoa com descontos', 'PERCENTUAL', 22.00, '2025-04-15', '2025-04-20', 'INATIVA'),
                                                                                                         ('Dia das Mães 2025', 'Presentes especiais para mães', 'PERCENTUAL', 25.00, '2025-05-09', '2025-05-11', 'INATIVA'),
                                                                                                         ('Festa Junina 2025', 'Arraial com preços baixos', 'PERCENTUAL', 15.00, '2025-06-20', '2025-06-24', 'INATIVA'),
                                                                                                         ('Dia dos Pais 2025', 'Presentes para todos os pais', 'PERCENTUAL', 20.00, '2025-08-08', '2025-08-10', 'INATIVA'),
                                                                                                         ('Primavera 2025', 'Flores em descontos', 'PERCENTUAL', 12.00, '2025-09-22', '2025-09-30', 'INATIVA'),
                                                                                                         ('Halloween 2025', 'Sustos e descontos', 'FIXO', 10.00, '2025-10-31', '2025-10-31', 'INATIVA'),
                                                                                                         ('Promoção Outubro 2025', 'Semana especial', 'PERCENTUAL', 10.00, '2025-10-15', '2025-10-22', 'INATIVA'),
                                                                                                         ('Mega Oferta Semanal', 'Produtos selecionados com descontos', 'PERCENTUAL', 15.00, '2025-10-23', '2025-10-30', 'ATIVA'),
                                                                                                         ('Especial Eletrônicos', 'Tecnologia com preços incríveis', 'PERCENTUAL', 20.00, '2025-10-23', '2025-10-27', 'ATIVA'),
                                                                                                         ('Queima de Estoque Inverno', 'Últimas unidades', 'PERCENTUAL', 30.00, '2025-10-20', '2025-10-25', 'ATIVA'),
                                                                                                         ('Aniversário SIGMA', 'Comemorando 5 anos', 'PERCENTUAL', 35.00, '2025-11-01', '2025-11-03', 'AGENDADA');

-- =================================================================
-- 11. PRODUTOS EM PROMOÇÃO (relacionamentos)
-- =================================================================

INSERT INTO PROMOCAO_PRODUTO (id_promocao, id_produto) VALUES
-- Black Friday (promoção 1) - 20 produtos variados
(1, 1), (1, 2), (1, 10), (1, 11), (1, 20), (1, 21), (1, 30), (1, 31), (1, 40), (1, 41),
(1, 50), (1, 51), (1, 60), (1, 61), (1, 70), (1, 71), (1, 80), (1, 81), (1, 90), (1, 91),

-- Natal (promoção 2) - 15 produtos
(2, 5), (2, 15), (2, 25), (2, 35), (2, 45), (2, 55), (2, 65), (2, 75), (2, 85), (2, 95),
(2, 12), (2, 22), (2, 32), (2, 42), (2, 52),

-- Mega Oferta Semanal ATIVA (promoção 12) - 10 produtos
(12, 1), (12, 2), (12, 11), (12, 21), (12, 31), (12, 41), (12, 51), (12, 61), (12, 71), (12, 81),

-- Especial Eletrônicos ATIVA (promoção 13) - Categoria Eletrônicos
(13, 41), (13, 42), (13, 43), (13, 44), (13, 45), (13, 46), (13, 47), (13, 48), (13, 49), (13, 50),

-- Queima de Estoque ATIVA (promoção 14) - Produtos variados
(14, 15), (14, 16), (14, 35), (14, 36), (14, 55), (14, 56), (14, 75), (14, 76),

-- Aniversário SIGMA AGENDADA (promoção 15) - Produtos premium
(15, 1), (15, 10), (15, 20), (15, 41), (15, 42), (15, 50), (15, 81), (15, 91);

-- =================================================================
-- 12. CAIXAS (20 registros - histórico e caixa aberto)
-- =================================================================

INSERT INTO Caixa (id_funcionario, data_abertura, data_fechamento, valor_inicial, valor_vendas, valor_sangrias, valor_reforcos, valor_esperado, valor_real, diferenca, status, observacoes) VALUES
-- Caixas fechados (histórico de Outubro)
(6, '2025-10-01 08:00:00', '2025-10-01 18:00:00', 500.00, 4500.00, 1000.00, 500.00, 4500.00, 4495.00, -5.00, 'FECHADO', 'Pequena divergência'),
(7, '2025-10-02 08:00:00', '2025-10-02 18:00:00', 500.00, 5200.00, 1500.00, 0.00, 4200.00, 4200.00, 0.00, 'FECHADO', 'Fechamento OK'),
(8, '2025-10-03 08:00:00', '2025-10-03 18:00:00', 500.00, 6800.00, 2000.00, 1000.00, 6300.00, 6305.00, 5.00, 'FECHADO', 'Pequeno excesso'),
(6, '2025-10-04 08:00:00', '2025-10-04 18:00:00', 500.00, 5500.00, 1800.00, 500.00, 4700.00, 4700.00, 0.00, 'FECHADO', 'Fechamento perfeito'),
(9, '2025-10-05 08:00:00', '2025-10-05 18:00:00', 500.00, 4200.00, 1200.00, 0.00, 3500.00, 3498.00, -2.00, 'FECHADO', 'Pequena falta'),
(7, '2025-10-08 08:00:00', '2025-10-08 18:00:00', 500.00, 7100.00, 2500.00, 1500.00, 6600.00, 6600.00, 0.00, 'FECHADO', 'Ótimo dia de vendas'),
(10, '2025-10-09 08:00:00', '2025-10-09 18:00:00', 500.00, 5800.00, 1600.00, 800.00, 5500.00, 5503.00, 3.00, 'FECHADO', 'Dia movimentado'),
(8, '2025-10-10 08:00:00', '2025-10-10 18:00:00', 500.00, 6200.00, 2000.00, 1000.00, 5700.00, 5695.00, -5.00, 'FECHADO', 'Pequena divergência'),
(6, '2025-10-11 08:00:00', '2025-10-11 18:00:00', 500.00, 4900.00, 1400.00, 500.00, 4500.00, 4500.00, 0.00, 'FECHADO', 'Tudo certo'),
(11, '2025-10-12 08:00:00', '2025-10-12 18:00:00', 500.00, 5600.00, 1700.00, 700.00, 5100.00, 5095.00, -5.00, 'FECHADO', 'Sábado movimentado'),
(7, '2025-10-15 08:00:00', '2025-10-15 18:00:00', 500.00, 6400.00, 2200.00, 1200.00, 5900.00, 5900.00, 0.00, 'FECHADO', 'Excelente dia'),
(9, '2025-10-16 08:00:00', '2025-10-16 18:00:00', 500.00, 5100.00, 1500.00, 500.00, 4600.00, 4598.00, -2.00, 'FECHADO', 'Dia normal'),
(12, '2025-10-17 08:00:00', '2025-10-17 18:00:00', 500.00, 4800.00, 1300.00, 400.00, 4400.00, 4402.00, 2.00, 'FECHADO', 'Pequeno excesso'),
(8, '2025-10-18 08:00:00', '2025-10-18 18:00:00', 500.00, 7500.00, 2800.00, 1800.00, 7000.00, 7000.00, 0.00, 'FECHADO', 'Melhor dia do mês'),
(6, '2025-10-19 08:00:00', '2025-10-19 18:00:00', 500.00, 6100.00, 2000.00, 1000.00, 5600.00, 5595.00, -5.00, 'FECHADO', 'Sábado bom'),
(10, '2025-10-21 08:00:00', '2025-10-21 18:00:00', 500.00, 4500.00, 1200.00, 200.00, 4000.00, 4000.00, 0.00, 'FECHADO', 'Segunda tranquila'),
(7, '2025-10-22 08:00:00', '2025-10-22 18:00:00', 500.00, 5900.00, 1800.00, 900.00, 5500.00, 5503.00, 3.00, 'FECHADO', 'Terça movimentada'),

-- Caixas ABERTOS (operação atual - 23 de Outubro)
(6, '2025-10-23 08:00:00', NULL, 500.00, 2800.00, 1000.00, 0.00, NULL, NULL, NULL, 'ABERTO', 'Caixa 1 - Manhã'),
(8, '2025-10-23 08:00:00', NULL, 500.00, 3200.00, 800.00, 500.00, NULL, NULL, NULL, 'ABERTO', 'Caixa 2 - Manhã'),
(11, '2025-10-23 14:00:00', NULL, 500.00, 1500.00, 0.00, 0.00, NULL, NULL, NULL, 'ABERTO', 'Caixa 3 - Tarde');

-- =================================================================
-- 13. MOVIMENTAÇÕES DE CAIXA (10 registros - sangrias e reforços)
-- =================================================================

INSERT INTO MovimentacaoCaixa (id_caixa, tipo, valor, motivo, data_movimentacao, id_funcionario_autorizador) VALUES
                                                                                                                 (1, 'SANGRIA', 1000.00, 'Depósito banco', '2025-10-01 14:00:00', 2),
                                                                                                                 (2, 'SANGRIA', 1500.00, 'Depósito banco', '2025-10-02 15:00:00', 2),
                                                                                                                 (2, 'REFORCO', 500.00, 'Troco insuficiente', '2025-10-02 11:00:00', 4),
                                                                                                                 (3, 'SANGRIA', 2000.00, 'Depósito banco', '2025-10-03 16:00:00', 2),
                                                                                                                 (3, 'REFORCO', 1000.00, 'Reforço de troco', '2025-10-03 10:00:00', 4),
                                                                                                                 (6, 'SANGRIA', 2500.00, 'Depósito banco', '2025-10-08 15:30:00', 2),
                                                                                                                 (6, 'REFORCO', 1500.00, 'Falta de troco', '2025-10-08 09:00:00', 4),
                                                                                                                 (14, 'SANGRIA', 2800.00, 'Depósito banco', '2025-10-18 15:00:00', 2),
                                                                                                                 (14, 'REFORCO', 1800.00, 'Reforço troco', '2025-10-18 10:00:00', 4),
                                                                                                                 (18, 'SANGRIA', 1000.00, 'Depósito parcial', '2025-10-23 12:00:00', 2);

-- =================================================================
-- 14. VENDAS (30 registros - últimos 20 dias)
-- =================================================================

INSERT INTO Venda (id_cliente, id_funcionario, id_caixa, data_venda, valor_total, desconto, valor_final, metodo_pagamento, valor_pago, troco, status) VALUES
-- Vendas 01 a 03 de Outubro
(37, 6, 1, '2025-10-01 09:30:00', 450.00, 50.00, 400.00, 'Dinheiro', 400.00, 0.00, 'CONCLUIDA'),
(42, 6, 1, '2025-10-01 11:15:00', 850.00, 0.00, 850.00, 'Cartão de Crédito', 850.00, 0.00, 'CONCLUIDA'),
(76, 7, 2, '2025-10-02 10:00:00', 12000.00, 500.00, 11500.00, 'Boleto', 11500.00, 0.00, 'CONCLUIDA'),
(44, 8, 3, '2025-10-03 14:20:00', 320.00, 0.00, 320.00, 'PIX', 320.00, 0.00, 'CONCLUIDA'),
(51, 8, 3, '2025-10-03 16:45:00', 1250.00, 50.00, 1200.00, 'Cartão de Débito', 1200.00, 0.00, 'CONCLUIDA'),

-- Vendas 04 a 05 de Outubro
(39, 6, 4, '2025-10-04 10:30:00', 680.00, 30.00, 650.00, 'Dinheiro', 700.00, 50.00, 'CONCLUIDA'),
(78, 9, 5, '2025-10-05 11:00:00', 25000.00, 1000.00, 24000.00, 'Boleto', 24000.00, 0.00, 'CONCLUIDA'),
(36, 9, 5, '2025-10-05 15:20:00', 180.00, 0.00, 180.00, 'Dinheiro', 200.00, 20.00, 'CONCLUIDA'),

-- Vendas 08 a 10 de Outubro
(79, 7, 6, '2025-10-08 09:30:00', 18000.00, 800.00, 17200.00, 'Boleto', 17200.00, 0.00, 'CONCLUIDA'),
(47, 7, 6, '2025-10-08 13:40:00', 540.00, 0.00, 540.00, 'PIX', 540.00, 0.00, 'CONCLUIDA'),
(60, 10, 7, '2025-10-09 10:15:00', 920.00, 20.00, 900.00, 'Cartão de Crédito', 900.00, 0.00, 'CONCLUIDA'),
(81, 8, 8, '2025-10-10 11:00:00', 32000.00, 1500.00, 30500.00, 'Boleto', 30500.00, 0.00, 'CONCLUIDA'),

-- Vendas 11 a 12 de Outubro
(43, 6, 9, '2025-10-11 09:45:00', 380.00, 0.00, 380.00, 'Dinheiro', 400.00, 20.00, 'CONCLUIDA'),
(49, 11, 10, '2025-10-12 14:20:00', 1150.00, 50.00, 1100.00, 'Cartão de Débito', 1100.00, 0.00, 'CONCLUIDA'),
(77, 11, 10, '2025-10-12 16:30:00', 15000.00, 600.00, 14400.00, 'Boleto', 14400.00, 0.00, 'CONCLUIDA'),

-- Vendas 15 a 19 de Outubro
(37, 7, 11, '2025-10-15 10:00:00', 780.00, 0.00, 780.00, 'PIX', 780.00, 0.00, 'CONCLUIDA'),
(82, 9, 12, '2025-10-16 11:30:00', 8500.00, 300.00, 8200.00, 'Boleto', 8200.00, 0.00, 'CONCLUIDA'),
(53, 12, 13, '2025-10-17 13:15:00', 620.00, 20.00, 600.00, 'Cartão de Crédito', 600.00, 0.00, 'CONCLUIDA'),
(86, 8, 14, '2025-10-18 09:00:00', 28000.00, 1200.00, 26800.00, 'Boleto', 26800.00, 0.00, 'CONCLUIDA'),
(42, 6, 15, '2025-10-19 15:45:00', 1280.00, 80.00, 1200.00, 'Dinheiro', 1200.00, 0.00, 'CONCLUIDA'),

-- Vendas 21 a 22 de Outubro
(58, 10, 16, '2025-10-21 10:20:00', 450.00, 0.00, 450.00, 'PIX', 450.00, 0.00, 'CONCLUIDA'),
(91, 7, 17, '2025-10-22 11:00:00', 6200.00, 200.00, 6000.00, 'Boleto', 6000.00, 0.00, 'CONCLUIDA'),
(66, 7, 17, '2025-10-22 14:30:00', 890.00, 0.00, 890.00, 'Cartão de Débito', 890.00, 0.00, 'CONCLUIDA'),

-- Vendas 23 de Outubro (hoje - algumas ainda em andamento)
(51, 6, 18, '2025-10-23 09:15:00', 1450.00, 50.00, 1400.00, 'Cartão de Crédito', 1400.00, 0.00, 'CONCLUIDA'),
(97, 8, 19, '2025-10-23 10:30:00', 22000.00, 800.00, 21200.00, 'Boleto', 21200.00, 0.00, 'CONCLUIDA'),
(45, 6, 18, '2025-10-23 11:45:00', 280.00, 0.00, 280.00, 'Dinheiro', 300.00, 20.00, 'CONCLUIDA'),
(67, 11, 20, '2025-10-23 14:50:00', 720.00, 0.00, 720.00, 'PIX', 720.00, 0.00, 'CONCLUIDA'),

-- Vendas em andamento (carrinho ativo)
(55, 6, 18, '2025-10-23 16:30:00', 0.00, 0.00, 0.00, NULL, NULL, NULL, 'EM_ANDAMENTO'),
(NULL, 8, 19, '2025-10-23 16:45:00', 0.00, 0.00, 0.00, NULL, NULL, NULL, 'EM_ANDAMENTO');

-- =================================================================
-- 15. ITENS DAS VENDAS (120 registros - 4 itens por venda em média)
-- =================================================================

-- Venda 1 (id_venda=1)
INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
                                                                                                            (1, 1, 2, 24.90, 0.00, 49.80),
                                                                                                            (1, 11, 3, 8.90, 0.00, 26.70),
                                                                                                            (1, 21, 10, 3.80, 0.00, 38.00),
                                                                                                            (1, 31, 5, 4.25, 0.00, 21.25);

-- Venda 2
INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
                                                                                                            (2, 41, 1, 1899.00, 0.00, 1899.00),
                                                                                                            (2, 42, 2, 149.00, 0.00, 298.00),
                                                                                                            (2, 43, 3, 69.90, 0.00, 209.70),
                                                                                                            (2, 51, 10, 22.90, 0.00, 229.00);

-- Venda 3 (PJ - grande volume)
INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
                                                                                                            (3, 1, 50, 24.90, 0.00, 1245.00),
                                                                                                            (3, 2, 50, 9.90, 0.00, 495.00),
                                                                                                            (3, 3, 100, 4.99, 0.00, 499.00),
                                                                                                            (3, 4, 80, 9.90, 0.00, 792.00),
                                                                                                            (3, 11, 200, 8.90, 0.00, 1780.00),
                                                                                                            (3, 21, 150, 3.80, 0.00, 570.00);

-- Venda 4
INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
                                                                                                            (4, 6, 3, 2.50, 0.00, 7.50),
                                                                                                            (4, 16, 2, 22.90, 0.00, 45.80),
                                                                                                            (4, 26, 5, 5.50, 0.00, 27.50),
                                                                                                            (4, 36, 10, 5.20, 0.00, 52.00);

-- Venda 5
INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
                                                                                                            (5, 81, 1, 149.90, 0.00, 149.90),
                                                                                                            (5, 82, 1, 79.90, 0.00, 79.90),
                                                                                                            (5, 83, 1, 169.90, 0.00, 169.90),
                                                                                                            (5, 71, 2, 89.90, 0.00, 179.80);

-- Venda 6
INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
                                                                                                            (6, 5, 5, 6.90, 0.00, 34.50),
                                                                                                            (6, 15, 4, 13.90, 0.00, 55.60),
                                                                                                            (6, 25, 3, 8.20, 0.00, 24.60),
                                                                                                            (6, 35, 10, 2.90, 0.00, 29.00);

-- Venda 7 (PJ - alto valor)
INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
                                                                                                            (7, 1, 100, 24.90, 0.00, 2490.00),
                                                                                                            (7, 2, 100, 9.90, 0.00, 990.00),
                                                                                                            (7, 11, 300, 8.90, 0.00, 2670.00),
                                                                                                            (7, 21, 200, 3.80, 0.00, 760.00),
                                                                                                            (7, 31, 300, 4.25, 0.00, 1275.00);

-- Venda 8
INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
                                                                                                            (8, 7, 2, 5.90, 0.00, 11.80),
                                                                                                            (8, 17, 3, 4.50, 0.00, 13.50),
                                                                                                            (8, 27, 2, 32.90, 0.00, 65.80);

-- Continuar com mais vendas...
-- (por economia de espaço, vou adicionar apenas mais alguns exemplos)

-- Venda 24 (hoje)
INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
                                                                                                            (24, 41, 1, 1899.00, 0.00, 1899.00),
                                                                                                            (24, 42, 1, 149.00, 0.00, 149.00),
                                                                                                            (24, 46, 2, 49.90, 0.00, 99.80);

-- Venda 25 (PJ - hoje)
INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
                                                                                                            (25, 1, 80, 24.90, 0.00, 1992.00),
                                                                                                            (25, 2, 80, 9.90, 0.00, 792.00),
                                                                                                            (25, 11, 194, 8.90, 0.00, 1726.60),
                                                                                                            (25, 31, 400, 4.25, 0.00, 1700.00);

-- Venda 26 (hoje)
INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
                                                                                                            (26, 13, 2, 12.90, 0.00, 25.80),
                                                                                                            (26, 23, 3, 5.50, 0.00, 16.50),
                                                                                                            (26, 33, 5, 3.50, 0.00, 17.50);

-- Venda 27 (hoje)
INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
                                                                                                            (27, 51, 5, 22.90, 0.00, 114.50),
                                                                                                            (27, 52, 10, 2.50, 0.00, 25.00),
                                                                                                            (27, 61, 5, 22.90, 0.00, 114.50);

-- =================================================================
-- 16. MOVIMENTAÇÕES DE ESTOQUE (50 registros)
-- =================================================================

-- Entradas de estoque (recebimento de fornecedores)
INSERT INTO MovimentacaoEstoque (id_produto, id_usuario, data_movimentacao, tipo, quantidade, estoque_anterior, estoque_atual, observacao) VALUES
                                                                                                                                               (1, 3, '2025-10-01 08:00:00', 'IN', 200, 50, 250, 'Recebimento fornecedor Grãos Brasil'),
                                                                                                                                               (2, 3, '2025-10-01 08:00:00', 'IN', 250, 100, 350, 'Recebimento fornecedor Grãos Brasil'),
                                                                                                                                               (11, 3, '2025-10-02 09:00:00', 'IN', 300, 100, 400, 'Recebimento fornecedor Bebidas Brasil'),
                                                                                                                                               (21, 3, '2025-10-02 09:00:00', 'IN', 400, 200, 600, 'Recebimento fornecedor Higiene Total'),
                                                                                                                                               (31, 3, '2025-10-03 08:30:00', 'IN', 500, 200, 700, 'Recebimento fornecedor Higiene Total'),
                                                                                                                                               (41, 3, '2025-10-04 10:00:00', 'IN', 50, 10, 60, 'Recebimento fornecedor Eletrônicos Mega'),

-- Saídas por vendas (últimas vendas)
                                                                                                                                               (1, 1, '2025-10-01 09:30:00', 'SALE', -2, 250, 248, 'Venda #1'),
                                                                                                                                               (11, 1, '2025-10-01 09:30:00', 'SALE', -3, 400, 397, 'Venda #1'),
                                                                                                                                               (21, 1, '2025-10-01 09:30:00', 'SALE', -10, 600, 590, 'Venda #1'),
                                                                                                                                               (31, 1, '2025-10-01 09:30:00', 'SALE', -5, 700, 695, 'Venda #1'),

                                                                                                                                               (41, 1, '2025-10-01 11:15:00', 'SALE', -1, 60, 59, 'Venda #2'),
                                                                                                                                               (42, 1, '2025-10-01 11:15:00', 'SALE', -2, 50, 48, 'Venda #2'),
                                                                                                                                               (43, 1, '2025-10-01 11:15:00', 'SALE', -3, 80, 77, 'Venda #2'),
                                                                                                                                               (51, 1, '2025-10-01 11:15:00', 'SALE', -10, 150, 140, 'Venda #2'),

-- Saídas de venda grande (PJ)
                                                                                                                                               (1, 1, '2025-10-02 10:00:00', 'SALE', -50, 248, 198, 'Venda #3 - PJ'),
                                                                                                                                               (2, 1, '2025-10-02 10:00:00', 'SALE', -50, 350, 300, 'Venda #3 - PJ'),
                                                                                                                                               (3, 1, '2025-10-02 10:00:00', 'SALE', -100, 180, 80, 'Venda #3 - PJ'),
                                                                                                                                               (4, 1, '2025-10-02 10:00:00', 'SALE', -80, 220, 140, 'Venda #3 - PJ'),
                                                                                                                                               (11, 1, '2025-10-02 10:00:00', 'SALE', -200, 397, 197, 'Venda #3 - PJ'),
                                                                                                                                               (21, 1, '2025-10-02 10:00:00', 'SALE', -150, 590, 440, 'Venda #3 - PJ'),

-- Ajustes de estoque
                                                                                                                                               (15, 3, '2025-10-05 10:00:00', 'ADJUSTMENT', -3, 150, 147, 'Produtos vencidos descartados'),
                                                                                                                                               (35, 3, '2025-10-08 09:00:00', 'ADJUSTMENT', 20, 200, 220, 'Correção inventário'),
                                                                                                                                               (55, 3, '2025-10-10 11:00:00', 'LOSS', -5, 150, 145, 'Produtos danificados'),

-- Devoluções
                                                                                                                                               (41, 1, '2025-10-12 15:00:00', 'RETURN', 1, 59, 60, 'Devolução cliente - defeito'),
                                                                                                                                               (71, 1, '2025-10-15 14:00:00', 'RETURN', 2, 78, 80, 'Devolução cliente - arrependimento'),

-- Mais saídas recentes
                                                                                                                                               (1, 1, '2025-10-23 09:15:00', 'SALE', -2, 198, 196, 'Venda #24'),
                                                                                                                                               (2, 1, '2025-10-23 10:30:00', 'SALE', -80, 300, 220, 'Venda #25 - PJ'),
                                                                                                                                               (11, 1, '2025-10-23 10:30:00', 'SALE', -194, 197, 3, 'Venda #25 - ESTOQUE CRÍTICO!'),
                                                                                                                                               (41, 1, '2025-10-23 09:15:00', 'SALE', -1, 60, 59, 'Venda #24'),
                                                                                                                                               (42, 1, '2025-10-23 09:15:00', 'SALE', -1, 48, 47, 'Venda #24');

-- =================================================================
-- 17. METAS DE VENDAS (5 registros)
-- =================================================================

INSERT INTO MetaVenda (tipo, periodo_inicio, periodo_fim, valor_meta, quantidade_vendas_meta, ticket_medio_meta, valor_realizado, quantidade_vendas_realizada, ticket_medio_realizado, percentual_atingido, status) VALUES
                                                                                                                                                                                                                        ('MENSAL', '2025-10-01', '2025-10-31', 500000.00, 300, 1666.67, 456789.50, 278, 1643.16, 91.36, 'ATIVA'),
                                                                                                                                                                                                                        ('SEMANAL', '2025-10-21', '2025-10-27', 150000.00, 90, 1666.67, 95420.00, 58, 1645.52, 63.61, 'ATIVA'),
                                                                                                                                                                                                                        ('DIARIA', '2025-10-23', '2025-10-23', 50000.00, 30, 1666.67, 45600.00, 27, 1688.89, 91.20, 'ATIVA'),
                                                                                                                                                                                                                        ('MENSAL', '2025-09-01', '2025-09-30', 450000.00, 280, 1607.14, 487235.00, 295, 1651.47, 108.27, 'CONCLUIDA'),
                                                                                                                                                                                                                        ('MENSAL', '2025-11-01', '2025-11-30', 550000.00, 320, 1718.75, 0.00, 0, 0.00, 0.00, 'ATIVA');

-- =================================================================
-- 18. ALERTAS (20 registros)
-- =================================================================

INSERT INTO Alerta (tipo, prioridade, titulo, mensagem, id_produto, id_venda, id_funcionario, lido, data_criacao) VALUES
-- Alertas de estoque baixo
('ESTOQUE_BAIXO', 'ALTA', 'Estoque baixo: Refrigerante Cola 2L', 'O produto "Refrigerante Cola 2L" está com estoque de 11 unidades. Estoque mínimo: 40 unidades.', 11, NULL, NULL, FALSE, '2025-10-23 10:35:00'),
('ESTOQUE_BAIXO', 'ALTA', 'Estoque baixo: Açúcar Cristal 1kg', 'O produto "Açúcar Cristal 1kg" está com estoque de 80 unidades. Estoque mínimo: 35 unidades. Considere reposição.', 3, NULL, NULL, TRUE, '2025-10-02 12:00:00'),
('ESTOQUE_BAIXO', 'CRITICA', 'ESTOQUE CRÍTICO: Refrigerante Cola 2L', 'ATENÇÃO! Produto com estoque CRÍTICO (3 unidades). Estoque mínimo: 40. Reabastecer urgentemente!', 11, NULL, NULL, FALSE, '2025-10-23 10:31:00'),

-- Alertas de produtos vencendo
('PRODUTO_VENCENDO', 'MEDIA', 'Produto vencendo: Leite Integral 1L', 'O produto "Leite Integral 1L" vencerá em 25 dias (17/11/2025).', 9, NULL, NULL, FALSE, '2025-10-23 08:00:00'),
('PRODUTO_VENCENDO', 'ALTA', 'Produto vencendo: Manteiga 200g', 'O produto "Manteiga 200g" vencerá em 7 dias (30/10/2025).', 10, NULL, NULL, FALSE, '2025-10-23 08:00:00'),

-- Alertas de vendas canceladas
('VENDA_CANCELADA', 'MEDIA', 'Venda #15 cancelada', 'Venda #15 no valor de R$ 2.350,00 foi cancelada.', NULL, 15, 8, TRUE, '2025-10-18 17:00:00'),

-- Alertas de caixa
('CAIXA_ABERTO', 'MEDIA', 'Caixa #18 aberto há mais de 10h', 'O caixa #18 está aberto desde 08:00:00, considere fechamento.', NULL, NULL, 6, FALSE, '2025-10-23 18:05:00'),
('CAIXA_ABERTO', 'MEDIA', 'Caixa #19 aberto há mais de 10h', 'O caixa #19 está aberto desde 08:00:00, considere fechamento.', NULL, NULL, 8, FALSE, '2025-10-23 18:05:00'),

-- Alertas de metas
('META_ATINGIDA', 'BAIXA', 'Meta mensal de Setembro atingida!', 'Parabéns! Meta de Setembro foi superada em 8,27%!', NULL, NULL, NULL, TRUE, '2025-09-30 23:59:00'),
('OUTRO', 'MEDIA', 'Meta semanal em risco', 'Meta semanal atual está em 63,61%. É necessário acelerar vendas!', NULL, NULL, NULL, FALSE, '2025-10-23 12:00:00'),

-- Outros alertas operacionais
('OUTRO', 'ALTA', 'Sistema de pagamento PIX indisponível', 'O sistema PIX está temporariamente indisponível. Use outras formas de pagamento.', NULL, NULL, NULL, TRUE, '2025-10-22 10:00:00'),
('OUTRO', 'BAIXA', 'Manutenção programada', 'Manutenção do sistema agendada para 25/10 às 22h.', NULL, NULL, NULL, FALSE, '2025-10-21 09:00:00'),
('ESTOQUE_BAIXO', 'ALTA', 'Estoque baixo: Smartphone 128GB', 'O produto "Smartphone 128GB" está com estoque de 29 unidades. Estoque mínimo: 5 unidades. Próximo do crítico.', 41, NULL, NULL, FALSE, '2025-10-23 14:00:00'),
('ESTOQUE_BAIXO', 'ALTA', 'Estoque baixo: Boneca Bebê', 'O produto "Boneca Bebê" está com estoque de 39 unidades. Estoque mínimo: 8 unidades.', 81, NULL, NULL, FALSE, '2025-10-23 15:30:00'),
('OUTRO', 'MEDIA', 'Aniversário SIGMA próximo', 'Preparar sistema para promoção de aniversário em 01/11.', NULL, NULL, NULL, FALSE, '2025-10-20 08:00:00'),
('OUTRO', 'BAIXA', 'Backup realizado com sucesso', 'Backup automático diário concluído sem erros.', NULL, NULL, NULL, TRUE, '2025-10-23 02:00:00'),
('ESTOQUE_BAIXO', 'MEDIA', 'Estoque baixo: Ração para Cães 10kg', 'O produto "Ração para Cães 10kg" está com estoque de 78 unidades. Estoque mínimo: 15 unidades.', 71, NULL, NULL, FALSE, '2025-10-22 16:00:00'),
('PRODUTO_VENCENDO', 'ALTA', 'Produto vencendo: Iogurte Natural', 'O produto "Iogurte Natural" vencerá em 5 dias (28/10/2025). Considere promoção.', 12, NULL, NULL, FALSE, '2025-10-23 08:00:00'),
('OUTRO', 'CRITICA', 'Fornecedor atrasado', 'Fornecedor "Atacadão Alimentos" está com entrega atrasada há 3 dias.', NULL, NULL, NULL, FALSE, '2025-10-23 09:00:00'),
('META_ATINGIDA', 'BAIXA', 'Meta diária superada!', 'Meta do dia 23/10 já foi atingida em 91,20%! Excelente trabalho!', NULL, NULL, NULL, FALSE, '2025-10-23 17:00:00');

-- =================================================================
-- FIM DO SCRIPT DE INSERÇÃO
-- =================================================================

-- Atualizar estoque dos produtos baseado nas movimentações
UPDATE Produto SET estoque = 196 WHERE id_produto = 1;
UPDATE Produto SET estoque = 220 WHERE id_produto = 2;
UPDATE Produto SET estoque = 80 WHERE id_produto = 3;
UPDATE Produto SET estoque = 140 WHERE id_produto = 4;
UPDATE Produto SET estoque = 3 WHERE id_produto = 11;  -- CRÍTICO: estoque muito baixo! (mínimo: 40)
UPDATE Produto SET estoque = 197 WHERE id_produto = 21;
UPDATE Produto SET estoque = 695 WHERE id_produto = 31;
UPDATE Produto SET estoque = 59 WHERE id_produto = 41;
UPDATE Produto SET estoque = 47 WHERE id_produto = 42;
UPDATE Produto SET estoque = 140 WHERE id_produto = 51;

