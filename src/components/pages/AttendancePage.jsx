import { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import Select from "@/components/atoms/Select"
import Label from "@/components/atoms/Label"
import AttendanceDot from "@/components/molecules/AttendanceDot"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { attendanceService } from "@/services/api/attendanceService"
import { studentService } from "@/services/api/studentService"
import { classService } from "@/services/api/classService"
import { format, startOfWeek, addDays, isToday, isSameDay } from "date-fns"
import { toast } from "react-toastify"

const AttendancePage = () => {
  const [attendance, setAttendance] = useState([])
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [currentWeek, setCurrentWeek] = useState(new Date())

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [attendanceData, studentsData, classesData] = await Promise.all([
        attendanceService.getAll(),
        studentService.getAll(),
        classService.getAll()
      ])
      setAttendance(attendanceData)
      setStudents(studentsData)
      setClasses(classesData)
      
      // Set default class selection
      if (classesData.length > 0) {
        setSelectedClass(classesData[0].Id.toString())
      }
    } catch (err) {
      setError("Failed to load attendance data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(startOfWeek(currentWeek, { weekStartsOn: 1 }), i)
  )

  const classStudents = students.filter(student => 
    student.classIds && student.classIds.includes(selectedClass)
  )

  const getAttendanceStatus = (studentId, date) => {
    const record = attendance.find(a => 
      a.studentId === studentId.toString() &&
      a.classId === selectedClass &&
      isSameDay(new Date(a.date), date)
    )
    return record ? record.status : null
  }

  const handleAttendanceClick = async (studentId, date, currentStatus) => {
    const statuses = ["present", "absent", "late", "excused"]
    const currentIndex = statuses.indexOf(currentStatus)
    const nextStatus = statuses[(currentIndex + 1) % statuses.length]

    try {
      await attendanceService.markAttendance(studentId.toString(), selectedClass, date, nextStatus)
      
      // Update local state
      setAttendance(prev => {
        const existingIndex = prev.findIndex(a => 
          a.studentId === studentId.toString() &&
          a.classId === selectedClass &&
          isSameDay(new Date(a.date), date)
        )
        
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = { ...updated[existingIndex], status: nextStatus }
          return updated
        } else {
          return [...prev, {
            Id: Date.now(),
            studentId: studentId.toString(),
            classId: selectedClass,
            date: date.toISOString(),
            status: nextStatus
          }]
        }
      })

      toast.success(`Marked as ${nextStatus}`)
    } catch (err) {
      toast.error("Failed to update attendance")
    }
  }

  const getTodayAttendanceStats = () => {
    const today = new Date()
    const todayAttendance = attendance.filter(record => 
      record.classId === selectedClass &&
      isSameDay(new Date(record.date), today)
    )
    
    const present = todayAttendance.filter(r => r.status === "present").length
    const absent = todayAttendance.filter(r => r.status === "absent").length
    const late = todayAttendance.filter(r => r.status === "late").length
    const excused = todayAttendance.filter(r => r.status === "excused").length

    return { present, absent, late, excused, total: todayAttendance.length }
  }

  if (loading) return <Loading className="p-6" />
  if (error) return <Error message={error} onRetry={loadData} className="mt-6" />

  if (classes.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Attendance</h1>
          <p className="text-gray-600">Track student attendance across your classes</p>
        </div>
        <Empty
          title="No classes found"
          description="Create a class first to start tracking attendance"
          icon="Calendar"
          actionText="Add Class"
        />
      </div>
    )
  }

  const stats = getTodayAttendanceStats()
  const selectedClassName = classes.find(c => c.Id.toString() === selectedClass)?.name || ""

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Attendance</h1>
          <p className="text-gray-600">Track student attendance across your classes</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="ChevronLeft" className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Settings" className="w-5 h-5 text-primary" />
              <span>Class Selection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              <Label>Select Class</Label>
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {classes.map(cls => (
                  <option key={cls.Id} value={cls.Id.toString()}>
                    {cls.name} - Period {cls.period}
                  </option>
                ))}
              </Select>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {classStudents.length} students enrolled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="BarChart" className="w-5 h-5 text-accent" />
              <span>Today's Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-1"></div>
                <div className="text-lg font-bold text-gray-900">{stats.present}</div>
                <div className="text-xs text-gray-600">Present</div>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-1"></div>
                <div className="text-lg font-bold text-gray-900">{stats.absent}</div>
                <div className="text-xs text-gray-600">Absent</div>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                <div className="text-lg font-bold text-gray-900">{stats.late}</div>
                <div className="text-xs text-gray-600">Late</div>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-1"></div>
                <div className="text-lg font-bold text-gray-900">{stats.excused}</div>
                <div className="text-xs text-gray-600">Excused</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Grid */}
      {classStudents.length === 0 ? (
        <Empty
          title="No students in selected class"
          description="Add students to this class to start tracking attendance"
          icon="Users"
          actionText="Manage Students"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Calendar" className="w-5 h-5 text-secondary" />
              <span>Weekly Attendance - {selectedClassName}</span>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Week of {format(weekDays[0], "MMM dd")} - {format(weekDays[6], "MMM dd, yyyy")}
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Student</th>
                    {weekDays.map((day, index) => (
                      <th key={index} className="text-center py-3 px-4 font-semibold text-gray-900 min-w-[100px]">
                        <div className="flex flex-col items-center">
                          <div className="text-xs text-gray-600 uppercase tracking-wide">
                            {format(day, "EEE")}
                          </div>
                          <div className={`text-sm ${isToday(day) ? "font-bold text-primary" : ""}`}>
                            {format(day, "MM/dd")}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {classStudents.map((student) => (
                    <tr key={student.Id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {student.firstName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-sm text-gray-600">Grade {student.gradeLevel}</div>
                          </div>
                        </div>
                      </td>
                      {weekDays.map((day, dayIndex) => {
                        const status = getAttendanceStatus(student.Id, day)
                        return (
                          <td key={dayIndex} className="py-4 px-4 text-center">
                            <div className="flex justify-center">
                              <AttendanceDot
                                status={status}
                                onClick={() => handleAttendanceClick(student.Id, day, status)}
                              />
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Present</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Absent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Late</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Excused</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-600">No Record</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Click on any dot to cycle through attendance statuses
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AttendancePage