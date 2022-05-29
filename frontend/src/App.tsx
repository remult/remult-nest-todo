import { useEffect, useState } from "react";
import { remult, setAuthToken } from "./common";
import { Task } from '../../src/shared/Task';
import { TasksController } from '../../src/shared/TasksController';
import { ErrorInfo } from "remult";
import axios from "axios";


const taskRepo = remult.repo(Task);

async function fetchTasks(hideCompleted: boolean) {
  return taskRepo.find({
    limit: 20,
    orderBy: { completed: "asc" },
    where: { completed: hideCompleted ? false : undefined }
  });
}
function App() {
  const [tasks, setTasks] = useState<(Task & { error?: ErrorInfo<Task> })[]>([]);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [username, setUsername] = useState("john");
  const [password, setPassword] = useState("changeme");

  useEffect(() => {
    fetchTasks(hideCompleted).then(setTasks);
  }, [hideCompleted]);

  const addTask = () => {
    setTasks([...tasks, new Task()])
  }

  const setAll = async (completed: boolean) => {
    await TasksController.setAll(completed);
    setTasks(await fetchTasks(hideCompleted));
  }

  const signIn = async () => {
    try {
      setAuthToken(await (await (axios.post<{ access_token: string }>('/auth/login', { username,password }))).data.access_token);
      window.location.reload();
    }
    catch (error: any) {
      alert(error.message);
    }
  }

  const signOut = () => {
    setAuthToken(null);
    window.location.reload();
  }

  if (!remult.authenticated())
    return (<div>
      <p>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type="password" />
        <button onClick={signIn}>Sign in</button>
      </p>
    </div>);

  return (
    <div>
      <p>
        Hi {remult.user.name} <button onClick={signOut}>Sign out</button>
      </p>
      <div>
        <button onClick={() => setAll(true)}>Set all as completed</button>
        <button onClick={() => setAll(false)}>Set all as uncompleted</button>
      </div>
      <input
        type="checkbox"
        checked={hideCompleted}
        onChange={e => setHideCompleted(e.target.checked)} /> Hide Completed
      <hr />
      {tasks.map(task => {
        const handleChange = (values: Partial<Task>) => {
          setTasks(tasks.map(t => t === task ? { ...task, ...values } : t));
        };

        const saveTask = async () => {
          try {
            const savedTask = await taskRepo.save(task);
            setTasks(tasks.map(t => t === task ? savedTask : t));
          } catch (error: any) {
            alert(error.message);
            setTasks(tasks.map(t => t === task ? { ...task, error } : t));
          }
        }

        const deleteTask = async () => {
          await taskRepo.delete(task);
          setTasks(tasks.filter(t => t !== task));
        };

        return (
          <div key={task.id}>
            <input type="checkbox"
              checked={task.completed}
              onChange={e => handleChange({ completed: e.target.checked })} />
            <input
              value={task.title}
              onChange={e => handleChange({ title: e.target.value })} />
            {task.error?.modelState?.title}
            <button onClick={saveTask}>Save</button>
            <button onClick={deleteTask}>Delete</button>
          </div>
        );
      })}
      <button onClick={addTask}>Add Task</button>
    </div>
  );
}
export default App;