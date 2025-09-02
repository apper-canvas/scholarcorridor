import { useState, useEffect } from "react"
import StatCard from "@/components/molecules/StatCard"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { studentService } from "@/services/api/studentService"
import { classService } from "@/services/api/classService" 
import { gradeService } from "@/services/api/gradeService"
import { attendanceService } from "@/services/api/attendanceService"
import { format, isToday } from "date-fns"

const DashboardPage = () => {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [grades, setGrades] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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
      setError("Failed to load dashboard data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <Loading className="p-6" />
  if (error) return <Error message={error} onRetry={loadData} className="mt-6" />

  const activeStudents = students.filter(student => student.status === "active")
  const todaysAttendance = attendance.filter(record => isToday(new Date(record.date)))
  const presentToday = todaysAttendance.filter(record => record.status === "present").length
  const attendanceRate = todaysAttendance.length > 0 ? Math.round((presentToday / todaysAttendance.length) * 100) : 0

  const recentGrades = grades
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map(grade => {
      const student = students.find(s => s.Id.toString() === grade.studentId)
      const cls = classes.find(c => c.Id.toString() === grade.classId)
      return { ...grade, student, class: cls }
    })

  const upcomingClasses = classes.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold font-display mb-2">Welcome back, Teacher!</h1>
          <p className="text-white/90 text-lg">Ready to inspire minds today? Here's what's happening in your classes.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Students"
          value={activeStudents.length}
          icon="Users"
          gradient="from-primary to-secondary"
        />
        <StatCard
          title="Total Classes"
          value={classes.length}
          icon="BookOpen"
          gradient="from-secondary to-purple-600"
        />
        <StatCard
          title="Today's Attendance"
          value={`${attendanceRate}%`}
          icon="Calendar"
          gradient="from-success to-green-600"
        />
        <StatCard
          title="Recent Grades"
          value={recentGrades.length}
          icon="GraduationCap"
          gradient="from-accent to-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Clock" className="w-5 h-5 text-primary" />
              <span>Today's Classes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((cls) => (
                <div key={cls.Id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <ApperIcon name="BookOpen" className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{cls.name}</h3>
                      <p className="text-sm text-gray-600">Period {cls.period} • {cls.room}</p>
                    </div>
                  </div>
                  <Badge variant="info">
                    {cls.studentIds ? cls.studentIds.length : 0} students
                  </Badge>
                </div>
              ))}
              {upcomingClasses.length === 0 && (
                <div className="text-center py-8">
                  <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No classes scheduled for today</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="TrendingUp" className="w-5 h-5 text-accent" />
              <span>Recent Grades</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGrades.map((grade) => (
                <div key={grade.Id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent to-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {grade.student ? grade.student.firstName.charAt(0) : "?"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {grade.student ? `${grade.student.firstName} ${grade.student.lastName}` : "Unknown Student"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {grade.assignmentName} • {grade.class ? grade.class.name : "Unknown Class"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900">
                      {grade.score}/{grade.maxScore}
                    </div>
                    <p className="text-xs text-gray-500">
                      {format(new Date(grade.date), "MMM dd")}
                    </p>
                  </div>
                </div>
              ))}
              {recentGrades.length === 0 && (
                <div className="text-center py-8">
                  <ApperIcon name="GraduationCap" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent grades to display</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Zap" className="w-5 h-5 text-primary" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <ApperIcon name="UserPlus" className="w-6 h-6" />
              <span className="text-sm">Add Student</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <ApperIcon name="Calendar" className="w-6 h-6" />
              <span className="text-sm">Take Attendance</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <ApperIcon name="Edit" className="w-6 h-6" />
              <span className="text-sm">Enter Grades</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <ApperIcon name="FileText" className="w-6 h-6" />
              <span className="text-sm">Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage