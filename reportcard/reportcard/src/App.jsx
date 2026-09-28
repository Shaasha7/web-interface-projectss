import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Routes,
  Route,
  NavLink,
  Link,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";

/* ==========================================================================
   Config
   ========================================================================== */
const SCHOOL = {
  name: "Greenfield Public School",
  tagline: "Excellence in Education",
  year: "2026–27",
};

const SUBJECTS = ["English", "Maths", "Science", "Social", "Computer"];
const MAX_MARKS = 100;
const PASS_MARK = 35;
const STORAGE_KEY = "reportcard.students.v1";

const GRADE_SCALE = [
  { min: 90, grade: "A+", label: "Outstanding" },
  { min: 80, grade: "A", label: "Excellent" },
  { min: 70, grade: "B", label: "Very Good" },
  { min: 60, grade: "C", label: "Good" },
  { min: 50, grade: "D", label: "Satisfactory" },
  { min: 0, grade: "F", label: "Needs Improvement" },
];

const initialStudents = [
  { id: 1, name: "Arjun Kumar", roll: "101", className: "10-A", marks: { English: 88, Maths: 95, Science: 91, Social: 79, Computer: 98 } },
  { id: 2, name: "Priya Sharma", roll: "102", className: "10-A", marks: { English: 92, Maths: 76, Science: 84, Social: 88, Computer: 90 } },
  { id: 3, name: "Rahul Das", roll: "103", className: "10-B", marks: { English: 61, Maths: 48, Science: 55, Social: 67, Computer: 72 } },
];

/* ==========================================================================
   Helpers
   ========================================================================== */
const getTotal = (marks) =>
  Object.values(marks).reduce((sum, m) => sum + Number(m), 0);

const getPercentage = (marks) =>
  (getTotal(marks) / (SUBJECTS.length * MAX_MARKS)) * 100;

const getGrade = (score) =>
  GRADE_SCALE.find((g) => score >= g.min).grade;

const gradeClass = (grade) => `grade grade-${grade.replace("+", "plus")}`;

const isPass = (marks) =>
  Object.values(marks).every((m) => Number(m) >= PASS_MARK);

const tone = (value) => (value >= 75 ? "good" : value >= 50 ? "mid" : "low");

const initials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/** Competition ranking: equal totals share a rank (1, 2, 2, 4…). */
function getRankMap(students) {
  const sorted = [...students].sort((a, b) => getTotal(b.marks) - getTotal(a.marks));
  const map = {};
  let rank = 0;
  let prev = null;
  sorted.forEach((s, i) => {
    const t = getTotal(s.marks);
    if (t !== prev) {
      rank = i + 1;
      prev = t;
    }
    map[s.id] = rank;
  });
  return map;
}

function getRemark(pct, pass) {
  if (!pass)
    return "Needs focused support in the subjects below the pass mark. Regular practice and guidance are recommended.";
  if (pct >= 90) return "Outstanding performance across all subjects. Keep up the excellent work.";
  if (pct >= 75) return "Consistent and commendable effort. A little more practice can push results even higher.";
  if (pct >= 60) return "Good progress. Focusing on weaker subjects will lift the overall score.";
  return "Satisfactory. Steady effort and regular revision will help improve results.";
}

/* ==========================================================================
   Hooks
   ========================================================================== */
function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable — keep working in memory */
    }
  }, [key, value]);

  return [value, setValue];
}

function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ReportCard` : "ReportCard";
  }, [title]);
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

/* ==========================================================================
   Toasts
   ========================================================================== */
const ToastContext = createContext(() => {});
const useToast = () => useContext(ToastContext);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <Icon name={t.type === "error" ? "alert" : "check"} size={18} />
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ==========================================================================
   UI primitives
   ========================================================================== */
const ICONS = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  plus: "M12 5v14M5 12h14",
  info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M12 16v-4M12 8h.01",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
  edit: "M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z",
  trash: "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6",
  print: "M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z",
  arrowLeft: "M19 12H5M12 19l-7-7 7-7",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  check: "M20 6 9 17l-5-5",
  alert: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M12 8v4M12 16h.01",
  trophy: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3",
  chart: "M3 3v18h18M7 15l4-4 3 3 5-6",
  award: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12M8.2 13.9 7 22l5-3 5 3-1.2-8.1",
  sort: "M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  refresh: "M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5",
};

function Icon({ name, size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

function Avatar({ name }) {
  const hue = [...name].reduce((h, c) => h + c.charCodeAt(0), 0) % 360;
  return (
    <span
      className="avatar"
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 65% 55%), hsl(${(hue + 40) % 360} 65% 42%))`,
      }}
    >
      {initials(name)}
    </span>
  );
}

function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <header className="page-header">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="header-actions">{actions}</div>}
    </header>
  );
}

function StatCard({ icon, label, value, meta, text }) {
  return (
    <div className={`stat-card${text ? " stat-card--text" : ""}`}>
      <div className="stat-top">
        <span>{label}</span>
        <div className="stat-icon">
          <Icon name={icon} size={18} />
        </div>
      </div>
      <strong title={typeof value === "string" ? value : undefined}>{value}</strong>
      {meta && <small className="stat-meta">{meta}</small>}
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="bar-track" role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <div className={`bar-fill tone-${tone(value)}`} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

function EmptyState({ icon, title, text, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon name={icon} size={26} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", variant = "danger", onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`modal-icon ${variant}`}>
          <Icon name={variant === "danger" ? "trash" : "alert"} size={22} />
        </div>
        <h3 id="modal-title">{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn outline" onClick={onCancel} autoFocus>
            Cancel
          </button>
          <button className={`btn ${variant === "danger" ? "danger" : ""}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Layout
   ========================================================================== */
function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo" aria-label="ReportCard home">
        Report<span>Card</span>
      </Link>
      <div className="nav-links">
        <NavLink to="/" end><Icon name="home" size={15} />Home</NavLink>
        <NavLink to="/students"><Icon name="users" size={15} />Students</NavLink>
        <NavLink to="/add"><Icon name="plus" size={15} />Add Student</NavLink>
        <NavLink to="/about"><Icon name="info" size={15} />About</NavLink>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} {SCHOOL.name}</span>
      <span>ReportCard · Academic Year {SCHOOL.year}</span>
    </footer>
  );
}

/* ==========================================================================
   Pages
   ========================================================================== */
function Home({ students }) {
  useDocumentTitle("Dashboard");

  const stats = useMemo(() => {
    const n = students.length;
    const avg = n ? students.reduce((s, st) => s + getPercentage(st.marks), 0) / n : 0;
    const passed = students.filter((s) => isPass(s.marks)).length;
    const top = [...students].sort((a, b) => getTotal(b.marks) - getTotal(a.marks)).slice(0, 3);
    const distribution = GRADE_SCALE.map((g) => ({
      ...g,
      count: students.filter((s) => getGrade(getPercentage(s.marks)) === g.grade).length,
    }));
    const subjectAvg = SUBJECTS.map((sub) => ({
      sub,
      avg: n ? students.reduce((s, st) => s + Number(st.marks[sub]), 0) / n : 0,
    }));
    const classes = new Set(students.map((s) => s.className)).size;
    return { n, avg, passed, passRate: n ? (passed / n) * 100 : 0, top, distribution, subjectAvg, classes };
  }, [students]);

  const maxCount = Math.max(1, ...stats.distribution.map((d) => d.count));

  return (
    <div className="page">
      <PageHeader
        eyebrow={`Academic Year ${SCHOOL.year}`}
        title="Dashboard"
        subtitle="Class performance at a glance."
        actions={
          <>
            <Link to="/students" className="btn outline">View Students</Link>
            <Link to="/add" className="btn"><Icon name="plus" />Add Student</Link>
          </>
        }
      />

      {stats.n === 0 ? (
        <EmptyState
          icon="users"
          title="No students yet"
          text="Add your first student to start generating report cards."
          action={<Link to="/add" className="btn"><Icon name="plus" />Add Student</Link>}
        />
      ) : (
        <>
          <div className="stats">
            <StatCard icon="users" label="Total Students" value={stats.n} meta={`${stats.classes} ${stats.classes === 1 ? "class" : "classes"}`} />
            <StatCard icon="chart" label="Class Average" value={`${stats.avg.toFixed(1)}%`} meta={`Overall grade ${getGrade(stats.avg)}`} />
            <StatCard icon="check" label="Passed" value={`${stats.passed}/${stats.n}`} meta={`${stats.passRate.toFixed(0)}% pass rate`} />
            <StatCard icon="trophy" label="Topper" value={stats.top[0].name} meta={`${getPercentage(stats.top[0].marks).toFixed(1)}% · ${stats.top[0].className}`} text />
          </div>

          <div className="grid-2">
            <section className="panel">
              <div className="panel-head">
                <h3>Top Performers</h3>
                <Link to="/students" className="link">View all <Icon name="arrowRight" size={14} /></Link>
              </div>
              <ol className="leaderboard">
                {stats.top.map((s, i) => (
                  <li key={s.id}>
                    <Link to={`/students/${s.id}`} className="leader-item">
                      <span className={`rank-badge rank-${i + 1}`}>{i + 1}</span>
                      <Avatar name={s.name} />
                      <div className="leader-info">
                        <strong>{s.name}</strong>
                        <span>{s.className} · Roll {s.roll}</span>
                      </div>
                      <span className="leader-score">{getPercentage(s.marks).toFixed(1)}%</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>

            <section className="panel">
              <div className="panel-head">
                <h3>Grade Distribution</h3>
              </div>
              <div className="bars">
                {stats.distribution.map((d) => (
                  <div className="bar-row" key={d.grade}>
                    <span><span className={gradeClass(d.grade)}>{d.grade}</span></span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${(d.count / maxCount) * 100}%` }} />
                    </div>
                    <span className="bar-value">{d.count}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="panel">
            <div className="panel-head">
              <h3>Subject Averages</h3>
            </div>
            <div className="bars">
              {stats.subjectAvg.map(({ sub, avg }) => (
                <div className="bar-row" key={sub}>
                  <span className="bar-label">{sub}</span>
                  <ProgressBar value={avg} />
                  <span className="bar-value">{avg.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function SortHeader({ label, field, sort, onSort, className }) {
  const active = sort.key === field;
  return (
    <th className={className} aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}>
      <button type="button" className={`th-sort${active ? " active" : ""}`} onClick={() => onSort(field)}>
        {label}
        <Icon name="sort" size={12} />
      </button>
    </th>
  );
}

function StudentList({ students, onDelete }) {
  useDocumentTitle("Students");
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [sort, setSort] = useState({ key: "roll", dir: "asc" });
  const [pending, setPending] = useState(null);

  const rankMap = useMemo(() => getRankMap(students), [students]);
  const classes = useMemo(() => [...new Set(students.map((s) => s.className))].sort(), [students]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = students.filter(
      (s) =>
        (classFilter === "all" || s.className === classFilter) &&
        (!q || s.name.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q))
    );
    const value = (s) =>
      ({
        rank: rankMap[s.id],
        roll: s.roll,
        name: s.name.toLowerCase(),
        className: s.className,
        total: getTotal(s.marks),
      })[sort.key];

    return [...list].sort((a, b) => {
      const A = value(a);
      const B = value(b);
      const cmp =
        typeof A === "number" && typeof B === "number"
          ? A - B
          : String(A).localeCompare(String(B), undefined, { numeric: true });
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [students, search, classFilter, sort, rankMap]);

  const handleSort = (key) =>
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "total" ? "desc" : "asc" }
    );

  const closeDialog = useCallback(() => setPending(null), []);

  const confirmDelete = () => {
    onDelete(pending.id);
    toast(`${pending.name} was removed`);
    setPending(null);
  };

  const clearFilters = () => {
    setSearch("");
    setClassFilter("all");
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow="Records"
        title="Students"
        subtitle={`${students.length} ${students.length === 1 ? "student" : "students"} enrolled`}
        actions={<Link to="/add" className="btn"><Icon name="plus" />Add Student</Link>}
      />

      {students.length === 0 ? (
        <EmptyState
          icon="users"
          title="No students yet"
          text="Records you add will appear here."
          action={<Link to="/add" className="btn"><Icon name="plus" />Add Student</Link>}
        />
      ) : (
        <>
          <div className="toolbar">
            <input
              className="search"
              type="search"
              placeholder="Search by name or roll no…"
              aria-label="Search students"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="select" aria-label="Filter by class" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
              <option value="all">All classes</option>
              {classes.map((c) => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
            <span className="result-count">
              Showing {rows.length} of {students.length}
            </span>
          </div>

          {rows.length === 0 ? (
            <EmptyState
              icon="users"
              title="No matching students"
              text="Try a different name, roll number or class."
              action={<button className="btn outline" onClick={clearFilters}>Clear filters</button>}
            />
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <SortHeader label="Rank" field="rank" sort={sort} onSort={handleSort} />
                    <SortHeader label="Roll" field="roll" sort={sort} onSort={handleSort} />
                    <SortHeader label="Student" field="name" sort={sort} onSort={handleSort} />
                    <SortHeader label="Class" field="className" sort={sort} onSort={handleSort} />
                    <SortHeader label="Total" field="total" sort={sort} onSort={handleSort} className="num" />
                    <th className="num">%</th>
                    <th>Grade</th>
                    <th>Result</th>
                    <th><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => {
                    const pct = getPercentage(s.marks);
                    const grade = getGrade(pct);
                    const pass = isPass(s.marks);
                    return (
                      <tr key={s.id}>
                        <td><span className={`rank-badge${rankMap[s.id] <= 3 ? ` rank-${rankMap[s.id]}` : ""}`}>{rankMap[s.id]}</span></td>
                        <td>{s.roll}</td>
                        <td>
                          <Link to={`/students/${s.id}`} className="name-cell">
                            <Avatar name={s.name} />
                            <strong>{s.name}</strong>
                          </Link>
                        </td>
                        <td>{s.className}</td>
                        <td className="num">{getTotal(s.marks)}</td>
                        <td className="num">{pct.toFixed(1)}</td>
                        <td><span className={gradeClass(grade)}>{grade}</span></td>
                        <td><span className={`result-badge ${pass ? "pass" : "fail"}`}>{pass ? "Pass" : "Fail"}</span></td>
                        <td>
                          <div className="actions">
                            <Link to={`/students/${s.id}`} className="btn-sm" title="View report"><Icon name="eye" size={14} />View</Link>
                            <Link to={`/students/${s.id}/edit`} className="btn-sm ghost" title="Edit"><Icon name="edit" size={14} /><span className="sr-only">Edit {s.name}</span></Link>
                            <button className="btn-sm danger" onClick={() => setPending(s)} title="Delete"><Icon name="trash" size={14} /><span className="sr-only">Delete {s.name}</span></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!pending}
        title="Delete student?"
        message={pending ? `${pending.name}'s record and report card will be permanently removed.` : ""}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={closeDialog}
      />
    </div>
  );
}

function ReportCard({ students }) {
  const { id } = useParams();
  const student = students.find((s) => s.id === Number(id));
  const rankMap = useMemo(() => getRankMap(students), [students]);
  useDocumentTitle(student ? `${student.name} · Report` : "Student not found");

  if (!student) return <StudentMissing />;

  const total = getTotal(student.marks);
  const pct = getPercentage(student.marks);
  const pass = isPass(student.marks);
  const overall = getGrade(pct);
  const entries = SUBJECTS.map((sub) => ({ sub, mark: Number(student.marks[sub]) }));
  const best = entries.reduce((a, b) => (b.mark > a.mark ? b : a));
  const weakest = entries.reduce((a, b) => (b.mark < a.mark ? b : a));
  const issued = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="page">
      <article className="report-card">
        <div className="report-header">
          <div className="school-mark"><Icon name="book" size={24} /></div>
          <h2>{SCHOOL.name}</h2>
          <p>{SCHOOL.tagline}</p>
          <span className="report-title">Progress Report · {SCHOOL.year}</span>
        </div>

        <div className="student-info">
          <div className="info-item"><span>Student Name</span><strong>{student.name}</strong></div>
          <div className="info-item"><span>Roll No</span><strong>{student.roll}</strong></div>
          <div className="info-item"><span>Class</span><strong>{student.className}</strong></div>
          <div className="info-item"><span>Rank</span><strong>{rankMap[student.id]} of {students.length}</strong></div>
          <div className="info-item"><span>Date Issued</span><strong>{issued}</strong></div>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Subject</th>
                <th className="num">Max</th>
                <th className="num">Obtained</th>
                <th className="col-bar">Performance</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(({ sub, mark }) => {
                const g = getGrade(mark);
                return (
                  <tr key={sub}>
                    <td><strong className="subject">{sub}</strong></td>
                    <td className="num">{MAX_MARKS}</td>
                    <td className={`num${mark < PASS_MARK ? " fail-text" : ""}`}>{mark}</td>
                    <td className="col-bar"><ProgressBar value={mark} /></td>
                    <td><span className={gradeClass(g)}>{g}</span></td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td className="num">{SUBJECTS.length * MAX_MARKS}</td>
                <td className="num">{total}</td>
                <td className="col-bar"><ProgressBar value={pct} /></td>
                <td><span className={gradeClass(overall)}>{overall}</span></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="summary">
          <div className="summary-tile"><span>Total</span><strong>{total}/{SUBJECTS.length * MAX_MARKS}</strong></div>
          <div className="summary-tile"><span>Percentage</span><strong>{pct.toFixed(2)}%</strong></div>
          <div className="summary-tile"><span>Overall Grade</span><strong>{overall}</strong></div>
          <div className={`summary-tile result ${pass ? "is-pass" : "is-fail"}`}>
            <span>Result</span>
            <strong className={pass ? "pass" : "fail"}>{pass ? "PASS" : "FAIL"}</strong>
          </div>
        </div>

        <div className="remarks">
          <h4>Teacher's Remarks</h4>
          <p>{getRemark(pct, pass)}</p>
          <div className="remarks-meta">
            <span>Strongest subject: <strong>{best.sub} ({best.mark})</strong></span>
            <span>Needs focus: <strong>{weakest.sub} ({weakest.mark})</strong></span>
          </div>
        </div>

        <div className="signatures">
          <div className="sig">Class Teacher</div>
          <div className="sig">Principal</div>
          <div className="sig">Parent / Guardian</div>
        </div>

        <div className="report-actions">
          <Link to="/students" className="btn outline"><Icon name="arrowLeft" />Back</Link>
          <Link to={`/students/${student.id}/edit`} className="btn outline"><Icon name="edit" />Edit</Link>
          <button className="btn" onClick={() => window.print()}><Icon name="print" />Print Report</button>
        </div>
      </article>
    </div>
  );
}

function StudentMissing() {
  return (
    <div className="page">
      <EmptyState
        icon="alert"
        title="Student not found"
        text="This record may have been deleted or the link is incorrect."
        action={<Link to="/students" className="btn"><Icon name="arrowLeft" />Back to Students</Link>}
      />
    </div>
  );
}

/* ---------- Add / Edit form ---------- */
const emptyForm = () => ({
  name: "",
  roll: "",
  className: "",
  marks: Object.fromEntries(SUBJECTS.map((s) => [s, ""])),
});

const validMark = (raw) => {
  if (raw === "" || raw === null) return false;
  const m = Number(raw);
  return !Number.isNaN(m) && m >= 0 && m <= MAX_MARKS;
};

function Field({ label, error, children }) {
  return (
    <label className={error ? "has-error" : ""}>
      {label}
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

function StudentForm({ initial, students, editingId, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState(() =>
    initial
      ? { ...initial, marks: Object.fromEntries(SUBJECTS.map((s) => [s, String(initial.marks[s] ?? "")])) }
      : emptyForm()
  );
  const [errors, setErrors] = useState({});

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const setMark = (sub, value) => {
    setForm((f) => ({ ...f, marks: { ...f.marks, [sub]: value } }));
    setErrors((e) => ({ ...e, [`mark-${sub}`]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.roll.trim()) e.roll = "Roll number is required";
    if (!form.className.trim()) e.className = "Class is required";

    const norm = (v) => v.trim().toLowerCase();
    const duplicate = students.some(
      (s) => s.id !== editingId && norm(s.roll) === norm(form.roll) && norm(s.className) === norm(form.className)
    );
    if (!e.roll && !e.className && duplicate) e.roll = `Roll ${form.roll.trim()} already exists in ${form.className.trim()}`;

    SUBJECTS.forEach((sub) => {
      if (!validMark(form.marks[sub])) e[`mark-${sub}`] = `Enter 0–${MAX_MARKS}`;
    });
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    onSubmit({
      name: form.name.trim(),
      roll: form.roll.trim(),
      className: form.className.trim().toUpperCase(),
      marks: Object.fromEntries(SUBJECTS.map((s) => [s, Number(form.marks[s])])),
    });
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const allValid = SUBJECTS.every((s) => validMark(form.marks[s]));
  const previewMarks = allValid ? Object.fromEntries(SUBJECTS.map((s) => [s, Number(form.marks[s])])) : null;

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h3 className="form-title">Student Details</h3>
      <div className="form-row">
        <Field label="Full Name" error={errors.name}>
          <input value={form.name} placeholder="e.g. Ananya Rao" aria-invalid={!!errors.name} onChange={(e) => setField("name", e.target.value)} />
        </Field>
        <Field label="Roll No" error={errors.roll}>
          <input value={form.roll} placeholder="e.g. 104" aria-invalid={!!errors.roll} onChange={(e) => setField("roll", e.target.value)} />
        </Field>
        <Field label="Class" error={errors.className}>
          <input value={form.className} placeholder="e.g. 10-A" aria-invalid={!!errors.className} onChange={(e) => setField("className", e.target.value)} />
        </Field>
      </div>

      <h3 className="form-title">Marks <small>(out of {MAX_MARKS})</small></h3>
      <div className="form-row">
        {SUBJECTS.map((sub) => (
          <Field key={sub} label={sub} error={errors[`mark-${sub}`]}>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max={MAX_MARKS}
              placeholder="0"
              value={form.marks[sub]}
              aria-invalid={!!errors[`mark-${sub}`]}
              onChange={(e) => setMark(sub, e.target.value)}
            />
          </Field>
        ))}
      </div>

      {hasErrors && (
        <p className="error"><Icon name="alert" />Please fix the highlighted fields.</p>
      )}

      <div className="form-footer">
        <div className="preview">
          {previewMarks ? (
            <>
              <span>Total <strong>{getTotal(previewMarks)}</strong></span>
              <span>Percentage <strong>{getPercentage(previewMarks).toFixed(1)}%</strong></span>
              <span>Grade <span className={gradeClass(getGrade(getPercentage(previewMarks)))}>{getGrade(getPercentage(previewMarks))}</span></span>
              <span className={`result-badge ${isPass(previewMarks) ? "pass" : "fail"}`}>{isPass(previewMarks) ? "Pass" : "Fail"}</span>
            </>
          ) : (
            <span>Enter all marks to see a live preview.</span>
          )}
        </div>
        <div className="form-actions">
          <button type="button" className="btn outline" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn"><Icon name="check" />{submitLabel}</button>
        </div>
      </div>
    </form>
  );
}

function AddStudent({ students, onAdd }) {
  useDocumentTitle("Add Student");
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <div className="page">
      <PageHeader
        eyebrow="New record"
        title="Add Student"
        subtitle="Enter student details and marks. The report card is generated instantly."
      />
      <StudentForm
        students={students}
        submitLabel="Save & View Report"
        onCancel={() => navigate("/students")}
        onSubmit={(data) => {
          const id = onAdd(data);
          toast(`${data.name} added successfully`);
          navigate(`/students/${id}`);
        }}
      />
    </div>
  );
}

function EditStudent({ students, onUpdate }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const student = students.find((s) => s.id === Number(id));
  useDocumentTitle(student ? `Edit ${student.name}` : "Student not found");

  if (!student) return <StudentMissing />;

  return (
    <div className="page">
      <PageHeader eyebrow="Edit record" title={student.name} subtitle={`Class ${student.className} · Roll ${student.roll}`} />
      <StudentForm
        key={student.id}
        initial={student}
        editingId={student.id}
        students={students}
        submitLabel="Save Changes"
        onCancel={() => navigate(`/students/${student.id}`)}
        onSubmit={(data) => {
          onUpdate(student.id, data);
          toast("Changes saved");
          navigate(`/students/${student.id}`);
        }}
      />
    </div>
  );
}

function About({ onReset }) {
  useDocumentTitle("About");
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  const close = useCallback(() => setConfirming(false), []);

  const features = [
    { icon: "chart", title: "Instant analytics", text: "Class averages, grade distribution and toppers update live." },
    { icon: "award", title: "Print-ready reports", text: "Certificate-style report cards with remarks and signature lines." },
    { icon: "shield", title: "Validated entries", text: "Checks for missing fields, invalid marks and duplicate roll numbers." },
  ];

  return (
    <div className="page">
      <PageHeader eyebrow="Product" title="About ReportCard" />
      <p className="lead">
        A fast, elegant way to record student marks and generate professional progress reports for {SCHOOL.name}.
      </p>

      <div className="feature-grid">
        {features.map((f) => (
          <div className="feature" key={f.title}>
            <div className="stat-icon"><Icon name={f.icon} size={18} /></div>
            <h4>{f.title}</h4>
            <p>{f.text}</p>
          </div>
        ))}
      </div>

      <h3>Grading Scale</h3>
      <div className="table-wrap table-wrap--small">
        <table className="table">
          <thead>
            <tr><th>Marks</th><th>Grade</th><th>Descriptor</th></tr>
          </thead>
          <tbody>
            {GRADE_SCALE.map((g, i) => (
              <tr key={g.grade}>
                <td>{i === 0 ? `${g.min}–100` : i === GRADE_SCALE.length - 1 ? `Below ${GRADE_SCALE[i - 1].min}` : `${g.min}–${GRADE_SCALE[i - 1].min - 1}`}</td>
                <td><span className={gradeClass(g.grade)}>{g.grade}</span></td>
                <td>{g.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="callout">
        <Icon name="info" size={18} />
        <span>A student passes when they score at least <strong>{PASS_MARK}</strong> in every subject.</span>
      </div>

      <section className="panel data-panel">
        <div>
          <h4>Your data</h4>
          <p>Records are saved in this browser. Resetting restores the sample students.</p>
        </div>
        <button className="btn outline" onClick={() => setConfirming(true)}><Icon name="refresh" />Reset demo data</button>
      </section>

      <ConfirmDialog
        open={confirming}
        variant="warning"
        title="Reset all data?"
        message="All students you've added or edited will be replaced with the sample data."
        confirmLabel="Reset"
        onCancel={close}
        onConfirm={() => {
          onReset();
          setConfirming(false);
          toast("Data reset to sample students");
        }}
      />
    </div>
  );
}

function NotFound() {
  useDocumentTitle("Page not found");
  return (
    <div className="page center not-found">
      <div className="big-404">404</div>
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn"><Icon name="home" />Go Home</Link>
    </div>
  );
}

/* ==========================================================================
   App
   ========================================================================== */
export default function App() {
  const [students, setStudents] = usePersistentState(STORAGE_KEY, initialStudents);

  const addStudent = (student) => {
    const id = Date.now();
    setStudents((prev) => [...prev, { ...student, id }]);
    return id;
  };

  const updateStudent = (id, data) =>
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));

  const deleteStudent = (id) => setStudents((prev) => prev.filter((s) => s.id !== id));

  const resetData = () => setStudents(initialStudents);

  return (
    <ToastProvider>
      <div className="app">
        <ScrollToTop />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home students={students} />} />
            <Route path="/students" element={<StudentList students={students} onDelete={deleteStudent} />} />
            <Route path="/students/:id" element={<ReportCard students={students} />} />
            <Route path="/students/:id/edit" element={<EditStudent students={students} onUpdate={updateStudent} />} />
            <Route path="/add" element={<AddStudent students={students} onAdd={addStudent} />} />
            <Route path="/about" element={<About onReset={resetData} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
