import { toast } from 'react-toastify'

const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

export const attendanceService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "StudentId_c"}},
          {"field": {"Name": "ClassId_c"}},
          {"field": {"Name": "Date_c"}},
          {"field": {"Name": "Status_c"}}
        ],
        orderBy: [{"fieldName": "Date_c", "sorttype": "DESC"}]
      }
      
      const response = await apperClient.fetchRecords('attendance_c', params)
      
      if (!response?.data?.length) {
        return []
      }
      
      return response.data.map(record => ({
        Id: record.Id,
        studentId: record.StudentId_c?.toString() || '',
        classId: record.ClassId_c?.toString() || '',
        date: record.Date_c || null,
        status: record.Status_c || ''
      }))
    } catch (error) {
      console.error("Error fetching attendance:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "StudentId_c"}},
          {"field": {"Name": "ClassId_c"}},
          {"field": {"Name": "Date_c"}},
          {"field": {"Name": "Status_c"}}
        ]
      }
      
      const response = await apperClient.getRecordById('attendance_c', parseInt(id), params)
      
      if (!response?.data) {
        return null
      }

      return {
        Id: response.data.Id,
        studentId: response.data.StudentId_c?.toString() || '',
        classId: response.data.ClassId_c?.toString() || '',
        date: response.data.Date_c || null,
        status: response.data.Status_c || ''
      }
    } catch (error) {
      console.error(`Error fetching attendance record ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(attendanceData) {
    try {
      const params = {
        records: [{
          StudentId_c: parseInt(attendanceData.studentId) || null,
          ClassId_c: parseInt(attendanceData.classId) || null,
          Date_c: attendanceData.date ? new Date(attendanceData.date).toISOString() : new Date().toISOString(),
          Status_c: attendanceData.status || ''
        }]
      }
      
      const response = await apperClient.createRecord('attendance_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create attendance:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return null
        }
        
        const createdRecord = successful[0]?.data
        if (createdRecord) {
          return {
            Id: createdRecord.Id,
            studentId: createdRecord.StudentId_c?.toString() || '',
            classId: createdRecord.ClassId_c?.toString() || '',
            date: createdRecord.Date_c || null,
            status: createdRecord.Status_c || ''
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error creating attendance:", error?.response?.data?.message || error)
      return null
    }
  },

  async update(id, attendanceData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          StudentId_c: parseInt(attendanceData.studentId) || null,
          ClassId_c: parseInt(attendanceData.classId) || null,
          Date_c: attendanceData.date ? new Date(attendanceData.date).toISOString() : null,
          Status_c: attendanceData.status || ''
        }]
      }
      
      const response = await apperClient.updateRecord('attendance_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update attendance:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return null
        }
        
        const updatedRecord = successful[0]?.data
        if (updatedRecord) {
          return {
            Id: updatedRecord.Id,
            studentId: updatedRecord.StudentId_c?.toString() || '',
            classId: updatedRecord.ClassId_c?.toString() || '',
            date: updatedRecord.Date_c || null,
            status: updatedRecord.Status_c || ''
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error updating attendance:", error?.response?.data?.message || error)
      return null
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('attendance_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete attendance:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }
        
        return successful.length > 0
      }
      return false
    } catch (error) {
      console.error("Error deleting attendance:", error?.response?.data?.message || error)
      return false
    }
  },

  async getByStudentId(studentId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "StudentId_c"}},
          {"field": {"Name": "ClassId_c"}},
          {"field": {"Name": "Date_c"}},
          {"field": {"Name": "Status_c"}}
        ],
        where: [{"FieldName": "StudentId_c", "Operator": "EqualTo", "Values": [parseInt(studentId)]}],
        orderBy: [{"fieldName": "Date_c", "sorttype": "DESC"}]
      }
      
      const response = await apperClient.fetchRecords('attendance_c', params)
      
      if (!response?.data?.length) {
        return []
      }
      
      return response.data.map(record => ({
        Id: record.Id,
        studentId: record.StudentId_c?.toString() || '',
        classId: record.ClassId_c?.toString() || '',
        date: record.Date_c || null,
        status: record.Status_c || ''
      }))
    } catch (error) {
      console.error("Error fetching attendance by student:", error?.response?.data?.message || error)
      return []
    }
  },

  async getByClassId(classId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "StudentId_c"}},
          {"field": {"Name": "ClassId_c"}},
          {"field": {"Name": "Date_c"}},
          {"field": {"Name": "Status_c"}}
        ],
        where: [{"FieldName": "ClassId_c", "Operator": "EqualTo", "Values": [parseInt(classId)]}],
        orderBy: [{"fieldName": "Date_c", "sorttype": "DESC"}]
      }
      
      const response = await apperClient.fetchRecords('attendance_c', params)
      
      if (!response?.data?.length) {
        return []
      }
      
      return response.data.map(record => ({
        Id: record.Id,
        studentId: record.StudentId_c?.toString() || '',
        classId: record.ClassId_c?.toString() || '',
        date: record.Date_c || null,
        status: record.Status_c || ''
      }))
    } catch (error) {
      console.error("Error fetching attendance by class:", error?.response?.data?.message || error)
      return []
    }
  },

  async getByDateRange(startDate, endDate) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "StudentId_c"}},
          {"field": {"Name": "ClassId_c"}},
          {"field": {"Name": "Date_c"}},
          {"field": {"Name": "Status_c"}}
        ],
        where: [
          {"FieldName": "Date_c", "Operator": "GreaterThanOrEqualTo", "Values": [new Date(startDate).toISOString()]},
          {"FieldName": "Date_c", "Operator": "LessThanOrEqualTo", "Values": [new Date(endDate).toISOString()]}
        ],
        orderBy: [{"fieldName": "Date_c", "sorttype": "DESC"}]
      }
      
      const response = await apperClient.fetchRecords('attendance_c', params)
      
      if (!response?.data?.length) {
        return []
      }
      
      return response.data.map(record => ({
        Id: record.Id,
        studentId: record.StudentId_c?.toString() || '',
        classId: record.ClassId_c?.toString() || '',
        date: record.Date_c || null,
        status: record.Status_c || ''
      }))
    } catch (error) {
      console.error("Error fetching attendance by date range:", error?.response?.data?.message || error)
      return []
    }
  },

  async markAttendance(studentId, classId, date, status) {
    try {
      // First, check if a record exists for this student, class, and date
      const params = {
        fields: [{"field": {"Name": "Id"}}],
        where: [
          {"FieldName": "StudentId_c", "Operator": "EqualTo", "Values": [parseInt(studentId)]},
          {"FieldName": "ClassId_c", "Operator": "EqualTo", "Values": [parseInt(classId)]},
          {"FieldName": "Date_c", "Operator": "EqualTo", "Values": [new Date(date).toISOString().split('T')[0]]}
        ]
      }
      
      const existingResponse = await apperClient.fetchRecords('attendance_c', params)
      
      if (existingResponse?.data?.length > 0) {
        // Update existing record
        return await this.update(existingResponse.data[0].Id, { 
          studentId: studentId.toString(), 
          classId: classId.toString(), 
          date, 
          status 
        })
      } else {
        // Create new record
        return await this.create({ 
          studentId: studentId.toString(), 
          classId: classId.toString(), 
          date, 
          status 
        })
      }
    } catch (error) {
      console.error("Error marking attendance:", error?.response?.data?.message || error)
      return null
    }
  },

  async getAttendanceRate(studentId, classId = null) {
    try {
      let studentAttendance = await this.getByStudentId(studentId)
      
      if (classId) {
        studentAttendance = studentAttendance.filter(record => record.classId === classId.toString())
      }

      if (studentAttendance.length === 0) return 0

      const presentCount = studentAttendance.filter(record => 
        record.status === "present" || record.status === "excused"
      ).length

      return Math.round((presentCount / studentAttendance.length) * 100)
    } catch (error) {
      console.error("Error calculating attendance rate:", error?.response?.data?.message || error)
      return 0
    }
  }
}