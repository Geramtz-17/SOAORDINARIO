package com.example.demo.controllers;

import com.example.demo.models.Curso;
import com.example.demo.services.CursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Optional;

@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE})
@RestController
@RequestMapping("/api/cursos")
public class CourseController {

    @Autowired
    private CursoService cursoService;

    @PostMapping
    public ResponseEntity<Curso> registrarCurso(@RequestBody Curso curso) {
        Curso nuevoCurso = cursoService.crear(curso);
        return new ResponseEntity<>(nuevoCurso, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Curso> consultarCursoPorId(@PathVariable Long id) {
        Optional<Curso> curso = cursoService.obtenerPorId(id);
        return curso.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCursoPorId(@PathVariable Long id) {
        try {
            cursoService.eliminarPorId(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); 
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
        }
    }

    @DeleteMapping
    public ResponseEntity<String> eliminarCursosPorCriterio(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String fechaInicioStr) {

        int cursosEliminados = 0;
        
        if (nombre != null && !nombre.trim().isEmpty()) {
            cursosEliminados += cursoService.eliminarPorNombre(nombre);
        }

        if (fechaInicioStr != null && !fechaInicioStr.trim().isEmpty()) {
            try {
                LocalDate fecha = LocalDate.parse(fechaInicioStr);
                cursosEliminados += cursoService.eliminarPorFechaInicio(fecha);
            } catch (java.time.format.DateTimeParseException e) {
                return new ResponseEntity<>("Error: Formato de fecha de inicio inválido. Use AAAA-MM-DD.", HttpStatus.BAD_REQUEST);
            }
        }
        
        if (cursosEliminados > 0) {
            return new ResponseEntity<>("Se eliminaron " + cursosEliminados + " cursos.", HttpStatus.OK);
        } else if (nombre == null && fechaInicioStr == null) {
            return new ResponseEntity<>("Debe especificar 'nombre' o 'fechaInicio' para eliminar.", HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>("No se encontraron cursos que coincidan con los criterios.", HttpStatus.NOT_FOUND
            );
        }
    }
}