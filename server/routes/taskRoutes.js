const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  taskCreateSchema,
  taskUpdateSchema,
} = require('../validators/taskValidator');

// Protect all task routes
router.use(protect);

router.route('/')
  .get(getTasks)
  .post(validate(taskCreateSchema), createTask);

router.route('/:id')
  .get(getTaskById)
  .put(validate(taskUpdateSchema), updateTask)
  .delete(deleteTask);

module.exports = router;
