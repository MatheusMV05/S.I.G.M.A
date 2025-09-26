package com.project.sigma.service;

import com.project.sigma.model.Usuario;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    // 1. CHAVE SECRETA: Use uma chave longa e segura. Em um projeto real,
    //    isso viria de um arquivo de configuração (application.properties).
    //    Esta chave precisa ter no mínimo 256 bits (32 bytes).
    private static final String SECRET_KEY = "sua_chave_secreta_muito_longa_e_segura_para_o_sigma_32_bytes";

    // 2. TEMPO DE EXPIRAÇÃO: Define por quanto tempo o token será válido.
    //    Aqui, estamos definindo para 1 hora (em milissegundos).
    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hora

    public String generateToken(Usuario usuario) {
        // 3. CLAIMS: São as informações que queremos colocar dentro do token.
        //    O "subject" (sub) é, por padrão, o login do usuário.
        //    Podemos adicionar informações extras (claims) como nome, roles, etc.
        Map<String, Object> claims = new HashMap<>();
        claims.put("nome", usuario.getNome());
        claims.put("role", usuario.getRole());

        // 4. CONSTRUÇÃO DO TOKEN
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(usuario.getLogin())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                // 5. ASSINATURA: Assina o token com o algoritmo HS256 e a chave secreta.
                //    Isso garante que o token não foi modificado.
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Método privado para obter a chave de assinatura.
    private Key getSigningKey() {
        byte[] keyBytes = SECRET_KEY.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}