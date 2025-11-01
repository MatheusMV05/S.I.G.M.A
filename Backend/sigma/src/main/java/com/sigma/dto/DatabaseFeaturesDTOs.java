package com.sigma.dto;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

/**
 * DTOs para as funcionalidades avançadas do banco de dados (Etapas 04 e 05)
 * Todos os DTOs em um único arquivo para evitar poluição do projeto
 */
public class DatabaseFeaturesDTOs {

    // =====================================================
    // DTOs para PROCEDURES
    // =====================================================
    
    /**
     * Produto crítico do procedimento sp_relatorio_produtos_criticos
     */
    public static class ProdutoCritico {
        private Long idProduto;
        private String nomeProduto;
        private String categoria;
        private Integer estoqueAtual;
        private Integer estoqueMinimo;
        private Integer deficit;
        private BigDecimal precoCusto;
        private BigDecimal precoVenda;
        private BigDecimal valorReposicaoNecessaria;
        private String fornecedor;
        private String telefoneFornecedor;
        private Date dataValidade;
        private Integer diasAteVencimento;
        private Integer diasDesdeCadastro;
        private String criticidade;
        private String motivoCriticidade;
        private String acaoRecomendada;
        private Integer prioridade;

        public ProdutoCritico() {}

        public ProdutoCritico(Long idProduto, String nomeProduto, String categoria, Integer estoqueAtual,
                            Integer estoqueMinimo, Integer deficit, BigDecimal precoCusto,
                            BigDecimal precoVenda, BigDecimal valorReposicaoNecessaria,
                            String fornecedor, String telefoneFornecedor, Date dataValidade,
                            Integer diasAteVencimento, Integer diasDesdeCadastro, String criticidade,
                            String motivoCriticidade, String acaoRecomendada, Integer prioridade) {
            this.idProduto = idProduto;
            this.nomeProduto = nomeProduto;
            this.categoria = categoria;
            this.estoqueAtual = estoqueAtual;
            this.estoqueMinimo = estoqueMinimo;
            this.deficit = deficit;
            this.precoCusto = precoCusto;
            this.precoVenda = precoVenda;
            this.valorReposicaoNecessaria = valorReposicaoNecessaria;
            this.fornecedor = fornecedor;
            this.telefoneFornecedor = telefoneFornecedor;
            this.dataValidade = dataValidade;
            this.diasAteVencimento = diasAteVencimento;
            this.diasDesdeCadastro = diasDesdeCadastro;
            this.criticidade = criticidade;
            this.motivoCriticidade = motivoCriticidade;
            this.acaoRecomendada = acaoRecomendada;
            this.prioridade = prioridade;
        }

        // Getters e Setters
        public Long getIdProduto() { return idProduto; }
        public void setIdProduto(Long idProduto) { this.idProduto = idProduto; }

        public String getNomeProduto() { return nomeProduto; }
        public void setNomeProduto(String nomeProduto) { this.nomeProduto = nomeProduto; }

        public String getCategoria() { return categoria; }
        public void setCategoria(String categoria) { this.categoria = categoria; }

        public Integer getEstoqueAtual() { return estoqueAtual; }
        public void setEstoqueAtual(Integer estoqueAtual) { this.estoqueAtual = estoqueAtual; }

        public Integer getEstoqueMinimo() { return estoqueMinimo; }
        public void setEstoqueMinimo(Integer estoqueMinimo) { this.estoqueMinimo = estoqueMinimo; }

        public Integer getDeficit() { return deficit; }
        public void setDeficit(Integer deficit) { this.deficit = deficit; }

        public BigDecimal getPrecoCusto() { return precoCusto; }
        public void setPrecoCusto(BigDecimal precoCusto) { this.precoCusto = precoCusto; }

        public BigDecimal getPrecoVenda() { return precoVenda; }
        public void setPrecoVenda(BigDecimal precoVenda) { this.precoVenda = precoVenda; }

        public BigDecimal getValorReposicaoNecessaria() { return valorReposicaoNecessaria; }
        public void setValorReposicaoNecessaria(BigDecimal valorReposicaoNecessaria) { this.valorReposicaoNecessaria = valorReposicaoNecessaria; }

        public String getFornecedor() { return fornecedor; }
        public void setFornecedor(String fornecedor) { this.fornecedor = fornecedor; }

        public String getTelefoneFornecedor() { return telefoneFornecedor; }
        public void setTelefoneFornecedor(String telefoneFornecedor) { this.telefoneFornecedor = telefoneFornecedor; }

        public Date getDataValidade() { return dataValidade; }
        public void setDataValidade(Date dataValidade) { this.dataValidade = dataValidade; }

        public Integer getDiasAteVencimento() { return diasAteVencimento; }
        public void setDiasAteVencimento(Integer diasAteVencimento) { this.diasAteVencimento = diasAteVencimento; }

        public Integer getDiasDesdeCadastro() { return diasDesdeCadastro; }
        public void setDiasDesdeCadastro(Integer diasDesdeCadastro) { this.diasDesdeCadastro = diasDesdeCadastro; }

        public String getCriticidade() { return criticidade; }
        public void setCriticidade(String criticidade) { this.criticidade = criticidade; }

        public String getMotivoCriticidade() { return motivoCriticidade; }
        public void setMotivoCriticidade(String motivoCriticidade) { this.motivoCriticidade = motivoCriticidade; }

        public String getAcaoRecomendada() { return acaoRecomendada; }
        public void setAcaoRecomendada(String acaoRecomendada) { this.acaoRecomendada = acaoRecomendada; }

        public Integer getPrioridade() { return prioridade; }
        public void setPrioridade(Integer prioridade) { this.prioridade = prioridade; }
    }

    /**
     * Resumo do relatório de produtos críticos
     */
    public static class ResumoRelatorio {
        private Integer totalProdutosCriticos;
        private Integer criticos;
        private Integer urgentes;
        private Integer atencao;
        private BigDecimal valorTotalReposicao;
        private Timestamp dataHoraRelatorio;

        public ResumoRelatorio() {}

        public ResumoRelatorio(Integer totalProdutosCriticos, Integer criticos, Integer urgentes,
                             Integer atencao, BigDecimal valorTotalReposicao, Timestamp dataHoraRelatorio) {
            this.totalProdutosCriticos = totalProdutosCriticos;
            this.criticos = criticos;
            this.urgentes = urgentes;
            this.atencao = atencao;
            this.valorTotalReposicao = valorTotalReposicao;
            this.dataHoraRelatorio = dataHoraRelatorio;
        }

        // Getters e Setters
        public Integer getTotalProdutosCriticos() { return totalProdutosCriticos; }
        public void setTotalProdutosCriticos(Integer totalProdutosCriticos) { this.totalProdutosCriticos = totalProdutosCriticos; }

        public Integer getCriticos() { return criticos; }
        public void setCriticos(Integer criticos) { this.criticos = criticos; }

        public Integer getUrgentes() { return urgentes; }
        public void setUrgentes(Integer urgentes) { this.urgentes = urgentes; }

        public Integer getAtencao() { return atencao; }
        public void setAtencao(Integer atencao) { this.atencao = atencao; }

        public BigDecimal getValorTotalReposicao() { return valorTotalReposicao; }
        public void setValorTotalReposicao(BigDecimal valorTotalReposicao) { this.valorTotalReposicao = valorTotalReposicao; }

        public Timestamp getDataHoraRelatorio() { return dataHoraRelatorio; }
        public void setDataHoraRelatorio(Timestamp dataHoraRelatorio) { this.dataHoraRelatorio = dataHoraRelatorio; }
    }

    /**
     * Response completa do procedimento sp_relatorio_produtos_criticos
     */
    public static class RelatoriosCriticosResponse {
        private List<ProdutoCritico> produtos;
        private ResumoRelatorio resumo;

        public RelatoriosCriticosResponse() {}

        public RelatoriosCriticosResponse(List<ProdutoCritico> produtos, ResumoRelatorio resumo) {
            this.produtos = produtos;
            this.resumo = resumo;
        }

        public List<ProdutoCritico> getProdutos() { return produtos; }
        public void setProdutos(List<ProdutoCritico> produtos) { this.produtos = produtos; }

        public ResumoRelatorio getResumo() { return resumo; }
        public void setResumo(ResumoRelatorio resumo) { this.resumo = resumo; }
    }

    // =====================================================
    // DTOs para CONSULTAS AVANÇADAS
    // =====================================================

    /**
     * Consulta 01: Produtos que nunca foram vendidos (ANTI JOIN)
     */
    public static class ProdutoNuncaVendido {
        private Long idProduto;
        private String produtoNome;
        private String marca;
        private BigDecimal precoVenda;
        private Integer estoque;
        private String categoriaNome;
        private String fornecedorNome;
        private BigDecimal valorInvestido;
        private BigDecimal valorPotencialVenda;
        private Integer diasSemVenda;

        public ProdutoNuncaVendido() {}

        public ProdutoNuncaVendido(Long idProduto, String produtoNome, String marca, BigDecimal precoVenda,
                                 Integer estoque, String categoriaNome, String fornecedorNome,
                                 BigDecimal valorInvestido, BigDecimal valorPotencialVenda, Integer diasSemVenda) {
            this.idProduto = idProduto;
            this.produtoNome = produtoNome;
            this.marca = marca;
            this.precoVenda = precoVenda;
            this.estoque = estoque;
            this.categoriaNome = categoriaNome;
            this.fornecedorNome = fornecedorNome;
            this.valorInvestido = valorInvestido;
            this.valorPotencialVenda = valorPotencialVenda;
            this.diasSemVenda = diasSemVenda;
        }

        // Getters e Setters
        public Long getIdProduto() { return idProduto; }
        public void setIdProduto(Long idProduto) { this.idProduto = idProduto; }

        public String getProdutoNome() { return produtoNome; }
        public void setProdutoNome(String produtoNome) { this.produtoNome = produtoNome; }

        public String getMarca() { return marca; }
        public void setMarca(String marca) { this.marca = marca; }

        public BigDecimal getPrecoVenda() { return precoVenda; }
        public void setPrecoVenda(BigDecimal precoVenda) { this.precoVenda = precoVenda; }

        public Integer getEstoque() { return estoque; }
        public void setEstoque(Integer estoque) { this.estoque = estoque; }

        public String getCategoriaNome() { return categoriaNome; }
        public void setCategoriaNome(String categoriaNome) { this.categoriaNome = categoriaNome; }

        public String getFornecedorNome() { return fornecedorNome; }
        public void setFornecedorNome(String fornecedorNome) { this.fornecedorNome = fornecedorNome; }

        public BigDecimal getValorInvestido() { return valorInvestido; }
        public void setValorInvestido(BigDecimal valorInvestido) { this.valorInvestido = valorInvestido; }

        public BigDecimal getValorPotencialVenda() { return valorPotencialVenda; }
        public void setValorPotencialVenda(BigDecimal valorPotencialVenda) { this.valorPotencialVenda = valorPotencialVenda; }

        public Integer getDiasSemVenda() { return diasSemVenda; }
        public void setDiasSemVenda(Integer diasSemVenda) { this.diasSemVenda = diasSemVenda; }
    }

    /**
     * Consulta 02: Produtos com preço acima da média (SUBCONSULTA SIMPLES)
     */
    public static class ProdutoPremium {
        private Long idProduto;
        private String produtoNome;
        private String marca;
        private BigDecimal precoVenda;
        private BigDecimal precoCusto;
        private BigDecimal margemLucro;
        private String categoriaNome;
        private BigDecimal precoMedioCategoria;
        private BigDecimal diferencaMedia;
        private BigDecimal percentualAcimaMedia;

        public ProdutoPremium() {}

        public ProdutoPremium(Long idProduto, String produtoNome, String marca, BigDecimal precoVenda,
                            BigDecimal precoCusto, BigDecimal margemLucro, String categoriaNome,
                            BigDecimal precoMedioCategoria, BigDecimal diferencaMedia, BigDecimal percentualAcimaMedia) {
            this.idProduto = idProduto;
            this.produtoNome = produtoNome;
            this.marca = marca;
            this.precoVenda = precoVenda;
            this.precoCusto = precoCusto;
            this.margemLucro = margemLucro;
            this.categoriaNome = categoriaNome;
            this.precoMedioCategoria = precoMedioCategoria;
            this.diferencaMedia = diferencaMedia;
            this.percentualAcimaMedia = percentualAcimaMedia;
        }

        // Getters e Setters
        public Long getIdProduto() { return idProduto; }
        public void setIdProduto(Long idProduto) { this.idProduto = idProduto; }

        public String getProdutoNome() { return produtoNome; }
        public void setProdutoNome(String produtoNome) { this.produtoNome = produtoNome; }

        public String getMarca() { return marca; }
        public void setMarca(String marca) { this.marca = marca; }

        public BigDecimal getPrecoVenda() { return precoVenda; }
        public void setPrecoVenda(BigDecimal precoVenda) { this.precoVenda = precoVenda; }

        public BigDecimal getPrecoCusto() { return precoCusto; }
        public void setPrecoCusto(BigDecimal precoCusto) { this.precoCusto = precoCusto; }

        public BigDecimal getMargemLucro() { return margemLucro; }
        public void setMargemLucro(BigDecimal margemLucro) { this.margemLucro = margemLucro; }

        public String getCategoriaNome() { return categoriaNome; }
        public void setCategoriaNome(String categoriaNome) { this.categoriaNome = categoriaNome; }

        public BigDecimal getPrecoMedioCategoria() { return precoMedioCategoria; }
        public void setPrecoMedioCategoria(BigDecimal precoMedioCategoria) { this.precoMedioCategoria = precoMedioCategoria; }

        public BigDecimal getDiferencaMedia() { return diferencaMedia; }
        public void setDiferencaMedia(BigDecimal diferencaMedia) { this.diferencaMedia = diferencaMedia; }

        public BigDecimal getPercentualAcimaMedia() { return percentualAcimaMedia; }
        public void setPercentualAcimaMedia(BigDecimal percentualAcimaMedia) { this.percentualAcimaMedia = percentualAcimaMedia; }
    }

    /**
     * Consulta 03: Clientes VIP (SUBCONSULTA CORRELACIONADA)
     */
    public static class ClienteVIP {
        private Long idPessoa;
        private String clienteNome;
        private String clienteEmail;
        private String tipoPessoa;
        private Integer ranking;
        private BigDecimal totalGasto;
        private Date dataUltimaCompra;
        private Integer totalCompras;
        private BigDecimal ticketMedio;
        private BigDecimal mediaGastoGeral;
        private BigDecimal diferencaMedia;
        private BigDecimal percentualAcimaMedia;

        public ClienteVIP() {}

        public ClienteVIP(Long idPessoa, String clienteNome, String clienteEmail, String tipoPessoa,
                        Integer ranking, BigDecimal totalGasto, Date dataUltimaCompra, Integer totalCompras,
                        BigDecimal ticketMedio, BigDecimal mediaGastoGeral, BigDecimal diferencaMedia,
                        BigDecimal percentualAcimaMedia) {
            this.idPessoa = idPessoa;
            this.clienteNome = clienteNome;
            this.clienteEmail = clienteEmail;
            this.tipoPessoa = tipoPessoa;
            this.ranking = ranking;
            this.totalGasto = totalGasto;
            this.dataUltimaCompra = dataUltimaCompra;
            this.totalCompras = totalCompras;
            this.ticketMedio = ticketMedio;
            this.mediaGastoGeral = mediaGastoGeral;
            this.diferencaMedia = diferencaMedia;
            this.percentualAcimaMedia = percentualAcimaMedia;
        }

        // Getters e Setters
        public Long getIdPessoa() { return idPessoa; }
        public void setIdPessoa(Long idPessoa) { this.idPessoa = idPessoa; }

        public String getClienteNome() { return clienteNome; }
        public void setClienteNome(String clienteNome) { this.clienteNome = clienteNome; }

        public String getClienteEmail() { return clienteEmail; }
        public void setClienteEmail(String clienteEmail) { this.clienteEmail = clienteEmail; }

        public String getTipoPessoa() { return tipoPessoa; }
        public void setTipoPessoa(String tipoPessoa) { this.tipoPessoa = tipoPessoa; }

        public Integer getRanking() { return ranking; }
        public void setRanking(Integer ranking) { this.ranking = ranking; }

        public BigDecimal getTotalGasto() { return totalGasto; }
        public void setTotalGasto(BigDecimal totalGasto) { this.totalGasto = totalGasto; }

        public Date getDataUltimaCompra() { return dataUltimaCompra; }
        public void setDataUltimaCompra(Date dataUltimaCompra) { this.dataUltimaCompra = dataUltimaCompra; }

        public Integer getTotalCompras() { return totalCompras; }
        public void setTotalCompras(Integer totalCompras) { this.totalCompras = totalCompras; }

        public BigDecimal getTicketMedio() { return ticketMedio; }
        public void setTicketMedio(BigDecimal ticketMedio) { this.ticketMedio = ticketMedio; }

        public BigDecimal getMediaGastoGeral() { return mediaGastoGeral; }
        public void setMediaGastoGeral(BigDecimal mediaGastoGeral) { this.mediaGastoGeral = mediaGastoGeral; }

        public BigDecimal getDiferencaMedia() { return diferencaMedia; }
        public void setDiferencaMedia(BigDecimal diferencaMedia) { this.diferencaMedia = diferencaMedia; }

        public BigDecimal getPercentualAcimaMedia() { return percentualAcimaMedia; }
        public void setPercentualAcimaMedia(BigDecimal percentualAcimaMedia) { this.percentualAcimaMedia = percentualAcimaMedia; }
    }

    // =====================================================
    // DTOs para VIEWS
    // =====================================================

    /**
     * View: vw_analise_vendas_completa
     */
    public static class VendaCompleta {
        private Long idVenda;
        private Timestamp dataVenda;
        private BigDecimal valorTotal;
        private BigDecimal desconto;
        private BigDecimal valorFinal;
        private String metodoPagamento;
        private String clienteNome;
        private String clienteEmail;
        private Integer rankingCliente;
        private String vendedorNome;
        private String vendedorCargo;
        private BigDecimal percentualDesconto;
        private Integer quantidadeItens;

        public VendaCompleta() {}

        public VendaCompleta(Long idVenda, Timestamp dataVenda, BigDecimal valorTotal, BigDecimal desconto,
                           BigDecimal valorFinal, String metodoPagamento, String clienteNome, String clienteEmail,
                           Integer rankingCliente, String vendedorNome, String vendedorCargo,
                           BigDecimal percentualDesconto, Integer quantidadeItens) {
            this.idVenda = idVenda;
            this.dataVenda = dataVenda;
            this.valorTotal = valorTotal;
            this.desconto = desconto;
            this.valorFinal = valorFinal;
            this.metodoPagamento = metodoPagamento;
            this.clienteNome = clienteNome;
            this.clienteEmail = clienteEmail;
            this.rankingCliente = rankingCliente;
            this.vendedorNome = vendedorNome;
            this.vendedorCargo = vendedorCargo;
            this.percentualDesconto = percentualDesconto;
            this.quantidadeItens = quantidadeItens;
        }

        // Getters e Setters
        public Long getIdVenda() { return idVenda; }
        public void setIdVenda(Long idVenda) { this.idVenda = idVenda; }

        public Timestamp getDataVenda() { return dataVenda; }
        public void setDataVenda(Timestamp dataVenda) { this.dataVenda = dataVenda; }

        public BigDecimal getValorTotal() { return valorTotal; }
        public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }

        public BigDecimal getDesconto() { return desconto; }
        public void setDesconto(BigDecimal desconto) { this.desconto = desconto; }

        public BigDecimal getValorFinal() { return valorFinal; }
        public void setValorFinal(BigDecimal valorFinal) { this.valorFinal = valorFinal; }

        public String getMetodoPagamento() { return metodoPagamento; }
        public void setMetodoPagamento(String metodoPagamento) { this.metodoPagamento = metodoPagamento; }

        public String getClienteNome() { return clienteNome; }
        public void setClienteNome(String clienteNome) { this.clienteNome = clienteNome; }

        public String getClienteEmail() { return clienteEmail; }
        public void setClienteEmail(String clienteEmail) { this.clienteEmail = clienteEmail; }

        public Integer getRankingCliente() { return rankingCliente; }
        public void setRankingCliente(Integer rankingCliente) { this.rankingCliente = rankingCliente; }

        public String getVendedorNome() { return vendedorNome; }
        public void setVendedorNome(String vendedorNome) { this.vendedorNome = vendedorNome; }

        public String getVendedorCargo() { return vendedorCargo; }
        public void setVendedorCargo(String vendedorCargo) { this.vendedorCargo = vendedorCargo; }

        public BigDecimal getPercentualDesconto() { return percentualDesconto; }
        public void setPercentualDesconto(BigDecimal percentualDesconto) { this.percentualDesconto = percentualDesconto; }

        public Integer getQuantidadeItens() { return quantidadeItens; }
        public void setQuantidadeItens(Integer quantidadeItens) { this.quantidadeItens = quantidadeItens; }
    }

    /**
     * View: vw_inventario_rentabilidade
     */
    public static class InventarioRentabilidade {
        private Long idProduto;
        private String produtoNome;
        private String marca;
        private BigDecimal precoCusto;
        private BigDecimal precoVenda;
        private BigDecimal margemLucroPercentual;
        private Integer estoque;
        private Integer estoqueMinimo;
        private BigDecimal valorEstoqueVenda;
        private BigDecimal lucroPotencialEstoque;
        private String categoriaNome;
        private String fornecedorNome;
        private String statusEstoque;
        private String classificacaoRentabilidade;
        private String acaoRecomendada;

        public InventarioRentabilidade() {}

        public InventarioRentabilidade(Long idProduto, String produtoNome, String marca, BigDecimal precoCusto,
                                      BigDecimal precoVenda, BigDecimal margemLucroPercentual, Integer estoque,
                                      Integer estoqueMinimo, BigDecimal valorEstoqueVenda, BigDecimal lucroPotencialEstoque,
                                      String categoriaNome, String fornecedorNome, String statusEstoque,
                                      String classificacaoRentabilidade, String acaoRecomendada) {
            this.idProduto = idProduto;
            this.produtoNome = produtoNome;
            this.marca = marca;
            this.precoCusto = precoCusto;
            this.precoVenda = precoVenda;
            this.margemLucroPercentual = margemLucroPercentual;
            this.estoque = estoque;
            this.estoqueMinimo = estoqueMinimo;
            this.valorEstoqueVenda = valorEstoqueVenda;
            this.lucroPotencialEstoque = lucroPotencialEstoque;
            this.categoriaNome = categoriaNome;
            this.fornecedorNome = fornecedorNome;
            this.statusEstoque = statusEstoque;
            this.classificacaoRentabilidade = classificacaoRentabilidade;
            this.acaoRecomendada = acaoRecomendada;
        }

        // Getters e Setters
        public Long getIdProduto() { return idProduto; }
        public void setIdProduto(Long idProduto) { this.idProduto = idProduto; }

        public String getProdutoNome() { return produtoNome; }
        public void setProdutoNome(String produtoNome) { this.produtoNome = produtoNome; }

        public String getMarca() { return marca; }
        public void setMarca(String marca) { this.marca = marca; }

        public BigDecimal getPrecoCusto() { return precoCusto; }
        public void setPrecoCusto(BigDecimal precoCusto) { this.precoCusto = precoCusto; }

        public BigDecimal getPrecoVenda() { return precoVenda; }
        public void setPrecoVenda(BigDecimal precoVenda) { this.precoVenda = precoVenda; }

        public BigDecimal getMargemLucroPercentual() { return margemLucroPercentual; }
        public void setMargemLucroPercentual(BigDecimal margemLucroPercentual) { this.margemLucroPercentual = margemLucroPercentual; }

        public Integer getEstoque() { return estoque; }
        public void setEstoque(Integer estoque) { this.estoque = estoque; }

        public Integer getEstoqueMinimo() { return estoqueMinimo; }
        public void setEstoqueMinimo(Integer estoqueMinimo) { this.estoqueMinimo = estoqueMinimo; }

        public BigDecimal getValorEstoqueVenda() { return valorEstoqueVenda; }
        public void setValorEstoqueVenda(BigDecimal valorEstoqueVenda) { this.valorEstoqueVenda = valorEstoqueVenda; }

        public BigDecimal getLucroPotencialEstoque() { return lucroPotencialEstoque; }
        public void setLucroPotencialEstoque(BigDecimal lucroPotencialEstoque) { this.lucroPotencialEstoque = lucroPotencialEstoque; }

        public String getCategoriaNome() { return categoriaNome; }
        public void setCategoriaNome(String categoriaNome) { this.categoriaNome = categoriaNome; }

        public String getFornecedorNome() { return fornecedorNome; }
        public void setFornecedorNome(String fornecedorNome) { this.fornecedorNome = fornecedorNome; }

        public String getStatusEstoque() { return statusEstoque; }
        public void setStatusEstoque(String statusEstoque) { this.statusEstoque = statusEstoque; }

        public String getClassificacaoRentabilidade() { return classificacaoRentabilidade; }
        public void setClassificacaoRentabilidade(String classificacaoRentabilidade) { this.classificacaoRentabilidade = classificacaoRentabilidade; }

        public String getAcaoRecomendada() { return acaoRecomendada; }
        public void setAcaoRecomendada(String acaoRecomendada) { this.acaoRecomendada = acaoRecomendada; }
    }

    // =====================================================
    // DTOs para AUDITORIA
    // =====================================================

    /**
     * Tabela: AuditoriaLog (criada pelo trigger)
     */
    public static class LogAuditoria {
        private Long idLog;
        private String tabelaAfetada;
        private String operacao;
        private Long idRegistro;
        private String dadosAntigos;
        private String dadosNovos;
        private String descricao;
        private Timestamp dataHora;

        public LogAuditoria() {}

        public LogAuditoria(Long idLog, String tabelaAfetada, String operacao, Long idRegistro,
                          String dadosAntigos, String dadosNovos, String descricao, Timestamp dataHora) {
            this.idLog = idLog;
            this.tabelaAfetada = tabelaAfetada;
            this.operacao = operacao;
            this.idRegistro = idRegistro;
            this.dadosAntigos = dadosAntigos;
            this.dadosNovos = dadosNovos;
            this.descricao = descricao;
            this.dataHora = dataHora;
        }

        // Getters e Setters
        public Long getIdLog() { return idLog; }
        public void setIdLog(Long idLog) { this.idLog = idLog; }

        public String getTabelaAfetada() { return tabelaAfetada; }
        public void setTabelaAfetada(String tabelaAfetada) { this.tabelaAfetada = tabelaAfetada; }

        public String getOperacao() { return operacao; }
        public void setOperacao(String operacao) { this.operacao = operacao; }

        public Long getIdRegistro() { return idRegistro; }
        public void setIdRegistro(Long idRegistro) { this.idRegistro = idRegistro; }

        public String getDadosAntigos() { return dadosAntigos; }
        public void setDadosAntigos(String dadosAntigos) { this.dadosAntigos = dadosAntigos; }

        public String getDadosNovos() { return dadosNovos; }
        public void setDadosNovos(String dadosNovos) { this.dadosNovos = dadosNovos; }

        public String getDescricao() { return descricao; }
        public void setDescricao(String descricao) { this.descricao = descricao; }

        public Timestamp getDataHora() { return dataHora; }
        public void setDataHora(Timestamp dataHora) { this.dataHora = dataHora; }
    }
}
