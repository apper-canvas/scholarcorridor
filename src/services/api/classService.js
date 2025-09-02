import { toast } from 'react-toastify'

const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

export const classService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Subject_c"}},
          {"field": {"Name": "Period_c"}},
          {"field": {"Name": "Room_c"}},
          {"field": {"Name": "StudentIds_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "ASC"}]
      }
      
      const response = await apperClient.fetchRecords('class_c', params)
      
      if (!response?.data?.length) {
        return []
      }
      
      return response.data.map(cls => ({
        Id: cls.Id,
        name: cls.Name_c || '',
        subject: cls.Subject_c || '',
        period: cls.Period_c || '',
        room: cls.Room_c || '',
        studentIds: cls.StudentIds_c ? cls.StudentIds_c.split(',') : []
      }))
    } catch (error) {
      console.error("Error fetching classes:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Subject_c"}},
          {"field": {"Name": "Period_c"}},
          {"field": {"Name": "Room_c"}},
          {"field": {"Name": "StudentIds_c"}}
        ]
      }
      
      const response = await apperClient.getRecordById('class_c', parseInt(id), params)
      
      if (!response?.data) {
        return null
      }

      return {
        Id: response.data.Id,
        name: response.data.Name_c || '',
        subject: response.data.Subject_c || '',
        period: response.data.Period_c || '',
        room: response.data.Room_c || '',
        studentIds: response.data.StudentIds_c ? response.data.StudentIds_c.split(',') : []
      }
    } catch (error) {
      console.error(`Error fetching class ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(classData) {
    try {
      const params = {
        records: [{
          Name_c: classData.name || '',
          Subject_c: classData.subject || '',
          Period_c: classData.period || '',
          Room_c: classData.room || '',
          StudentIds_c: classData.studentIds ? classData.studentIds.join(',') : ''
        }]
      }
      
      const response = await apperClient.createRecord('class_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create class:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return null
        }
        
        const createdClass = successful[0]?.data
        if (createdClass) {
          return {
            Id: createdClass.Id,
            name: createdClass.Name_c || '',
            subject: createdClass.Subject_c || '',
            period: createdClass.Period_c || '',
            room: createdClass.Room_c || '',
            studentIds: createdClass.StudentIds_c ? createdClass.StudentIds_c.split(',') : []
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error creating class:", error?.response?.data?.message || error)
      return null
    }
  },

  async update(id, classData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name_c: classData.name || '',
          Subject_c: classData.subject || '',
          Period_c: classData.period || '',
          Room_c: classData.room || '',
          StudentIds_c: classData.studentIds ? classData.studentIds.join(',') : ''
        }]
      }
      
      const response = await apperClient.updateRecord('class_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update class:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return null
        }
        
        const updatedClass = successful[0]?.data
        if (updatedClass) {
          return {
            Id: updatedClass.Id,
            name: updatedClass.Name_c || '',
            subject: updatedClass.Subject_c || '',
            period: updatedClass.Period_c || '',
            room: updatedClass.Room_c || '',
            studentIds: updatedClass.StudentIds_c ? updatedClass.StudentIds_c.split(',') : []
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error updating class:", error?.response?.data?.message || error)
      return null
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('class_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete class:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }
        
        return successful.length > 0
      }
      return false
    } catch (error) {
      console.error("Error deleting class:", error?.response?.data?.message || error)
      return false
    }
  }
}