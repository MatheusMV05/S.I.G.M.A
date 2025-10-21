package com.project.sigma.config;

import com.project.sigma.model.Promocao;
import com.project.sigma.repository.PromocaoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@EnableScheduling
public class ScheduledTasks {

    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

    @Autowired
    private PromocaoRepository promocaoRepository;

    /**
     * Roda todo dia à 1 da manhã (01:00:00)
     * Atualiza os status das promoções
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void updatePromotionStatuses() {
        log.info("Iniciando tarefa agendada: Atualização de Status de Promoções");
        LocalDate hoje = LocalDate.now();
        int agendadasParaAtivas = 0;
        int ativasParaInativas = 0;

        // 1. Procura promoções AGENDADAS que devem iniciar HOJE
        List<Promocao> agendadas = promocaoRepository.findAllByStatus(Promocao.StatusPromocao.AGENDADA);
        for (Promocao promo : agendadas) {
            if (hoje.isEqual(promo.getData_inicio()) || (hoje.isAfter(promo.getData_inicio()) && hoje.isBefore(promo.getData_fim()))) {
                promocaoRepository.updateStatus(promo.getId_promocao(), Promocao.StatusPromocao.ATIVA);
                agendadasParaAtivas++;
            }
        }

        // 2. Procura promoções ATIVAS que devem EXPIRAR HOJE (data_fim foi ontem)
        List<Promocao> ativas = promocaoRepository.findAllByStatus(Promocao.StatusPromocao.ATIVA);
        for (Promocao promo : ativas) {
            if (hoje.isAfter(promo.getData_fim())) {
                promocaoRepository.updateStatus(promo.getId_promocao(), Promocao.StatusPromocao.INATIVA);
                ativasParaInativas++;
            }
        }

        log.info("Tarefa finalizada: {} promoções -> ATIVA. {} promoções -> INATIVA.", agendadasParaAtivas, ativasParaInativas);
    }
}
