package com.project.sigma.controller;

import com.project.sigma.model.PontoEletronico;
import com.project.sigma.service.PontoEletronicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ponto-eletronico")
@CrossOrigin(origins = "*")
public class PontoEletronicoController {

    @Autowired
    private PontoEletronicoService pontoService;

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody PontoEletronico ponto) {
        try {
            PontoEletronico novoPonto = pontoService.criar(ponto);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoPonto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody PontoEletronico ponto) {
        try {
            PontoEletronico pontoAtualizado = pontoService.atualizar(id, ponto);
            return ResponseEntity.ok(pontoAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PontoEletronico> buscarPorId(@PathVariable Long id) {
        return pontoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<PontoEletronico>> listarTodos() {
        List<PontoEletronico> pontos = pontoService.listarTodos();
        return ResponseEntity.ok(pontos);
    }

    @GetMapping("/funcionario/{idFuncionario}")
    public ResponseEntity<List<PontoEletronico>> buscarPorFuncionario(@PathVariable Long idFuncionario) {
        List<PontoEletronico> pontos = pontoService.buscarPorFuncionario(idFuncionario);
        return ResponseEntity.ok(pontos);
    }

    @GetMapping("/funcionario/{idFuncionario}/data/{data}")
    public ResponseEntity<PontoEletronico> buscarPorFuncionarioEData(
            @PathVariable Long idFuncionario,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return pontoService.buscarPorFuncionarioEData(idFuncionario, data)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/periodo")
    public ResponseEntity<List<PontoEletronico>> buscarPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        List<PontoEletronico> pontos = pontoService.buscarPorPeriodo(dataInicio, dataFim);
        return ResponseEntity.ok(pontos);
    }

    @GetMapping("/funcionario/{idFuncionario}/periodo")
    public ResponseEntity<List<PontoEletronico>> buscarPorFuncionarioEPeriodo(
            @PathVariable Long idFuncionario,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        List<PontoEletronico> pontos = pontoService.buscarPorFuncionarioEPeriodo(idFuncionario, dataInicio, dataFim);
        return ResponseEntity.ok(pontos);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PontoEletronico>> buscarPorStatus(
            @PathVariable PontoEletronico.StatusPonto status) {
        List<PontoEletronico> pontos = pontoService.buscarPorStatus(status);
        return ResponseEntity.ok(pontos);
    }

    @GetMapping("/horas-extras")
    public ResponseEntity<List<PontoEletronico>> buscarComHorasExtras(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        List<PontoEletronico> pontos = pontoService.buscarComHorasExtras(dataInicio, dataFim);
        return ResponseEntity.ok(pontos);
    }

    @GetMapping("/funcionario/{idFuncionario}/total-horas")
    public ResponseEntity<Map<String, BigDecimal>> getTotalHoras(
            @PathVariable Long idFuncionario,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        BigDecimal totalHoras = pontoService.getTotalHorasFuncionario(idFuncionario, dataInicio, dataFim);
        BigDecimal totalHorasExtras = pontoService.getTotalHorasExtrasFuncionario(idFuncionario, dataInicio, dataFim);
        
        return ResponseEntity.ok(Map.of(
                "totalHoras", totalHoras,
                "totalHorasExtras", totalHorasExtras
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            pontoService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoints para registrar marcações de ponto

    @PostMapping("/registrar-entrada")
    public ResponseEntity<?> registrarEntrada(@RequestBody RegistrarPontoRequest request) {
        try {
            LocalTime hora = request.getHora() != null ? request.getHora() : LocalTime.now();
            PontoEletronico ponto = pontoService.registrarEntrada(request.getIdFuncionario(), hora);
            return ResponseEntity.status(HttpStatus.CREATED).body(ponto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/registrar-saida-almoco")
    public ResponseEntity<?> registrarSaidaAlmoco(@RequestBody RegistrarPontoRequest request) {
        try {
            LocalTime hora = request.getHora() != null ? request.getHora() : LocalTime.now();
            PontoEletronico ponto = pontoService.registrarSaidaAlmoco(request.getIdFuncionario(), hora);
            return ResponseEntity.ok(ponto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/registrar-retorno-almoco")
    public ResponseEntity<?> registrarRetornoAlmoco(@RequestBody RegistrarPontoRequest request) {
        try {
            LocalTime hora = request.getHora() != null ? request.getHora() : LocalTime.now();
            PontoEletronico ponto = pontoService.registrarRetornoAlmoco(request.getIdFuncionario(), hora);
            return ResponseEntity.ok(ponto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/registrar-saida")
    public ResponseEntity<?> registrarSaida(@RequestBody RegistrarPontoRequest request) {
        try {
            LocalTime hora = request.getHora() != null ? request.getHora() : LocalTime.now();
            PontoEletronico ponto = pontoService.registrarSaida(request.getIdFuncionario(), hora);
            return ResponseEntity.ok(ponto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/registrar-falta")
    public ResponseEntity<?> registrarFalta(@RequestBody RegistrarFaltaRequest request) {
        try {
            PontoEletronico ponto = pontoService.registrarFalta(
                    request.getIdFuncionario(),
                    request.getData(),
                    request.getObservacao()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(ponto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/registrar-atestado")
    public ResponseEntity<?> registrarAtestado(@RequestBody RegistrarFaltaRequest request) {
        try {
            PontoEletronico ponto = pontoService.registrarAtestado(
                    request.getIdFuncionario(),
                    request.getData(),
                    request.getObservacao()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(ponto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Classes internas para requests

    public static class RegistrarPontoRequest {
        private Long idFuncionario;
        private LocalTime hora;

        public Long getIdFuncionario() { return idFuncionario; }
        public void setIdFuncionario(Long idFuncionario) { this.idFuncionario = idFuncionario; }
        public LocalTime getHora() { return hora; }
        public void setHora(LocalTime hora) { this.hora = hora; }
    }

    public static class RegistrarFaltaRequest {
        private Long idFuncionario;
        private LocalDate data;
        private String observacao;

        public Long getIdFuncionario() { return idFuncionario; }
        public void setIdFuncionario(Long idFuncionario) { this.idFuncionario = idFuncionario; }
        public LocalDate getData() { return data; }
        public void setData(LocalDate data) { this.data = data; }
        public String getObservacao() { return observacao; }
        public void setObservacao(String observacao) { this.observacao = observacao; }
    }
}
