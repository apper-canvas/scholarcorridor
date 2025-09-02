import { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import Select from "@/components/atoms/Select"
import StudentTable from "@/components/organisms/StudentTable"
import StudentModal from "@/components/organisms/StudentModal"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { studentService } from "@/services/api/studentService"
import { classService } from "@/services/api/classService"
import { toast } from "react-toastify"

const StudentsPage = () => {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [studentsData, classesData] = await Promise.all([
        studentService.getAll(),
        classService.getAll()
      ])
      setStudents(studentsData)
      setClasses(classesData)
    } catch (err) {
      setError("Failed to load students. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = students

    if (searchQuery) {
      filtered = filtered.filter(student =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(student => student.status === statusFilter)
    }

    if (gradeFilter !== "all") {
      filtered = filtered.filter(student => student.gradeLevel === gradeFilter)
    }

    setFilteredStudents(filtered)
  }, [students, searchQuery, statusFilter, gradeFilter])

  const handleAddStudent = () => {
    setSelectedStudent(null)
    setModalOpen(true)
  }

  const handleEditStudent = (student) => {
    setSelectedStudent(student)
    setModalOpen(true)
  }

  const handleViewStudent = (student) => {
    toast.info(`Viewing details for ${student.firstName} ${student.lastName}`)
  }

  const handleDeleteStudent = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
      try {
        await studentService.delete(student.Id)
        setStudents(prev => prev.filter(s => s.Id !== student.Id))
        toast.success("Student deleted successfully")
      } catch (err) {
        toast.error("Failed to delete student")
      }
    }
  }

  const handleSaveStudent = async (studentData) => {
    try {
      if (selectedStudent) {
        const updatedStudent = await studentService.update(selectedStudent.Id, studentData)
        setStudents(prev => prev.map(s => s.Id === selectedStudent.Id ? updatedStudent : s))
        toast.success("Student updated successfully")
      } else {
        const newStudent = await studentService.create(studentData)
        setStudents(prev => [...prev, newStudent])
        toast.success("Student added successfully")
      }
      setModalOpen(false)
    } catch (err) {
      toast.error("Failed to save student")
    }
  }

  const gradeOptions = [
    "K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
  ]

  if (loading) return <Loading className="p-6" />
  if (error) return <Error message={error} onRetry={loadData} className="mt-6" />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Students</h1>
          <p className="text-gray-600">Manage your student roster and information</p>
        </div>
        <Button onClick={handleAddStudent} variant="accent" className="flex items-center space-x-2">
          <ApperIcon name="UserPlus" className="w-4 h-4" />
          <span>Add Student</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students by name or email..."
          />
        </div>
        <div className="flex gap-4">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-32"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
          <Select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="w-32"
          >
            <option value="all">All Grades</option>
            {gradeOptions.map(grade => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <Empty
          title="No students found"
          description="Start by adding your first student to the roster"
          icon="Users"
          action={handleAddStudent}
          actionText="Add Student"
        />
      ) : (
        <StudentTable
          students={filteredStudents}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          onView={handleViewStudent}
        />
      )}

      {/* Student Modal */}
      <StudentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        student={selectedStudent}
        onSave={handleSaveStudent}
        classes={classes}
      />
    </div>
  )
}

export default StudentsPage