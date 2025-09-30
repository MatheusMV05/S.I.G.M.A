package com.project.sigma.config;

import com.project.sigma.model.Usuario;
import com.project.sigma.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        criarAdministradorPadrao();
    }

    private void criarAdministradorPadrao() {
        try {
            // Verifica se o usuário 'admin' JÁ EXISTE usando o método findByUsername
            if (usuarioRepository.findByUsername("admin").isPresent()) {
                System.out.println("Administrador padrão já existe no sistema.");
                return;
            }

            System.out.println("Nenhum administrador padrão encontrado. Criando usuário 'admin'...");

            Usuario admin = new Usuario();
            admin.setId_pessoa(1L); // Setting a default ID for the admin user
            admin.setUsername("admin");
            // Codifica a senha antes de salvar
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole(Usuario.Role.ADMIN);
            admin.setStatus(Usuario.StatusUsuario.ATIVO);

            // Salva o novo administrador
            usuarioRepository.save(admin);
            System.out.println("Administrador padrão criado com sucesso.");
        } catch (Exception e) {
            System.err.println("Erro ao criar administrador padrão: " + e.getMessage());
            e.printStackTrace();
        }
    }
}