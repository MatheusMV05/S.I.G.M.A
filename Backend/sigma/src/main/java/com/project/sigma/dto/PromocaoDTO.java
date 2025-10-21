package com.project.sigma.dto;

import com.project.sigma.model.Produto;
import com.project.sigma.model.Promocao;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

// Este DTO será a resposta completa da promoção
@Data
public class PromocaoDTO {
    private Long id_promocao;
    private String nome;
    private String descricao;
    private Promocao.TipoDesconto tipo_desconto;
    private BigDecimal valor_desconto;
    private LocalDate data_inicio;
    private LocalDate data_fim;
    private Promocao.StatusPromocao status;

    // Lista completa dos objetos Produto
    private List<Produto> produtos;

    // Campos de Analytics (a ser implementado depois)
    private Integer applicationsCount;
    private BigDecimal totalSales;

    // Método helper para mapear da Entidade para o DTO
    public static PromocaoDTO fromEntity(Promocao promocao) {
        PromocaoDTO dto = new PromocaoDTO();
        dto.setId_promocao(promocao.getId_promocao());
        dto.setNome(promocao.getNome());
        dto.setDescricao(promocao.getDescricao());
        dto.setTipo_desconto(promocao.getTipo_desconto());
        dto.setValor_desconto(promocao.getValor_desconto());
        dto.setData_inicio(promocao.getData_inicio());
        dto.setData_fim(promocao.getData_fim());
        dto.setStatus(promocao.getStatus());
        dto.setProdutos(promocao.getProdutos()); // Assumindo que foi populado pelo Service

        // Mock de dados de analytics por enquanto
        dto.setApplicationsCount(0);
        dto.setTotalSales(BigDecimal.ZERO);

        return dto;
    }
}
