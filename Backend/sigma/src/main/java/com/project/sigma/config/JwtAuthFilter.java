package com.project.sigma.config;

import com.project.sigma.service.JwtService;
import com.project.sigma.service.UserDetailServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailServiceImpl userDetailService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Ignorar requisições OPTIONS (CORS preflight)
        if ("OPTIONS".equals(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        try {
            // 1. Verifica se o cabeçalho Authorization existe e começa com "Bearer "
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                username = jwtService.extractUsername(token);
            }

            // 2. Se temos um username e o usuário ainda não está autenticado no contexto de segurança
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailService.loadUserByUsername(username);

                // 3. Valida o token
                if (jwtService.validateToken(token, userDetails)) {
                    // 4. Se o token for válido, cria um objeto de autenticação e o define no contexto de segurança
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Em caso de erro no JWT, apenas continua sem autenticar
            System.err.println("Erro no filtro JWT: " + e.getMessage());
        }

        // 5. Continua a cadeia de filtros
        filterChain.doFilter(request, response);
    }
}
