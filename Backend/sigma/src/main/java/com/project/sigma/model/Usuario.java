package com.project.sigma.model;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data // O Lombok @Data gera getters, setters, toString, etc.
public class Usuario implements UserDetails {

    private Long id_usuario;
    private String nome;
    private String username;
    private String password;
    private String role; // 'ADMIN' ou 'USER'
    private String status; // 'ATIVO' ou 'INATIVO'

    // Métodos da interface UserDetails que o Spring Security precisa

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // A role precisa ser prefixada com "ROLE_" para o Spring Security
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.role));
    }

    @Override
    public String getUsername() {
        return this.username; // O campo de login
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Podemos adicionar lógica para expirar contas no futuro
    }

    @Override
    public boolean isAccountNonLocked() {
        return "ATIVO".equals(this.status); // A conta está "destrancada" se o status for ATIVO
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Podemos adicionar lógica para expirar senhas no futuro
    }

    @Override
    public boolean isEnabled() {
        return "ATIVO".equals(this.status); // O usuário está "habilitado" se o status for ATIVO
    }
}