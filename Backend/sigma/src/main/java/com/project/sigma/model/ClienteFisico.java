package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteFisico {
    private Long id_pessoa;
    private String cpf;
    private LocalDate data_nascimento;

    // Not stored in DB, populated when needed
    private Cliente cliente;

    public ClienteFisico(Long id_pessoa, String cpf, LocalDate data_nascimento) {
        this.id_pessoa = id_pessoa;
        this.cpf = cpf;
        this.data_nascimento = data_nascimento;
    }
}
