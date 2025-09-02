import studentsData from "@/services/mockData/students.json"

let students = [...studentsData]

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const studentService = {
  async getAll() {
    await delay()
    return [...students]
  },

  async getById(id) {
    await delay()
    return students.find(student => student.Id === parseInt(id))
  },

  async create(studentData) {
    await delay()
    const newId = Math.max(...students.map(s => s.Id), 0) + 1
    const newStudent = {
      Id: newId,
      ...studentData
    }
    students.push(newStudent)
    return newStudent
  },

  async update(id, studentData) {
    await delay()
    const index = students.findIndex(student => student.Id === parseInt(id))
    if (index !== -1) {
      students[index] = { ...students[index], ...studentData }
      return students[index]
    }
    return null
  },

  async delete(id) {
    await delay()
    const index = students.findIndex(student => student.Id === parseInt(id))
    if (index !== -1) {
      const deletedStudent = students.splice(index, 1)[0]
      return deletedStudent
    }
    return null
  },

  async getByClassId(classId) {
    await delay()
    return students.filter(student => 
      student.classIds && student.classIds.includes(classId.toString())
    )
  }
}