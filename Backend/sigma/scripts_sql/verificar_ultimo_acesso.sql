-- Script para verificar o último acesso dos usuários

-- Ver todos os usuários com seu último acesso
SELECT 
    u.id_pessoa,
    p.nome,
    u.username,
    u.role,
    u.status,
    u.ultimo_acesso,
    TIMESTAMPDIFF(MINUTE, u.ultimo_acesso, NOW()) as minutos_desde_ultimo_acesso
FROM Usuario u
INNER JOIN Funcionario f ON u.id_pessoa = f.id_pessoa
INNER JOIN Pessoa p ON f.id_pessoa = p.id_pessoa
ORDER BY u.ultimo_acesso DESC;

-- Ver apenas usuários que acessaram recentemente (últimas 24h)
SELECT 
    u.id_pessoa,
    p.nome,
    u.username,
    u.ultimo_acesso,
    TIMESTAMPDIFF(MINUTE, u.ultimo_acesso, NOW()) as minutos_desde_ultimo_acesso
FROM Usuario u
INNER JOIN Funcionario f ON u.id_pessoa = f.id_pessoa
INNER JOIN Pessoa p ON f.id_pessoa = p.id_pessoa
WHERE u.ultimo_acesso >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
ORDER BY u.ultimo_acesso DESC;

-- Ver estatísticas de acesso
SELECT 
    COUNT(*) as total_usuarios,
    COUNT(CASE WHEN u.status = 'ATIVO' THEN 1 END) as usuarios_ativos,
    COUNT(CASE WHEN u.ultimo_acesso IS NOT NULL THEN 1 END) as ja_acessaram,
    COUNT(CASE WHEN u.ultimo_acesso >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) as acessos_ultimas_24h,
    COUNT(CASE WHEN u.ultimo_acesso >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as acessos_ultima_semana
FROM Usuario u;

-- Atualizar manualmente o último acesso de um usuário específico (exemplo)
-- UPDATE Usuario SET ultimo_acesso = NOW() WHERE username = 'admin';
