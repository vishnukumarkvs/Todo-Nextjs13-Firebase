"use client";
import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { GoSignOut } from "react-icons/go";
import { useRouter } from "next/navigation";
import { getFirestore } from "firebase/firestore";
import { app } from "../../firebase/firebase";
import { auth } from "../../firebase/auth";

import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

const arr = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];

import { signOutUser } from "../../firebase/auth";

const db = getFirestore(app);

const TodoHome = () => {
  const [todoInput, setTodoInput] = useState("");
  const [todos, setTodos] = useState([]);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getTodos = async () => {
    console.log("entered");
    if (!user) {
      return; // user is null or undefined, so exit early
    }
    const q = query(collection(db, "todos"), where("owner", "==", user.uid));
    let data = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      data.push({ ...doc.data(), id: doc.id });
    });
    setTodos(data);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, so set the user state variable
        setUser(user);
        setLoading(false);
        getTodos();
      } else {
        // No user is signed in, so clear the user state variable
        router.push("/login");
        setUser(null);
      }
    });

    if (user) {
      getTodos();
    }

    return () => unsubscribe(); // unsubscribe from the listener when the component unmounts
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOutUser(auth);
      setUser(null); // clear the user state variable
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const addTodo = async () => {
    try {
      const docRef = await addDoc(collection(db, "todos"), {
        owner: user.uid,
        content: todoInput,
        completed: false,
      });
      console.log("Document written with ID: ", docRef.id);
      await getTodos();
      setTodoInput("");
      console.log("todos", todos);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", id));
      await getTodos();
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const markAsCompleted = async (event, id) => {
    try {
      await updateDoc(doc(db, "todos", id), {
        completed: event.target.checked,
      });
      await getTodos();
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const onKeyUp = (event) => {
    if (event.key === "Enter") {
      if (todoInput.trim() !== "") {
        addTodo();
      }
    }
  };

  return (
    <div>
      <div className="mt-4 p-5 rounded-lg bg-white/[0.5] text-black active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed top-5 right-5 cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 hover:shadow-md border-2 border-black">
        <span>
          Welcome{" "}
          <span className="text-[#322d85] font-semibold">
            {user.displayName}{" "}
          </span>
          !!
        </span>
      </div>
      <div
        onClick={handleSignOut}
        className="w-44 py-4 mt-10 rounded-lg bg-black/[0.8] text-white active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 right-5 cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 hover:shadow-md"
      >
        <GoSignOut size={18} />
        <span>Logout</span>
      </div>
      <div className="max-w-3xl mx-auto mt-10 p-8">
        <div className="bg-white -m-6 p-3 sticky top-0">
          <div className="flex justify-center flex-col items-center">
            <span className="text-7xl mb-10">📝</span>
            <h1 className="text-5xl md:text-7xl font-bold">ToooDooo's</h1>
          </div>
          <div className="flex items-center gap-2 mt-10">
            <input
              placeholder={`👋 What's your tasks today?`}
              type="text"
              className="font-semibold placeholder:text-gray-500 border-[2px] border-black h-[60px] grow shadow-sm rounded-md px-4 focus-visible:outline-yellow-400 text-lg transition-all duration-300"
              autoFocus
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onKeyUp={onKeyUp}
            />
            <button
              onClick={() => {
                if (todoInput.trim() !== "") {
                  addTodo();
                }
              }}
              className="w-[60px] h-[60px] rounded-md bg-black flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-black/[0.8]"
            >
              <AiOutlinePlus size={30} color="#fff" />
            </button>
          </div>
        </div>
        <div className="my-10">
          {todos.length > 0 &&
            todos.map((todo, index) => (
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <input
                    id={`todo-${todos.id}`}
                    type="checkbox"
                    className="w-4 h-4 accent-green-400 rounded-lg"
                    checked={todo.completed}
                    onChange={(event) => markAsCompleted(event, todo.id)}
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`font-medium ${
                      todo.completed ? "line-through" : ""
                    }`}
                  >
                    {todo.content}
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <MdDeleteForever
                    size={24}
                    className="text-red-400 hover:text-red-600 cursor-pointer"
                    onClick={() => deleteTodo(todo.id)}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TodoHome;
