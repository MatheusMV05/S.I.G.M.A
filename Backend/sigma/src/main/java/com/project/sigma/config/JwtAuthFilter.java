package com.project.sigma.config;

import com.project.sigma.service.JwtService;
import com.project.sigma.service.UserDetailServiceImpl;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailServiceImpl userDetailsService;

    public JwtAuthFilter(JwtService jwtService, UserDetailServiceImpl userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        try {
            username = jwtService.extractUsername(jwt);
            
            logger.info("🔐 JWT Auth Filter - Username extraído: " + username);

            // Verifica se o usuário não está já autenticado nesta sessão/requisição
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                
                logger.info("🔐 JWT Auth Filter - UserDetails carregado: " + userDetails.getUsername());
                logger.info("🔐 JWT Auth Filter - Authorities: " + userDetails.getAuthorities());

                // Se o token for válido, precisamos atualizar o SecurityContext
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    logger.info("✅ JWT Auth Filter - Token válido para: " + username);
                    // Cria o token de autenticação com os detalhes do usuário e suas permissões
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null, // Não precisamos das credenciais (senha) aqui
                            userDetails.getAuthorities()
                    );

                    // Adiciona mais detalhes da requisição ao token de autenticação
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    // Atualiza o SecurityContextHolder. Agora o Spring sabe que o usuário está autenticado.
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.info("✅ JWT Auth Filter - SecurityContext atualizado para: " + username);
                } else {
                    logger.warn("❌ JWT Auth Filter - Token inválido para: " + username);
                }
            }
        } catch (ExpiredJwtException e) {
            // Log para o erro de token expirado (opcional, mas bom para debug)
            logger.warn("❌ JWT Auth Filter - Token expirado: " + e.getMessage());
        } catch (Exception e) {
            logger.error("❌ JWT Auth Filter - Erro geral: " + e.getMessage(), e);
        }

        // Continua para o próximo filtro na cadeia
        filterChain.doFilter(request, response);
    }
}