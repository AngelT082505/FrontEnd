import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateTask from "./pages/CreateTask";
import TaskList from "./pages/TaskList";
import AdminUserManagement from "./pages/AdminUserManagement";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-task/:userId?" element={<CreateTask />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/admin/users" element={<AdminUserManagement />} /> {/* Solo accesible admin */}
        {/* otras rutas */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
