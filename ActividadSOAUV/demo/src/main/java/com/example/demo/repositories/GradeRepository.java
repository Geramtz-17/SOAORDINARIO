package com.example.demo.repositories;

import com.example.demo.models.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudentId(String studentId);
    List<Grade> findByCourseId(String courseId);
}
