package com.project.sigma.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.sigma.dto.ProdutoRequestDTO;
import java.math.BigDecimal;

public class TestProdutoMapping {
    public static void main(String[] args) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            
            // JSON que o frontend envia
            String jsonFromFrontend = """
                {
                    "nome": "Arroz Branco 5kg",
                    "marca": "Tio João", 
                    "valor_unitario": 25.90,
                    "quant_em_estoque": 50,
                    "id_categoria": 1,
                    "descricao": "Arroz branco tipo 1",
                    "estoque_minimo": 10,
                    "preco_custo": 18.13,
                    "status": "ATIVO",
                    "codigo_barras": "1234567890123",
                    "unidade": "UN",
                    "peso": 5.0
                }
            """;
            
            System.out.println("=== TESTE DE MAPEAMENTO JSON ===");
            System.out.println("JSON recebido do frontend:");
            System.out.println(jsonFromFrontend);
            
            // Tentar fazer o parse
            ProdutoRequestDTO dto = mapper.readValue(jsonFromFrontend, ProdutoRequestDTO.class);
            
            System.out.println("\n=== RESULTADO DO MAPEAMENTO ===");
            dto.debugPrint();
            
            // Verificar se o valor_unitario foi mapeado corretamente
            if (dto.getValorUnitario() != null) {
                System.out.println("\n✅ SUCESSO: valor_unitario foi mapeado corretamente!");
                System.out.println("Valor: " + dto.getValorUnitario());
            } else {
                System.out.println("\n❌ ERRO: valor_unitario está NULL após mapeamento!");
            }
            
        } catch (Exception e) {
            System.out.println("\n❌ ERRO NO MAPEAMENTO: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
