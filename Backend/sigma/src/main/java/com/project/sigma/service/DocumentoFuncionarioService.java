package com.project.sigma.service;

import com.project.sigma.model.DocumentoFuncionario;
import com.project.sigma.repository.DocumentoFuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DocumentoFuncionarioService {

    @Autowired
    private DocumentoFuncionarioRepository documentoRepository;

    @Transactional
    public DocumentoFuncionario criar(DocumentoFuncionario documento) {
        return documentoRepository.save(documento);
    }

    @Transactional
    public DocumentoFuncionario atualizar(Long id, DocumentoFuncionario documento) {
        if (!documentoRepository.existsById(id)) {
            throw new RuntimeException("Documento não encontrado com ID: " + id);
        }
        documento.setIdDocumento(id);
        return documentoRepository.save(documento);
    }

    public Optional<DocumentoFuncionario> buscarPorId(Long id) {
        return documentoRepository.findById(id);
    }

    public List<DocumentoFuncionario> listarTodos() {
        return documentoRepository.findAll();
    }

    public List<DocumentoFuncionario> buscarPorFuncionario(Long idFuncionario) {
        return documentoRepository.findByFuncionario(idFuncionario);
    }

    public List<DocumentoFuncionario> buscarPorTipo(DocumentoFuncionario.TipoDocumento tipoDocumento) {
        return documentoRepository.findByTipo(tipoDocumento);
    }

    public List<DocumentoFuncionario> buscarDocumentosVencidos() {
        return documentoRepository.findDocumentosVencidos();
    }

    public List<DocumentoFuncionario> buscarDocumentosAVencer(int dias) {
        return documentoRepository.findDocumentosAVencer(dias);
    }

    public Optional<DocumentoFuncionario> buscarPorFuncionarioETipo(Long idFuncionario, 
            DocumentoFuncionario.TipoDocumento tipoDocumento) {
        return documentoRepository.findByFuncionarioAndTipo(idFuncionario, tipoDocumento);
    }

    @Transactional
    public void deletar(Long id) {
        if (!documentoRepository.existsById(id)) {
            throw new RuntimeException("Documento não encontrado com ID: " + id);
        }
        documentoRepository.deleteById(id);
    }

    /**
     * Verifica se um documento está vencido
     */
    public boolean isDocumentoVencido(DocumentoFuncionario documento) {
        if (documento.getDataValidade() == null) {
            return false;
        }
        return documento.getDataValidade().isBefore(java.time.LocalDate.now());
    }

    /**
     * Verifica quantos dias faltam para o documento vencer
     */
    public Long diasParaVencer(DocumentoFuncionario documento) {
        if (documento.getDataValidade() == null) {
            return null;
        }
        return java.time.temporal.ChronoUnit.DAYS.between(
                java.time.LocalDate.now(), 
                documento.getDataValidade());
    }
}
