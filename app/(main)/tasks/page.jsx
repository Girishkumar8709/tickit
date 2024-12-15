"use client";

import {
  addTodoToDatabase,
  deleteTodoFromDatabase,
  fetchTodosFromDatabase,
  updateTodoInDatabase,
} from "@/actions/todoService";

import { useEffect, useState } from "react";

export default function TodoList() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isUpdatedMode, setIsUpdatedMode] = useState(false);

  // Fetch todos from the database
  const fetchTodos = async () => {
    try {
      const todos = await fetchTodosFromDatabase();
      setTodos(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      alert("Failed to fetch todos. Please try again later.");
    }
  };

  // Fetch todos when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  // Handle form submission (Add/Update Todo)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isUpdatedMode && selectedTodo) {
        const updatedTodo = { title, details, dueDate: new Date(dueDate) };
        const updated = await updateTodoInDatabase(selectedTodo.id, updatedTodo);
        if (updated) {
          resetForm();
          alert("Todo updated successfully!");
        } else {
          alert("Failed to update Todo.");
        }
      } else {
        const added = await addTodoToDatabase(title, details, new Date(dueDate));
        if (added) {
          resetForm();
          alert("Todo added successfully!");
        } else {
          alert("Failed to add Todo.");
        }
      }
      fetchTodos();
    } catch (error) {
      console.error("Error handling Todo submit:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Reset form fields and state
  const resetForm = () => {
    setTitle("");
    setDetails("");
    setDueDate("");
    setSelectedTodo(null);
    setIsUpdatedMode(false);
  };

  // Handle updating Todo details
  const handleUpdateClick = (todo) => {
    setTitle(todo.title || "");
    setDetails(todo.details || "");
    setDueDate(todo.dueDate || "");
    setSelectedTodo(todo);
    setIsUpdatedMode(true);
  };

  // Handle deleting a Todo
  const handleDeleteClick = async (todoId) => {
    try {
      const deletedId = await deleteTodoFromDatabase(todoId);
      if (deletedId) {
        fetchTodos();
        alert("Todo deleted successfully!");
      } else {
        alert("Failed to delete Todo.");
      }
    } catch (error) {
      console.error("Error deleting Todo:", error);
      alert("An error occurred while deleting the Todo.");
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center flex-col  lg:flex-row min-h-screen small-h-screen">
      {/* Left Section */}
      
      <section className="flex-1 flex md:flex-col items-center md:justify-start mx-auto">
        <div className="p-6 md:p-12 mt-10 rounded-lg shadow-xl w-full max-w-lg bg-white">
          <h2 className="text-center text-2xl font-bold leading-9 text-gray-900">
            {isUpdatedMode ? "Update your Todo" : "Create a Todo"}
          </h2>
          <form onSubmit={handleSubmit} className="mt-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Details"
              className="w-full p-2 mb-4 border rounded"
              required
            ></textarea>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isUpdatedMode ? "Update Todo" : "Add Todo"}
            </button>
          </form>
        </div>
      </section>

      {/* Right Section */}
      <section className="flex-1 flex flex-col items-center justify-start mx-auto mt-6">
        <div className="p-6 md:p-12 mt-10 rounded-lg shadow-xl w-full max-w-lg bg-white">
          <h2 className="text-xl font-semibold mb-4">Todo List</h2>
          <ul className="w-full max-w-lg">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="p-4 mb-4 bg-gray-100 rounded shadow flex justify-between"
              >
                <div>
                  <h4 className="font-bold">{todo.title}</h4>
                  <p>{todo.details}</p>
                  <small>Due: {new Date(todo.dueDate).toLocaleDateString()}</small>
                </div>
                <div className="mt-4 space-x-6">
                  <button
                    onClick={() => handleUpdateClick(todo)}
                    className="px-3 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(todo.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
