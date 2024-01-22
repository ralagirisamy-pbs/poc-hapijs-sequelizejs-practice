const TaskController = require("../controllers/task");

exports.plugin = {
  name: "taskRouter",
  /**
   * A handler to bind routes to the server.
   * @param {*} server A Hapi server instance
   */
  register: async (server) => {
    server.route([
      { method: "GET", path: "/tasks", handler: TaskController.getAllTasks },
      {
        method: "GET",
        path: "/task/{id}",
        handler: TaskController.getTaskById,
      },
      { method: "POST", path: "/task", handler: TaskController.createTask },
      { method: "PUT", path: "/task/{id}", handler: TaskController.updateTask },
      {
        method: "DELETE",
        path: "/task/{id}",
        handler: TaskController.deleteTask,
      },
    ]);
  },
};
