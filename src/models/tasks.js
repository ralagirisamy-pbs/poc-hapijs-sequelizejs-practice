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
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          field: "name",
        },
        description: {
          type: DataTypes.STRING(1234),
          allowNull: true,
          field: "description",
        },
        assignee: {
          type: DataTypes.ARRAY(DataTypes.BIGINT),
          defaultValue: [],
          field: "assignee",
        },
      },
      {
        tableName: "task",
        schema: process.env.DB_SCHEMA,
        timestamps: true,
        createdAt: "createdatetime",
        updatedAt: "updatedatetime",
      },
    );
  }
}

module.exports = (sequelize, DataTypes) => Task.init(sequelize, DataTypes);
