package com.project.sigma.controller;

import com.project.sigma.model.DocumentoFuncionario;
import com.project.sigma.service.DocumentoFuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documentos-funcionario")
@CrossOrigin(origins = "*")
public class DocumentoFuncionarioController {

    @Autowired
    private DocumentoFuncionarioService documentoService;

    @PostMapping
    public ResponseEntity<DocumentoFuncionario> criar(@RequestBody DocumentoFuncionario documento) {
        try {
            DocumentoFuncionario novoDocumento = documentoService.criar(documento);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoDocumento);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocumentoFuncionario> atualizar(@PathVariable Long id, 
            @RequestBody DocumentoFuncionario documento) {
        try {
            DocumentoFuncionario documentoAtualizado = documentoService.atualizar(id, documento);
            return ResponseEntity.ok(documentoAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentoFuncionario> buscarPorId(@PathVariable Long id) {
        return documentoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<DocumentoFuncionario>> listarTodos() {
        List<DocumentoFuncionario> documentos = documentoService.listarTodos();
        return ResponseEntity.ok(documentos);
    }

    @GetMapping("/funcionario/{idFuncionario}")
    public ResponseEntity<List<DocumentoFuncionario>> buscarPorFuncionario(@PathVariable Long idFuncionario) {
        List<DocumentoFuncionario> documentos = documentoService.buscarPorFuncionario(idFuncionario);
        return ResponseEntity.ok(documentos);
    }

    @GetMapping("/tipo/{tipoDocumento}")
    public ResponseEntity<List<DocumentoFuncionario>> buscarPorTipo(
            @PathVariable DocumentoFuncionario.TipoDocumento tipoDocumento) {
        List<DocumentoFuncionario> documentos = documentoService.buscarPorTipo(tipoDocumento);
        return ResponseEntity.ok(documentos);
    }

    @GetMapping("/vencidos")
    public ResponseEntity<List<DocumentoFuncionario>> buscarVencidos() {
        List<DocumentoFuncionario> documentos = documentoService.buscarDocumentosVencidos();
        return ResponseEntity.ok(documentos);
    }

    @GetMapping("/a-vencer")
    public ResponseEntity<List<DocumentoFuncionario>> buscarAVencer(@RequestParam(defaultValue = "30") int dias) {
        List<DocumentoFuncionario> documentos = documentoService.buscarDocumentosAVencer(dias);
        return ResponseEntity.ok(documentos);
    }

    @GetMapping("/funcionario/{idFuncionario}/tipo/{tipoDocumento}")
    public ResponseEntity<DocumentoFuncionario> buscarPorFuncionarioETipo(
            @PathVariable Long idFuncionario,
            @PathVariable DocumentoFuncionario.TipoDocumento tipoDocumento) {
        return documentoService.buscarPorFuncionarioETipo(idFuncionario, tipoDocumento)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            documentoService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/vencido")
    public ResponseEntity<Boolean> isDocumentoVencido(@PathVariable Long id) {
        return documentoService.buscarPorId(id)
                .map(documento -> ResponseEntity.ok(documentoService.isDocumentoVencido(documento)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/dias-para-vencer")
    public ResponseEntity<Long> diasParaVencer(@PathVariable Long id) {
        return documentoService.buscarPorId(id)
                .map(documento -> {
                    Long dias = documentoService.diasParaVencer(documento);
                    return dias != null ? ResponseEntity.ok(dias) : ResponseEntity.ok(Long.MAX_VALUE);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
