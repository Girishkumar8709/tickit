"use server";
import { db } from "@/lib/prisma"; // Correct import for your Prisma client instance

export async function addTodoToDatabase(title, details, dueDate) {
  try {
    // Ensure dueDate is a valid Date
    const validDueDate = new Date(dueDate);

    if (isNaN(validDueDate)) {
      throw new Error("Invalid dueDate format");
    }

    const todo = await db.task.create({
      data: {
        title,
        details: details || null, // Handle optional details
        dueDate: validDueDate, // Ensure proper Date format
      },
    });

    console.log("Todo added with ID:", todo.id);
    return true;
  } catch (error) {
    console.error("Error adding todo:", error);  // Log error details
    return false;
  }
}

export async function fetchTodosFromDatabase() {
  try {
    const todos = await db.task.findMany({
      orderBy: {
        createdAt: "desc", // Sorting by creation date, newest first
      },
    });

    return todos;
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
}

export async function deleteTodoFromDatabase(todoId) {
  try {
    console.log("Attempting to delete todo with ID:", todoId);
    await db.task.delete({
      where: { id: todoId },
    });
    return todoId;
  } catch (error) {
    console.error("Error deleting the todo:", error);
    return null;
  }
}

export async function updateTodoInDatabase(todoId, updatedTodo) {
  try {
    const todo = await db.task.update({
      where: { id: todoId },
      data: updatedTodo,
    });
    console.log("Todo updated successfully!");
    return true;
  } catch (error) {
    console.error("Error updating todo:", error);
    return false;
  }
}
