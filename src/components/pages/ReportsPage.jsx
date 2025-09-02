import { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import Select from "@/components/atoms/Select"
import Label from "@/components/atoms/Label"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { studentService } from "@/services/api/studentService"
import { classService } from "@/services/api/classService"
import { gradeService } from "@/services/api/gradeService"
import { attendanceService } from "@/services/api/attendanceService"
import { toast } from "react-toastify"

const ReportsPage = () => {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [grades, setGrades] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [reportData, setReportData] = useState([])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [studentsData, classesData, gradesData, attendanceData] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ])
      setStudents(studentsData)
      setClasses(classesData)
      setGrades(gradesData)
      setAttendance(attendanceData)
    } catch (err) {
      setError("Failed to load report data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    generateReportData()
  }, [students, grades, attendance, selectedClass])

  const generateReportData = () => {
    let filteredStudents = students.filter(student => student.status === "active")
    
    if (selectedClass !== "all") {
      filteredStudents = filteredStudents.filter(student =>
        student.classIds && student.classIds.includes(selectedClass)
      )
    }

    const reports = filteredStudents.map(student => {
      // Calculate grades
      let studentGrades = grades.filter(grade => grade.studentId === student.Id.toString())
      if (selectedClass !== "all") {
        studentGrades = studentGrades.filter(grade => grade.classId === selectedClass)
      }

      const totalPoints = studentGrades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0)
      const averageGrade = studentGrades.length > 0 ? Math.round(totalPoints / studentGrades.length) : 0

      // Calculate attendance
      let studentAttendance = attendance.filter(record => record.studentId === student.Id.toString())
      if (selectedClass !== "all") {
        studentAttendance = studentAttendance.filter(record => record.classId === selectedClass)
      }

      const presentCount = studentAttendance.filter(record => 
        record.status === "present" || record.status === "excused"
      ).length
      const attendanceRate = studentAttendance.length > 0 
        ? Math.round((presentCount / studentAttendance.length) * 100) 
        : 0

      return {
        student,
        averageGrade,
        attendanceRate,
        totalAssignments: studentGrades.length,
        totalAttendanceRecords: studentAttendance.length
      }
    })

    setReportData(reports.sort((a, b) => b.averageGrade - a.averageGrade))
  }

  const getGradeLevel = (average) => {
    if (average >= 90) return { level: "A", color: "success" }
    if (average >= 80) return { level: "B", color: "info" }
    if (average >= 70) return { level: "C", color: "warning" }
    if (average >= 60) return { level: "D", color: "destructive" }
    return { level: "F", color: "destructive" }
  }

  const getAttendanceLevel = (rate) => {
    if (rate >= 95) return "excellent"
    if (rate >= 85) return "good"
    if (rate >= 75) return "satisfactory"
    return "needs-improvement"
  }

  const handleExportReport = () => {
    toast.info("Export functionality would be implemented here")
  }

  if (loading) return <Loading className="p-6" />
  if (error) return <Error message={error} onRetry={loadData} className="mt-6" />

  const classOptions = classes.filter(cls => cls.studentIds && cls.studentIds.length > 0)
  const selectedClassName = selectedClass === "all" ? "All Classes" : 
    classes.find(c => c.Id.toString() === selectedClass)?.name || ""

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Reports</h1>
          <p className="text-gray-600">Comprehensive student performance overview</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <ApperIcon name="Printer" className="w-4 h-4" />
            <span>Print</span>
          </Button>
          <Button 
            onClick={handleExportReport}
            variant="accent" 
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Download" className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Filter" className="w-5 h-5 text-primary" />
            <span>Report Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1.5">
              <Label>Class Selection</Label>
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="all">All Classes</option>
                {classOptions.map(cls => (
                  <option key={cls.Id} value={cls.Id.toString()}>
                    {cls.name} - Period {cls.period}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Report Type</Label>
              <Select defaultValue="summary">
                <option value="summary">Student Summary</option>
                <option value="detailed">Detailed Performance</option>
                <option value="attendance">Attendance Only</option>
                <option value="grades">Grades Only</option>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <ApperIcon name="RefreshCw" className="w-4 h-4 mr-1" />
                Refresh
              </Button>
              <Button variant="ghost" size="sm">
                <ApperIcon name="Settings" className="w-4 h-4 mr-1" />
                Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg flex items-center justify-center">
                <ApperIcon name="Users" className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Class Average</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.length > 0 
                    ? Math.round(reportData.reduce((sum, r) => sum + r.averageGrade, 0) / reportData.length)
                    : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-success to-green-600 rounded-xl shadow-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.length > 0 
                    ? Math.round(reportData.reduce((sum, r) => sum + r.attendanceRate, 0) / reportData.length)
                    : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-orange-500 rounded-xl shadow-lg flex items-center justify-center">
                <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Honor Roll</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.filter(r => r.averageGrade >= 90).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-purple-600 rounded-xl shadow-lg flex items-center justify-center">
                <ApperIcon name="Award" className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Performance Table */}
      {reportData.length === 0 ? (
        <Empty
          title="No report data available"
          description="Add students and grades to generate performance reports"
          icon="FileText"
          actionText="Add Students"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="BarChart3" className="w-5 h-5 text-secondary" />
              <span>Student Performance Report - {selectedClassName}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Grade Average</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Letter Grade</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Attendance</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Assignments</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData.map((report, index) => {
                    const gradeLevel = getGradeLevel(report.averageGrade)
                    const attendanceLevel = getAttendanceLevel(report.attendanceRate)
                    
                    return (
                      <tr 
                        key={report.student.Id} 
                        className={`hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-md">
                              <span className="text-sm font-medium text-white">
                                {report.student.firstName.charAt(0)}{report.student.lastName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {report.student.firstName} {report.student.lastName}
                              </div>
                              <div className="text-sm text-gray-600">
                                Grade {report.student.gradeLevel}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-lg font-bold text-gray-900">
                            {report.averageGrade}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant={gradeLevel.color} className="text-sm font-medium">
                            {gradeLevel.level}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center space-y-1">
                            <span className="font-medium text-gray-900">
                              {report.attendanceRate}%
                            </span>
                            <Badge variant={attendanceLevel} className="text-xs">
                              {attendanceLevel.replace("-", " ")}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm text-gray-600">
                            {report.totalAssignments} submitted
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            {report.averageGrade >= 90 && report.attendanceRate >= 95 ? (
                              <div className="flex items-center space-x-1 text-success">
                                <ApperIcon name="Trophy" className="w-4 h-4" />
                                <span className="text-xs font-medium">Excellent</span>
                              </div>
                            ) : report.averageGrade >= 80 && report.attendanceRate >= 85 ? (
                              <div className="flex items-center space-x-1 text-primary">
                                <ApperIcon name="Star" className="w-4 h-4" />
                                <span className="text-xs font-medium">Good</span>
                              </div>
                            ) : report.averageGrade < 70 || report.attendanceRate < 75 ? (
                              <div className="flex items-center space-x-1 text-error">
                                <ApperIcon name="AlertTriangle" className="w-4 h-4" />
                                <span className="text-xs font-medium">Needs Attention</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1 text-gray-500">
                                <ApperIcon name="Minus" className="w-4 h-4" />
                                <span className="text-xs font-medium">Average</span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ReportsPage