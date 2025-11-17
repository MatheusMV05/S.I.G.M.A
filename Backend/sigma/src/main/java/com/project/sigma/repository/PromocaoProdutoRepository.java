package com.project.sigma.repository;

import com.project.sigma.model.PromocaoProduto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Types;
import java.util.List;

@Repository
public class PromocaoProdutoRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void save(PromocaoProduto promocaoProduto) {
        String sql = "INSERT INTO Promocao_Produto (id_promocao, id_produto) VALUES (?, ?)";
        jdbcTemplate.update(sql, promocaoProduto.getId_promocao(), promocaoProduto.getId_produto());
    }

    public List<Long> findProdutoIdsByPromocaoId(Long promocaoId) {
        String sql = "SELECT id_produto FROM Promocao_Produto WHERE id_promocao = ?";
        return jdbcTemplate.queryForList(sql, new Object[]{promocaoId}, Long.class);
    }

    public void deleteByPromocaoId(Long promocaoId) {
        String sql = "DELETE FROM Promocao_Produto WHERE id_promocao = ?";
        jdbcTemplate.update(sql, promocaoId);
    }
}
