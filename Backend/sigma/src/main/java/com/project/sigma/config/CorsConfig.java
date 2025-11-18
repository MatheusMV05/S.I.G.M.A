package com.project.sigma.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${spring.web.cors.allowed-origins:http://localhost:5173,http://localhost:3000}")
    private String allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permitir origens configuradas via variável de ambiente
        // Em produção, configure FRONTEND_URL no Railway
        List<String> origins = Arrays.asList(allowedOrigins.split(","));
        configuration.setAllowedOrigins(origins);
        
        // Fallback para desenvolvimento local
        if (origins.isEmpty() || origins.get(0).isEmpty()) {
            configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        }
        
        // Métodos HTTP permitidos
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        
        // Headers permitidos
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Headers expostos
        configuration.setExposedHeaders(Arrays.asList("*"));
        
        // Permitir credenciais
        configuration.setAllowCredentials(true);
        
        // Tempo de cache para requisições preflight
        configuration.setMaxAge(3600L);
        
        // Aplicar configuração a todas as rotas
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}