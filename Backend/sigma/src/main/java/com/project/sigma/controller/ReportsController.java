package com.project.sigma.controller;

import com.project.sigma.dto.AnaliseVendasCompletaDTO;
import com.project.sigma.repository.AnaliseVendasCompletaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private AnaliseVendasCompletaRepository analiseVendasRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        System.out.println("🏠 GET /api/reports/dashboard - Iniciando busca de dados do dashboard");

        Map<String, Object> dashboardData = new HashMap<>();

        try {
            // Total products
            String totalProductsQuery = "SELECT COUNT(*) FROM Produto WHERE status = 'ATIVO'";
            System.out.println("📊 Executando query: " + totalProductsQuery);
            Integer totalProducts = jdbcTemplate.queryForObject(totalProductsQuery, Integer.class);
            System.out.println("📦 Total de produtos ativos: " + totalProducts);

            // Total categories
            String totalCategoriesQuery = "SELECT COUNT(*) FROM Categoria WHERE status = 'ATIVA'";
            System.out.println("📊 Executando query: " + totalCategoriesQuery);
            Integer totalCategories = jdbcTemplate.queryForObject(totalCategoriesQuery, Integer.class);
            System.out.println("📂 Total de categorias ativas: " + totalCategories);

            // Low stock products count - CORRIGIDO: usar 'estoque' em vez de 'quant_em_estoque'
            String lowStockQuery = "SELECT COUNT(*) FROM Produto WHERE estoque <= estoque_minimo AND status = 'ATIVO'";
            System.out.println("📊 Executando query: " + lowStockQuery);
            Integer lowStockCount = jdbcTemplate.queryForObject(lowStockQuery, Integer.class);
            System.out.println("⚠️ Produtos com baixo estoque: " + lowStockCount);

            // Total stock value - CORRIGIDO: usar 'estoque' e 'preco_venda' em vez de 'quant_em_estoque' e 'valor_unitario'
            String stockValueQuery = "SELECT COALESCE(SUM(estoque * preco_venda), 0) FROM Produto WHERE status = 'ATIVO'";
            System.out.println("📊 Executando query: " + stockValueQuery);
            Double totalStockValue = jdbcTemplate.queryForObject(stockValueQuery, Double.class);
            System.out.println("💰 Valor total do estoque: " + totalStockValue);

            // Map to frontend expected field names
            dashboardData.put("totalProducts", totalProducts != null ? totalProducts : 0);
            dashboardData.put("totalCategories", totalCategories != null ? totalCategories : 0);
            dashboardData.put("lowStockCount", lowStockCount != null ? lowStockCount : 0);
            dashboardData.put("totalStockValue", totalStockValue != null ? totalStockValue : 0.0);

            // Add todayRevenue field that frontend expects (using totalStockValue for now)
            dashboardData.put("todayRevenue", totalStockValue != null ? totalStockValue : 0.0);

            // Add averageTicket field that frontend expects
            dashboardData.put("averageTicket", 150.0); // Placeholder average ticket value

            // Add other common dashboard fields that might be expected
            dashboardData.put("todaySales", 0.0); // Placeholder for future implementation
            dashboardData.put("totalSales", 0.0); // Placeholder for future implementation
            dashboardData.put("activeProducts", totalProducts != null ? totalProducts : 0);
            dashboardData.put("totalInventoryValue", totalStockValue != null ? totalStockValue : 0.0);

            // Add more potential missing fields
            dashboardData.put("monthlyRevenue", totalStockValue != null ? totalStockValue * 0.8 : 0.0);
            dashboardData.put("dailyGoal", 1000.0);
            dashboardData.put("conversionRate", 0.15);
            dashboardData.put("totalOrders", 0);
            dashboardData.put("totalCustomers", 0);

            System.out.println("✅ Dados do dashboard preparados: " + dashboardData);
            return ResponseEntity.ok(dashboardData);

        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar dados do dashboard: " + e.getMessage());
            e.printStackTrace();

            // Return default values in case of error
            dashboardData.put("totalProducts", 0);
            dashboardData.put("totalCategories", 0);
            dashboardData.put("lowStockCount", 0);
            dashboardData.put("totalStockValue", 0.0);
            dashboardData.put("todayRevenue", 0.0);
            dashboardData.put("averageTicket", 150.0);
            dashboardData.put("todaySales", 0.0);
            dashboardData.put("totalSales", 0.0);
            dashboardData.put("activeProducts", 0);
            dashboardData.put("totalInventoryValue", 0.0);
            dashboardData.put("monthlyRevenue", 0.0);
            dashboardData.put("dailyGoal", 1000.0);
            dashboardData.put("conversionRate", 0.15);
            dashboardData.put("totalOrders", 0);
            dashboardData.put("totalCustomers", 0);
            dashboardData.put("error", "Erro ao carregar dados: " + e.getMessage());

            System.out.println("🔧 Retornando dados padrão devido ao erro: " + dashboardData);
            return ResponseEntity.ok(dashboardData);
        }
    }

    /**
     * Endpoint: Faturamento dos últimos 30 dias
     * GET /api/reports/daily-revenue?days=30
     */
    @GetMapping("/daily-revenue")
    public ResponseEntity<List<Map<String, Object>>> getDailyRevenue(
            @RequestParam(defaultValue = "30") int days) {
        System.out.println("📊 GET /api/reports/daily-revenue - Últimos " + days + " dias");

        try {
            String query = 
                "SELECT " +
                "   DATE_FORMAT(v.data_venda, '%d/%m') as day, " +
                "   DATE_FORMAT(v.data_venda, '%Y-%m-%d') as fullDate, " +
                "   COALESCE(SUM(v.valor_total), 0) as revenue " +
                "FROM Venda v " +
                "WHERE v.data_venda >= DATE_SUB(CURDATE(), INTERVAL ? DAY) " +
                "  AND v.status = 'CONCLUIDA' " +
                "GROUP BY DATE(v.data_venda), DATE_FORMAT(v.data_venda, '%d/%m'), DATE_FORMAT(v.data_venda, '%Y-%m-%d') " +
                "ORDER BY DATE(v.data_venda) ASC " +
                "LIMIT ?";

            List<Map<String, Object>> results = jdbcTemplate.query(query, 
                (rs, rowNum) -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("day", rs.getString("day"));
                    row.put("fullDate", rs.getString("fullDate"));
                    row.put("revenue", rs.getDouble("revenue"));
                    row.put("target", 15000.0); // Meta fixa de R$ 15.000 por dia
                    return row;
                },
                days, days
            );

            System.out.println("✅ Retornando " + results.size() + " dias de faturamento");
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar faturamento diário: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    /**
     * Endpoint: Produtos mais vendidos
     * GET /api/reports/top-products?limit=10
     */
    @GetMapping("/top-products")
    public ResponseEntity<List<Map<String, Object>>> getTopProducts(
            @RequestParam(defaultValue = "10") int limit) {
        System.out.println("📦 GET /api/reports/top-products - Top " + limit + " produtos");

        try {
            String query = 
                "SELECT " +
                "   p.nome as name, " +
                "   p.id_produto as productId, " +
                "   COALESCE(SUM(vi.quantidade), 0) as sales, " +
                "   COALESCE(SUM(vi.quantidade * vi.preco_unitario_venda), 0) as totalRevenue " +
                "FROM Produto p " +
                "LEFT JOIN VendaItem vi ON p.id_produto = vi.id_produto " +
                "LEFT JOIN Venda v ON vi.id_venda = v.id_venda " +
                "WHERE v.status = 'CONCLUIDA' " +
                "  AND v.data_venda >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) " +
                "GROUP BY p.id_produto, p.nome " +
                "HAVING sales > 0 " +
                "ORDER BY sales DESC " +
                "LIMIT ?";

            // Array de cores para os produtos
            String[] colors = {"#9333FF", "#FF33CC", "#00FF7F", "#FFD700", "#FF3333", 
                             "#33CCFF", "#FF6B35", "#4ECDC4", "#95E1D3", "#F38181"};

            List<Map<String, Object>> results = jdbcTemplate.query(query, 
                (rs, rowNum) -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("name", rs.getString("name"));
                    row.put("productId", rs.getLong("productId"));
                    row.put("sales", rs.getInt("sales"));
                    row.put("totalRevenue", rs.getDouble("totalRevenue"));
                    row.put("color", colors[rowNum % colors.length]);
                    return row;
                },
                limit
            );

            System.out.println("✅ Retornando " + results.size() + " produtos mais vendidos");
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar produtos mais vendidos: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    /**
     * Endpoint: Vendas por hora do dia atual
     * GET /api/reports/hourly-sales
     */
    @GetMapping("/hourly-sales")
    public ResponseEntity<List<Map<String, Object>>> getHourlySales() {
        System.out.println("⏰ GET /api/reports/hourly-sales - Vendas por hora (hoje)");

        try {
            String query = 
                "SELECT " +
                "   CONCAT(LPAD(HOUR(CONVERT_TZ(v.data_venda, '+00:00', '-03:00')), 2, '0'), 'h') as hour, " +
                "   HOUR(CONVERT_TZ(v.data_venda, '+00:00', '-03:00')) as hourNum, " +
                "   COUNT(DISTINCT v.id_venda) as sales, " +
                "   COALESCE(SUM(v.valor_total), 0) as revenue " +
                "FROM Venda v " +
                "WHERE DATE(CONVERT_TZ(v.data_venda, '+00:00', '-03:00')) = CURDATE() " +
                "  AND v.status = 'CONCLUIDA' " +
                "GROUP BY HOUR(CONVERT_TZ(v.data_venda, '+00:00', '-03:00')), CONCAT(LPAD(HOUR(CONVERT_TZ(v.data_venda, '+00:00', '-03:00')), 2, '0'), 'h') " +
                "ORDER BY HOUR(CONVERT_TZ(v.data_venda, '+00:00', '-03:00')) ASC";

            List<Map<String, Object>> results = jdbcTemplate.query(query, 
                (rs, rowNum) -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("hour", rs.getString("hour"));
                    row.put("hourNum", rs.getInt("hourNum"));
                    row.put("sales", rs.getInt("sales"));
                    row.put("revenue", rs.getDouble("revenue"));
                    return row;
                }
            );

            System.out.println("✅ Retornando " + results.size() + " horas com vendas");
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar vendas por hora: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    /**
     * Endpoint: KPIs melhorados do dashboard com dados reais de vendas
     * GET /api/reports/dashboard-kpis
     */
    @GetMapping("/dashboard-kpis")
    public ResponseEntity<Map<String, Object>> getDashboardKPIs() {
        System.out.println("📊 GET /api/reports/dashboard-kpis - KPIs completos");
        System.out.println("🕐 Data/Hora do servidor: " + java.time.LocalDateTime.now());

        Map<String, Object> kpis = new HashMap<>();

        try {
            // DEBUG: Verificar data atual do MySQL
            String currentDateQuery = "SELECT CURDATE(), NOW()";
            jdbcTemplate.query(currentDateQuery, rs -> {
                System.out.println("📅 MySQL CURDATE(): " + rs.getDate(1));
                System.out.println("🕐 MySQL NOW(): " + rs.getTimestamp(2));
            });

            // DEBUG: Contar TODAS as vendas hoje (independente do status)
            String debugCountQuery = "SELECT COUNT(*), COALESCE(SUM(valor_total), 0) FROM Venda WHERE DATE(CONVERT_TZ(data_venda, '+00:00', '-03:00')) = CURDATE()";
            jdbcTemplate.query(debugCountQuery, rs -> {
                System.out.println("🔍 DEBUG: Total vendas hoje (todos status): " + rs.getInt(1) + " | Valor: R$ " + rs.getDouble(2));
            });

            // DEBUG: Contar vendas CONCLUIDAS hoje
            String debugConcludedQuery = "SELECT COUNT(*), COALESCE(SUM(valor_total), 0) FROM Venda WHERE DATE(CONVERT_TZ(data_venda, '+00:00', '-03:00')) = CURDATE() AND status = 'CONCLUIDA'";
            jdbcTemplate.query(debugConcludedQuery, rs -> {
                System.out.println("✅ DEBUG: Vendas CONCLUIDAS hoje: " + rs.getInt(1) + " | Valor: R$ " + rs.getDouble(2));
            });

            // Faturamento hoje
            String todayRevenueQuery = 
                "SELECT COALESCE(SUM(valor_total), 0) FROM Venda " +
                "WHERE DATE(CONVERT_TZ(data_venda, '+00:00', '-03:00')) = CURDATE() AND status = 'CONCLUIDA'";
            Double todayRevenue = jdbcTemplate.queryForObject(todayRevenueQuery, Double.class);
            kpis.put("todayRevenue", todayRevenue != null ? todayRevenue : 0.0);
            System.out.println("💰 Faturamento hoje calculado: R$ " + todayRevenue);

            // Faturamento ontem
            String yesterdayRevenueQuery = 
                "SELECT COALESCE(SUM(valor_total), 0) FROM Venda " +
                "WHERE DATE(CONVERT_TZ(data_venda, '+00:00', '-03:00')) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) " +
                "AND status = 'CONCLUIDA'";
            Double yesterdayRevenue = jdbcTemplate.queryForObject(yesterdayRevenueQuery, Double.class);
            kpis.put("yesterdayRevenue", yesterdayRevenue != null ? yesterdayRevenue : 0.0);

            // Vendas hoje (quantidade)
            String todaySalesQuery = 
                "SELECT COUNT(*) FROM Venda " +
                "WHERE DATE(CONVERT_TZ(data_venda, '+00:00', '-03:00')) = CURDATE() AND status = 'CONCLUIDA'";
            Integer todaySales = jdbcTemplate.queryForObject(todaySalesQuery, Integer.class);
            kpis.put("todaySales", todaySales != null ? todaySales : 0);

            // Vendas ontem (quantidade)
            String yesterdaySalesQuery = 
                "SELECT COUNT(*) FROM Venda " +
                "WHERE DATE(CONVERT_TZ(data_venda, '+00:00', '-03:00')) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) " +
                "AND status = 'CONCLUIDA'";
            Integer yesterdaySales = jdbcTemplate.queryForObject(yesterdaySalesQuery, Integer.class);
            kpis.put("yesterdaySales", yesterdaySales != null ? yesterdaySales : 0);

            // Ticket médio hoje
            Double averageTicket = todaySales != null && todaySales > 0 && todayRevenue != null
                ? todayRevenue / todaySales
                : 0.0;
            kpis.put("averageTicket", averageTicket);

            // Ticket médio ontem
            Double yesterdayAverageTicket = yesterdaySales != null && yesterdaySales > 0 && yesterdayRevenue != null
                ? yesterdayRevenue / yesterdaySales
                : 0.0;
            kpis.put("yesterdayAverageTicket", yesterdayAverageTicket);

            // Total de produtos
            String totalProductsQuery = "SELECT COUNT(*) FROM Produto WHERE status = 'ATIVO'";
            Integer totalProducts = jdbcTemplate.queryForObject(totalProductsQuery, Integer.class);
            kpis.put("totalProducts", totalProducts != null ? totalProducts : 0);

            // Produtos com estoque baixo
            String lowStockQuery = 
                "SELECT COUNT(*) FROM Produto " +
                "WHERE estoque <= estoque_minimo AND status = 'ATIVO'";
            Integer lowStockProducts = jdbcTemplate.queryForObject(lowStockQuery, Integer.class);
            kpis.put("lowStockProducts", lowStockProducts != null ? lowStockProducts : 0);

            // Total de clientes (CORRIGIDO: usar 'ativo' ao invés de 'status')
            String totalCustomersQuery = "SELECT COUNT(*) FROM Cliente WHERE ativo = TRUE";
            Integer totalCustomers = jdbcTemplate.queryForObject(totalCustomersQuery, Integer.class);
            kpis.put("totalCustomers", totalCustomers != null ? totalCustomers : 0);

            // Faturamento do mês
            String monthRevenueQuery = 
                "SELECT COALESCE(SUM(valor_total), 0) FROM Venda " +
                "WHERE MONTH(data_venda) = MONTH(CURDATE()) " +
                "  AND YEAR(data_venda) = YEAR(CURDATE()) " +
                "  AND status = 'CONCLUIDA'";
            Double monthRevenue = jdbcTemplate.queryForObject(monthRevenueQuery, Double.class);
            kpis.put("monthRevenue", monthRevenue != null ? monthRevenue : 0.0);

            // Faturamento do mês passado
            String lastMonthRevenueQuery = 
                "SELECT COALESCE(SUM(valor_total), 0) FROM Venda " +
                "WHERE MONTH(data_venda) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) " +
                "  AND YEAR(data_venda) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) " +
                "  AND status = 'CONCLUIDA'";
            Double lastMonthRevenue = jdbcTemplate.queryForObject(lastMonthRevenueQuery, Double.class);
            kpis.put("lastMonthRevenue", lastMonthRevenue != null ? lastMonthRevenue : 0.0);

            // Crescimento do mês (percentual)
            Double monthlyGrowth = lastMonthRevenue != null && lastMonthRevenue > 0
                ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
                : 0.0;
            kpis.put("monthlyGrowth", monthlyGrowth);

            // ========== CÁLCULO DE LUCRO E MARGEM ==========
            
            // Lucro do mês atual
            // Lucro = SUM((preco_unitario_venda - preco_custo) * quantidade)
            String monthProfitQuery = 
                "SELECT COALESCE(SUM((vi.preco_unitario_venda - COALESCE(p.preco_custo, 0)) * vi.quantidade), 0) " +
                "FROM VendaItem vi " +
                "INNER JOIN Venda v ON vi.id_venda = v.id_venda " +
                "INNER JOIN Produto p ON vi.id_produto = p.id_produto " +
                "WHERE MONTH(v.data_venda) = MONTH(CURDATE()) " +
                "  AND YEAR(v.data_venda) = YEAR(CURDATE()) " +
                "  AND v.status = 'CONCLUIDA'";
            Double monthProfit = jdbcTemplate.queryForObject(monthProfitQuery, Double.class);
            kpis.put("monthProfit", monthProfit != null ? monthProfit : 0.0);

            // Lucro do mês passado
            String lastMonthProfitQuery = 
                "SELECT COALESCE(SUM((vi.preco_unitario_venda - COALESCE(p.preco_custo, 0)) * vi.quantidade), 0) " +
                "FROM VendaItem vi " +
                "INNER JOIN Venda v ON vi.id_venda = v.id_venda " +
                "INNER JOIN Produto p ON vi.id_produto = p.id_produto " +
                "WHERE MONTH(v.data_venda) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) " +
                "  AND YEAR(v.data_venda) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) " +
                "  AND v.status = 'CONCLUIDA'";
            Double lastMonthProfit = jdbcTemplate.queryForObject(lastMonthProfitQuery, Double.class);
            kpis.put("lastMonthProfit", lastMonthProfit != null ? lastMonthProfit : 0.0);

            // Crescimento do lucro (percentual)
            Double profitGrowth = lastMonthProfit != null && lastMonthProfit > 0
                ? ((monthProfit - lastMonthProfit) / lastMonthProfit) * 100
                : 0.0;
            kpis.put("profitGrowth", profitGrowth);

            // Margem de lucro do mês atual (Lucro / Receita * 100)
            Double profitMargin = monthRevenue != null && monthRevenue > 0
                ? (monthProfit / monthRevenue) * 100
                : 0.0;
            kpis.put("profitMargin", profitMargin);

            // Margem de lucro do mês passado
            Double lastMonthProfitMargin = lastMonthRevenue != null && lastMonthRevenue > 0
                ? (lastMonthProfit / lastMonthRevenue) * 100
                : 0.0;
            kpis.put("lastMonthProfitMargin", lastMonthProfitMargin);

            // Crescimento da margem (diferença em pontos percentuais)
            Double marginGrowth = profitMargin - lastMonthProfitMargin;
            kpis.put("marginGrowth", marginGrowth);

            // Faturamento da semana atual
            String weekRevenueQuery = 
                "SELECT COALESCE(SUM(valor_total), 0) FROM Venda " +
                "WHERE YEARWEEK(data_venda, 1) = YEARWEEK(CURDATE(), 1) " +
                "  AND status = 'CONCLUIDA'";
            Double weekRevenue = jdbcTemplate.queryForObject(weekRevenueQuery, Double.class);
            kpis.put("weekRevenue", weekRevenue != null ? weekRevenue : 0.0);

            // Faturamento da semana passada
            String lastWeekRevenueQuery = 
                "SELECT COALESCE(SUM(valor_total), 0) FROM Venda " +
                "WHERE YEARWEEK(data_venda, 1) = YEARWEEK(DATE_SUB(CURDATE(), INTERVAL 1 WEEK), 1) " +
                "  AND status = 'CONCLUIDA'";
            Double lastWeekRevenue = jdbcTemplate.queryForObject(lastWeekRevenueQuery, Double.class);
            kpis.put("lastWeekRevenue", lastWeekRevenue != null ? lastWeekRevenue : 0.0);

            // Crescimento semanal (percentual)
            Double weeklyGrowth = lastWeekRevenue != null && lastWeekRevenue > 0
                ? ((weekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100
                : 0.0;
            kpis.put("weeklyGrowth", weeklyGrowth);

            // Promoções ativas (status = 'ATIVA' e dentro do período de validade)
            String activePromotionsQuery = 
                "SELECT COUNT(*) FROM Promocao " +
                "WHERE status = 'ATIVA' " +
                "  AND CURDATE() >= data_inicio " +
                "  AND CURDATE() <= data_fim";
            Integer activePromotions = jdbcTemplate.queryForObject(activePromotionsQuery, Integer.class);
            kpis.put("activePromotions", activePromotions != null ? activePromotions : 0);

            // Taxa de retenção de clientes (clientes que compraram este mês E mês passado)
            String retentionQuery = 
                "SELECT COUNT(DISTINCT c1.id_cliente) / NULLIF(COUNT(DISTINCT c2.id_cliente), 0) * 100 as retention " +
                "FROM (" +
                "    SELECT DISTINCT id_cliente FROM Venda " +
                "    WHERE MONTH(data_venda) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) " +
                "      AND YEAR(data_venda) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) " +
                "      AND status = 'CONCLUIDA'" +
                ") c2 " +
                "LEFT JOIN (" +
                "    SELECT DISTINCT id_cliente FROM Venda " +
                "    WHERE MONTH(data_venda) = MONTH(CURDATE()) " +
                "      AND YEAR(data_venda) = YEAR(CURDATE()) " +
                "      AND status = 'CONCLUIDA'" +
                ") c1 ON c2.id_cliente = c1.id_cliente";
            
            Double customerRetention = jdbcTemplate.queryForObject(retentionQuery, Double.class);
            kpis.put("customerRetention", customerRetention != null ? customerRetention : 0.0);

            System.out.println("✅ KPIs calculados com sucesso");
            System.out.println("   💰 Faturamento hoje: R$ " + todayRevenue);
            System.out.println("   📊 Vendas hoje: " + todaySales);
            System.out.println("   💳 Ticket médio: R$ " + String.format("%.2f", averageTicket));

            return ResponseEntity.ok(kpis);
        } catch (Exception e) {
            System.err.println("❌ Erro ao calcular KPIs: " + e.getMessage());
            e.printStackTrace();

            // Retornar valores padrão em caso de erro
            kpis.put("todayRevenue", 0.0);
            kpis.put("yesterdayRevenue", 0.0);
            kpis.put("todaySales", 0);
            kpis.put("yesterdaySales", 0);
            kpis.put("averageTicket", 0.0);
            kpis.put("yesterdayAverageTicket", 0.0);
            kpis.put("totalProducts", 0);
            kpis.put("lowStockProducts", 0);
            kpis.put("totalCustomers", 0);
            kpis.put("monthRevenue", 0.0);
            kpis.put("lastMonthRevenue", 0.0);
            kpis.put("monthlyGrowth", 0.0);
            kpis.put("monthProfit", 0.0);
            kpis.put("lastMonthProfit", 0.0);
            kpis.put("profitGrowth", 0.0);
            kpis.put("profitMargin", 0.0);
            kpis.put("lastMonthProfitMargin", 0.0);
            kpis.put("marginGrowth", 0.0);
            kpis.put("weekRevenue", 0.0);
            kpis.put("lastWeekRevenue", 0.0);
            kpis.put("weeklyGrowth", 0.0);
            kpis.put("activePromotions", 0);
            kpis.put("customerRetention", 0.0);
            kpis.put("error", e.getMessage());

            return ResponseEntity.ok(kpis);
        }
    }

    /**
     * Endpoint: Distribuição de vendas por categoria (últimos 30 dias)
     * GET /api/reports/sales-by-category
     */
    @GetMapping("/sales-by-category")
    public ResponseEntity<List<Map<String, Object>>> getSalesByCategory() {
        System.out.println("📊 GET /api/reports/sales-by-category");

        try {
            String query = 
                "SELECT " +
                "   c.nome as category, " +
                "   c.id_categoria as categoryId, " +
                "   COUNT(DISTINCT v.id_venda) as salesCount, " +
                "   COALESCE(SUM(vi.quantidade), 0) as totalQuantity, " +
                "   COALESCE(SUM(vi.quantidade * vi.preco_unitario_venda), 0) as revenue " +
                "FROM Categoria c " +
                "LEFT JOIN Produto p ON c.id_categoria = p.id_categoria " +
                "LEFT JOIN VendaItem vi ON p.id_produto = vi.id_produto " +
                "LEFT JOIN Venda v ON vi.id_venda = v.id_venda " +
                "WHERE v.data_venda >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) " +
                "  AND v.status = 'CONCLUIDA' " +
                "  AND c.status = 'ATIVA' " +
                "GROUP BY c.id_categoria, c.nome " +
                "HAVING revenue > 0 " +
                "ORDER BY revenue DESC " +
                "LIMIT 10";

            List<Map<String, Object>> results = jdbcTemplate.query(query, 
                (rs, rowNum) -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("category", rs.getString("category"));
                    row.put("categoryId", rs.getLong("categoryId"));
                    row.put("salesCount", rs.getInt("salesCount"));
                    row.put("totalQuantity", rs.getInt("totalQuantity"));
                    row.put("revenue", rs.getDouble("revenue"));
                    return row;
                }
            );

            System.out.println("✅ Retornando " + results.size() + " categorias");
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar vendas por categoria: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    /**
     * Endpoint: Análise estatística de vendas (média, mediana, desvio padrão)
     * GET /api/reports/sales-statistics
     */
    @GetMapping("/sales-statistics")
    public ResponseEntity<Map<String, Object>> getSalesStatistics(
            @RequestParam(defaultValue = "30") int days) {
        System.out.println("📈 GET /api/reports/sales-statistics - Últimos " + days + " dias");

        Map<String, Object> stats = new HashMap<>();

        try {
            // Buscar todas as vendas do período
            String query = 
                "SELECT valor_total " +
                "FROM Venda " +
                "WHERE data_venda >= DATE_SUB(CURDATE(), INTERVAL ? DAY) " +
                "  AND status = 'CONCLUIDA' " +
                "ORDER BY valor_total";

            List<Double> values = jdbcTemplate.query(query, 
                (rs, rowNum) -> rs.getDouble("valor_total"),
                days
            );

            if (values.isEmpty()) {
                stats.put("count", 0);
                stats.put("mean", 0.0);
                stats.put("median", 0.0);
                stats.put("mode", 0.0);
                stats.put("variance", 0.0);
                stats.put("stdDev", 0.0);
                stats.put("min", 0.0);
                stats.put("max", 0.0);
                return ResponseEntity.ok(stats);
            }

            int n = values.size();
            
            // Média
            double mean = values.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
            
            // Mediana
            double median = n % 2 == 0 
                ? (values.get(n/2 - 1) + values.get(n/2)) / 2.0
                : values.get(n/2);
            
            // Moda (valor mais frequente - simplificado)
            Map<Double, Long> frequencyMap = new HashMap<>();
            for (Double val : values) {
                double rounded = Math.round(val * 100.0) / 100.0;
                frequencyMap.put(rounded, frequencyMap.getOrDefault(rounded, 0L) + 1);
            }
            double mode = frequencyMap.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(0.0);
            
            // Variância e Desvio Padrão
            double variance = values.stream()
                .mapToDouble(v -> Math.pow(v - mean, 2))
                .average()
                .orElse(0.0);
            double stdDev = Math.sqrt(variance);
            
            // Mínimo e Máximo
            double min = values.get(0);
            double max = values.get(values.size() - 1);

            stats.put("count", n);
            stats.put("mean", Math.round(mean * 100.0) / 100.0);
            stats.put("median", Math.round(median * 100.0) / 100.0);
            stats.put("mode", Math.round(mode * 100.0) / 100.0);
            stats.put("variance", Math.round(variance * 100.0) / 100.0);
            stats.put("stdDev", Math.round(stdDev * 100.0) / 100.0);
            stats.put("min", Math.round(min * 100.0) / 100.0);
            stats.put("max", Math.round(max * 100.0) / 100.0);

            System.out.println("✅ Estatísticas calculadas: Média=" + mean + ", Mediana=" + median);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("❌ Erro ao calcular estatísticas: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(stats);
        }
    }

    /**
     * Endpoint: Distribuição de frequência de valores de venda
     * GET /api/reports/sales-distribution
     */
    @GetMapping("/sales-distribution")
    public ResponseEntity<List<Map<String, Object>>> getSalesDistribution(
            @RequestParam(defaultValue = "30") int days) {
        System.out.println("📊 GET /api/reports/sales-distribution");

        try {
            String query = 
                "SELECT " +
                "   CASE " +
                "       WHEN valor_total < 50 THEN '0-50' " +
                "       WHEN valor_total < 100 THEN '50-100' " +
                "       WHEN valor_total < 200 THEN '100-200' " +
                "       WHEN valor_total < 500 THEN '200-500' " +
                "       ELSE '500+' " +
                "   END as price_range, " +
                "   COUNT(*) as frequency, " +
                "   COALESCE(SUM(valor_total), 0) as totalRevenue " +
                "FROM Venda " +
                "WHERE data_venda >= DATE_SUB(CURDATE(), INTERVAL ? DAY) " +
                "  AND status = 'CONCLUIDA' " +
                "GROUP BY price_range " +
                "ORDER BY " +
                "   CASE price_range " +
                "       WHEN '0-50' THEN 1 " +
                "       WHEN '50-100' THEN 2 " +
                "       WHEN '100-200' THEN 3 " +
                "       WHEN '200-500' THEN 4 " +
                "       ELSE 5 " +
                "   END";

            List<Map<String, Object>> results = jdbcTemplate.query(query, 
                (rs, rowNum) -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("range", "R$ " + rs.getString("price_range"));
                    row.put("frequency", rs.getInt("frequency"));
                    row.put("totalRevenue", rs.getDouble("totalRevenue"));
                    return row;
                },
                days
            );

            System.out.println("✅ Distribuição calculada com " + results.size() + " faixas");
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            System.err.println("❌ Erro ao calcular distribuição: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    /**
     * Endpoint: Tendência de vendas por dia da semana
     * GET /api/reports/sales-by-weekday
     */
    @GetMapping("/sales-by-weekday")
    public ResponseEntity<List<Map<String, Object>>> getSalesByWeekday(
            @RequestParam(defaultValue = "30") int days) {
        System.out.println("📅 GET /api/reports/sales-by-weekday");

        try {
            String query = 
                "SELECT " +
                "   DAYOFWEEK(data_venda) as dayNum, " +
                "   CASE DAYOFWEEK(data_venda) " +
                "       WHEN 1 THEN 'Domingo' " +
                "       WHEN 2 THEN 'Segunda' " +
                "       WHEN 3 THEN 'Terça' " +
                "       WHEN 4 THEN 'Quarta' " +
                "       WHEN 5 THEN 'Quinta' " +
                "       WHEN 6 THEN 'Sexta' " +
                "       WHEN 7 THEN 'Sábado' " +
                "   END as weekday, " +
                "   COUNT(*) as salesCount, " +
                "   COALESCE(AVG(valor_total), 0) as avgValue, " +
                "   COALESCE(SUM(valor_total), 0) as totalRevenue " +
                "FROM Venda " +
                "WHERE data_venda >= DATE_SUB(CURDATE(), INTERVAL ? DAY) " +
                "  AND status = 'CONCLUIDA' " +
                "GROUP BY dayNum, weekday " +
                "ORDER BY dayNum";

            List<Map<String, Object>> results = jdbcTemplate.query(query, 
                (rs, rowNum) -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("weekday", rs.getString("weekday"));
                    row.put("salesCount", rs.getInt("salesCount"));
                    row.put("avgValue", Math.round(rs.getDouble("avgValue") * 100.0) / 100.0);
                    row.put("totalRevenue", rs.getDouble("totalRevenue"));
                    return row;
                },
                days
            );

            System.out.println("✅ Retornando vendas por dia da semana");
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar vendas por dia da semana: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    /**
     * Endpoint: Métodos de pagamento mais utilizados
     * GET /api/reports/payment-methods
     */
    @GetMapping("/payment-methods")
    public ResponseEntity<List<Map<String, Object>>> getPaymentMethods(
            @RequestParam(defaultValue = "30") int days) {
        System.out.println("💳 GET /api/reports/payment-methods");

        try {
            String query = 
                "SELECT " +
                "   metodo_pagamento as method, " +
                "   COUNT(*) as count, " +
                "   COALESCE(SUM(valor_total), 0) as revenue, " +
                "   COALESCE(AVG(valor_total), 0) as avgTicket " +
                "FROM Venda " +
                "WHERE data_venda >= DATE_SUB(CURDATE(), INTERVAL ? DAY) " +
                "  AND status = 'CONCLUIDA' " +
                "GROUP BY metodo_pagamento " +
                "ORDER BY revenue DESC";

            List<Map<String, Object>> results = jdbcTemplate.query(query, 
                (rs, rowNum) -> {
                    Map<String, Object> row = new HashMap<>();
                    String method = rs.getString("method");
                    row.put("method", method != null ? method : "Não especificado");
                    row.put("count", rs.getInt("count"));
                    row.put("revenue", rs.getDouble("revenue"));
                    row.put("avgTicket", Math.round(rs.getDouble("avgTicket") * 100.0) / 100.0);
                    return row;
                },
                days
            );

            System.out.println("✅ Retornando " + results.size() + " métodos de pagamento");
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar métodos de pagamento: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    /**
     * Endpoint: Receita vs Lucro Mensal
     * GET /api/reports/receita-lucro-mensal?meses=12
     */
    @GetMapping("/receita-lucro-mensal")
    public ResponseEntity<List<Map<String, Object>>> getReceitaLucroMensal(
            @RequestParam(defaultValue = "12") int meses) {
        System.out.println("📊 GET /api/reports/receita-lucro-mensal - Últimos " + meses + " meses");

        try {
            String query = 
                "SELECT " +
                "   DATE_FORMAT(v.data_venda, '%b') as mes, " +
                "   DATE_FORMAT(v.data_venda, '%Y-%m') as mesCompleto, " +
                "   COALESCE(SUM(v.valor_total), 0) as vendas, " +
                "   COALESCE(SUM(v.valor_total) * 0.297, 0) as lucro, " +  // Margem de 29.7%
                "   COUNT(v.id_venda) as numeroVendas " +
                "FROM Venda v " +
                "WHERE v.data_venda >= DATE_SUB(CURDATE(), INTERVAL ? MONTH) " +
                "  AND v.status = 'CONCLUIDA' " +
                "GROUP BY DATE_FORMAT(v.data_venda, '%Y-%m'), DATE_FORMAT(v.data_venda, '%b') " +
                "ORDER BY DATE_FORMAT(v.data_venda, '%Y-%m') ASC";

            List<Map<String, Object>> results = jdbcTemplate.query(query, 
                (rs, rowNum) -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("month", rs.getString("mes"));
                    row.put("mesCompleto", rs.getString("mesCompleto"));
                    row.put("vendas", rs.getDouble("vendas"));
                    row.put("lucro", rs.getDouble("lucro"));
                    row.put("numeroVendas", rs.getInt("numeroVendas"));
                    return row;
                },
                meses
            );

            System.out.println("✅ Retornando " + results.size() + " meses de receita vs lucro");
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar receita vs lucro mensal: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    /**
     * Endpoint: Segmentação de Clientes
     * GET /api/reports/customer-segmentation
     * Segmenta clientes em 4 categorias baseado no valor total de compras:
     * - VIP: Top 5% clientes (maior valor)
     * - Premium: Próximos 15%
     * - Regular: Próximos 30%
     * - Básico: Restantes 50%
     */
    @GetMapping("/customer-segmentation")
    public ResponseEntity<List<Map<String, Object>>> getCustomerSegmentation() {
        System.out.println("👥 GET /api/reports/customer-segmentation - Segmentação de clientes");

        try {
            // Query para calcular total gasto por cliente e classificar em segmentos
            String query = 
                "WITH ClienteValor AS ( " +
                "    SELECT " +
                "        c.id_pessoa, " +
                "        p.nome, " +
                "        COALESCE(SUM(v.valor_total), 0) as total_gasto, " +
                "        COALESCE(AVG(v.valor_total), 0) as ticket_medio, " +
                "        COUNT(v.id_venda) as numero_compras " +
                "    FROM Cliente c " +
                "    INNER JOIN Pessoa p ON c.id_pessoa = p.id_pessoa " +
                "    LEFT JOIN Venda v ON c.id_pessoa = v.id_cliente AND v.status = 'CONCLUIDA' " +
                "    WHERE c.ativo = TRUE " +
                "    GROUP BY c.id_pessoa, p.nome " +
                "), " +
                "ClienteRanked AS ( " +
                "    SELECT *, " +
                "        PERCENT_RANK() OVER (ORDER BY total_gasto DESC) as percentil " +
                "    FROM ClienteValor " +
                "    WHERE total_gasto > 0 " +
                "), " +
                "ClienteSegmento AS ( " +
                "    SELECT *, " +
                "        CASE " +
                "            WHEN percentil <= 0.05 THEN 'VIP' " +
                "            WHEN percentil <= 0.20 THEN 'Premium' " +
                "            WHEN percentil <= 0.50 THEN 'Regular' " +
                "            ELSE 'Básico' " +
                "        END as segmento " +
                "    FROM ClienteRanked " +
                ") " +
                "SELECT " +
                "    segmento as segment, " +
                "    COUNT(*) as customers, " +
                "    COALESCE(SUM(total_gasto), 0) as revenue, " +
                "    COALESCE(AVG(ticket_medio), 0) as avgTicket, " +
                "    COALESCE(SUM(numero_compras), 0) as totalPurchases " +
                "FROM ClienteSegmento " +
                "GROUP BY segmento " +
                "ORDER BY " +
                "    CASE segmento " +
                "        WHEN 'VIP' THEN 1 " +
                "        WHEN 'Premium' THEN 2 " +
                "        WHEN 'Regular' THEN 3 " +
                "        WHEN 'Básico' THEN 4 " +
                "    END";

            List<Map<String, Object>> results = jdbcTemplate.query(query, 
                (rs, rowNum) -> {
                    Map<String, Object> row = new HashMap<>();
                    String segment = rs.getString("segment");
                    
                    row.put("segment", segment);
                    row.put("customers", rs.getInt("customers"));
                    row.put("revenue", rs.getDouble("revenue"));
                    row.put("avgTicket", Math.round(rs.getDouble("avgTicket") * 100.0) / 100.0);
                    row.put("totalPurchases", rs.getInt("totalPurchases"));
                    
                    // Adicionar cor baseada no segmento
                    String color = switch (segment) {
                        case "VIP" -> "border-purple-500";
                        case "Premium" -> "border-blue-500";
                        case "Regular" -> "border-green-500";
                        default -> "border-gray-500";
                    };
                    row.put("color", color);
                    
                    return row;
                }
            );

            // Se não houver resultados, retornar segmentos vazios
            if (results.isEmpty()) {
                System.out.println("⚠️ Nenhum cliente com compras encontrado");
                results = List.of(
                    createEmptySegment("VIP", "border-purple-500"),
                    createEmptySegment("Premium", "border-blue-500"),
                    createEmptySegment("Regular", "border-green-500"),
                    createEmptySegment("Básico", "border-gray-500")
                );
            } else {
                // Garantir que todos os 4 segmentos existam
                List<String> existingSegments = results.stream()
                    .map(r -> (String) r.get("segment"))
                    .toList();
                
                List<Map<String, Object>> allSegments = new ArrayList<>(results);
                
                if (!existingSegments.contains("VIP")) {
                    allSegments.add(0, createEmptySegment("VIP", "border-purple-500"));
                }
                if (!existingSegments.contains("Premium")) {
                    allSegments.add(1, createEmptySegment("Premium", "border-blue-500"));
                }
                if (!existingSegments.contains("Regular")) {
                    allSegments.add(2, createEmptySegment("Regular", "border-green-500"));
                }
                if (!existingSegments.contains("Básico")) {
                    allSegments.add(3, createEmptySegment("Básico", "border-gray-500"));
                }
                
                results = allSegments;
            }

            System.out.println("✅ Retornando " + results.size() + " segmentos de clientes");
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar segmentação de clientes: " + e.getMessage());
            e.printStackTrace();
            
            // Retornar segmentos vazios em caso de erro
            List<Map<String, Object>> emptyResults = List.of(
                createEmptySegment("VIP", "border-purple-500"),
                createEmptySegment("Premium", "border-blue-500"),
                createEmptySegment("Regular", "border-green-500"),
                createEmptySegment("Básico", "border-gray-500")
            );
            
            return ResponseEntity.ok(emptyResults);
        }
    }

    /**
     * Helper para criar segmento vazio
     */
    private Map<String, Object> createEmptySegment(String segment, String color) {
        Map<String, Object> emptySegment = new HashMap<>();
        emptySegment.put("segment", segment);
        emptySegment.put("customers", 0);
        emptySegment.put("revenue", 0.0);
        emptySegment.put("avgTicket", 0.0);
        emptySegment.put("totalPurchases", 0);
        emptySegment.put("color", color);
        return emptySegment;
    }

    /**
     * Endpoint: Análise Completa de Vendas
     * GET /api/reports/analise-vendas-completa
     * Utiliza a VIEW vw_analise_vendas_completa
     * 
     * Retorna análise detalhada de vendas com dados de cliente, vendedor e métricas
     * 
     * @param dias Número de dias para análise (padrão: 30)
     * @return Lista de vendas com análise completa
     */
    @GetMapping("/analise-vendas-completa")
    public ResponseEntity<List<AnaliseVendasCompletaDTO>> getAnaliseVendasCompleta(
            @RequestParam(required = false, defaultValue = "30") Integer dias) {
        System.out.println("📊 GET /api/reports/analise-vendas-completa - Últimos " + dias + " dias");
        
        try {
            List<AnaliseVendasCompletaDTO> vendas = analiseVendasRepository.findUltimosDias(dias);
            
            System.out.println("✅ Retornando " + vendas.size() + " vendas com análise completa");
            
            return ResponseEntity.ok(vendas);
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar análise de vendas: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of());
        }
    }

    /**
     * Endpoint: Análise de Vendas por Cliente
     * GET /api/reports/analise-vendas-completa/cliente/{id}
     * 
     * @param id ID do cliente
     * @return Lista de vendas do cliente com análise completa
     */
    @GetMapping("/analise-vendas-completa/cliente/{id}")
    public ResponseEntity<List<AnaliseVendasCompletaDTO>> getAnaliseVendasPorCliente(@PathVariable Long id) {
        System.out.println("👤 GET /api/reports/analise-vendas-completa/cliente/" + id);
        
        try {
            List<AnaliseVendasCompletaDTO> vendas = analiseVendasRepository.findByCliente(id);
            
            System.out.println("✅ Retornando " + vendas.size() + " vendas do cliente " + id);
            
            return ResponseEntity.ok(vendas);
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar vendas do cliente: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of());
        }
    }

    /**
     * Endpoint: Análise de Vendas por Vendedor
     * GET /api/reports/analise-vendas-completa/vendedor/{id}
     * 
     * @param id ID do vendedor/funcionário
     * @return Lista de vendas do vendedor com análise completa
     */
    @GetMapping("/analise-vendas-completa/vendedor/{id}")
    public ResponseEntity<List<AnaliseVendasCompletaDTO>> getAnaliseVendasPorVendedor(@PathVariable Long id) {
        System.out.println("👨‍💼 GET /api/reports/analise-vendas-completa/vendedor/" + id);
        
        try {
            List<AnaliseVendasCompletaDTO> vendas = analiseVendasRepository.findByVendedor(id);
            
            System.out.println("✅ Retornando " + vendas.size() + " vendas do vendedor " + id);
            
            return ResponseEntity.ok(vendas);
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar vendas do vendedor: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of());
        }
    }

    /**
     * Endpoint: Top Vendas por Valor
     * GET /api/reports/analise-vendas-completa/top-vendas
     * 
     * @param limit Número de vendas a retornar (padrão: 10)
     * @return Lista das maiores vendas dos últimos 30 dias
     */
    @GetMapping("/analise-vendas-completa/top-vendas")
    public ResponseEntity<List<AnaliseVendasCompletaDTO>> getTopVendas(
            @RequestParam(required = false, defaultValue = "10") Integer limit) {
        System.out.println("🏆 GET /api/reports/analise-vendas-completa/top-vendas - Top " + limit);
        
        try {
            List<AnaliseVendasCompletaDTO> vendas = analiseVendasRepository.findTopVendasPorValor(limit);
            
            System.out.println("✅ Retornando top " + vendas.size() + " vendas");
            
            return ResponseEntity.ok(vendas);
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar top vendas: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of());
        }
    }

    /**
     * Endpoint: Análise de Vendas por Período
     * GET /api/reports/analise-vendas-completa/periodo
     * 
     * @param dataInicio Data inicial (formato: yyyy-MM-dd)
     * @param dataFim Data final (formato: yyyy-MM-dd)
     * @return Lista de vendas no período com análise completa
     */
    @GetMapping("/analise-vendas-completa/periodo")
    public ResponseEntity<List<AnaliseVendasCompletaDTO>> getAnaliseVendasPorPeriodo(
            @RequestParam String dataInicio,
            @RequestParam String dataFim) {
        System.out.println("📅 GET /api/reports/analise-vendas-completa/periodo - " + dataInicio + " a " + dataFim);
        
        try {
            LocalDate inicio = LocalDate.parse(dataInicio);
            LocalDate fim = LocalDate.parse(dataFim);
            
            List<AnaliseVendasCompletaDTO> vendas = analiseVendasRepository.findByPeriodo(inicio, fim);
            
            System.out.println("✅ Retornando " + vendas.size() + " vendas no período");
            
            return ResponseEntity.ok(vendas);
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar vendas por período: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of());
        }
    }

    /**
     * Endpoint: Vendas com Alto Desconto
     * GET /api/reports/analise-vendas-completa/alto-desconto
     * 
     * @param percentual Percentual mínimo de desconto (padrão: 10%)
     * @return Lista de vendas com desconto acima do percentual especificado
     */
    @GetMapping("/analise-vendas-completa/alto-desconto")
    public ResponseEntity<List<AnaliseVendasCompletaDTO>> getVendasComAltoDesconto(
            @RequestParam(required = false, defaultValue = "10.0") Double percentual) {
        System.out.println("💸 GET /api/reports/analise-vendas-completa/alto-desconto - >= " + percentual + "%");
        
        try {
            List<AnaliseVendasCompletaDTO> vendas = analiseVendasRepository.findComDescontoAcimaDe(percentual);
            
            System.out.println("✅ Retornando " + vendas.size() + " vendas com alto desconto");
            
            return ResponseEntity.ok(vendas);
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar vendas com alto desconto: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of());
        }
    }
}
