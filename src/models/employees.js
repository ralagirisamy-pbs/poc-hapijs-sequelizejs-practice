const { Model } = require("sequelize");

class Employee extends Model {
  static init(sequelize, DataTypes) {
    const employee = sequelize.define(
      "Employee",
      {
        id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
          field: "id",
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          field: "name",
        },
        position: {
          type: DataTypes.STRING,
          allowNull: false,
          field: "position",
        },
        team: {
          type: DataTypes.STRING,
          allowNull: false,
          field: "team",
        },
        experience: {
          type: DataTypes.FLOAT,
          allowNull: false,
          field: "experience",
        },
      },
      {
        tableName: "employee",
        schema: process.env.DB_SCHEMA,
        timestamps: true,
        createdAt: "createdatetime",
        updatedAt: "updatedatetime",
        indexes: [
          {
            name: "employee_pk",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
    employee.associate = (models) => {
      models.Employee.hasMany(models.Task, {
        as: "tasks",
        foreignKey: "assigned_employee_id",
      });
    };
    return employee;
  }
}

module.exports = (sequelize, DataTypes) => Employee.init(sequelize, DataTypes);
