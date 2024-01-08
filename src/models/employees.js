const { Model } = require("sequelize");

class Employee extends Model {
  static init(sequelize, DataTypes) {
    return sequelize.define(
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
        tasks: {
          type: DataTypes.ARRAY(DataTypes.BIGINT),
          defaultValue: [],
          field: "tasks",
        },
      },
      {
        tableName: "employee",
        schema: process.env.DB_SCHEMA,
        timestamps: true,
        createdAt: "createdatetime",
        updatedAt: "updatedatetime",
      },
    );
  }
}

module.exports = (sequelize, DataTypes) => Employee.init(sequelize, DataTypes);
