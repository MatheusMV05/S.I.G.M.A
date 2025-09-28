package com.project.sigma.controller;

import com.project.sigma.dto.LoginRequest;
import com.project.sigma.dto.LoginResponse;
import com.project.sigma.model.Usuario;
import com.project.sigma.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.project.sigma.model.Usuario;
import com.project.sigma.service.UsuarioService;
import com.project.sigma.repository.UsuarioRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("=== INICIO DO LOGIN ===");
            System.out.println("Método: POST /api/login");
            System.out.println("Body recebido - Login: " + loginRequest.getLogin() + ", Senha: " + (loginRequest.getSenha() != null ? "[PRESENTE]" : "[AUSENTE]"));
            System.out.println("Headers: Authorization = " + (loginRequest != null ? "OK" : "NULL"));
            
            // 1. Cria um objeto de autenticação com o login e a senha.
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    loginRequest.getLogin(),
                    loginRequest.getSenha()
            );

            System.out.println("Token de autenticação criado para: " + loginRequest.getLogin());

            // 2. O AuthenticationManager tenta autenticar.
            Authentication authentication = authenticationManager.authenticate(authToken);
            System.out.println("✅ Autenticação bem-sucedida para: " + loginRequest.getLogin());

            // 3. Se a autenticação for bem-sucedida, pegamos os dados do usuário.
            Usuario usuario = (Usuario) authentication.getPrincipal();
            System.out.println("✅ Usuário autenticado - Nome: " + usuario.getNome() + ", Role: " + usuario.getRole());

            // 4. Geramos o token JWT com base nos dados do usuário.
            String token = jwtService.generateToken(usuario);
            System.out.println("✅ Token JWT gerado: " + token.substring(0, 20) + "...");

            // 5. Retornamos o token para o cliente.
            LoginResponse response = new LoginResponse(token);
            System.out.println("✅ Resposta enviada com sucesso");
            System.out.println("=== FIM DO LOGIN ===");
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            System.err.println("❌ Credenciais inválidas para usuário: " + loginRequest.getLogin());
            System.err.println("Erro: " + e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", "Credenciais inválidas", "message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Erro durante o login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Erro interno do servidor", "message", e.getMessage()));
        }
    }

    @Autowired
    private UsuarioService usuarioService;

    // ATENÇÃO: Por agora, este endpoint será PÚBLICO para podermos testar.
    // Depois, iremos protegê-lo para que apenas admins possam criar usuários.
    @PostMapping("/auth/users")
    public ResponseEntity<Usuario> createUser(@RequestBody Usuario usuario) {
        Usuario novoUsuario = usuarioService.createUser(usuario);
        return ResponseEntity.status(201).body(novoUsuario);
    }

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/debug/user/{login}")
    public ResponseEntity<?> debugUser(@PathVariable String login) {
        try {
            Optional<Usuario> usuario = usuarioRepository.findByLogin(login);
            if (usuario.isPresent()) {
                Usuario u = usuario.get();
                Map<String, Object> info = new HashMap<>();
                info.put("id", u.getId());
                info.put("nome", u.getNome());
                info.put("login", u.getLogin());
                info.put("role", u.getRole());
                info.put("senhaHash", u.getSenha().substring(0, 15) + "...");
                return ResponseEntity.ok(info);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro: " + e.getMessage());
        }
    }

    @PostMapping("/debug/test-password")
    public ResponseEntity<?> testPassword(@RequestBody Map<String, String> request) {
        try {
            String login = request.get("login");
            String senha = request.get("senha");

            Optional<Usuario> usuario = usuarioRepository.findByLogin(login);
            if (usuario.isPresent()) {
                Usuario u = usuario.get();
                boolean senhaCorreta = passwordEncoder.matches(senha, u.getSenha());

                Map<String, Object> result = new HashMap<>();
                result.put("usuarioEncontrado", true);
                result.put("senhaCorreta", senhaCorreta);
                result.put("nome", u.getNome());
                result.put("role", u.getRole());

                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.ok(Map.of("usuarioEncontrado", false));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro: " + e.getMessage());
        }
    }

    @Autowired
    private PasswordEncoder passwordEncoder;
}
