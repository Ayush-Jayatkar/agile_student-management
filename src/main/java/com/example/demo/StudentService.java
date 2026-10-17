package com.example.demo;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.stereotype.Service;

@Service
public class StudentService {
    private final List<Student> students = new ArrayList<>();
    private final AtomicInteger nextId = new AtomicInteger(1);

    public synchronized Student addStudent(String name, String rollNo) {
        if (students.stream().anyMatch(student -> student.getRollNo().equalsIgnoreCase(rollNo))) {
            throw new IllegalArgumentException("A student with this roll number already exists.");
        }
        Student student = new Student(nextId.getAndIncrement(), name, rollNo);
        students.add(student);
        return student;
    }

    public synchronized List<Student> getAllStudents() {
        return new ArrayList<>(students);
    }

    public synchronized List<Student> searchByName(String name) {
        return students.stream()
                .filter(student -> student.getName().toLowerCase().contains(name.toLowerCase()))
                .toList();
    }

    public synchronized Student updateStudent(int id, String name, String rollNo) {
        Student current = students.stream().filter(student -> student.getId() == id)
                .findFirst().orElse(null);
        if (current == null) {
            return null;
        }
        boolean duplicate = students.stream().anyMatch(student -> student.getId() != id
                && student.getRollNo().equalsIgnoreCase(rollNo));
        if (duplicate) {
            throw new IllegalArgumentException("A student with this roll number already exists.");
        }
        Student updated = new Student(id, name, rollNo);
        students.set(students.indexOf(current), updated);
        return updated;
    }

    public synchronized boolean deleteStudent(int id) {
        return students.removeIf(student -> student.getId() == id);
    }
}
