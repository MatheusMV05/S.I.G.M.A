package com.project.sigma.service;

import com.project.sigma.model.FeriasFuncionario;
import com.project.sigma.repository.FeriasFuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FeriasFuncionarioService {

    @Autowired
    private FeriasFuncionarioRepository feriasRepository;

    @Transactional
    public FeriasFuncionario criar(FeriasFuncionario ferias) {
        // Validar se há conflito de datas
        if (feriasRepository.hasConflito(ferias.getIdFuncionario(), 
                ferias.getDataInicioFerias(), ferias.getDataFimFerias(), null)) {
            throw new RuntimeException("Já existem férias programadas para este funcionário neste período");
        }
        
        // Validar quantidade de dias
        if (ferias.getDiasGozados() < 1 || ferias.getDiasGozados() > 30) {
            throw new RuntimeException("Quantidade de dias de férias deve estar entre 1 e 30");
        }
        
        return feriasRepository.save(ferias);
    }

    @Transactional
    public FeriasFuncionario atualizar(Long id, FeriasFuncionario ferias) {
        if (!feriasRepository.existsById(id)) {
            throw new RuntimeException("Férias não encontradas com ID: " + id);
        }
        
        // Validar se há conflito de datas (excluindo o próprio registro)
        if (feriasRepository.hasConflito(ferias.getIdFuncionario(), 
                ferias.getDataInicioFerias(), ferias.getDataFimFerias(), id)) {
            throw new RuntimeException("Já existem férias programadas para este funcionário neste período");
        }
        
        ferias.setIdFerias(id);
        return feriasRepository.save(ferias);
    }

    public Optional<FeriasFuncionario> buscarPorId(Long id) {
        return feriasRepository.findById(id);
    }

    public List<FeriasFuncionario> listarTodos() {
        return feriasRepository.findAll();
    }

    public List<FeriasFuncionario> buscarPorFuncionario(Long idFuncionario) {
        return feriasRepository.findByFuncionario(idFuncionario);
    }

    public List<FeriasFuncionario> buscarPorStatus(FeriasFuncionario.StatusFerias status) {
        return feriasRepository.findByStatus(status);
    }

    public List<FeriasFuncionario> buscarPorPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        return feriasRepository.findByPeriodo(dataInicio, dataFim);
    }

    public List<FeriasFuncionario> buscarFeriasEmAndamento() {
        return feriasRepository.findFeriasEmAndamento();
    }

    public List<FeriasFuncionario> buscarFeriasProgramadasProximos(int dias) {
        return feriasRepository.findFeriasProgramadasProximos(dias);
    }

    @Transactional
    public void deletar(Long id) {
        if (!feriasRepository.existsById(id)) {
            throw new RuntimeException("Férias não encontradas com ID: " + id);
        }
        feriasRepository.deleteById(id);
    }

    /**
     * Inicia férias (muda status para EM_ANDAMENTO)
     */
    @Transactional
    public FeriasFuncionario iniciarFerias(Long id) {
        FeriasFuncionario ferias = feriasRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Férias não encontradas com ID: " + id));
        
        if (ferias.getStatusFerias() != FeriasFuncionario.StatusFerias.PROGRAMADAS) {
            throw new RuntimeException("Apenas férias programadas podem ser iniciadas");
        }
        
        ferias.setStatusFerias(FeriasFuncionario.StatusFerias.EM_ANDAMENTO);
        return feriasRepository.save(ferias);
    }

    /**
     * Conclui férias (muda status para CONCLUIDAS)
     */
    @Transactional
    public FeriasFuncionario concluirFerias(Long id) {
        FeriasFuncionario ferias = feriasRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Férias não encontradas com ID: " + id));
        
        if (ferias.getStatusFerias() != FeriasFuncionario.StatusFerias.EM_ANDAMENTO) {
            throw new RuntimeException("Apenas férias em andamento podem ser concluídas");
        }
        
        ferias.setStatusFerias(FeriasFuncionario.StatusFerias.CONCLUIDAS);
        return feriasRepository.save(ferias);
    }

    /**
     * Cancela férias (muda status para CANCELADAS)
     */
    @Transactional
    public FeriasFuncionario cancelarFerias(Long id, String motivo) {
        FeriasFuncionario ferias = feriasRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Férias não encontradas com ID: " + id));
        
        if (ferias.getStatusFerias() == FeriasFuncionario.StatusFerias.CONCLUIDAS) {
            throw new RuntimeException("Férias concluídas não podem ser canceladas");
        }
        
        ferias.setStatusFerias(FeriasFuncionario.StatusFerias.CANCELADAS);
        ferias.setObservacoes((ferias.getObservacoes() != null ? ferias.getObservacoes() + "\n" : "") + 
                "Cancelada. Motivo: " + motivo);
        return feriasRepository.save(ferias);
    }

    /**
     * Atualiza status das férias automaticamente baseado na data
     */
    @Transactional
    public void atualizarStatusAutomatico() {
        LocalDate hoje = LocalDate.now();
        
        // Iniciar férias programadas que começam hoje
        List<FeriasFuncionario> paraIniciar = feriasRepository.findByStatus(FeriasFuncionario.StatusFerias.PROGRAMADAS);
        for (FeriasFuncionario ferias : paraIniciar) {
            if (!ferias.getDataInicioFerias().isAfter(hoje) && !ferias.getDataFimFerias().isBefore(hoje)) {
                ferias.setStatusFerias(FeriasFuncionario.StatusFerias.EM_ANDAMENTO);
                feriasRepository.save(ferias);
            }
        }
        
        // Concluir férias em andamento que terminaram
        List<FeriasFuncionario> emAndamento = feriasRepository.findByStatus(FeriasFuncionario.StatusFerias.EM_ANDAMENTO);
        for (FeriasFuncionario ferias : emAndamento) {
            if (ferias.getDataFimFerias().isBefore(hoje)) {
                ferias.setStatusFerias(FeriasFuncionario.StatusFerias.CONCLUIDAS);
                feriasRepository.save(ferias);
            }
        }
    }
}
