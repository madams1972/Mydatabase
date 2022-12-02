USE employees_db;


INSERT INTO department (name) 
VALUES   ("Program Team"),
        ("Operations"),
        ("Corprate Partners"),
        ("Development"),
        ("Human Resources");
  

INSERT INTO role (title, salary, department_id)
VALUES ("Program Manager", 90000, 1),
        ("Operations Manager", 90000, 2),
        ("Corprate Partners Manager", 90000, 3),
        ("Development Manager", 100000, 4),
        ("Program Specialist", 60000, 5),
        ("Office Specialist", 50000, 1),
        ("HR Specialist", 50000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Kylie", "Jenner",  2, null),
        ("Missi", "Arens", 1, null),
        ("Malissa", "Adams", 4, 2),
        ("James", "Nagbe", 5, null),
        ("Rebekah", "Kallhoff", 3, null);