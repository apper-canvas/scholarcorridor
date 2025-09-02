import attendanceData from "@/services/mockData/attendance.json"

let attendance = [...attendanceData]

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const attendanceService = {
  async getAll() {
    await delay()
    return [...attendance]
  },

  async getById(id) {
    await delay()
    return attendance.find(record => record.Id === parseInt(id))
  },

  async create(attendanceData) {
    await delay()
    const newId = Math.max(...attendance.map(a => a.Id), 0) + 1
    const newRecord = {
      Id: newId,
      ...attendanceData,
      date: new Date(attendanceData.date).toISOString()
    }
    attendance.push(newRecord)
    return newRecord
  },

  async update(id, attendanceData) {
    await delay()
    const index = attendance.findIndex(record => record.Id === parseInt(id))
    if (index !== -1) {
      attendance[index] = { ...attendance[index], ...attendanceData }
      return attendance[index]
    }
    return null
  },

  async delete(id) {
    await delay()
    const index = attendance.findIndex(record => record.Id === parseInt(id))
    if (index !== -1) {
      const deletedRecord = attendance.splice(index, 1)[0]
      return deletedRecord
    }
    return null
  },

  async getByStudentId(studentId) {
    await delay()
    return attendance.filter(record => record.studentId === studentId.toString())
  },

  async getByClassId(classId) {
    await delay()
    return attendance.filter(record => record.classId === classId.toString())
  },

  async getByDateRange(startDate, endDate) {
    await delay()
    return attendance.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate >= new Date(startDate) && recordDate <= new Date(endDate)
    })
  },

  async markAttendance(studentId, classId, date, status) {
    await delay()
    const existingRecord = attendance.find(record => 
      record.studentId === studentId.toString() &&
      record.classId === classId.toString() &&
      new Date(record.date).toDateString() === new Date(date).toDateString()
    )

    if (existingRecord) {
      return await this.update(existingRecord.Id, { status })
    } else {
      return await this.create({ studentId, classId, date, status })
    }
  },

  async getAttendanceRate(studentId, classId = null) {
    await delay()
    let studentAttendance = attendance.filter(record => record.studentId === studentId.toString())
    
    if (classId) {
      studentAttendance = studentAttendance.filter(record => record.classId === classId.toString())
    }

    if (studentAttendance.length === 0) return 0

    const presentCount = studentAttendance.filter(record => 
      record.status === "present" || record.status === "excused"
    ).length

    return Math.round((presentCount / studentAttendance.length) * 100)
  }
}