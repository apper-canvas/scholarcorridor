import { toast } from "react-toastify";
import React from "react";

const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

export const studentService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "FirstName_c"}},
          {"field": {"Name": "LastName_c"}},
          {"field": {"Name": "Email_c"}},
          {"field": {"Name": "Phone_c"}},
          {"field": {"Name": "GradeLevel_c"}},
          {"field": {"Name": "DateOfBirth_c"}},
          {"field": {"Name": "EnrollmentDate_c"}},
          {"field": {"Name": "Status_c"}},
          {"field": {"Name": "ClassIds_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      }
      
      const response = await apperClient.fetchRecords('student_c', params)
      
      if (!response?.data?.length) {
        return []
      }
      
      return response.data.map(student => ({
        Id: student.Id,
        firstName: student.FirstName_c || '',
        lastName: student.LastName_c || '',
        email: student.Email_c || '',
        phone: student.Phone_c || '',
        gradeLevel: student.GradeLevel_c || '',
        dateOfBirth: student.DateOfBirth_c || null,
        enrollmentDate: student.EnrollmentDate_c || null,
        status: student.Status_c || 'active',
        classIds: student.ClassIds_c ? student.ClassIds_c.split(',') : []
      }))
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "FirstName_c"}},
          {"field": {"Name": "LastName_c"}},
          {"field": {"Name": "Email_c"}},
          {"field": {"Name": "Phone_c"}},
          {"field": {"Name": "GradeLevel_c"}},
          {"field": {"Name": "DateOfBirth_c"}},
          {"field": {"Name": "EnrollmentDate_c"}},
          {"field": {"Name": "Status_c"}},
          {"field": {"Name": "ClassIds_c"}}
        ]
      }
      
      const response = await apperClient.getRecordById('student_c', parseInt(id), params)
      
      if (!response?.data) {
        return null
      }

      return {
        Id: response.data.Id,
        firstName: response.data.FirstName_c || '',
        lastName: response.data.LastName_c || '',
        email: response.data.Email_c || '',
        phone: response.data.Phone_c || '',
        gradeLevel: response.data.GradeLevel_c || '',
        dateOfBirth: response.data.DateOfBirth_c || null,
        enrollmentDate: response.data.EnrollmentDate_c || null,
        status: response.data.Status_c || 'active',
        classIds: response.data.ClassIds_c ? response.data.ClassIds_c.split(',') : []
      }
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(studentData) {
    try {
      const params = {
        records: [{
          FirstName_c: studentData.firstName || '',
          LastName_c: studentData.lastName || '',
          Email_c: studentData.email || '',
          Phone_c: studentData.phone || '',
          GradeLevel_c: studentData.gradeLevel || '',
          DateOfBirth_c: studentData.dateOfBirth || null,
          EnrollmentDate_c: studentData.enrollmentDate || null,
          Status_c: studentData.status || 'active',
          ClassIds_c: studentData.classIds ? studentData.classIds.join(',') : ''
        }]
      }
      
      const response = await apperClient.createRecord('student_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create student:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return null
        }
        
        const createdStudent = successful[0]?.data
        if (createdStudent) {
          return {
            Id: createdStudent.Id,
            firstName: createdStudent.FirstName_c || '',
            lastName: createdStudent.LastName_c || '',
            email: createdStudent.Email_c || '',
            phone: createdStudent.Phone_c || '',
            gradeLevel: createdStudent.GradeLevel_c || '',
            dateOfBirth: createdStudent.DateOfBirth_c || null,
            enrollmentDate: createdStudent.EnrollmentDate_c || null,
            status: createdStudent.Status_c || 'active',
            classIds: createdStudent.ClassIds_c ? createdStudent.ClassIds_c.split(',') : []
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error)
      return null
    }
  },

  async update(id, studentData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          FirstName_c: studentData.firstName || '',
          LastName_c: studentData.lastName || '',
          Email_c: studentData.email || '',
          Phone_c: studentData.phone || '',
          GradeLevel_c: studentData.gradeLevel || '',
          DateOfBirth_c: studentData.dateOfBirth || null,
          EnrollmentDate_c: studentData.enrollmentDate || null,
          Status_c: studentData.status || 'active',
          ClassIds_c: studentData.classIds ? studentData.classIds.join(',') : ''
        }]
      }
      
      const response = await apperClient.updateRecord('student_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update student:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return null
        }
        
        const updatedStudent = successful[0]?.data
        if (updatedStudent) {
          return {
            Id: updatedStudent.Id,
            firstName: updatedStudent.FirstName_c || '',
            lastName: updatedStudent.LastName_c || '',
            email: updatedStudent.Email_c || '',
            phone: updatedStudent.Phone_c || '',
            gradeLevel: updatedStudent.GradeLevel_c || '',
            dateOfBirth: updatedStudent.DateOfBirth_c || null,
            enrollmentDate: updatedStudent.EnrollmentDate_c || null,
            status: updatedStudent.Status_c || 'active',
            classIds: updatedStudent.ClassIds_c ? updatedStudent.ClassIds_c.split(',') : []
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error)
      return null
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('student_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete student:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }
        
        return successful.length > 0
      }
      return false
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error)
      return false
    }
  },

  async getByClassId(classId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "FirstName_c"}},
          {"field": {"Name": "LastName_c"}},
          {"field": {"Name": "Email_c"}},
          {"field": {"Name": "Phone_c"}},
          {"field": {"Name": "GradeLevel_c"}},
          {"field": {"Name": "DateOfBirth_c"}},
          {"field": {"Name": "EnrollmentDate_c"}},
          {"field": {"Name": "Status_c"}},
          {"field": {"Name": "ClassIds_c"}}
        ],
        where: [{"FieldName": "ClassIds_c", "Operator": "Contains", "Values": [classId.toString()]}]
      }
      
      const response = await apperClient.fetchRecords('student_c', params)
      
      if (!response?.data?.length) {
        return []
      }
      
      return response.data.map(student => ({
        Id: student.Id,
        firstName: student.FirstName_c || '',
        lastName: student.LastName_c || '',
        email: student.Email_c || '',
        phone: student.Phone_c || '',
        gradeLevel: student.GradeLevel_c || '',
        dateOfBirth: student.DateOfBirth_c || null,
        enrollmentDate: student.EnrollmentDate_c || null,
        status: student.Status_c || 'active',
        classIds: student.ClassIds_c ? student.ClassIds_c.split(',') : []
      }))
    } catch (error) {
      console.error("Error fetching students by class:", error?.response?.data?.message || error)
      return []
    }
}
}