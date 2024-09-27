"use client";
import React, { createContext, useState } from "react";
import runChat from "@/lib/gemini";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [recentPrompts, setRecentPrompts] = useState("");
  const [displayResult, setDisplayResult] = useState(false);

  // on submit
  const submit = async (prompt) => {
    setLoading(true);
    setDisplayResult(true);
    setRecentPrompts(prompt);
  
    // Update chat history with user input
    const newChatEntry = { prompt, response: "" };
    setChatHistory((prev) => [...prev, newChatEntry]);
  
    try {
      // Fetch the response from your FastAPI backend
      const response = await runChat(prompt);
  
      // Start streaming the response after it has fully arrived
      streamResponse(response, newChatEntry); 
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setLoading(false);
      setInput("");
    };
  };
  
  const streamResponse = (response, chatEntry) => {
    const fullResponse = response;
    let index = 0;
  
    const interval = setInterval(() => {
      if (index < fullResponse.length) {
        chatEntry.response += fullResponse[index]; // Append character by character
        setChatHistory((prev) => {
          const updatedChat = [...prev];
          updatedChat[updatedChat.length - 1] = chatEntry; // Update the last entry with new response
          return updatedChat;
        });
        index++;
      } else {
        clearInterval(interval); // Stop streaming when done
      }
    }, 0); // Adjust the interval time for speed (50 ms = 20 characters per second)
  };

  // Light and dark mode
  const toggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const contextValue = {
    theme,
    toggle,
    submit,
    setInput,
    input,
    chatHistory,
    loading,
    displayResult,
    recentPrompts,
    setRecentPrompts,
    setDisplayResult,
  };

  return (
    <Context.Provider value={contextValue}>
      <style jsx global>{`
        a {
          color: blue; /* Normal link color */
          text-decoration: underline; /* Underline links */
        }
        a:visited {
          color: purple; /* Color for visited links */
        }
        a:hover {
          color: darkblue; /* Color for links on hover */
        }
      `}</style>
      <div className={theme}>{children}</div>
    </Context.Provider>
  );
};

export default ContextProvider;
