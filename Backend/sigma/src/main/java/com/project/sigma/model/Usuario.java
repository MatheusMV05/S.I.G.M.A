package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements UserDetails {
    private Long id_pessoa;
    private String username;
    private String password;
    private Role role;
    private StatusUsuario status;
    private LocalDateTime ultimo_acesso;

    // Not stored in DB, populated when needed
    private Funcionario funcionario;

    public enum Role {
        ADMIN, USER
    }

    public enum StatusUsuario {
        ATIVO, INATIVO
    }

    public Usuario(Long id_pessoa, String username, String password, Role role) {
        this.id_pessoa = id_pessoa;
        this.username = username;
        this.password = password;
        this.role = role;
        this.status = StatusUsuario.ATIVO;
    }

    // Spring Security UserDetails implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status == StatusUsuario.ATIVO;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status == StatusUsuario.ATIVO;
    }
}