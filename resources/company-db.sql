-- DROP SCHEMA company;

CREATE SCHEMA IF NOT EXISTS company;

-- company.employee definition

-- DROP TABLE company.employee;

CREATE TABLE IF NOT EXISTS company.employee (
	id bigserial NOT NULL,
	createdatetime timestamp NULL DEFAULT now(),
	updatedatetime timestamp NULL DEFAULT now(),
	"name" text NOT NULL,
	"position" text NOT NULL,
	team text NOT NULL,
	experience float4 NOT NULL,
    CONSTRAINT employee_pk PRIMARY KEY (id)
);

-- DROP SEQUENCE company.employee_id_seq;

CREATE SEQUENCE IF NOT EXISTS company.employee_id_seq 
    INCREMENT BY 1 
	START 1 
    OWNED BY employee.id;

-- company.employee definition ends 

------------------------------------

-- company.task definition

-- Drop table

-- DROP TABLE company.task;
CREATE TYPE priority AS ENUM ('Low', 'Medium', 'High');

CREATE TABLE IF NOT EXISTS company.task (
	id bigserial NOT NULL,
	createdatetime timestamp NULL DEFAULT now(),
	updatedatetime timestamp NULL DEFAULT now(),
	title text NOT NULL,
	description text NULL,
	priority priority,
	labels text[] DEFAULT '{}',
	assigned_employee_id int8 NULL,
    CONSTRAINT task_pk PRIMARY KEY (id)
);

ALTER TABLE company.task 
    ADD CONSTRAINT task_employee_fk FOREIGN KEY (assigned_employee_id) REFERENCES company.employee(id);

-- DROP SEQUENCE company.task_id_seq;

CREATE SEQUENCE IF NOT EXISTS company.task_id_seq 
    INCREMENT BY 1 
	START 1 
    OWNED BY task.id;

-- company.task definition ends