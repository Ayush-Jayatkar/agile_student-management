# Student Management System

![CI/CD workflow](https://github.com/Ayush-Jayatkar/agile_student-management/actions/workflows/ci-cd.yml/badge.svg)

## Project overview and run

CampusDesk is a responsive student management website and REST API. Use the sidebar to explore **Overview**, **Students**, **Agile Plan**, **CI/CD Pipeline**, and **Environments**. Add, view, search, edit, and delete student records. Student data is held in memory, so it resets when the server restarts. Java 17 and Maven are used.

Run the application from the project folder:

```bash
./mvnw spring-boot:run
```

On Windows, use `mvnw.cmd spring-boot:run`. Open the website at `http://localhost:8081`. The REST API is available at `http://localhost:8081/students`.

The Overview page has a **Load sample students** button. Use it on an empty directory to insert five example records (Asha Patel, Rohan Mehta, Priya Shah, Arjun Desai, and Neha Kulkarni) for a demonstration. Search, edit, and delete those records from the Students page. They remain in memory only and reset when the application restarts.

Example request to add a student:

```bash
curl -X POST http://localhost:8081/students -H "Content-Type: application/json" -d '{"name":"Asha Patel","rollNo":"R100"}'
```

Other API endpoints: `GET /students`, `GET /students/search?name=asha`, `PUT /students/{id}`, and `DELETE /students/{id}`. Add or edit requests with a duplicate roll number return HTTP 400.

To check CI locally on Windows, run `mvnw.cmd clean verify` followed by `mvnw.cmd checkstyle:check`. To see GitHub Actions output, push the project to your GitHub repository, open its **Actions** tab, and select the **Student Management CI/CD** run. The workflow builds and tests the app, checks style, packages a JAR, builds the Docker image, and uploads the JAR and JaCoCo report. It does not deploy to a cloud host yet.

## User stories

| ID | User story | Points | Priority |
|---|---|---:|---|
| US1 | As a teacher, I want to add a student so that the class list is up to date. | 3 | High |
| US2 | As a teacher, I want to view all students so that I can check the class list. | 2 | High |
| US3 | As a teacher, I want to search by name so that I can find a student quickly. | 3 | Medium |
| US4 | As a teacher, I want to edit or delete a student so that the list stays accurate. | 2 | Medium |
| US5 | As a developer, I want CI/CD to run automatically on every push so that changes are checked and packaged consistently. | 5 | High |

## Sprint planning

| Sprint | Timing | Goal | Stories |
|---|---|---|---|
| Sprint 1 | Week 1 | Build the student directory: add, view, search, edit, delete, and test student records. | US1, US2, US3, US4 |
| Sprint 2 | Week 2 | Automate build, tests, quality checks, coverage, and Docker packaging. | US5 |

## Definition of Done

- Code is merged to `main`.
- Unit and controller tests pass.
- Checkstyle runs successfully.
- JaCoCo coverage report is generated.
- Docker image builds.
- The GitHub Actions pipeline is green.

## Acceptance criteria: US1, add a student

**Scenario: Add a student with a new roll number**

- Given the student list does not contain roll number `R100`,
- When a teacher submits the name `Asha Patel` and roll number `R100`,
- Then the system creates the student and returns HTTP 201 with the student details.

**Scenario: Reject a duplicate roll number**

- Given the student list already contains roll number `R100`,
- When a teacher submits another student with roll number `R100`,
- Then the system returns HTTP 400 and does not add the duplicate.

## Agile metrics (example)

These sample figures show how a team could report progress; update them with actual sprint results.

| Metric | Sprint 1 | Sprint 2 |
|---|---:|---:|
| Planned points | 10 | 5 |
| Completed points | 10 | 5 |
| Velocity (completed points) | 10 | 5 |
| Defect density (bugs per 100 lines of code) | 2.0 | 1.0 |
| Lead time (request to delivery) | 5 days | 3 days |
| Cycle time (work started to delivery) | 3 days | 2 days |

## Environments and Agile dashboard

- **Dev:** run the app locally with `./mvnw spring-boot:run`.
- **Test:** GitHub Actions builds and tests each pull request and push to `main`.
- **Production:** run the packaged app in Docker or deploy the image to a cloud host.

Use a GitHub Projects board as the Agile dashboard. Move work through **To Do**, **In Progress**, and **Done** to make progress visible to the team.

The in-app **Agile Plan** page presents the five stories, sprint assignments, Definition of Done, acceptance criteria, and example metrics. The GitHub Projects board is a suggested external team board; it is not connected to this application.
