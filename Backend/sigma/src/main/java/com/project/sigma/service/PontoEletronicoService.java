package com.project.sigma.service;

import com.project.sigma.model.PontoEletronico;
import com.project.sigma.repository.PontoEletronicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PontoEletronicoService {

    @Autowired
    private PontoEletronicoRepository pontoRepository;

    @Transactional
    public PontoEletronico criar(PontoEletronico ponto) {
        // Verificar se já existe ponto para este funcionário nesta data
        Optional<PontoEletronico> pontoExistente = pontoRepository.findByFuncionarioAndData(
                ponto.getIdFuncionario(), ponto.getDataPonto());
        
        if (pontoExistente.isPresent()) {
            throw new RuntimeException("Já existe registro de ponto para este funcionário nesta data");
        }
        
        return pontoRepository.save(ponto);
    }

    @Transactional
    public PontoEletronico atualizar(Long id, PontoEletronico ponto) {
        if (!pontoRepository.existsById(id)) {
            throw new RuntimeException("Ponto não encontrado com ID: " + id);
        }
        ponto.setIdPonto(id);
        return pontoRepository.save(ponto);
    }

    public Optional<PontoEletronico> buscarPorId(Long id) {
        return pontoRepository.findById(id);
    }

    public List<PontoEletronico> listarTodos() {
        return pontoRepository.findAll();
    }

    public List<PontoEletronico> buscarPorFuncionario(Long idFuncionario) {
        return pontoRepository.findByFuncionario(idFuncionario);
    }

    public Optional<PontoEletronico> buscarPorFuncionarioEData(Long idFuncionario, LocalDate data) {
        return pontoRepository.findByFuncionarioAndData(idFuncionario, data);
    }

    public List<PontoEletronico> buscarPorPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        return pontoRepository.findByPeriodo(dataInicio, dataFim);
    }

    public List<PontoEletronico> buscarPorFuncionarioEPeriodo(Long idFuncionario, 
            LocalDate dataInicio, LocalDate dataFim) {
        return pontoRepository.findByFuncionarioAndPeriodo(idFuncionario, dataInicio, dataFim);
    }

    public List<PontoEletronico> buscarPorStatus(PontoEletronico.StatusPonto status) {
        return pontoRepository.findByStatus(status);
    }

    public List<PontoEletronico> buscarComHorasExtras(LocalDate dataInicio, LocalDate dataFim) {
        return pontoRepository.findComHorasExtras(dataInicio, dataFim);
    }

    public BigDecimal getTotalHorasFuncionario(Long idFuncionario, LocalDate dataInicio, LocalDate dataFim) {
        return pontoRepository.getTotalHorasFuncionario(idFuncionario, dataInicio, dataFim);
    }

    public BigDecimal getTotalHorasExtrasFuncionario(Long idFuncionario, LocalDate dataInicio, LocalDate dataFim) {
        return pontoRepository.getTotalHorasExtrasFuncionario(idFuncionario, dataInicio, dataFim);
    }

    @Transactional
    public void deletar(Long id) {
        if (!pontoRepository.existsById(id)) {
            throw new RuntimeException("Ponto não encontrado com ID: " + id);
        }
        pontoRepository.deleteById(id);
    }

    /**
     * Registra entrada do funcionário
     */
    @Transactional
    public PontoEletronico registrarEntrada(Long idFuncionario, java.time.LocalTime horaEntrada) {
        LocalDate hoje = LocalDate.now();
        
        // Verificar se já existe ponto para hoje
        Optional<PontoEletronico> pontoExistente = pontoRepository.findByFuncionarioAndData(idFuncionario, hoje);
        
        if (pontoExistente.isPresent()) {
            throw new RuntimeException("Entrada já registrada para hoje");
        }
        
        PontoEletronico ponto = new PontoEletronico(idFuncionario, hoje);
        ponto.setHoraEntrada(horaEntrada);
        ponto.setStatusPonto(PontoEletronico.StatusPonto.NORMAL);
        
        return pontoRepository.save(ponto);
    }

    /**
     * Registra saída para almoço
     */
    @Transactional
    public PontoEletronico registrarSaidaAlmoco(Long idFuncionario, java.time.LocalTime horaSaidaAlmoco) {
        LocalDate hoje = LocalDate.now();
        
        PontoEletronico ponto = pontoRepository.findByFuncionarioAndData(idFuncionario, hoje)
                .orElseThrow(() -> new RuntimeException("Entrada não registrada para hoje"));
        
        if (ponto.getHoraSaidaAlmoco() != null) {
            throw new RuntimeException("Saída para almoço já registrada");
        }
        
        ponto.setHoraSaidaAlmoco(horaSaidaAlmoco);
        return pontoRepository.save(ponto);
    }

    /**
     * Registra retorno do almoço
     */
    @Transactional
    public PontoEletronico registrarRetornoAlmoco(Long idFuncionario, java.time.LocalTime horaRetornoAlmoco) {
        LocalDate hoje = LocalDate.now();
        
        PontoEletronico ponto = pontoRepository.findByFuncionarioAndData(idFuncionario, hoje)
                .orElseThrow(() -> new RuntimeException("Entrada não registrada para hoje"));
        
        if (ponto.getHoraSaidaAlmoco() == null) {
            throw new RuntimeException("Saída para almoço não registrada");
        }
        
        if (ponto.getHoraRetornoAlmoco() != null) {
            throw new RuntimeException("Retorno do almoço já registrado");
        }
        
        ponto.setHoraRetornoAlmoco(horaRetornoAlmoco);
        return pontoRepository.save(ponto);
    }

    /**
     * Registra saída do funcionário
     */
    @Transactional
    public PontoEletronico registrarSaida(Long idFuncionario, java.time.LocalTime horaSaida) {
        LocalDate hoje = LocalDate.now();
        
        PontoEletronico ponto = pontoRepository.findByFuncionarioAndData(idFuncionario, hoje)
                .orElseThrow(() -> new RuntimeException("Entrada não registrada para hoje"));
        
        if (ponto.getHoraSaida() != null) {
            throw new RuntimeException("Saída já registrada");
        }
        
        ponto.setHoraSaida(horaSaida);
        return pontoRepository.save(ponto);
    }

    /**
     * Registra falta
     */
    @Transactional
    public PontoEletronico registrarFalta(Long idFuncionario, LocalDate data, String observacao) {
        // Verificar se já existe ponto para esta data
        Optional<PontoEletronico> pontoExistente = pontoRepository.findByFuncionarioAndData(idFuncionario, data);
        
        if (pontoExistente.isPresent()) {
            throw new RuntimeException("Já existe registro de ponto para esta data");
        }
        
        PontoEletronico ponto = new PontoEletronico(idFuncionario, data);
        ponto.setStatusPonto(PontoEletronico.StatusPonto.FALTA);
        ponto.setObservacoes(observacao);
        
        return pontoRepository.save(ponto);
    }

    /**
     * Registra atestado médico
     */
    @Transactional
    public PontoEletronico registrarAtestado(Long idFuncionario, LocalDate data, String observacao) {
        // Verificar se já existe ponto para esta data
        Optional<PontoEletronico> pontoExistente = pontoRepository.findByFuncionarioAndData(idFuncionario, data);
        
        if (pontoExistente.isPresent()) {
            throw new RuntimeException("Já existe registro de ponto para esta data");
        }
        
        PontoEletronico ponto = new PontoEletronico(idFuncionario, data);
        ponto.setStatusPonto(PontoEletronico.StatusPonto.ATESTADO);
        ponto.setObservacoes(observacao);
        
        return pontoRepository.save(ponto);
    }
}
