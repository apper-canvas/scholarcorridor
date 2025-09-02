import { toast } from 'react-toastify'

const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

export const gradeService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "StudentId_c"}},
          {"field": {"Name": "ClassId_c"}},
          {"field": {"Name": "AssignmentName_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Score_c"}},
          {"field": {"Name": "MaxScore_c"}},
          {"field": {"Name": "Date_c"}}
        ],
        orderBy: [{"fieldName": "Date_c", "sorttype": "DESC"}]
      }
      
      const response = await apperClient.fetchRecords('grade_c', params)
      
      if (!response?.data?.length) {
        return []
      }
      
      return response.data.map(grade => ({
        Id: grade.Id,
        studentId: grade.StudentId_c?.toString() || '',
        classId: grade.ClassId_c?.toString() || '',
        assignmentName: grade.AssignmentName_c || '',
        category: grade.Category_c || '',
        score: grade.Score_c || 0,
        maxScore: grade.MaxScore_c || 100,
        date: grade.Date_c || null
      }))
    } catch (error) {
      console.error("Error fetching grades:", error?.response?.data?.message || error)
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
          {"field": {"Name": "AssignmentName_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Score_c"}},
          {"field": {"Name": "MaxScore_c"}},
          {"field": {"Name": "Date_c"}}
        ]
      }
      
      const response = await apperClient.getRecordById('grade_c', parseInt(id), params)
      
      if (!response?.data) {
        return null
      }

      return {
        Id: response.data.Id,
        studentId: response.data.StudentId_c?.toString() || '',
        classId: response.data.ClassId_c?.toString() || '',
        assignmentName: response.data.AssignmentName_c || '',
        category: response.data.Category_c || '',
        score: response.data.Score_c || 0,
        maxScore: response.data.MaxScore_c || 100,
        date: response.data.Date_c || null
      }
    } catch (error) {
      console.error(`Error fetching grade ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(gradeData) {
    try {
      const params = {
        records: [{
          StudentId_c: parseInt(gradeData.studentId) || null,
          ClassId_c: parseInt(gradeData.classId) || null,
          AssignmentName_c: gradeData.assignmentName || '',
          Category_c: gradeData.category || '',
          Score_c: gradeData.score || 0,
          MaxScore_c: gradeData.maxScore || 100,
          Date_c: gradeData.date || new Date().toISOString()
        }]
      }
      
      const response = await apperClient.createRecord('grade_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create grade:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return null
        }
        
        const createdGrade = successful[0]?.data
        if (createdGrade) {
          return {
            Id: createdGrade.Id,
            studentId: createdGrade.StudentId_c?.toString() || '',
            classId: createdGrade.ClassId_c?.toString() || '',
            assignmentName: createdGrade.AssignmentName_c || '',
            category: createdGrade.Category_c || '',
            score: createdGrade.Score_c || 0,
            maxScore: createdGrade.MaxScore_c || 100,
            date: createdGrade.Date_c || null
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error creating grade:", error?.response?.data?.message || error)
      return null
    }
  },

  async update(id, gradeData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          StudentId_c: parseInt(gradeData.studentId) || null,
          ClassId_c: parseInt(gradeData.classId) || null,
          AssignmentName_c: gradeData.assignmentName || '',
          Category_c: gradeData.category || '',
          Score_c: gradeData.score || 0,
          MaxScore_c: gradeData.maxScore || 100,
          Date_c: gradeData.date || null
        }]
      }
      
      const response = await apperClient.updateRecord('grade_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update grade:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return null
        }
        
        const updatedGrade = successful[0]?.data
        if (updatedGrade) {
          return {
            Id: updatedGrade.Id,
            studentId: updatedGrade.StudentId_c?.toString() || '',
            classId: updatedGrade.ClassId_c?.toString() || '',
            assignmentName: updatedGrade.AssignmentName_c || '',
            category: updatedGrade.Category_c || '',
            score: updatedGrade.Score_c || 0,
            maxScore: updatedGrade.MaxScore_c || 100,
            date: updatedGrade.Date_c || null
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error updating grade:", error?.response?.data?.message || error)
      return null
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('grade_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete grade:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }
        
        return successful.length > 0
      }
      return false
    } catch (error) {
      console.error("Error deleting grade:", error?.response?.data?.message || error)
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
          {"field": {"Name": "AssignmentName_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Score_c"}},
          {"field": {"Name": "MaxScore_c"}},
          {"field": {"Name": "Date_c"}}
        ],
        where: [{"FieldName": "StudentId_c", "Operator": "EqualTo", "Values": [parseInt(studentId)]}],
        orderBy: [{"fieldName": "Date_c", "sorttype": "DESC"}]
      }
      
      const response = await apperClient.fetchRecords('grade_c', params)
      
      if (!response?.data?.length) {
        return []
      }
      
      return response.data.map(grade => ({
        Id: grade.Id,
        studentId: grade.StudentId_c?.toString() || '',
        classId: grade.ClassId_c?.toString() || '',
        assignmentName: grade.AssignmentName_c || '',
        category: grade.Category_c || '',
        score: grade.Score_c || 0,
        maxScore: grade.MaxScore_c || 100,
        date: grade.Date_c || null
      }))
    } catch (error) {
      console.error("Error fetching grades by student:", error?.response?.data?.message || error)
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
          {"field": {"Name": "AssignmentName_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Score_c"}},
          {"field": {"Name": "MaxScore_c"}},
          {"field": {"Name": "Date_c"}}
        ],
        where: [{"FieldName": "ClassId_c", "Operator": "EqualTo", "Values": [parseInt(classId)]}],
        orderBy: [{"fieldName": "Date_c", "sorttype": "DESC"}]
      }
      
      const response = await apperClient.fetchRecords('grade_c', params)
      
      if (!response?.data?.length) {
        return []
      }
      
      return response.data.map(grade => ({
        Id: grade.Id,
        studentId: grade.StudentId_c?.toString() || '',
        classId: grade.ClassId_c?.toString() || '',
        assignmentName: grade.AssignmentName_c || '',
        category: grade.Category_c || '',
        score: grade.Score_c || 0,
        maxScore: grade.MaxScore_c || 100,
        date: grade.Date_c || null
      }))
    } catch (error) {
      console.error("Error fetching grades by class:", error?.response?.data?.message || error)
      return []
    }
  },

  async getStudentAverage(studentId, classId = null) {
    try {
      let grades = await this.getByStudentId(studentId)
      
      if (classId) {
        grades = grades.filter(grade => grade.classId === classId.toString())
      }

      if (grades.length === 0) return 0

      const totalPoints = grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0)
      return Math.round((totalPoints / grades.length) * 100) / 100
    } catch (error) {
      console.error("Error calculating student average:", error?.response?.data?.message || error)
      return 0
    }
  }
}