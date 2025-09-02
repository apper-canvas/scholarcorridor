import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import Select from "@/components/atoms/Select"
import Label from "@/components/atoms/Label"
import ApperIcon from "@/components/ApperIcon"
import { format } from "date-fns"

const StudentModal = ({ isOpen, onClose, student, onSave, classes = [] }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gradeLevel: "",
    dateOfBirth: "",
    enrollmentDate: "",
    status: "active",
    classIds: []
  })

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        phone: student.phone || "",
        gradeLevel: student.gradeLevel || "",
        dateOfBirth: student.dateOfBirth ? format(new Date(student.dateOfBirth), "yyyy-MM-dd") : "",
        enrollmentDate: student.enrollmentDate ? format(new Date(student.enrollmentDate), "yyyy-MM-dd") : "",
        status: student.status || "active",
        classIds: student.classIds || []
      })
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gradeLevel: "",
        dateOfBirth: "",
        enrollmentDate: format(new Date(), "yyyy-MM-dd"),
        status: "active",
        classIds: []
      })
    }
  }, [student])

  const handleSubmit = (e) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
      enrollmentDate: new Date(formData.enrollmentDate).toISOString()
    }
    onSave(submitData)
  }

  const handleClassToggle = (classId) => {
    setFormData(prev => ({
      ...prev,
      classIds: prev.classIds.includes(classId)
        ? prev.classIds.filter(id => id !== classId)
        : [...prev.classIds, classId]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="UserPlus" className="w-5 h-5 text-primary" />
            <span>{student ? "Edit Student" : "Add New Student"}</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="First Name"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <FormField
                label="Last Name"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Email"
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <FormField
                label="Phone"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="gradeLevel" className="after:content-['*'] after:text-error after:ml-1">
                  Grade Level
                </Label>
                <Select
                  id="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                  required
                >
                  <option value="">Select grade level</option>
                  <option value="K">Kindergarten</option>
                  <option value="1">1st Grade</option>
                  <option value="2">2nd Grade</option>
                  <option value="3">3rd Grade</option>
                  <option value="4">4th Grade</option>
                  <option value="5">5th Grade</option>
                  <option value="6">6th Grade</option>
                  <option value="7">7th Grade</option>
                  <option value="8">8th Grade</option>
                  <option value="9">9th Grade</option>
                  <option value="10">10th Grade</option>
                  <option value="11">11th Grade</option>
                  <option value="12">12th Grade</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Date of Birth"
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
              <FormField
                label="Enrollment Date"
                id="enrollmentDate"
                type="date"
                value={formData.enrollmentDate}
                onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                required
              />
            </div>

            {classes.length > 0 && (
              <div className="space-y-3">
                <Label>Enrolled Classes</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {classes.map((cls) => (
                    <label
                      key={cls.Id}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.classIds.includes(cls.Id.toString())}
                        onChange={() => handleClassToggle(cls.Id.toString())}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{cls.name}</div>
                        <div className="text-xs text-gray-500">{cls.subject} - Period {cls.period}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="accent" className="flex items-center space-x-2">
                <ApperIcon name="Save" className="w-4 h-4" />
                <span>{student ? "Update Student" : "Add Student"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentModal