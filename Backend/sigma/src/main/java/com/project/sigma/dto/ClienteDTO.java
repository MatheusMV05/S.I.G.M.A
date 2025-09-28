package com.project.sigma.dto;

import lombok.Data;
import com.project.sigma.model.Pessoa;

@Data
public class ClienteDTO {

    //Usaremos composição para incluir todos os dados da Pessoa
    private Pessoa pessoa;

    //Campo da tabela Cliente
    private Integer ranke;

    //Campo da tabela cliente_fisica (pode ser nulo)
    private String cpf;

    //Campo da tabela cliente_juridico (pode ser nulo)
    private String cnpj;

    //Um campo para identificar o tipo de cliente (PF ou PJ)
    //Isso será útil para a lógica no frontend e backend.
    private String tipoCliente;

}
