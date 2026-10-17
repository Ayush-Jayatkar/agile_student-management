package com.example.demo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class StudentServiceTest {
    private StudentService service;

    @BeforeEach
    void setUp() {
        service = new StudentService();
    }

    @Test
    void addsStudent() {
        assertEquals("Asha", service.addStudent("Asha", "R1").getName());
    }

    @Test
    void rejectsDuplicateRollNo() {
        service.addStudent("Asha", "R1");
        assertThrows(IllegalArgumentException.class, () -> service.addStudent("Ben", "R1"));
    }

    @Test
    void getsAllStudents() {
        service.addStudent("Asha", "R1");
        service.addStudent("Ben", "R2");
        assertEquals(2, service.getAllStudents().size());
    }

    @Test
    void searchesNameIgnoringCase() {
        service.addStudent("Asha Patel", "R1");
        assertEquals(1, service.searchByName("ASHA").size());
    }

    @Test
    void searchCanReturnNoMatches() {
        service.addStudent("Asha", "R1");
        assertTrue(service.searchByName("Nobody").isEmpty());
    }

    @Test
    void deletesExistingStudent() {
        int id = service.addStudent("Asha", "R1").getId();
        assertTrue(service.deleteStudent(id));
        assertTrue(service.getAllStudents().isEmpty());
    }

    @Test
    void returnsFalseWhenStudentDoesNotExist() {
        assertFalse(service.deleteStudent(44));
    }

    @Test
    void updatesExistingStudent() {
        Student original = service.addStudent("Asha", "R1");
        Student updated = service.updateStudent(original.getId(), "Asha Patel", "R2");
        assertEquals(original.getId(), updated.getId());
        assertEquals("Asha Patel", updated.getName());
        assertEquals("R2", updated.getRollNo());
    }

    @Test
    void rejectsDuplicateRollNoWhenUpdating() {
        service.addStudent("Asha", "R1");
        Student other = service.addStudent("Ben", "R2");
        assertThrows(IllegalArgumentException.class,
                () -> service.updateStudent(other.getId(), "Ben", "R1"));
    }
}
