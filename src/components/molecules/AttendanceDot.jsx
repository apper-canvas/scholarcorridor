import { cn } from "@/utils/cn"

const AttendanceDot = ({ status, onClick, className }) => {
  const statusStyles = {
    present: "attendance-present",
    absent: "attendance-absent", 
    late: "attendance-late",
    excused: "attendance-excused"
  }

  const statusLabels = {
    present: "Present",
    absent: "Absent",
    late: "Late", 
    excused: "Excused"
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-4 h-4 rounded-full border-2 border-white shadow-sm hover:scale-125 transition-all duration-200",
        statusStyles[status] || "bg-gray-300",
        className
      )}
      title={statusLabels[status] || "No record"}
    />
  )
}

export default AttendanceDot