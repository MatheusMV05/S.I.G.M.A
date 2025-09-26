package com.project.sigma.service;

import com.project.sigma.model.Usuario;
import com.project.sigma.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario createUser(Usuario usuario) {
        // Criptografa a senha antes de salvar
        String senhaCriptografada = passwordEncoder.encode(usuario.getPassword());
        usuario.setSenha(senhaCriptografada);

        // Salva o usuário no banco de dados
        return usuarioRepository.save(usuario);
    }
}