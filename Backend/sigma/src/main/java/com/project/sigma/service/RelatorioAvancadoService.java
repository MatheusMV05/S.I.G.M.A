package com.project.sigma.service;

import com.project.sigma.dto.ClienteVIPDTO;
import com.project.sigma.dto.ProdutoAcimaMediaDTO;
import com.project.sigma.dto.ProdutoNuncaVendidoDTO;
import com.project.sigma.repository.RelatorioAvancadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service para relatórios avançados com consultas SQL complexas
 * Feature #6 - Insights Inteligentes
 */
@Service
public class RelatorioAvancadoService {

    @Autowired
    private RelatorioAvancadoRepository relatorioRepository;

    /**
     * Feature #6: Produtos que nunca foram vendidos (ANTI JOIN)
     */
    public List<ProdutoNuncaVendidoDTO> buscarProdutosNuncaVendidos(Integer limit) {
        System.out.println("🔍 Service: Buscando produtos nunca vendidos - Limit: " + limit);
        return relatorioRepository.buscarProdutosNuncaVendidos(limit);
    }

    /**
     * Feature #6: Produtos com preço acima da média (SUBCONSULTA)
     */
    public List<ProdutoAcimaMediaDTO> buscarProdutosAcimaMedia(Integer limit) {
        System.out.println("💎 Service: Buscando produtos acima da média - Limit: " + limit);
        return relatorioRepository.buscarProdutosAcimaMedia(limit);
    }

    /**
     * Feature #6: Clientes VIP com gasto acima da média (SUBCONSULTA)
     */
    public List<ClienteVIPDTO> buscarClientesVIP(Integer limit) {
        System.out.println("⭐ Service: Buscando clientes VIP - Limit: " + limit);
        return relatorioRepository.buscarClientesVIP(limit);
    }
}
