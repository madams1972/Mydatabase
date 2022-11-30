USE employee_db;


INSERT INTO department (id, name) 
VALUES   (1, "Program Team"),
        (2, "Operations"),
        (3, "Corprate Partners"),
        (4, "Development"),
        (5, "Human Resources");
  

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Program Manager", 90000, 1),
        (2, "Operations Manager", 90000, 2),
        (3, "Corprate Partners Manager", 90000, 3),
        (4, "Development Manager", 100000, 4),
        (5, "Program Specialist", 60000, 5,
        (6, "Office Specialist", 50000, 1),
        (7, "HR Specialist", 50000, 2);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES  (1,"Kylie", "Jenner",  2, 2),
        (2, "Malissa", "Adams", 4, 1),
        (3, "James", "Nagbe", 5, 2),
        (4, "Rebekah", "Kallhoff", 3, 1),
        (5, "Missi", "Arens", 1, 1 );