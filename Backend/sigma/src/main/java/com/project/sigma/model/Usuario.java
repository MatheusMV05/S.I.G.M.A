package com.project.sigma.model;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
public class Usuario implements UserDetails {

    private Long id;
    private String nome;
    private String login;
    private String senha;
    private String role; // Ex: "admin", "manager", "cashier"

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // O Spring Security espera uma lista de "Authorities".
        // O "ROLE_" é um prefixo padrão que o Spring usa para reconhecer as permissões.
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.role.toUpperCase()));
    }

    @Override
    public String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.login;
    }

    // Métodos de controle da conta (por agora, deixaremos todos como 'true')
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
