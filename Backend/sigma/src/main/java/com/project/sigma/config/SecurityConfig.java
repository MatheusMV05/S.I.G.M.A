package com.project.sigma.config;

import com.project.sigma.service.UserDetailServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Autowired
    private UserDetailServiceImpl userDetailService;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/login", "/api/auth/login", "/api/auth/users", "/api/auth/debug/**").permitAll()
                        .requestMatchers("/api/ponto-eletronico/**").authenticated()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exception -> exception
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            System.err.println("🚫 Access Denied - Path: " + request.getRequestURI());
                            System.err.println("🚫 Access Denied - Method: " + request.getMethod());
                            System.err.println("🚫 Access Denied - User: " + (request.getUserPrincipal() != null ? request.getUserPrincipal().getName() : "Anonymous"));
                            System.err.println("🚫 Access Denied - Exception: " + accessDeniedException.getMessage());
                            response.setStatus(403);
                            response.getWriter().write("{\"error\": \"Acesso negado: " + accessDeniedException.getMessage() + "\"}");
                        })
                        .authenticationEntryPoint((request, response, authException) -> {
                            System.err.println("🔒 Authentication Failed - Path: " + request.getRequestURI());
                            System.err.println("🔒 Authentication Failed - Method: " + request.getMethod());
                            System.err.println("🔒 Authentication Failed - Exception: " + authException.getMessage());
                            response.setStatus(401);
                            response.getWriter().write("{\"error\": \"Não autenticado: " + authException.getMessage() + "\"}");
                        })
                )
                // --- ADIÇÃO 2: Adicionar o nosso filtro à cadeia de segurança ---
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}