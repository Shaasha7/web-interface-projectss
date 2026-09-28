import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'nova-todos-v1'
const THEME_KEY = 'nova-theme'

const CATEGORIES = ['Personal', 'Work', 'Shopping', 'Health', 'Ideas']
const PRIORITIES = ['high', 'medium', 'low']
const PRIORITY_RANK = { high: 0, medium: 1, low: 2 }

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

const loadTodos = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return [
    { id: uid(), text: 'Design the landing page hero', done: false, priority: 'high', category: 'Work', due: '', createdAt: Date.now() },
    { id: uid(), text: 'Morning run — 5km', done: true, priority: 'medium', category: 'Health', due: '', createdAt: Date.now() - 1000 },
    { id: uid(), text: 'Buy coffee beans', done: false, priority: 'low', category: 'Shopping', due: '', createdAt: Date.now() - 2000 },
  ]
}

const formatDue = (due) => {
  if (!due) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(due + 'T00:00:00')
  const diff = Math.round((d - today) / 86400000)
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, state: 'overdue' }
  if (diff === 0) return { label: 'Today', state: 'today' }
  if (diff === 1) return { label: 'Tomorrow', state: 'soon' }
  return { label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), state: 'later' }
}

const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function Calendar({ todos, selected, onSelect, onDropTask }) {
  const [cursor, setCursor] = useState(() => {
    const d = selected ? new Date(selected + 'T00:00:00') : new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [hoverDay, setHoverDay] = useState(null)
  const todayISO = toISO(new Date())

  const byDate = useMemo(() => {
    const map = {}
    todos.forEach((t) => {
      if (t.due) (map[t.due] ||= []).push(t)
    })
    return map
  }, [todos])

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const startOffset = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cellCount = Math.ceil((startOffset + daysInMonth) / 7) * 7
  const cells = Array.from({ length: cellCount }, (_, i) => new Date(year, month, i - startOffset + 1))

  const monthTasks = todos.filter((t) => {
    if (!t.due) return false
    const d = new Date(t.due + 'T00:00:00')
    return d.getFullYear() === year && d.getMonth() === month
  })

  const shift = (n) => setCursor(new Date(year, month + n, 1))
  const goToday = () => {
    const now = new Date()
    setCursor(new Date(now.getFullYear(), now.getMonth(), 1))
    onSelect(todayISO, true)
  }

  return (
    <section className="calendar">
      <div className="cal-head">
        <div>
          <h2>{cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2>
          <p>
            {monthTasks.length} task{monthTasks.length !== 1 && 's'} this month ·{' '}
            {monthTasks.filter((t) => t.done).length} done
          </p>
        </div>
        <div className="cal-nav">
          <button onClick={() => shift(-1)} aria-label="Previous month">‹</button>
          <button className="today-btn" onClick={goToday}>Today</button>
          <button onClick={() => shift(1)} aria-label="Next month">›</button>
        </div>
      </div>

      <div className="cal-grid">
        {WEEKDAYS.map((w) => (
          <span key={w} className="cal-weekday">{w}</span>
        ))}
        {cells.map((date) => {
          const iso = toISO(date)
          const tasks = byDate[iso] || []
          const pending = tasks.filter((t) => !t.done)
          const outside = date.getMonth() !== month
          const overdue = iso < todayISO && pending.length > 0
          const allDone = tasks.length > 0 && pending.length === 0
          const cls = [
            'cal-day',
            outside && 'outside',
            iso === todayISO && 'today',
            iso === selected && 'selected',
            overdue && 'overdue',
            allDone && 'all-done',
            hoverDay === iso && 'drop-target',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <button
              key={iso}
              className={cls}
              onClick={() => onSelect(iso)}
              onDragOver={(e) => {
                e.preventDefault()
                setHoverDay(iso)
              }}
              onDragLeave={() => setHoverDay((h) => (h === iso ? null : h))}
              onDrop={(e) => {
                e.preventDefault()
                setHoverDay(null)
                onDropTask(iso)
              }}
              title={tasks.length ? tasks.map((t) => `${t.done ? '✓' : '•'} ${t.text}`).join('\n') : ''}
            >
              <span className="cal-num">{date.getDate()}</span>
              {tasks.length > 0 && (
                <span className="cal-dots">
                  {tasks.slice(0, 3).map((t) => (
                    <i key={t.id} className={`dot ${t.priority} ${t.done ? 'done' : ''}`} />
                  ))}
                  {tasks.length > 3 && <em>+{tasks.length - 3}</em>}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="cal-legend">
        <span><i className="dot high" /> High</span>
        <span><i className="dot medium" /> Medium</span>
        <span><i className="dot low" /> Low</span>
        <span className="hint">Click a day to filter · drag a task onto a day to reschedule</span>
      </div>
    </section>
  )
}

function ProgressRing({ value }) {
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <div className="ring">
      <svg viewBox="0 0 80 80">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c5cff" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r={r} className="ring-track" />
        <circle
          cx="40"
          cy="40"
          r={r}
          className="ring-bar"
          strokeDasharray={c}
          strokeDashoffset={c - (value / 100) * c}
        />
      </svg>
      <span>{value}%</span>
    </div>
  )
}

function TodoItem({ todo, onToggle, onDelete, onUpdate, dragProps, isDragOver }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const [leaving, setLeaving] = useState(false)
  const inputRef = useRef(null)
  const due = formatDue(todo.due)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const save = () => {
    const text = draft.trim()
    if (text) onUpdate(todo.id, { text })
    else setDraft(todo.text)
    setEditing(false)
  }

  const remove = () => {
    setLeaving(true)
    setTimeout(() => onDelete(todo.id), 280)
  }

  return (
    <li
      className={`todo ${todo.done ? 'done' : ''} ${leaving ? 'leaving' : ''} ${isDragOver ? 'drag-over' : ''}`}
      {...dragProps}
    >
      <span className={`priority-bar ${todo.priority}`} />
      <span className="grip" title="Drag to reorder">⋮⋮</span>

      <button
        className={`check ${todo.done ? 'checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.done ? 'Mark as not done' : 'Mark as done'}
      >
        <svg viewBox="0 0 24 24">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </button>

      <div className="todo-body">
        {editing ? (
          <input
            ref={inputRef}
            className="edit-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save()
              if (e.key === 'Escape') {
                setDraft(todo.text)
                setEditing(false)
              }
            }}
          />
        ) : (
          <p className="todo-text" onDoubleClick={() => setEditing(true)} title="Double-click to edit">
            {todo.text}
          </p>
        )}
        <div className="meta">
          <span className="chip category">{todo.category}</span>
          <span className={`chip prio ${todo.priority}`}>{todo.priority}</span>
          {due && <span className={`chip due ${todo.done ? '' : due.state}`}>📅 {due.label}</span>}
        </div>
      </div>

      <div className="actions">
        <button className="icon-btn" onClick={() => setEditing(true)} aria-label="Edit">
          ✎
        </button>
        <button className="icon-btn danger" onClick={remove} aria-label="Delete">
          ✕
        </button>
      </div>
    </li>
  )
}

export default function App() {
  const [todos, setTodos] = useState(loadTodos)
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('Personal')
  const [due, setDue] = useState('')
  const [filter, setFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('manual')
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark')
  const [dragId, setDragId] = useState(null)
  const [overId, setOverId] = useState(null)
  const [toast, setToast] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showCalendar, setShowCalendar] = useState(true)
  const undoRef = useRef(null)

  const selectDate = (iso, force = false) => {
    if (!force && selectedDate === iso) {
      setSelectedDate(null)
      setDue('')
    } else {
      setSelectedDate(iso)
      setDue(iso)
    }
  }

  const clearDate = () => {
    setSelectedDate(null)
    setDue('')
  }

  const dropOnDay = (iso) => {
    if (!dragId) return
    const task = todos.find((t) => t.id === dragId)
    setTodos((p) => p.map((t) => (t.id === dragId ? { ...t, due: iso } : t)))
    setDragId(null)
    setOverId(null)
    if (task)
      showToast(`Moved to ${new Date(iso + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`, () =>
        setTodos((p) => p.map((t) => (t.id === task.id ? { ...t, due: task.due } : t)))
      )
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const showToast = (message, undo) => {
    undoRef.current = undo
    setToast(message)
    clearTimeout(showToast.t)
    showToast.t = setTimeout(() => setToast(null), 4000)
  }

  const addTodo = (e) => {
    e.preventDefault()
    const value = text.trim()
    if (!value) return
    setTodos((prev) => [
      { id: uid(), text: value, done: false, priority, category, due, createdAt: Date.now() },
      ...prev,
    ])
    setText('')
    setDue(selectedDate || '')
  }

  const toggle = (id) => setTodos((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const update = (id, patch) => setTodos((p) => p.map((t) => (t.id === id ? { ...t, ...patch } : t)))

  const remove = (id) => {
    const snapshot = todos
    setTodos((p) => p.filter((t) => t.id !== id))
    showToast('Task deleted', () => setTodos(snapshot))
  }

  const clearCompleted = () => {
    const snapshot = todos
    const count = todos.filter((t) => t.done).length
    if (!count) return
    setTodos((p) => p.filter((t) => !t.done))
    showToast(`Cleared ${count} completed`, () => setTodos(snapshot))
  }

  const toggleAll = () => {
    const allDone = todos.every((t) => t.done)
    setTodos((p) => p.map((t) => ({ ...t, done: !allDone })))
  }

  const stats = useMemo(() => {
    const total = todos.length
    const done = todos.filter((t) => t.done).length
    const overdue = todos.filter((t) => !t.done && formatDue(t.due)?.state === 'overdue').length
    return { total, done, active: total - done, overdue, pct: total ? Math.round((done / total) * 100) : 0 }
  }, [todos])

  const visible = useMemo(() => {
    let list = todos.filter((t) => {
      if (filter === 'active' && t.done) return false
      if (filter === 'completed' && !t.done) return false
      if (catFilter !== 'All' && t.category !== catFilter) return false
      if (selectedDate && t.due !== selectedDate) return false
      if (search && !t.text.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    if (sortBy === 'priority') list = [...list].sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority])
    if (sortBy === 'due')
      list = [...list].sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999'))
    if (sortBy === 'newest') list = [...list].sort((a, b) => b.createdAt - a.createdAt)
    return list
  }, [todos, filter, catFilter, search, sortBy, selectedDate])

  const handleDrop = (targetId) => {
    if (!dragId || dragId === targetId) return
    setTodos((prev) => {
      const list = [...prev]
      const from = list.findIndex((t) => t.id === dragId)
      const to = list.findIndex((t) => t.id === targetId)
      const [moved] = list.splice(from, 1)
      list.splice(to, 0, moved)
      return list
    })
    setSortBy('manual')
  }

  const dragPropsFor = (id) => ({
    draggable: sortBy === 'manual',
    onDragStart: () => setDragId(id),
    onDragOver: (e) => {
      e.preventDefault()
      setOverId(id)
    },
    onDragLeave: () => setOverId((o) => (o === id ? null : o)),
    onDrop: () => {
      handleDrop(id)
      setDragId(null)
      setOverId(null)
    },
    onDragEnd: () => {
      setDragId(null)
      setOverId(null)
    },
  })

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  })()

  return (
    <div className="app">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <main className="shell">
        <header className="header">
          <div>
            <p className="eyebrow">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1>
              {greeting} <span className="wave">👋</span>
            </h1>
            <p className="subtitle">
              You have <strong>{stats.active}</strong> task{stats.active !== 1 && 's'} left
              {stats.overdue > 0 && <span className="overdue-note"> · {stats.overdue} overdue</span>}
            </p>
          </div>
          <div className="header-right">
            <ProgressRing value={stats.pct} />
            <button
              className={`theme-toggle ${showCalendar ? 'on' : ''}`}
              onClick={() => setShowCalendar((s) => !s)}
              aria-label="Toggle calendar"
              title="Toggle calendar"
            >
              📅
            </button>
            <button
              className="theme-toggle"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <section className="stats">
          <div className="stat">
            <span className="stat-num">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-num">{stats.active}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat">
            <span className="stat-num">{stats.done}</span>
            <span className="stat-label">Done</span>
          </div>
          <div className="stat">
            <span className={`stat-num ${stats.overdue ? 'warn' : ''}`}>{stats.overdue}</span>
            <span className="stat-label">Overdue</span>
          </div>
        </section>

        <form className="composer" onSubmit={addTodo}>
          <div className="composer-main">
            <input
              className="composer-input"
              placeholder="What needs to be done?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button className="add-btn" type="submit" disabled={!text.trim()}>
              <span>+</span> Add
            </button>
          </div>
          <div className="composer-opts">
            <div className="prio-picker">
              {PRIORITIES.map((p) => (
                <button
                  type="button"
                  key={p}
                  className={`prio-opt ${p} ${priority === p ? 'active' : ''}`}
                  onClick={() => setPriority(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="select">
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="select date" />
          </div>
        </form>

        {showCalendar && (
          <Calendar todos={todos} selected={selectedDate} onSelect={selectDate} onDropTask={dropOnDay} />
        )}

        {selectedDate && (
          <div className="date-filter">
            <span>
              Showing tasks for{' '}
              <strong>
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </strong>
              <em> · new tasks will be due this day</em>
            </span>
            <button onClick={clearDate}>Clear ✕</button>
          </div>
        )}

        <section className="toolbar">
          <div className="search">
            <span>🔍</span>
            <input placeholder="Search tasks…" value={search} onChange={(e) => setSearch(e.target.value)} />
            {search && (
              <button onClick={() => setSearch('')} aria-label="Clear search">
                ✕
              </button>
            )}
          </div>
          <div className="segmented">
            {['all', 'active', 'completed'].map((f) => (
              <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
        </section>

        <section className="toolbar secondary">
          <div className="cats">
            {['All', ...CATEGORIES].map((c) => (
              <button key={c} className={`cat-pill ${catFilter === c ? 'active' : ''}`} onClick={() => setCatFilter(c)}>
                {c}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select small">
            <option value="manual">Sort: Manual</option>
            <option value="priority">Sort: Priority</option>
            <option value="due">Sort: Due date</option>
            <option value="newest">Sort: Newest</option>
          </select>
        </section>

        <ul className="list">
          {visible.length === 0 ? (
            <li className="empty">
              <div className="empty-icon">✨</div>
              <h3>{todos.length ? 'Nothing matches' : 'All clear!'}</h3>
              <p>{todos.length ? 'Try a different filter or search.' : 'Add your first task above to get started.'}</p>
            </li>
          ) : (
            visible.map((t) => (
              <TodoItem
                key={t.id}
                todo={t}
                onToggle={toggle}
                onDelete={remove}
                onUpdate={update}
                dragProps={dragPropsFor(t.id)}
                isDragOver={overId === t.id && dragId !== t.id}
              />
            ))
          )}
        </ul>

        {todos.length > 0 && (
          <footer className="footer">
            <button onClick={toggleAll}>{todos.every((t) => t.done) ? 'Uncheck all' : 'Complete all'}</button>
            <span>Double-click a task to edit · drag to reorder</span>
            <button onClick={clearCompleted} disabled={!stats.done}>
              Clear completed
            </button>
          </footer>
        )}
      </main>

      {toast && (
        <div className="toast">
          <span>{toast}</span>
          <button
            onClick={() => {
              undoRef.current?.()
              setToast(null)
            }}
          >
            Undo
          </button>
        </div>
      )}
    </div>
  )
}
