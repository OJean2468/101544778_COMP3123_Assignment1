const express = require('express');
const auth = require('../middleware/auth');
const employeeController = require('../controllers/employeeController');
const { validateCreateEmployee, validateUpdateEmployee } = require('../validators/validator');

const router = express.Router();

// Protect all routes in this router with JWT authentication
router.use(auth);

// #3: GET /api/v1/emp/employees
router.get('/employees', employeeController.getAllEmployees);

// #4: POST /api/v1/emp/employees
router.post('/employees', validateCreateEmployee, employeeController.createEmployee);

// #5: GET /api/v1/emp/employees/:eid
router.get('/employees/:eid', employeeController.getEmployeeById);

// #6: PUT /api/v1/emp/employees/:eid
router.put('/employees/:eid', validateUpdateEmployee, employeeController.updateEmployee);

// #7: DELETE /api/v1/emp/employees?eid=xxx
router.delete('/employees', employeeController.deleteEmployee);

module.exports = router;