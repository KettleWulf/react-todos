import { useState, useEffect } from "react";
import { Todo } from "./types/todo-type";
import initialTodos from "./data/todos";
import "./App.css";

function App() {
	const [formInput, setFormInput] = useState("")
	const [showForm, setShowForm] = useState(false);
	const [todos, setTodos] = useState<Todo[]>(() => {
		const saved = localStorage.getItem("todos");
		return saved ? JSON.parse(saved) : initialTodos;
	});

	useEffect(() => {
		const saved = localStorage.getItem("todos");
		if (saved) {
			setTodos(JSON.parse(saved));
		}
	}, []);
	
	useEffect(() => {
		localStorage.setItem("todos", JSON.stringify(todos));
	},	[todos]);


	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const newTodo: Todo = {
			id: todos.reduce((max, todo) => todo.id > max ? todo.id : max, 0) + 1,
			title: formInput,
			completed: false,
		}

		setTodos([...todos, newTodo]);
		setFormInput("");
	}

	const toggleTodoCompleted = (toggleTodo: Todo) => {

		  setTodos(todos.map(todo =>
			todo.id === toggleTodo.id
			  ? { ...todo, completed: !todo.completed }
			  : todo
		  ));
	}


	return (
		<div className="container">
			<div className="topContainer">
				<h1>Todos</h1>
				<p className="mt-3">{todos.reduce((total, todo) => todo.completed ? total + 1 : total, 0)} of {todos.length} completed!</p>
			</div>

			<hr />

			{!showForm && (
				<button 
					className="btn btn-success"
					onClick={() => setShowForm(true)}
				>
				Add New Todo
				</button>
			)}

			{showForm && (
				<form onSubmit={handleFormSubmit} className="mb-3">
					<div className="input-group">
						<input
							aria-label="Todo title"
							className="form-control"
							placeholder="Name your todo and submit"
							type="text"
							required
							onChange={(e) => {setFormInput(e.target.value)}}
							value={formInput}
							autoFocus
						/>
						<button
							className="btn btn-success"
							type="submit"
						>
							Submit
						</button>
					</div>

				</form>
			)}

			<hr />
			
			{todos.length > 0 ? (
				<div className="listContainer">

					<div className="ms-4">
						<h2>Things to do</h2>
						<ul className=" list-group list-group-flush">
							{todos
								.filter(todo => !todo.completed)
								.map(todo => 
								<li 
									className="uncompletedTodos list-group-item"
									key={todo.id}
									onClick={() => {toggleTodoCompleted(todo)}}>
									❗ {todo.title}
								</li>
							)}
						</ul>
					</div>

					<div className="me-4">
						<h2>Things I've done</h2>
						<ul className="list-group list-group-flush">
							{todos
								.filter(todo => todo.completed)
								.map(todo => 
								<li
									className="completedTodos list-group-item"
									key={todo.id}
									onClick={() => {setTodos(todos.filter(keepTodo => keepTodo.id !== todo.id))}}>
									✔️ {todo.title}
								</li>
							)}
						</ul>
					</div>	

				</div>
			) : (
				<p className="alert alert-warning">You think you got nothing todo? Really?</p>
			)}
			
				
			

		</div>
	);
}

export default App;
