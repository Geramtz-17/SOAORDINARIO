package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.models.Curso;
import java.time.LocalDate;
import java.util.List;

public interface CursoRepository extends JpaRepository<Curso, Long> {
    List<Curso> findByNombre(String nombre);
    List<Curso> findByFechaInicio(LocalDate fechaInicio);
}
