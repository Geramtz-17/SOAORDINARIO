package com.example.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.repositories.CursoRepository;
import com.example.demo.models.Curso;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CursoService {

    @Autowired
    private CursoRepository repository;

    public Curso crear(Curso curso) {
        return repository.save(curso);
    }

    public Optional<Curso> obtenerPorId(Long id) {
        return repository.findById(id);
    }

    public void eliminarPorId(Long id) {
        repository.deleteById(id);
    }

    public int eliminarPorNombre(String nombre) {
        List<Curso> found = repository.findByNombre(nombre);
        repository.deleteAll(found);
        return found.size();
    }

    public int eliminarPorFechaInicio(LocalDate fecha) {
        List<Curso> found = repository.findByFechaInicio(fecha);
        repository.deleteAll(found);
        return found.size();
    }
}