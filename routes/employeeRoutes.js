const router = require('express').Router()
const { protect } = require('../middleware/authMiddleware')
const {
  addEmployee,
  getAllEmployees,
  searchEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController')

router.use(protect)

router.post('/', addEmployee)
router.get('/', getAllEmployees)
router.get('/search', searchEmployees)
router.get('/:id', getEmployeeById)
router.put('/:id', updateEmployee)
router.delete('/:id', deleteEmployee)

module.exports = router
