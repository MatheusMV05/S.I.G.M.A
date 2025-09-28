package com.project.sigma.controller;

import com.project.sigma.dto.LoginRequest;
import com.project.sigma.dto.LoginResponse;
import com.project.sigma.model.Usuario;
import com.project.sigma.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.sigma.model.Usuario;
import com.project.sigma.service.UsuarioService;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        // 1. Cria um objeto de autenticação com o login e a senha.
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                loginRequest.getLogin(),
                loginRequest.getSenha()
        );

        // 2. O AuthenticationManager tenta autenticar.
        //    Ele vai usar nosso UserDetailServiceImpl para buscar o usuário
        //    e o PasswordEncoder para comparar as senhas.
        //    Se as credenciais estiverem erradas, ele lança uma exceção aqui.
        Authentication authentication = authenticationManager.authenticate(authToken);

        // 3. Se a autenticação for bem-sucedida, pegamos os dados do usuário.
        Usuario usuario = (Usuario) authentication.getPrincipal();

        // 4. Geramos o token JWT com base nos dados do usuário.
        String token = jwtService.generateToken(usuario);

        // 5. Retornamos o token para o cliente.
        return ResponseEntity.ok(new LoginResponse(token));
    }

    @Autowired
    private UsuarioService usuarioService;

    // ATENÇÃO: Por agora, este endpoint será PÚBLICO para podermos testar.
    // Depois, iremos protegê-lo para que apenas admins possam criar usuários.
    @PostMapping("/users")
    public ResponseEntity<Usuario> createUser(@RequestBody Usuario usuario) {
        Usuario novoUsuario = usuarioService.createUser(usuario);
        return ResponseEntity.status(201).body(novoUsuario);
    }
}
