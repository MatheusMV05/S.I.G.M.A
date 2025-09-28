package com.project.sigma.service;

import com.project.sigma.model.Usuario;
import com.project.sigma.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("Tentando carregar usuário: " + username);

        // Busca o usuário no repositório
        Usuario usuario = usuarioRepository.findByLogin(username)
                .orElseThrow(() -> {
                    System.err.println("Usuário não encontrado no banco: " + username);
                    return new UsernameNotFoundException("Usuário não encontrado: " + username);
                });

        System.out.println("Usuário encontrado no banco: " + usuario.getNome() + " - Role: " + usuario.getRole());
        System.out.println("Senha no banco (hash): " + usuario.getSenha().substring(0, 10) + "...");

        return usuario;
    }
}
