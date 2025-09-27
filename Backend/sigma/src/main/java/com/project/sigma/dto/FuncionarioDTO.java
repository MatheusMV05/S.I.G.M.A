package com.project.sigma.dto;

import com.project.sigma.model.Funcionario;
import com.project.sigma.model.Pessoa;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FuncionarioDTO {

    private Pessoa pessoa;
    private Funcionario funcionario;

}
