package com.project.sigma.controller;

import com.project.sigma.model.FeriasFuncionario;
import com.project.sigma.service.FeriasFuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/ferias-funcionario")
@CrossOrigin(origins = "*")
public class FeriasFuncionarioController {

    @Autowired
    private FeriasFuncionarioService feriasService;

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody FeriasFuncionario ferias) {
        try {
            FeriasFuncionario novasFerias = feriasService.criar(ferias);
            return ResponseEntity.status(HttpStatus.CREATED).body(novasFerias);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody FeriasFuncionario ferias) {
        try {
            FeriasFuncionario feriasAtualizadas = feriasService.atualizar(id, ferias);
            return ResponseEntity.ok(feriasAtualizadas);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeriasFuncionario> buscarPorId(@PathVariable Long id) {
        return feriasService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<FeriasFuncionario>> listarTodos() {
        List<FeriasFuncionario> ferias = feriasService.listarTodos();
        return ResponseEntity.ok(ferias);
    }

    @GetMapping("/funcionario/{idFuncionario}")
    public ResponseEntity<List<FeriasFuncionario>> buscarPorFuncionario(@PathVariable Long idFuncionario) {
        List<FeriasFuncionario> ferias = feriasService.buscarPorFuncionario(idFuncionario);
        return ResponseEntity.ok(ferias);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<FeriasFuncionario>> buscarPorStatus(
            @PathVariable FeriasFuncionario.StatusFerias status) {
        List<FeriasFuncionario> ferias = feriasService.buscarPorStatus(status);
        return ResponseEntity.ok(ferias);
    }

    @GetMapping("/periodo")
    public ResponseEntity<List<FeriasFuncionario>> buscarPorPeriodo(
            @RequestParam String dataInicio,
            @RequestParam String dataFim) {
        try {
            LocalDate inicio = LocalDate.parse(dataInicio);
            LocalDate fim = LocalDate.parse(dataFim);
            List<FeriasFuncionario> ferias = feriasService.buscarPorPeriodo(inicio, fim);
            return ResponseEntity.ok(ferias);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/em-andamento")
    public ResponseEntity<List<FeriasFuncionario>> buscarEmAndamento() {
        List<FeriasFuncionario> ferias = feriasService.buscarFeriasEmAndamento();
        return ResponseEntity.ok(ferias);
    }

    @GetMapping("/proximas")
    public ResponseEntity<List<FeriasFuncionario>> buscarProximas(@RequestParam(defaultValue = "30") int dias) {
        List<FeriasFuncionario> ferias = feriasService.buscarFeriasProgramadasProximos(dias);
        return ResponseEntity.ok(ferias);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            feriasService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoints para mudança de status

    @PutMapping("/{id}/iniciar")
    public ResponseEntity<?> iniciar(@PathVariable Long id) {
        try {
            FeriasFuncionario ferias = feriasService.iniciarFerias(id);
            return ResponseEntity.ok(ferias);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/concluir")
    public ResponseEntity<?> concluir(@PathVariable Long id) {
        try {
            FeriasFuncionario ferias = feriasService.concluirFerias(id);
            return ResponseEntity.ok(ferias);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelar(@PathVariable Long id, @RequestBody CancelarFeriasRequest request) {
        try {
            FeriasFuncionario ferias = feriasService.cancelarFerias(id, request.getMotivo());
            return ResponseEntity.ok(ferias);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/atualizar-status-automatico")
    public ResponseEntity<Void> atualizarStatusAutomatico() {
        feriasService.atualizarStatusAutomatico();
        return ResponseEntity.ok().build();
    }

    // Classe interna para request de cancelamento
    public static class CancelarFeriasRequest {
        private String motivo;

        public String getMotivo() { return motivo; }
        public void setMotivo(String motivo) { this.motivo = motivo; }
    }
}
