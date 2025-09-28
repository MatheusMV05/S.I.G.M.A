package com.project.sigma.config;

import com.project.sigma.model.Pessoa;
import com.project.sigma.model.Funcionario;
import com.project.sigma.model.Usuario;
import com.project.sigma.repository.PessoaRepository;
import com.project.sigma.repository.FuncionarioRepository;
import com.project.sigma.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private PessoaRepository pessoaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        criarAdministradorPadrao();
    }

    private void criarAdministradorPadrao() {
        // Verifica se já existe um usuário admin
        Optional<Usuario> adminExistente = usuarioRepository.findByLogin("admin");

        if (adminExistente.isEmpty()) {
            try {
                // 1. Criar a pessoa
                Pessoa adminPessoa = new Pessoa();
                adminPessoa.setNome("Administrador do Sistema");
                adminPessoa.setRua("Rua Principal");
                adminPessoa.setNumero("100");
                adminPessoa.setBairro("Centro");
                adminPessoa.setCidade("Sistema");

                // Salvar pessoa e obter ID gerado
                Pessoa pessoaSalva = pessoaRepository.salvar(adminPessoa);

                // 2. Criar o funcionário
                String funcionarioSql = "INSERT INTO funcionario (id_pessoa, matricula, salario, cargo, setor, id_supervisor) VALUES (?, ?, ?, ?, ?, ?)";
                jdbcTemplate.update(funcionarioSql,
                    pessoaSalva.getId_pessoa(),
                    "ADM001",
                    new BigDecimal("10000.00"),
                    "Administrador",
                    "TI",
                    null
                );

                // 3. Criar o usuário admin
                Usuario adminUsuario = new Usuario();
                adminUsuario.setId(pessoaSalva.getId_pessoa());
                adminUsuario.setNome(pessoaSalva.getNome());
                adminUsuario.setLogin("admin");
                adminUsuario.setSenha(passwordEncoder.encode("admin123"));
                adminUsuario.setRole("ADMIN");

                usuarioRepository.save(adminUsuario);

                System.out.println("=================================================");
                System.out.println("ADMINISTRADOR PADRÃO CRIADO COM SUCESSO!");
                System.out.println("Login: admin");
                System.out.println("Senha: admin123");
                System.out.println("Role: ADMIN");
                System.out.println("=================================================");

            } catch (Exception e) {
                System.err.println("Erro ao criar administrador padrão: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Administrador padrão já existe no sistema.");
        }
    }
}
