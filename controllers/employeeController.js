const Employee = require('../models/Employee')

const addEmployee = async (req, res, next) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body
    const exists = await Employee.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Employee with this email already exists.' })

    const employee = await Employee.create({ name, email, department, skills, performanceScore, experience })
    res.status(201).json(employee)
  } catch (err) { next(err) }
}

const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 })
    res.json(employees)
  } catch (err) { next(err) }
}

const searchEmployees = async (req, res, next) => {
  try {
    const { department, name } = req.query
    const filter = {}
    if (department) filter.department = department
    if (name) filter.name = { $regex: name, $options: 'i' }

    const employees = await Employee.find(filter).sort({ performanceScore: -1 })
    res.json(employees)
  } catch (err) { next(err) }
}

const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id)
    if (!employee) return res.status(404).json({ message: 'Employee not found.' })
    res.json(employee)
  } catch (err) { next(err) }
}

const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!employee) return res.status(404).json({ message: 'Employee not found.' })
    res.json(employee)
  } catch (err) { next(err) }
}

const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id)
    if (!employee) return res.status(404).json({ message: 'Employee not found.' })
    res.json({ message: 'Employee deleted successfully.' })
  } catch (err) { next(err) }
}

module.exports = { addEmployee, getAllEmployees, searchEmployees, getEmployeeById, updateEmployee, deleteEmployee }
