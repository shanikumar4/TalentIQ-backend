const Employee = require('../models/Employee')
const { getAIRecommendation } = require('../utils/openrouter')

const recommend = async (req, res, next) => {
  try {
    const { employeeId, employeeIds } = req.body

    if (employeeId) {
      const emp = await Employee.findById(employeeId)
      if (!emp) return res.status(404).json({ message: 'Employee not found.' })

      let promptType = ''
      if (emp.performanceScore >= 80) {
        promptType = 'This employee has a high performance score. Evaluate if they deserve a promotion and explain why.'
      } else if (emp.performanceScore < 60) {
        promptType = 'This employee has a low performance score. Provide constructive improvement feedback and a development plan.'
      } else {
        promptType = 'This employee has an average performance score. Suggest how they can move to the next level.'
      }

      const prompt = `
Employee: ${emp.name}
Department: ${emp.department}
Skills: ${emp.skills.join(', ')}
Performance Score: ${emp.performanceScore}/100
Years of Experience: ${emp.experience}

${promptType}

Based on this data, provide:
1. Should this employee be promoted? Why or why not?
2. What specific training would improve their performance?
3. Any skill gaps to address for their department?
4. One sentence of overall feedback.
      `.trim()

      const recommendation = await getAIRecommendation(prompt)
      emp.aiRecommendation = recommendation
      emp.lastRecommendedAt = new Date()
      await emp.save()

      return res.json({ employeeId, recommendation })
    }

    if (employeeIds && Array.isArray(employeeIds)) {
      const employees = await Employee.find({ _id: { $in: employeeIds } })
      if (!employees.length) return res.status(404).json({ message: 'No employees found.' })

      const employeeList = employees.map(e =>
        `${e.name} | Dept: ${e.department} | Score: ${e.performanceScore}/100 | Exp: ${e.experience}yr | Skills: ${e.skills.join(', ')}`
      ).join('\n')

      const prompt = `
Here are multiple employees. Rank them from highest to lowest potential for promotion and give a brief one-line reason for each:

${employeeList}

Return a numbered list with: Rank. Name — Reason
      `.trim()

      const ranking = await getAIRecommendation(prompt)
      return res.json({ ranking })
    }

    return res.status(400).json({ message: 'Provide either employeeId or employeeIds array.' })
  } catch (err) { next(err) }
}

module.exports = { recommend }
