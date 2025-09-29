package com.project.sigma.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor // Construtor com todos os argumentos
public class LoginResponse {

    private Long id;
    private String nome;
    private String username;
    private String role;
    private String token;

}