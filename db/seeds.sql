INSERT INTO department (name)
VALUES
('HR'),
('sales'),
('finance'),
('production');

INSERT INTO role (title, salary, department_id)
VALUES
('Recruiter', 45000, 1),
('Sales manager', 60000, 2),
('Accountant', 65000, 3),
('Production Designer', 55000, 4),
('VP of Sales', 70000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Camil', 'Grabowski', 2, NULL),
('Mason', 'Yancy', 1, NULL),
('Ryan', 'Smith', 3, NULL),
('Jorge', 'Verde', 4, NULL),
('Nick', 'Tuttle', 5, NULL);