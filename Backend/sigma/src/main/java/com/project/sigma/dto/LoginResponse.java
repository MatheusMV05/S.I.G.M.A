package com.project.sigma.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor // Cria um construtor com todos os argumentos
public class LoginResponse {
    private String token;
}
