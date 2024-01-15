const { Model } = require("sequelize");

class Task extends Model {
  static init(sequelize, DataTypes) {
    return sequelize.define(
      "Task",
      {
        id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
          field: "id",
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
          field: "title",
        },
        description: {
          type: DataTypes.STRING(1234),
          allowNull: true,
          field: "description",
        },
        priority: {
          type: DataTypes.ENUM("Low", "Medium", "High"),
          field: "priority",
          default: "Low",
        },
        labels: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          field: "labels",
          default: [],
        },
        assigned_employee_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
          field: "assigned_employee_id",
          references: {
            model: "employee",
            key: "id",
          },
        },
      },
      {
        tableName: "task",
        schema: process.env.DB_SCHEMA,
        timestamps: true,
        createdAt: "createdatetime",
        updatedAt: "updatedatetime",
        indexes: [
          {
            name: "task_pk",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
}

module.exports = (sequelize, DataTypes) => Task.init(sequelize, DataTypes);
