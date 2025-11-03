package com.project.sigma.controller;

import com.project.sigma.model.HistoricoFuncionario;
import com.project.sigma.service.HistoricoFuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/historico-funcionario")
@CrossOrigin(origins = "*")
public class HistoricoFuncionarioController {

    @Autowired
    private HistoricoFuncionarioService historicoService;

    @PostMapping
    public ResponseEntity<HistoricoFuncionario> criar(@RequestBody HistoricoFuncionario historico) {
        try {
            HistoricoFuncionario novoHistorico = historicoService.criar(historico);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoHistorico);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<HistoricoFuncionario> atualizar(@PathVariable Long id, 
            @RequestBody HistoricoFuncionario historico) {
        try {
            HistoricoFuncionario historicoAtualizado = historicoService.atualizar(id, historico);
            return ResponseEntity.ok(historicoAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistoricoFuncionario> buscarPorId(@PathVariable Long id) {
        return historicoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<HistoricoFuncionario>> listarTodos() {
        List<HistoricoFuncionario> historicos = historicoService.listarTodos();
        return ResponseEntity.ok(historicos);
    }

    @GetMapping("/funcionario/{idFuncionario}")
    public ResponseEntity<List<HistoricoFuncionario>> buscarPorFuncionario(@PathVariable Long idFuncionario) {
        List<HistoricoFuncionario> historicos = historicoService.buscarPorFuncionario(idFuncionario);
        return ResponseEntity.ok(historicos);
    }

    @GetMapping("/tipo/{tipoEvento}")
    public ResponseEntity<List<HistoricoFuncionario>> buscarPorTipoEvento(
            @PathVariable HistoricoFuncionario.TipoEvento tipoEvento) {
        List<HistoricoFuncionario> historicos = historicoService.buscarPorTipoEvento(tipoEvento);
        return ResponseEntity.ok(historicos);
    }

    @GetMapping("/periodo")
    public ResponseEntity<List<HistoricoFuncionario>> buscarPorPeriodo(
            @RequestParam String dataInicio,
            @RequestParam String dataFim) {
        try {
            LocalDate inicio = LocalDate.parse(dataInicio);
            LocalDate fim = LocalDate.parse(dataFim);
            List<HistoricoFuncionario> historicos = historicoService.buscarPorPeriodo(inicio, fim);
            return ResponseEntity.ok(historicos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            historicoService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoints especializados para registrar eventos

    @PostMapping("/admissao")
    public ResponseEntity<HistoricoFuncionario> registrarAdmissao(@RequestBody AdmissaoRequest request) {
        try {
            HistoricoFuncionario historico = historicoService.registrarAdmissao(
                    request.getIdFuncionario(),
                    request.getCargo(),
                    request.getSetor(),
                    request.getSalario(),
                    request.getRealizadoPor()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(historico);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/promocao")
    public ResponseEntity<HistoricoFuncionario> registrarPromocao(@RequestBody PromocaoRequest request) {
        try {
            HistoricoFuncionario historico = historicoService.registrarPromocao(
                    request.getIdFuncionario(),
                    request.getCargoAnterior(),
                    request.getCargoNovo(),
                    request.getSalarioAnterior(),
                    request.getSalarioNovo(),
                    request.getRealizadoPor()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(historico);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/mudanca-setor")
    public ResponseEntity<HistoricoFuncionario> registrarMudancaSetor(@RequestBody MudancaSetorRequest request) {
        try {
            HistoricoFuncionario historico = historicoService.registrarMudancaSetor(
                    request.getIdFuncionario(),
                    request.getSetorAnterior(),
                    request.getSetorNovo(),
                    request.getRealizadoPor()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(historico);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/aumento-salarial")
    public ResponseEntity<HistoricoFuncionario> registrarAumentoSalarial(@RequestBody AumentoSalarialRequest request) {
        try {
            HistoricoFuncionario historico = historicoService.registrarAumentoSalarial(
                    request.getIdFuncionario(),
                    request.getSalarioAnterior(),
                    request.getSalarioNovo(),
                    request.getMotivo(),
                    request.getRealizadoPor()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(historico);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/desligamento")
    public ResponseEntity<HistoricoFuncionario> registrarDesligamento(@RequestBody DesligamentoRequest request) {
        try {
            HistoricoFuncionario historico = historicoService.registrarDesligamento(
                    request.getIdFuncionario(),
                    request.getMotivo(),
                    request.getRealizadoPor()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(historico);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Classes internas para requests

    public static class AdmissaoRequest {
        private Long idFuncionario;
        private String cargo;
        private String setor;
        private java.math.BigDecimal salario;
        private Long realizadoPor;

        public Long getIdFuncionario() { return idFuncionario; }
        public void setIdFuncionario(Long idFuncionario) { this.idFuncionario = idFuncionario; }
        public String getCargo() { return cargo; }
        public void setCargo(String cargo) { this.cargo = cargo; }
        public String getSetor() { return setor; }
        public void setSetor(String setor) { this.setor = setor; }
        public java.math.BigDecimal getSalario() { return salario; }
        public void setSalario(java.math.BigDecimal salario) { this.salario = salario; }
        public Long getRealizadoPor() { return realizadoPor; }
        public void setRealizadoPor(Long realizadoPor) { this.realizadoPor = realizadoPor; }
    }

    public static class PromocaoRequest {
        private Long idFuncionario;
        private String cargoAnterior;
        private String cargoNovo;
        private java.math.BigDecimal salarioAnterior;
        private java.math.BigDecimal salarioNovo;
        private Long realizadoPor;

        public Long getIdFuncionario() { return idFuncionario; }
        public void setIdFuncionario(Long idFuncionario) { this.idFuncionario = idFuncionario; }
        public String getCargoAnterior() { return cargoAnterior; }
        public void setCargoAnterior(String cargoAnterior) { this.cargoAnterior = cargoAnterior; }
        public String getCargoNovo() { return cargoNovo; }
        public void setCargoNovo(String cargoNovo) { this.cargoNovo = cargoNovo; }
        public java.math.BigDecimal getSalarioAnterior() { return salarioAnterior; }
        public void setSalarioAnterior(java.math.BigDecimal salarioAnterior) { this.salarioAnterior = salarioAnterior; }
        public java.math.BigDecimal getSalarioNovo() { return salarioNovo; }
        public void setSalarioNovo(java.math.BigDecimal salarioNovo) { this.salarioNovo = salarioNovo; }
        public Long getRealizadoPor() { return realizadoPor; }
        public void setRealizadoPor(Long realizadoPor) { this.realizadoPor = realizadoPor; }
    }

    public static class MudancaSetorRequest {
        private Long idFuncionario;
        private String setorAnterior;
        private String setorNovo;
        private Long realizadoPor;

        public Long getIdFuncionario() { return idFuncionario; }
        public void setIdFuncionario(Long idFuncionario) { this.idFuncionario = idFuncionario; }
        public String getSetorAnterior() { return setorAnterior; }
        public void setSetorAnterior(String setorAnterior) { this.setorAnterior = setorAnterior; }
        public String getSetorNovo() { return setorNovo; }
        public void setSetorNovo(String setorNovo) { this.setorNovo = setorNovo; }
        public Long getRealizadoPor() { return realizadoPor; }
        public void setRealizadoPor(Long realizadoPor) { this.realizadoPor = realizadoPor; }
    }

    public static class AumentoSalarialRequest {
        private Long idFuncionario;
        private java.math.BigDecimal salarioAnterior;
        private java.math.BigDecimal salarioNovo;
        private String motivo;
        private Long realizadoPor;

        public Long getIdFuncionario() { return idFuncionario; }
        public void setIdFuncionario(Long idFuncionario) { this.idFuncionario = idFuncionario; }
        public java.math.BigDecimal getSalarioAnterior() { return salarioAnterior; }
        public void setSalarioAnterior(java.math.BigDecimal salarioAnterior) { this.salarioAnterior = salarioAnterior; }
        public java.math.BigDecimal getSalarioNovo() { return salarioNovo; }
        public void setSalarioNovo(java.math.BigDecimal salarioNovo) { this.salarioNovo = salarioNovo; }
        public String getMotivo() { return motivo; }
        public void setMotivo(String motivo) { this.motivo = motivo; }
        public Long getRealizadoPor() { return realizadoPor; }
        public void setRealizadoPor(Long realizadoPor) { this.realizadoPor = realizadoPor; }
    }

    public static class DesligamentoRequest {
        private Long idFuncionario;
        private String motivo;
        private Long realizadoPor;

        public Long getIdFuncionario() { return idFuncionario; }
        public void setIdFuncionario(Long idFuncionario) { this.idFuncionario = idFuncionario; }
        public String getMotivo() { return motivo; }
        public void setMotivo(String motivo) { this.motivo = motivo; }
        public Long getRealizadoPor() { return realizadoPor; }
        public void setRealizadoPor(Long realizadoPor) { this.realizadoPor = realizadoPor; }
    }
}
