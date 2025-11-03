package com.project.sigma.service;

import com.project.sigma.model.HistoricoFuncionario;
import com.project.sigma.repository.HistoricoFuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class HistoricoFuncionarioService {

    @Autowired
    private HistoricoFuncionarioRepository historicoRepository;

    @Transactional
    public HistoricoFuncionario criar(HistoricoFuncionario historico) {
        return historicoRepository.save(historico);
    }

    @Transactional
    public HistoricoFuncionario atualizar(Long id, HistoricoFuncionario historico) {
        if (!historicoRepository.existsById(id)) {
            throw new RuntimeException("Histórico não encontrado com ID: " + id);
        }
        historico.setIdHistorico(id);
        return historicoRepository.save(historico);
    }

    public Optional<HistoricoFuncionario> buscarPorId(Long id) {
        return historicoRepository.findById(id);
    }

    public List<HistoricoFuncionario> listarTodos() {
        return historicoRepository.findAll();
    }

    public List<HistoricoFuncionario> buscarPorFuncionario(Long idFuncionario) {
        return historicoRepository.findByFuncionario(idFuncionario);
    }

    public List<HistoricoFuncionario> buscarPorTipoEvento(HistoricoFuncionario.TipoEvento tipoEvento) {
        return historicoRepository.findByTipoEvento(tipoEvento);
    }

    public List<HistoricoFuncionario> buscarPorPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        return historicoRepository.findByPeriodo(dataInicio, dataFim);
    }

    @Transactional
    public void deletar(Long id) {
        if (!historicoRepository.existsById(id)) {
            throw new RuntimeException("Histórico não encontrado com ID: " + id);
        }
        historicoRepository.deleteById(id);
    }

    /**
     * Registra um evento de admissão no histórico
     */
    @Transactional
    public HistoricoFuncionario registrarAdmissao(Long idFuncionario, String cargo, String setor, 
            java.math.BigDecimal salario, Long realizadoPor) {
        HistoricoFuncionario historico = new HistoricoFuncionario();
        historico.setIdFuncionario(idFuncionario);
        historico.setTipoEvento(HistoricoFuncionario.TipoEvento.ADMISSAO);
        historico.setDataEvento(LocalDate.now());
        historico.setCargoNovo(cargo);
        historico.setSetorNovo(setor);
        historico.setSalarioNovo(salario);
        historico.setDescricao("Admissão no cargo de " + cargo + " no setor " + setor);
        historico.setRealizadoPor(realizadoPor);
        
        return historicoRepository.save(historico);
    }

    /**
     * Registra um evento de promoção no histórico
     */
    @Transactional
    public HistoricoFuncionario registrarPromocao(Long idFuncionario, String cargoAnterior, String cargoNovo,
            java.math.BigDecimal salarioAnterior, java.math.BigDecimal salarioNovo, Long realizadoPor) {
        HistoricoFuncionario historico = new HistoricoFuncionario();
        historico.setIdFuncionario(idFuncionario);
        historico.setTipoEvento(HistoricoFuncionario.TipoEvento.PROMOCAO);
        historico.setDataEvento(LocalDate.now());
        historico.setCargoAnterior(cargoAnterior);
        historico.setCargoNovo(cargoNovo);
        historico.setSalarioAnterior(salarioAnterior);
        historico.setSalarioNovo(salarioNovo);
        historico.setDescricao("Promoção de " + cargoAnterior + " para " + cargoNovo + 
                ". Salário ajustado de R$ " + salarioAnterior + " para R$ " + salarioNovo);
        historico.setRealizadoPor(realizadoPor);
        
        return historicoRepository.save(historico);
    }

    /**
     * Registra um evento de mudança de setor no histórico
     */
    @Transactional
    public HistoricoFuncionario registrarMudancaSetor(Long idFuncionario, String setorAnterior, 
            String setorNovo, Long realizadoPor) {
        HistoricoFuncionario historico = new HistoricoFuncionario();
        historico.setIdFuncionario(idFuncionario);
        historico.setTipoEvento(HistoricoFuncionario.TipoEvento.MUDANCA_SETOR);
        historico.setDataEvento(LocalDate.now());
        historico.setSetorAnterior(setorAnterior);
        historico.setSetorNovo(setorNovo);
        historico.setDescricao("Transferência do setor " + setorAnterior + " para " + setorNovo);
        historico.setRealizadoPor(realizadoPor);
        
        return historicoRepository.save(historico);
    }

    /**
     * Registra um evento de aumento salarial no histórico
     */
    @Transactional
    public HistoricoFuncionario registrarAumentoSalarial(Long idFuncionario, java.math.BigDecimal salarioAnterior,
            java.math.BigDecimal salarioNovo, String motivo, Long realizadoPor) {
        HistoricoFuncionario historico = new HistoricoFuncionario();
        historico.setIdFuncionario(idFuncionario);
        historico.setTipoEvento(HistoricoFuncionario.TipoEvento.AUMENTO_SALARIAL);
        historico.setDataEvento(LocalDate.now());
        historico.setSalarioAnterior(salarioAnterior);
        historico.setSalarioNovo(salarioNovo);
        historico.setDescricao("Reajuste salarial de R$ " + salarioAnterior + " para R$ " + salarioNovo + 
                (motivo != null ? ". Motivo: " + motivo : ""));
        historico.setRealizadoPor(realizadoPor);
        
        return historicoRepository.save(historico);
    }

    /**
     * Registra um evento de desligamento no histórico
     */
    @Transactional
    public HistoricoFuncionario registrarDesligamento(Long idFuncionario, String motivo, Long realizadoPor) {
        HistoricoFuncionario historico = new HistoricoFuncionario();
        historico.setIdFuncionario(idFuncionario);
        historico.setTipoEvento(HistoricoFuncionario.TipoEvento.DESLIGAMENTO);
        historico.setDataEvento(LocalDate.now());
        historico.setDescricao("Desligamento" + (motivo != null ? ". Motivo: " + motivo : ""));
        historico.setRealizadoPor(realizadoPor);
        
        return historicoRepository.save(historico);
    }
}
