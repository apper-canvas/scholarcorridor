import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import StudentsPage from "@/components/pages/StudentsPage"
import ClassesPage from "@/components/pages/ClassesPage"
import GradesPage from "@/components/pages/GradesPage"
import AttendancePage from "@/components/pages/AttendancePage"
import ReportsPage from "@/components/pages/ReportsPage"
import DashboardPage from "@/components/pages/DashboardPage"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="classes" element={<ClassesPage />} />
            <Route path="grades" element={<GradesPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App