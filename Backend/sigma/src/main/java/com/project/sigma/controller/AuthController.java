package com.project.sigma.controller;

import com.project.sigma.dto.LoginRequest;
import com.project.sigma.dto.LoginResponse;
import com.project.sigma.model.Usuario;
import com.project.sigma.service.JwtService;
import com.project.sigma.service.UserDetailServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailServiceImpl userDetailService;

    @Autowired
    private JwtService jwtService;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("=== INICIO DO LOGIN ===");
        System.out.println("Método: " + "POST /api/login");
        System.out.println("Body recebido - Login: " + loginRequest.getLogin() + ", Senha: [PRESENTE]");

        try {
            System.out.println("Headers: Authorization = OK");
            System.out.println("Token de autenticação criado para: " + loginRequest.getLogin());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getLogin(), loginRequest.getSenha())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            System.out.println("✅ Autenticação bem-sucedida para: " + loginRequest.getLogin());

            final Usuario userDetails = (Usuario) userDetailService.loadUserByUsername(loginRequest.getLogin());

            if (userDetails != null) {
                System.out.println("✅ Usuário autenticado - ID: " + userDetails.getId_pessoa() + ", Role: " + userDetails.getRole());

                final String token = jwtService.generateToken(userDetails);
                System.out.println("✅ Token JWT gerado: " + token.substring(0, 20) + "...");

                LoginResponse response = new LoginResponse(
                        userDetails.getId_pessoa(),
                        userDetails.getUsername(),
                        userDetails.getUsername(),
                        userDetails.getRole().name(),
                        token
                );

                System.out.println("✅ Resposta enviada com sucesso");
                System.out.println("=== FIM DO LOGIN ===");
                return ResponseEntity.ok(response);
            } else {
                throw new RuntimeException("Detalhes do usuário não encontrados após autenticação");
            }
        } catch (AuthenticationException e) {
            System.out.println("❌ Falha na autenticação: " + e.getMessage());
            System.out.println("=== FIM DO LOGIN ===");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
        } catch (Exception e) {
            System.err.println("❌ Erro durante o login: " + e.getMessage());
            e.printStackTrace();
            System.out.println("=== FIM DO LOGIN ===");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ocorreu um erro interno no servidor.");
        }
    }


    @PostMapping("/auth/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logout bem-sucedido.");
    }
}