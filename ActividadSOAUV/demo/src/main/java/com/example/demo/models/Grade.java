package com.example.demo.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "grades")
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentId;
    private String courseId;
    private Double grade;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId(){ return id; }
    public void setId(Long id){ this.id = id; }
    public String getStudentId(){ return studentId; }
    public void setStudentId(String studentId){ this.studentId = studentId; }
    public String getCourseId(){ return courseId; }
    public void setCourseId(String courseId){ this.courseId = courseId; }
    public Double getGrade(){ return grade; }
    public void setGrade(Double grade){ this.grade = grade; }
    public LocalDateTime getCreatedAt(){ return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt){ this.createdAt = createdAt; }
}
