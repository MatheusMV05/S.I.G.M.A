package com.project.sigma.service;

import com.project.sigma.dto.*;
import com.project.sigma.repository.ConsultasAvancadasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Service para executar consultas avançadas e acessar views
 * Utiliza Repository com JDBC puro (sem JPA) conforme requisitos do projeto
 */
@Service
public class AdvancedQueriesService {

    @Autowired
    private ConsultasAvancadasRepository repository;

    /**
     * CONSULTA 1: Produtos que nunca foram vendidos (ANTI JOIN)
     */
    public List<ProdutoNuncaVendidoDTO> getProdutosNuncaVendidos() {
        return repository.produtosNuncaVendidos();
    }

    /**
     * CONSULTA 2: Produtos e Fornecedores - FULL OUTER JOIN (simulado com UNION)
     */
    public List<ProdutoFornecedorDTO> getProdutosFornecedoresFullOuter() {
        return repository.produtosEFornecedoresFullOuter();
    }

    /**
     * CONSULTA 3: Produtos com preço ACIMA DA MÉDIA (SUBCONSULTA)
     */
    public List<ProdutoAcimaMediaDTO> getProdutosAcimaDaMedia() {
        return repository.produtosAcimaDaMedia();
    }

    /**
     * CONSULTA 4: Clientes VIP - compraram MAIS QUE A MÉDIA (SUBCONSULTA)
     */
    public List<ClienteVIPDTO> getClientesVIP() {
        return repository.clientesCompraramAcimaMedia();
    }

    /**
     * VIEW 1: Relatório completo de vendas
     */
    public List<RelatorioVendaDTO> getRelatorioVendas(LocalDate dataInicio, LocalDate dataFim) {
        return repository.consultarViewRelatorioVendas(dataInicio, dataFim);
    }

    /**
     * VIEW 2: Estoque completo com informações de categoria e fornecedor
     */
    public List<EstoqueCompletoDTO> getEstoqueCompleto(String statusEstoque) {
        return repository.consultarViewEstoqueCompleto(statusEstoque);
    }
}
