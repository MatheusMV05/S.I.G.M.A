package com.project.sigma.service;

import com.project.sigma.model.Usuario;
import com.project.sigma.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario criarUsuario(Usuario usuario) {
        // Criptografa a senha antes de salvar
        // A linha abaixo é a correção: setSenha -> setPassword
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuarioRepository.save(usuario);
        return usuario;
    }

    public Optional<Usuario> buscarPorLogin(String login) {
        return usuarioRepository.findByUsername(login);
    }

}