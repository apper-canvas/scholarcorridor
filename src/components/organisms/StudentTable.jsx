import { useState } from "react"
import { Card } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { format } from "date-fns"

const StudentTable = ({ students, onEdit, onDelete, onView }) => {
  const [sortField, setSortField] = useState("firstName")
  const [sortDirection, setSortDirection] = useState("asc")

  const sortedStudents = [...students].sort((a, b) => {
    if (sortField === "firstName" || sortField === "lastName") {
      const aValue = a[sortField].toLowerCase()
      const bValue = b[sortField].toLowerCase()
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    return 0
  })

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th 
                className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort("firstName")}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  <ApperIcon name="ArrowUpDown" className="w-4 h-4 text-gray-400" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Grade Level</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Enrolled</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedStudents.map((student, index) => (
              <tr 
                key={student.Id} 
                className={`hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mr-3 shadow-md">
                      <span className="text-sm font-medium text-white">
                        {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{student.gradeLevel}</td>
                <td className="px-6 py-4">
                  <Badge variant={student.status === "active" ? "success" : "destructive"}>
                    {student.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {format(new Date(student.enrollmentDate), "MMM dd, yyyy")}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(student)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <ApperIcon name="Eye" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(student)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(student)}
                      className="hover:bg-error/10 hover:text-error"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default StudentTable