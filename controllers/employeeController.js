const Employee = require('../models/Employee');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

// #3: GET /api/v1/emp/employees (Status: 200)
// Get employees owned by the authenticated user
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ user: req.user.id });
    return res.status(200).json(employees);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || 'Error retrieving employees'
    });
  }
};

// #4: POST /api/v1/emp/employees (Status: 201)
// Create an employee for the authenticated user
exports.createEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      first_name,
      last_name,
      email,
      position,
      salary,
      date_of_joining,
      department
    } = req.body;

    const newEmployee = await Employee.create({
      first_name,
      last_name,
      email,
      position,
      salary,
      date_of_joining,
      department,
      user: req.user.id // Always assign ownership to the authenticated user
    });

    return res.status(201).json({
      message: 'Employee created successfully.',
      employee_id: newEmployee._id,
      employee: newEmployee
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || 'Error creating employee'
    });
  }
};

// #5: GET /api/v1/emp/employees/:eid (Status: 200)
// Get an employee owned by the authenticated user
exports.getEmployeeById = async (req, res) => {
  try {
    const { eid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eid)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid employee ID format'
      });
    }

    // Must match BOTH employee ID and the logged-in user's ID
    const employee = await Employee.findOne({
      _id: eid,
      user: req.user.id
    });

    if (!employee) {
      return res.status(404).json({
        status: false,
        message: 'Employee not found or you do not have permission to view it'
      });
    }

    return res.status(200).json(employee);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || 'Error retrieving employee'
    });
  }
};

// #6: PUT /api/v1/emp/employees/:eid (Status: 200)
// Update an employee owned by the authenticated user
exports.updateEmployee = async (req, res) => {
  try {
    const { eid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eid)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid employee ID format'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Prevent user from changing the employee's owner
    const updateData = { ...req.body };
    delete updateData.user;
    delete updateData._id;

    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: eid, user: req.user.id }, // Enforce ownership
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        status: false,
        message: 'Employee not found or you do not have permission to update it'
      });
    }

    return res.status(200).json({
      message: 'Employee details updated successfully.',
      employee: updatedEmployee
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || 'Error updating employee'
    });
  }
};

// #7: DELETE /api/v1/emp/employees?eid=xxx (Status: 204)
// Delete an employee owned by the authenticated user
exports.deleteEmployee = async (req, res) => {
  try {
    const { eid } = req.query; // Read from query string (?eid=xxx)

    if (!eid || !mongoose.Types.ObjectId.isValid(eid)) {
      return res.status(400).json({
        status: false,
        message: 'Valid employee ID query parameter (?eid=xxx) is required'
      });
    }

    const deletedEmployee = await Employee.findOneAndDelete({
      _id: eid,
      user: req.user.id // Enforce ownership
    });

    if (!deletedEmployee) {
      return res.status(404).json({
        status: false,
        message: 'Employee not found or you do not have permission to delete it'
      });
    }

    // Status 204 (No Content) as required by the specification
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || 'Error deleting employee'
    });
  }
};