import { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { classService } from "@/services/api/classService"
import { studentService } from "@/services/api/studentService"
import { toast } from "react-toastify"

const ClassesPage = () => {
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [classesData, studentsData] = await Promise.all([
        classService.getAll(),
        studentService.getAll()
      ])
      setClasses(classesData)
      setStudents(studentsData)
    } catch (err) {
      setError("Failed to load classes. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getEnrolledStudents = (classId) => {
    return students.filter(student => 
      student.classIds && student.classIds.includes(classId.toString())
    )
  }

  const handleViewClass = (cls) => {
    toast.info(`Viewing ${cls.name} details`)
  }

  if (loading) return <Loading className="p-6" />
  if (error) return <Error message={error} onRetry={loadData} className="mt-6" />

  if (classes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">Classes</h1>
            <p className="text-gray-600">Organize and manage your course offerings</p>
          </div>
        </div>
        <Empty
          title="No classes found"
          description="Create your first class to start organizing students by subject"
          icon="BookOpen"
          actionText="Add Class"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Classes</h1>
          <p className="text-gray-600">Organize and manage your course offerings</p>
        </div>
        <Button variant="accent" className="flex items-center space-x-2">
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Class</span>
        </Button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => {
          const enrolledStudents = getEnrolledStudents(cls.Id)
          return (
            <Card key={cls.Id} className="hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                      {cls.name}
                    </CardTitle>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="BookOpen" className="w-4 h-4 mr-2 text-primary" />
                        {cls.subject}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Clock" className="w-4 h-4 mr-2 text-secondary" />
                        Period {cls.period}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="MapPin" className="w-4 h-4 mr-2 text-accent" />
                        {cls.room}
                      </div>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ApperIcon name="GraduationCap" className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="info" className="flex items-center space-x-1">
                    <ApperIcon name="Users" className="w-3 h-3" />
                    <span>{enrolledStudents.length} students</span>
                  </Badge>
                  <Badge variant={enrolledStudents.length > 0 ? "success" : "warning"}>
                    {enrolledStudents.length > 0 ? "Active" : "Empty"}
                  </Badge>
                </div>
                
                {/* Student Avatars */}
                {enrolledStudents.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Enrolled Students:</p>
                    <div className="flex -space-x-2">
                      {enrolledStudents.slice(0, 4).map((student, index) => (
                        <div
                          key={student.Id}
                          className="w-8 h-8 bg-gradient-to-br from-accent to-orange-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm"
                          title={`${student.firstName} ${student.lastName}`}
                        >
                          <span className="text-xs font-medium text-white">
                            {student.firstName.charAt(0)}
                          </span>
                        </div>
                      ))}
                      {enrolledStudents.length > 4 && (
                        <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                          <span className="text-xs font-medium text-white">
                            +{enrolledStudents.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleViewClass(cls)}
                  >
                    <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="ghost" className="px-3">
                    <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default ClassesPage