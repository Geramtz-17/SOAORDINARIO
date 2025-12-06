package com.example.demo.services;

import com.example.demo.models.Grade;
import com.example.demo.repositories.GradeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class GradeService {

    private final GradeRepository repo;

    public GradeService(GradeRepository repo) {
        this.repo = repo;
    }

    public List<Grade> findByStudentId(String studentId) {
        return repo.findByStudentId(studentId);
    }

    public List<Grade> findByCourseId(String courseId) {
        return repo.findByCourseId(courseId);
    }

    public Optional<Grade> findById(Long id) {
        return repo.findById(id);
    }
    @Transactional
    public Grade create(Grade grade) {
        if (grade.getGrade() == null) {
            throw new IllegalArgumentException("El campo grade es obligatorio");
        }
        return repo.save(grade);
    }

    @Transactional
    public Optional<Grade> update(Long id, Grade newData) {
        return repo.findById(id).map(existing -> {
            existing.setStudentId(newData.getStudentId());
            existing.setCourseId(newData.getCourseId());
            existing.setGrade(newData.getGrade());
            return repo.save(existing);
        });
    }

    @Transactional
    public boolean delete(Long id) {
        if (!repo.existsById(id)) return false;
        repo.deleteById(id);
        return true;
    }
}
