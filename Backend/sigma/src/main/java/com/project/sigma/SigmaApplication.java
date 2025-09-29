package com.project.sigma;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@SpringBootApplication
public class SigmaApplication {

	public static void main(String[] args) {
		SpringApplication.run(SigmaApplication.class, args);
	}

	@Component
	public static class PasswordUpdater implements CommandLineRunner {

		@Autowired
		private JdbcTemplate jdbcTemplate;

		@Override
		public void run(String... args) throws Exception {
			// Update admin password to correct bcrypt hash for "admin"
			BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
			String correctPasswordHash = encoder.encode("admin");

			try {
				int updated = jdbcTemplate.update(
					"UPDATE Usuario SET password = ? WHERE username = 'admin'",
					correctPasswordHash
				);

				if (updated > 0) {
					System.out.println("✅ Senha do administrador atualizada com sucesso!");
					System.out.println("🔑 Login: admin / Senha: admin");
				} else {
					System.out.println("ℹ️ Usuário admin não encontrado para atualização.");
				}
			} catch (Exception e) {
				System.out.println("❌ Erro ao atualizar senha do admin: " + e.getMessage());
			}

			// Check database structure and data
			checkDatabaseStatus();
		}

		private void checkDatabaseStatus() {
			System.out.println("\n🔍 Verificando estrutura do banco de dados...");

			try {
				// Check if Produto table exists and has data
				Integer produtoCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Produto", Integer.class);
				System.out.println("📦 Total de produtos no banco: " + produtoCount);

				// Check if Categoria table exists and has data
				Integer categoriaCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Categoria", Integer.class);
				System.out.println("📂 Total de categorias no banco: " + categoriaCount);

				// Check if tables have the expected columns
				try {
					jdbcTemplate.queryForObject("SELECT status FROM Produto LIMIT 1", String.class);
					System.out.println("✅ Coluna 'status' existe na tabela Produto");
				} catch (Exception e) {
					System.out.println("❌ Coluna 'status' não encontrada na tabela Produto");
				}

				try {
					jdbcTemplate.queryForObject("SELECT preco_custo FROM Produto LIMIT 1", Object.class);
					System.out.println("✅ Coluna 'preco_custo' existe na tabela Produto");
				} catch (Exception e) {
					System.out.println("❌ Coluna 'preco_custo' não encontrada na tabela Produto");
				}

				// Show sample data if exists
				if (produtoCount > 0) {
					System.out.println("📋 Primeiros produtos cadastrados:");
					try {
						jdbcTemplate.query("SELECT nome, status FROM Produto LIMIT 3", (rs, rowNum) -> {
							System.out.println("   - " + rs.getString("nome") + " (Status: " + rs.getString("status") + ")");
							return null;
						});
					} catch (Exception e) {
						System.out.println("❌ Erro ao buscar produtos de amostra: " + e.getMessage());
					}
				}

			} catch (Exception e) {
				System.out.println("❌ Erro ao verificar banco de dados: " + e.getMessage());
				System.out.println("⚠️ Possivelmente o script SQL não foi executado ou há problemas na estrutura do banco");
			}

			System.out.println("🔍 Verificação do banco concluída.\n");
		}
	}
}
