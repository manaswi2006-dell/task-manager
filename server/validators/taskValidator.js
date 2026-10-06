const Joi = require('joi');

const taskCreateSchema = Joi.object({
  title: Joi.string().trim().min(1).max(120).required().messages({
    'string.base': 'Title must be a string',
    'string.empty': 'Task title is required',
    'string.max': 'Title cannot exceed 120 characters',
    'any.required': 'Task title is required',
  }),
  description: Joi.string().allow('').trim().max(1000).messages({
    'string.base': 'Description must be a string',
    'string.max': 'Description cannot exceed 1000 characters',
  }),
  status: Joi.string()
    .valid('Pending', 'In Progress', 'Completed')
    .default('Pending')
    .messages({
      'any.only': 'Status must be one of Pending, In Progress, Completed',
    }),
  priority: Joi.string()
    .valid('Low', 'Medium', 'High')
    .default('Medium')
    .messages({
      'any.only': 'Priority must be one of Low, Medium, High',
    }),
  dueDate: Joi.date().iso().allow(null, '').messages({
    'date.base': 'Due date must be a valid date',
    'date.format': 'Due date must be an ISO format date',
  }),
  assignee: Joi.string().allow('').trim().max(50).messages({
    'string.base': 'Assignee must be a string',
    'string.max': 'Assignee cannot exceed 50 characters',
  }),
});

const taskUpdateSchema = Joi.object({
  title: Joi.string().trim().min(1).max(120).messages({
    'string.base': 'Title must be a string',
    'string.empty': 'Task title cannot be empty',
    'string.max': 'Title cannot exceed 120 characters',
  }),
  description: Joi.string().allow('').trim().max(1000).messages({
    'string.base': 'Description must be a string',
    'string.max': 'Description cannot exceed 1000 characters',
  }),
  status: Joi.string()
    .valid('Pending', 'In Progress', 'Completed')
    .messages({
      'any.only': 'Status must be one of Pending, In Progress, Completed',
    }),
  priority: Joi.string()
    .valid('Low', 'Medium', 'High')
    .messages({
      'any.only': 'Priority must be one of Low, Medium, High',
    }),
  dueDate: Joi.date().iso().allow(null, '').messages({
    'date.base': 'Due date must be a valid date',
  }),
  assignee: Joi.string().allow('').trim().max(50).messages({
    'string.base': 'Assignee must be a string',
    'string.max': 'Assignee cannot exceed 50 characters',
  }),
}).min(1);

module.exports = {
  taskCreateSchema,
  taskUpdateSchema,
};
