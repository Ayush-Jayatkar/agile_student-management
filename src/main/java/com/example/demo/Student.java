package com.example.demo;

public class Student {
    private final int id;
    private final String name;
    private final String rollNo;

    public Student(int id, String name, String rollNo) {
        this.id = id;
        this.name = name;
        this.rollNo = rollNo;
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public String getRollNo() { return rollNo; }
}
