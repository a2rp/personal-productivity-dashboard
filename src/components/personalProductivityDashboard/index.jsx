import { useEffect, useMemo, useState } from "react";
import { FiArrowUpRight, FiCheck, FiClock, FiPlus, FiTarget } from "react-icons/fi";
import styles from "./styles.module.css";
const key = "productivity-overview-tasks";
const today = () => new Date().toISOString().slice(0, 10);
const seed = [{ id: "t1", title: "Review the project brief", priority: "High", done: false }, { id: "t2", title: "Send the weekly update", priority: "Medium", done: true, doneAt: today() }, { id: "t3", title: "Read for twenty minutes", priority: "Low", done: false }, { id: "t4", title: "Plan tomorrow's first block", priority: "Medium", done: false }];
const load = () => { try { const data = JSON.parse(localStorage.getItem(key)); return Array.isArray(data) ? data : seed; } catch { return seed; } };
const PersonalProductivityDashboard = () => {
    const [tasks, setTasks] = useState(load);
    const [newTask, setNewTask] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [seconds, setSeconds] = useState(25 * 60);
    const [running, setRunning] = useState(false);
    const [sessions, setSessions] = useState(() => Number(localStorage.getItem(key + "-sessions")) || 2);
    const [note, setNote] = useState(() => localStorage.getItem(key + "-note") || "Leave a little room between meetings.");
    useEffect(() => localStorage.setItem(key, JSON.stringify(tasks)), [tasks]);
    useEffect(() => localStorage.setItem(key + "-sessions", String(sessions)), [sessions]);
    useEffect(() => localStorage.setItem(key + "-note", note), [note]);
    useEffect(() => {
        if (!running) return undefined;
        const timer = window.setInterval(() => {
            setSeconds((remaining) => {
                if (remaining <= 1) { setRunning(false); setSessions((count) => count + 1); return 25 * 60; }
                return remaining - 1;
            });
        }, 1000);
        return () => window.clearInterval(timer);
    }, [running]);
    const openTasks = tasks.filter((task) => !task.done);
    const doneCount = tasks.filter((task) => task.done && task.doneAt === today()).length;
    const days = useMemo(() => Array.from({ length: 7 }, (_, index) => { const date = new Date(); date.setHours(12, 0, 0, 0); date.setDate(date.getDate() - 6 + index); const value = date.toISOString().slice(0, 10); return { value, label: date.toLocaleDateString("en", { weekday: "short" }), count: tasks.filter((task) => task.done && task.doneAt === value).length }; }), [tasks]);
    const max = Math.max(1, ...days.map((day) => day.count));
    const addTask = (event) => { event.preventDefault(); if (!newTask.trim()) return; setTasks((items) => [...items, { id: crypto.randomUUID(), title: newTask.trim(), priority, done: false }]); setNewTask(""); };
    const toggle = (task) => setTasks((items) => items.map((item) => item.id === task.id ? { ...item, done: !item.done, doneAt: !item.done ? today() : null } : item));
    const clock = String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0");
    const greeting = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date());
    return <section className={styles.dashboard} id="today">
        <div className={styles.welcome}><div><p className={styles.label}>{greeting}</p><h1>Make space for good work.</h1><p>A practical view of what's next, without the noise.</p></div><span className={styles.dayMark}>TODAY<br /><strong>{new Date().getDate()}</strong></span></div>
        <div className={styles.metricRow}><article><span><FiTarget />Open tasks</span><strong>{openTasks.length.toString().padStart(2, "0")}</strong><small>Ready when you are</small></article><article><span><FiCheck />Done today</span><strong>{doneCount.toString().padStart(2, "0")}</strong><small>Small wins count</small></article><article><span><FiClock />Focus sessions</span><strong>{sessions.toString().padStart(2, "0")}</strong><small>Today on this device</small></article></div>
        <div className={styles.mainGrid}>
            <section className={styles.taskPanel}><header><div><span className={styles.panelIndex}>01 / AGENDA</span><h2>Next up</h2></div><small>{openTasks.length} open</small></header><form onSubmit={addTask}><input value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="Add a task to today" aria-label="New task" required /><select value={priority} onChange={(event) => setPriority(event.target.value)} aria-label="Task priority"><option>High</option><option>Medium</option><option>Low</option></select><button aria-label="Add task"><FiPlus /></button></form><div className={styles.tasks}>{tasks.map((task) => <label className={task.done ? styles.done : ""} key={task.id}><input type="checkbox" checked={task.done} onChange={() => toggle(task)} /><span className={styles.taskText}>{task.title}</span><small className={styles[task.priority.toLowerCase()]}>{task.priority}</small></label>)}</div><a className={styles.seeAll} href="#insights">Look at your week <FiArrowUpRight /></a></section>
            <section className={styles.focusPanel}><header><span className={styles.panelIndex}>02 / FOCUS</span><h2>One thing at a time.</h2></header><p>Take a short sprint on your current priority.</p><div className={styles.timer}>{clock}</div><div className={styles.timerActions}><button onClick={() => setRunning(!running)}>{running ? "Pause focus" : "Start 25 min"}</button><button onClick={() => { setRunning(false); setSeconds(25 * 60); }} aria-label="Reset focus timer">Reset</button></div><small>{running ? "Timer is running" : "A focus session is ready"}</small></section>
        </div>
        <div className={styles.bottomGrid} id="insights"><section className={styles.weekPanel}><header><div><span className={styles.panelIndex}>03 / RHYTHM</span><h2>Completed this week</h2></div><span>Tasks</span></header><div className={styles.chart}>{days.map((day) => <div key={day.value}><span>{day.count}</span><i><b style={{ height: (day.count ? Math.max(12, day.count / max * 100) : 3) + "%" }} /></i><small>{day.label}</small></div>)}</div></section><section className={styles.notePanel}><span className={styles.panelIndex}>A NOTE TO SELF</span><textarea value={note} onChange={(event) => setNote(event.target.value)} aria-label="Personal reminder" placeholder="Leave a reminder for the day..." /><small>Saved locally as you type</small></section></div>
    </section>;
};
export default PersonalProductivityDashboard;
