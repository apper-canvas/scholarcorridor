import gradesData from "@/services/mockData/grades.json"

let grades = [...gradesData]

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const gradeService = {
  async getAll() {
    await delay()
    return [...grades]
  },

  async getById(id) {
    await delay()
    return grades.find(grade => grade.Id === parseInt(id))
  },

  async create(gradeData) {
    await delay()
    const newId = Math.max(...grades.map(g => g.Id), 0) + 1
    const newGrade = {
      Id: newId,
      ...gradeData,
      date: new Date(gradeData.date).toISOString()
    }
    grades.push(newGrade)
    return newGrade
  },

  async update(id, gradeData) {
    await delay()
    const index = grades.findIndex(grade => grade.Id === parseInt(id))
    if (index !== -1) {
      grades[index] = { ...grades[index], ...gradeData }
      return grades[index]
    }
    return null
  },

  async delete(id) {
    await delay()
    const index = grades.findIndex(grade => grade.Id === parseInt(id))
    if (index !== -1) {
      const deletedGrade = grades.splice(index, 1)[0]
      return deletedGrade
    }
    return null
  },

  async getByStudentId(studentId) {
    await delay()
    return grades.filter(grade => grade.studentId === studentId.toString())
  },

  async getByClassId(classId) {
    await delay()
    return grades.filter(grade => grade.classId === classId.toString())
  },

  async getStudentAverage(studentId, classId = null) {
    await delay()
    let studentGrades = grades.filter(grade => grade.studentId === studentId.toString())
    
    if (classId) {
      studentGrades = studentGrades.filter(grade => grade.classId === classId.toString())
    }

    if (studentGrades.length === 0) return 0

    const totalPoints = studentGrades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0)
    return Math.round((totalPoints / studentGrades.length) * 100) / 100
  }
}