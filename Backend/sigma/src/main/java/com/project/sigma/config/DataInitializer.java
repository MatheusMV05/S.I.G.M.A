package com.project.sigma.config;

import com.project.sigma.model.Funcionario;
import com.project.sigma.model.Pessoa;
import com.project.sigma.model.Usuario;
import com.project.sigma.repository.FuncionarioRepository;
import com.project.sigma.repository.PessoaRepository;
import com.project.sigma.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PessoaRepository pessoaRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Override
    public void run(String... args) {
        criarAdministradorPadrao();
    }

    @Transactional
    protected void criarAdministradorPadrao() {
        try {
            // Verifica se o usuário 'admin' JÁ EXISTE
            if (usuarioRepository.findByUsername("admin").isPresent()) {
                System.out.println("Administrador padrão já existe no sistema.");
                return;
            }

            System.out.println("Nenhum administrador padrão encontrado. Criando usuário 'admin'...");


            Pessoa adminPessoa = new Pessoa();
            adminPessoa.setNome("Administrador");
            adminPessoa.setEmail("admin@sigma.com");


            // Salva a pessoa e obtém a entidade com o ID gerado pelo banco
            Pessoa pessoaSalva = pessoaRepository.save(adminPessoa);


            Funcionario adminFunc = new Funcionario();
            adminFunc.setId_pessoa(pessoaSalva.getId_pessoa()); // Usa o ID real
            adminFunc.setMatricula("ADMIN001");
            adminFunc.setSalario(BigDecimal.ZERO);
            adminFunc.setCargo("ADMINISTRADOR");
            adminFunc.setSetor("SISTEMAS");
            adminFunc.setData_admissao(LocalDate.now());
            adminFunc.setStatus(Funcionario.StatusFuncionario.ATIVO);

            funcionarioRepository.save(adminFunc);



            Usuario adminUsuario = new Usuario();
            adminUsuario.setId_pessoa(pessoaSalva.getId_pessoa());
            adminUsuario.setUsername("admin");
            adminUsuario.setPassword(passwordEncoder.encode("admin")); // Codifica a senha
            adminUsuario.setRole(Usuario.Role.ADMIN);
            adminUsuario.setStatus(Usuario.StatusUsuario.ATIVO);

            // Salva o novo administrador
            usuarioRepository.save(adminUsuario);

            System.out.println("Administrador padrão criado com sucesso.");
        } catch (Exception e) {
            System.err.println("Erro ao criar administrador padrão: " + e.getMessage());
            e.printStackTrace();
        }
    }
}