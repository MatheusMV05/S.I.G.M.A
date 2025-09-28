package com.project.sigma.dto;


import com.project.sigma.model.Fornecedor;
import com.project.sigma.model.Pessoa;
import lombok.Data;

@Data
public class FornecedorDTO {

    private Pessoa pessoa;
    private Fornecedor fornecedor;
    private String telefone;
}
