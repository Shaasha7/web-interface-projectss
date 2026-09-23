import { useState } from "react";
import "./App.css";

function App() {
  const students = [
    { id: 1, name: "Shalini Udayakumar Shetty", department: "AI & DS", year: "2nd Year" },
    { id: 2, name: "Vatti Venkatesh Yadav", department: "AI & DS", year: "2nd Year" },
    { id: 3, name: "Shavenn Venkatesh Yadav", department: "ECE", year: "2nd Year" },
    { id: 4, name: "Shaasha Venkatesh Yadav", department: "AI & DS", year: "2nd Year" },
    { id: 5, name: "Haripriya Rajesh", department: "CSE", year: "2nd Year" },
    { id: 6, name: "Alanciya Kareem", department: "IT", year: "2nd Year" },
    { id: 7, name: "Ramajayam Udayakumar", department: "ECE", year: "2nd Year" },
    { id: 8, name: "Udayakumar Shanmugam", department: "CSE", year: "2nd Year" },
  ];

  const [attendance, setAttendance] = useState(() => {
    const initialAttendance = {};

    students.forEach((student) => {
      initialAttendance[student.id] = "Absent";
    });

    return initialAttendance;
  });

  const [search, setSearch] = useState("");

  const markAttendance = (id, status) => {
    setAttendance((previousAttendance) => ({
      ...previousAttendance,
      [id]: status,
    }));
  };

  const presentCount = Object.values(attendance).filter(
    (status) => status === "Present"
  ).length;

  const absentCount = Object.values(attendance).filter(
    (status) => status === "Absent"
  ).length;

  const totalStudents = students.length;

  const attendancePercentage =
    totalStudents > 0
      ? Math.round((presentCount / totalStudents) * 100)
      : 0;

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">

      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>

      <main className="dashboard">

        {/* Header */}
        <header className="header">
          <div>
            <div className="brand">
              <div className="brand-icon">✓</div>
              <span>Attendify</span>
            </div>

            <h1>Attendance Dashboard</h1>

            <p className="subtitle">
              Manage today's student attendance with ease.
            </p>
          </div>

          <div className="date-box">
            <span className="date-label">TODAY</span>

            <strong>
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </strong>
          </div>
        </header>

        {/* Statistics */}
        <section className="stats">

          <div className="stat-card">
            <div className="stat-top">
              <span>Total Students</span>
              <div className="stat-icon blue">👥</div>
            </div>

            <h2>{totalStudents}</h2>

            <p>Enrolled students</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Present</span>
              <div className="stat-icon green">✓</div>
            </div>

            <h2>{presentCount}</h2>

            <p className="green-text">
              {attendancePercentage}% attendance
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Absent</span>
              <div className="stat-icon red">×</div>
            </div>

            <h2>{absentCount}</h2>

            <p className="red-text">
              {totalStudents > 0
                ? Math.round((absentCount / totalStudents) * 100)
                : 0}
              % absent
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Attendance Rate</span>
              <div className="stat-icon purple">%</div>
            </div>

            <h2>{attendancePercentage}%</h2>

            <div className="progress">
              <div
                className="progress-fill"
                style={{
                  width: `${attendancePercentage}%`,
                }}
              ></div>
            </div>
          </div>

        </section>

        {/* Student Attendance */}
        <section className="students-section">

          <div className="section-header">
            <div>
              <h2>Student Attendance</h2>
              <p>Mark each student's attendance for today.</p>
            </div>

            <div className="search-box">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search student..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="table-head">
            <span>STUDENT</span>
            <span>DEPARTMENT</span>
            <span>YEAR</span>
            <span>STATUS</span>
            <span>ACTION</span>
          </div>

          <div className="student-list">

            {filteredStudents.map((student) => {
              const status = attendance[student.id];

              return (
                <div className="student-row" key={student.id}>

                  <div className="student-info">
                    <div className="avatar">
                      {student.name.charAt(0)}
                    </div>

                    <div>
                      <h3>{student.name}</h3>

                      <p>
                        ID: STU-{String(student.id).padStart(3, "0")}
                      </p>
                    </div>
                  </div>

                  <div className="department">
                    {student.department}
                  </div>

                  <div className="year">
                    {student.year}
                  </div>

                  <div>
                    <span
                      className={
                        status === "Present"
                          ? "status status-present"
                          : "status status-absent"
                      }
                    >
                      <span className="status-dot"></span>
                      {status}
                    </span>
                  </div>

                  <div className="actions">

                    <button
                      className={
                        status === "Present"
                          ? "action-btn present active"
                          : "action-btn present"
                      }
                      onClick={() =>
                        markAttendance(student.id, "Present")
                      }
                    >
                      ✓ Present
                    </button>

                    <button
                      className={
                        status === "Absent"
                          ? "action-btn absent active"
                          : "action-btn absent"
                      }
                      onClick={() =>
                        markAttendance(student.id, "Absent")
                      }
                    >
                      × Absent
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

          {filteredStudents.length === 0 && (
            <div className="empty">
              No students found.
            </div>
          )}

        </section>

        <footer>
          <span>Attendify</span>
          <span>•</span>
          <span>Attendance Management System</span>
        </footer>

      </main>
    </div>
  );
}

export default App;