create database if not exists SIGMA;
use SIGMA;
create table if not exists Pessoa (
	id_pessoa int auto_increment primary key,
    nome varchar(255) not null,
    rua varchar(255),
    numero VARCHAR(20),
    bairro VARCHAR(100),
    cidade VARCHAR(100)
);
create table if not exists Telefone (
	telefone_id int auto_increment primary key,
    numero varchar(20) not null,
    id_pessoa int not null,
    foreign key (id_pessoa) references Pessoa(id_pessoa) on delete cascade
);
CREATE TABLE IF NOT EXISTS Categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);
create table if not exists Fornecedor (
id_fornecedor int auto_increment primary key,
cnpj varchar(18) unique not null
);
create table if not exists Produto (
id_produto int auto_increment primary key,
nome varchar(255) not null,
marca varchar(100),
quant_em_estoque int not null default 0,
valor_unitario decimal(10, 2) not null,
data_validade date,
id_categoria int,
descricao TEXT,
estoque_minimo INT,
estoque_maximo INT,
foreign key (id_categoria) references Categoria(id_categoria)
);
create table if not exists Fornece (
id_fornecedor int,
id_produto int,
quantidade_recebida int not null,
valor_de_compra decimal(10, 2) not null,
data_da_compra datetime default current_timestamp,
foreign key (id_fornecedor) references Fornecedor(id_fornecedor),
foreign key (id_produto) references Produto(id_produto),
primary key (id_fornecedor, id_produto, data_da_compra)
);
create table if not exists Cliente (
	id_pessoa int primary key,
    foreign key (id_pessoa) references Pessoa(id_pessoa) on delete cascade
);
create table if not exists funcionario (
    id_pessoa int primary key,
    matricula varchar(20) unique not null,
    salario decimal(10, 2) not null,
    cargo varchar(100),
    setor varchar(100),
    id_supervisor int null,
    foreign key (id_pessoa) references pessoa(id_pessoa) on delete cascade,
    foreign key (id_supervisor) references funcionario(id_pessoa) on delete set null
);
create table if not exists compra_atende (
    id_compra int auto_increment primary key,
    data_hora datetime default current_timestamp,
    valor_total decimal(10, 2) not null,
    id_funcionario int not null,
    id_cliente int null,
    foreign key (id_funcionario) references funcionario(id_pessoa),
    foreign key (id_cliente) references cliente(id_pessoa)
);
create table if not exists contem_itens (
    id_compra int not null,
    id_produto int not null,
    quantidade int not null,
    foreign key (id_compra) references compra_atende(id_compra) on delete cascade,
    foreign key (id_produto) references produto(id_produto),
    primary key (id_compra, id_produto)
);

-- Tabela modificada para cumprir os requisitos da implementação backend!
CREATE TABLE IF NOT EXISTS usuario (
    id_pessoa INT PRIMARY KEY,
    login VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_pessoa) REFERENCES funcionario(id_pessoa) ON DELETE CASCADE
);
create table if not exists prateleira (
    id_prateleira int auto_increment primary key,
    localizacao varchar(255) not null,
    id_categoria int null, 
    foreign key (id_categoria) references categoria(id_categoria)
);
create table if not exists guardado (
    id_prateleira int not null,
    id_produto int not null,
    quant_em_prateleira int not null,
    foreign key (id_prateleira) references prateleira(id_prateleira) on delete cascade,
    foreign key (id_produto) references produto(id_produto) on delete cascade,
    primary key (id_prateleira, id_produto)
);
create table if not exists promocao (
    id_promocao int auto_increment primary key,
    percentual_desconto decimal(5, 2) not null,
    data_inicio date not null,
    data_fim date not null
);
create table if not exists aplica_se_a (
    id_promocao int not null,
    id_produto int not null,
    foreign key (id_promocao) references promocao(id_promocao) on delete cascade,
    foreign key (id_produto) references produto(id_produto) on delete cascade,
    primary key (id_promocao, id_produto)
);
create table if not exists cliente_fisica (
    id_pessoa int primary key,
    cpf varchar(14) unique not null,
    foreign key (id_pessoa) references cliente(id_pessoa) on delete cascade
);
create table if not exists cliente_juridico (
    id_pessoa int primary key,
    cnpj varchar(18) unique not null,
    foreign key (id_pessoa) references cliente(id_pessoa) on delete cascade
);

alter table telefone 
drop foreign key telefone_ibfk_1;
alter table telefone 
add constraint fk_telefone_pessoa 
foreign key (id_pessoa) references pessoa(id_pessoa)
on delete cascade
on update cascade;



    



