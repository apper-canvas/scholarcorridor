import { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import Select from "@/components/atoms/Select"
import Label from "@/components/atoms/Label"
import GradePill from "@/components/molecules/GradePill"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { gradeService } from "@/services/api/gradeService"
import { studentService } from "@/services/api/studentService"
import { classService } from "@/services/api/classService"
import { format } from "date-fns"
import { toast } from "react-toastify"

const GradesPage = () => {
  const [grades, setGrades] = useState([])
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [filteredGrades, setFilteredGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState("all")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [gradesData, studentsData, classesData] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll(),
        classService.getAll()
      ])
      setGrades(gradesData)
      setStudents(studentsData)
      setClasses(classesData)
    } catch (err) {
      setError("Failed to load grades. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = grades

    if (selectedClass !== "all") {
      filtered = filtered.filter(grade => grade.classId === selectedClass)
    }

    if (selectedStudent !== "all") {
      filtered = filtered.filter(grade => grade.studentId === selectedStudent)
    }

    setFilteredGrades(filtered.sort((a, b) => new Date(b.date) - new Date(a.date)))
  }, [grades, selectedClass, selectedStudent])

  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id.toString() === studentId)
    return student ? `${student.firstName} ${student.lastName}` : "Unknown Student"
  }

  const getClassName = (classId) => {
    const cls = classes.find(c => c.Id.toString() === classId)
    return cls ? cls.name : "Unknown Class"
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "homework": return "BookOpen"
      case "quiz": return "FileText"
      case "test": return "Clipboard"
      case "project": return "Briefcase"
      default: return "FileText"
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "homework": return "info"
      case "quiz": return "warning"
      case "test": return "destructive"
      case "project": return "secondary"
      default: return "default"
    }
  }

  if (loading) return <Loading className="p-6" />
  if (error) return <Error message={error} onRetry={loadData} className="mt-6" />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Grades</h1>
          <p className="text-gray-600">Track and manage student performance</p>
        </div>
        <Button variant="accent" className="flex items-center space-x-2">
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Grade</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Filter by Class</Label>
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="all">All Classes</option>
                {classes.map(cls => (
                  <option key={cls.Id} value={cls.Id.toString()}>
                    {cls.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Filter by Student</Label>
              <Select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="all">All Students</option>
                {students
                  .filter(student => selectedClass === "all" || 
                    (student.classIds && student.classIds.includes(selectedClass)))
                  .map(student => (
                    <option key={student.Id} value={student.Id.toString()}>
                      {student.firstName} {student.lastName}
                    </option>
                  ))}
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedClass("all")
                  setSelectedStudent("all")
                }}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="RotateCcw" className="w-4 h-4" />
                <span>Clear Filters</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grades List */}
      {filteredGrades.length === 0 ? (
        <Empty
          title="No grades found"
          description="Start by adding grades for your students' assignments"
          icon="GraduationCap"
          actionText="Add Grade"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredGrades.map((grade) => (
            <Card key={grade.Id} className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl shadow-lg flex items-center justify-center bg-gradient-to-br from-primary to-secondary`}>
                      <ApperIcon 
                        name={getCategoryIcon(grade.category)} 
                        className="w-6 h-6 text-white" 
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {grade.assignmentName}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="font-medium">{getStudentName(grade.studentId)}</span>
                        <span>•</span>
                        <span>{getClassName(grade.classId)}</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          grade.category === "homework" ? "bg-blue-100 text-blue-800" :
                          grade.category === "quiz" ? "bg-yellow-100 text-yellow-800" :
                          grade.category === "test" ? "bg-red-100 text-red-800" :
                          "bg-purple-100 text-purple-800"
                        }`}>
                          {grade.category}
                        </span>
                        <span>•</span>
                        <span>{format(new Date(grade.date), "MMM dd, yyyy")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <GradePill score={grade.score} maxScore={grade.maxScore} />
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default GradesPage