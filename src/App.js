// src/App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import "./index.css";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAizYHF5cwIOiKU0xfZQg4IG5-6K9yWaa0",
  authDomain: "student-dashboard-dfb83.firebaseapp.com",
  projectId: "student-dashboard-dfb83",
  storageBucket: "student-dashboard-dfb83.appspot.com",
  messagingSenderId: "403211493406",
  appId: "1:403211493406:web:bd4c3a480543fb81df4e0f",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Mock API
const mock = new MockAdapter(axios, { delayResponse: 1000 });
const mockStudents = [
  { id: 1, name: "Rohit Ganguly", email: "rohitganguly2004@gmail.com", course: "IT", cgpa: "9.4" },
  { id: 2, name: "Sanket More", email: "sanketmore15@gmail.com", course: "EXTC", cgpa: "8.8" },
  { id: 3, name: "Sahil Patil", email: "sahilpatil55@gmail.com", course: "IT", cgpa: "8.95" },
  { id: 4, name: "Rohan Singh", email: "singhrohan18@gmail.com", course: "IT", cgpa: "9.8" },
  { id: 5, name: "Atharva Pawar", email: "atharvapawar90@gmail.com", course: "EXTC", cgpa: "8.2" },
  { id: 6, name: "Soham Amare", email: "sohamamare86@gmail.com", course: "EXTC", cgpa: "9" },
  { id: 7, name: "Viraj Parmar", email: "virajparmar05@gmail.com", course: "IT", cgpa: "8" },
];
mock.onGet("/students").reply(200, mockStudents);

const App = () => {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    axios.get("/students").then((res) => setStudents(res.data));
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const filteredStudents = students.filter((s) =>
    filter ? s.course.toLowerCase().includes(filter.toLowerCase()) : true
  );

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className={theme === "dark" ? "dark-theme" : ""}>
      <Router>
        <div className="container">
          <Navbar user={user} toggleTheme={toggleTheme} theme={theme} />
          <Routes>
            <Route path="/" element={<Home students={filteredStudents} setFilter={setFilter} user={user} />} />
            <Route path="/add" element={<ProtectedRoute user={user}><AddStudent /></ProtectedRoute>} />
            <Route path="/student/:id" element={<ProtectedRoute user={user}><StudentDetail students={students} /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

const Navbar = ({ user, toggleTheme, theme }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    firebase.auth().signOut();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">Student Dashboard</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/add">Add Student</Link>
        {!user ? (
          <Link to="/login">Login</Link>
        ) : (
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        )}
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>
    </nav>
  );
};

const ProtectedRoute = ({ user, children }) => {
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

const Home = ({ students, setFilter, user }) => {
  const [editStudent, setEditStudent] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [studentList, setStudentList] = useState(students);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All");

  useEffect(() => {
    setStudentList(students);
  }, [students]);

  const filteredList = studentList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse =
      selectedCourse === "All" || s.course.toLowerCase() === selectedCourse.toLowerCase();

    return matchesSearch && matchesCourse;
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%", maxWidth: "400px" }}
      />
      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%", maxWidth: "400px" }}
      >
        <option value="All">All Courses</option>
        <option value="IT">IT</option>
        <option value="EXTC">EXTC</option>
      </select>

      <ul>
        {filteredList.map((s) => (
          <li key={s.id} className="student-card">
            <Link to={`/student/${s.id}`}>
              <p><strong>{s.name}</strong></p>
            </Link>
            <p>{s.email}</p>
            <p>{s.course}</p>
            {user && (
              <div style={{ marginTop: "10px" }}>
                <button onClick={() => setEditStudent(s)} style={{ marginRight: "10px" }}>Edit</button>
                <button onClick={() => setConfirmDelete(s)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {editStudent && (
        <EditStudentModal
          student={editStudent}
          onClose={() => setEditStudent(null)}
          onSave={(updated) => {
            const updatedList = studentList.map((s) => (s.id === updated.id ? updated : s));
            setStudentList(updatedList);
            setEditStudent(null);
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmDeleteModal
          student={confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onDelete={(id) => {
            const updatedList = studentList.filter((s) => s.id !== id);
            setStudentList(updatedList);
            setConfirmDelete(null);
          }}
        />
      )}
    </div>
  );
};

const AddStudent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [cgpa, setCgpa] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !course || !cgpa || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please fill all fields correctly.");
      return;
    }
    alert("Student added successfully (mock only).");
    setName("");
    setEmail("");
    setCourse("");
    setCgpa("");
  };

  return (
    <form onSubmit={handleSubmit} className="add-student-form">
      <h2>Add New Student</h2>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} />
      <input placeholder="CGPA" value={cgpa} onChange={(e) => setCgpa(e.target.value)} />
      <button type="submit">Add Student</button>
    </form>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().signInWithPopup(provider);
      navigate(from, { replace: true });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <p>You must log in to access this feature.</p>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
};

const StudentDetail = ({ students }) => {
  const { id } = useParams();
  const student = students.find((s) => s.id === parseInt(id));
  if (!student) return <p>Student not found.</p>;

  return (
    <div className="student-detail">
      <h2>{student.name}</h2>
      <p><strong>Email:</strong> {student.email}</p>
      <p><strong>Course:</strong> {student.course}</p>
      <p><strong>CGPA:</strong> {student.cgpa}</p>
    </div>
  );
};

const EditStudentModal = ({ student, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...student });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Edit Student</h3>
        <form onSubmit={handleSubmit}>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <input name="course" value={formData.course} onChange={handleChange} placeholder="Course" />
          <input name="cgpa" value={formData.cgpa} onChange={handleChange} placeholder="CGPA" />
          <button type="submit">Save</button>
          <button type="button" onClick={onClose} style={{ marginLeft: "10px" }}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

const ConfirmDeleteModal = ({ student, onClose, onDelete }) => (
  <div className="modal">
    <div className="modal-content">
      <p>Are you sure you want to delete <strong>{student.name}</strong>?</p>
      <button onClick={() => onDelete(student.id)}>Yes, Delete</button>
      <button onClick={onClose} style={{ marginLeft: "10px" }}>Cancel</button>
    </div>
  </div>
);

export default App;
