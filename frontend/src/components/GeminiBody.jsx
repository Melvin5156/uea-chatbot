"use client"
import React, { useContext, useState } from "react";
import {
  Compass,
  Lightbulb,
  Youtube,
  Code,
  SendHorizontal,
  Mic,
  Star,
} from "lucide-react";
import { Context } from "@/context/ContextProvider";
import crypto from "crypto"; // For hashing

const GeminiBody = () => {
  const {
    submit,
    displayResult,
    input,
    setInput,
    chatHistory,
  } = useContext(Context);

  const [isRecording, setIsRecording] = useState(false);
  const [rating, setRating] = useState(null);
  const [showRating, setShowRating] = useState(false);

  const handleClick = (query) => {
    submit(query);
    setInput(""); // Clear the input field
  };

  const initializeSpeechRecognition = () => {
    const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognitionInstance = new recognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = "en-US";

    recognitionInstance.onstart = () => {
      setIsRecording(true);
    };

    recognitionInstance.onend = () => {
      setIsRecording(false);
    };

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      submit(transcript);
    };

    recognitionInstance.start();
  };

  const handleRating = (stars) => {
    setRating(stars);
    setShowRating(false);
    const hash = crypto.createHash('sha256').update(JSON.stringify(chatHistory)).digest('hex');
    
    // For demonstration purposes, we will just log the hash and rating
    console.log({ hash, rating });
  };

  return (
    <div className="flex-1 min-h-[100vh] pb-[15vh] relative bg-gray-100">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-gray-100 z-50">
        <div className="flex items-center justify-between p-5 text-xl text-gray-600">
          <a href="#" onClick={() => window.location.reload()} className="flex items-center">
            <img src="./uea-png-white.png" alt="University of East Anglia" className="w-52 h-auto object-contain" />
          </a>
        </div>
      </div>

      <div className="max-w-[900px] m-auto flex flex-col h-full relative mt-24">
        <div className="flex-1 overflow-y-auto">
          {!displayResult ? (
            <>
              <div className="my-12 font-medium p-5">
                <p className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-200">
                  Hello,
                </p>
                <p className="text-4xl mt-2.5 text-gray-500">How may I help you today?</p>
              </div>
              <div className="grid grid-cols-4 gap-5 p-5">
                <div
                  onClick={() => handleClick("What are my options after I graduate from the university?")}
                  className="h-48 p-4 bg-gray-200 rounded-xl relative cursor-pointer text-black"
                >
                  <p>What are my options after I graduate from the university?</p>
                  <Compass
                    size={35}
                    className="p-1 absolute bottom-2 right-2 bg-gray-300 text-black rounded-full"
                  />
                </div>
                <div
                  onClick={() => handleClick("What are the library hours at UEA?")}
                  className="h-48 p-4 bg-gray-200 rounded-xl relative cursor-pointer text-black"
                >
                  <p>What are the library hours at UEA?</p>
                  <Lightbulb
                    size={35}
                    className="p-1 absolute bottom-2 right-2 bg-gray-300 text-black rounded-full"
                  />
                </div>
                <div
                  onClick={() => handleClick("How do I find friends from the campus?")}
                  className="h-48 p-4 bg-gray-200 rounded-xl relative cursor-pointer text-black"
                >
                  <p>How do I find friends from the campus?</p>
                  <Youtube
                    size={35}
                    className="p-1 absolute bottom-2 right-2 bg-gray-300 text-black rounded-full"
                  />
                </div>
                <div
                  onClick={() => handleClick("Come up with a funny joke I can tell to people at UEA!")}
                  className="h-48 p-4 bg-gray-200 rounded-xl relative cursor-pointer text-black"
                >
                  <p>Come up with a funny joke I can tell to people at UEA!</p>
                  <Code
                    size={35}
                    className="p-1 absolute bottom-2 right-2 bg-gray-300 text-black rounded-full"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="my-10 flex flex-col gap-3">
              {chatHistory.map((entry, index) => (
                <div key={index} className="flex flex-col gap-3 mb-8">
                  <div className="flex items-center gap-4">
                    <img src="/user.png" alt="User" className="w-9 h-9 object-cover" />
                    <p className="ml-2 text-black">{entry.prompt}</p>
                  </div>
                  <div className="flex items-start gap-4 mt-2">
                    <img src="/uea-bot.png" alt="Bot" className="w-9 h-9 object-cover" />
                    <p
                      className="text-md font-normal leading-6 text-black ml-2"
                      dangerouslySetInnerHTML={{ __html: entry.response }}
                    ></p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {showRating && (
            <div className="fixed bottom-0 w-full max-w-[900px] px-5 m-auto bg-gray-100 py-2.5 rounded-t-lg">
              <div className="flex flex-col items-center">
                <p className="mb-4 text-xl">Rate the Chat</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={30}
                      className={`cursor-pointer ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                      onClick={() => handleRating(star)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="fixed bottom-0 w-full max-w-[900px] px-5 m-auto bg-gray-100 py-2.5 rounded-t-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
              setInput(""); // Clear the input field after submitting
            }}
          >
            <div className="flex items-center justify-between gap-5 bg-gray-200 p-2 rounded-lg">
              <input
                onChange={(e) => setInput(e.target.value)}
                value={input}
                type="text"
                className="flex-1 bg-gray-200 border-none outline-none p-2 text-md text-gray-800 rounded-lg"
                placeholder="Type a message here"
              />
              <div className="flex items-center gap-4">
                <SendHorizontal
                  onClick={input ? () => submit(input) : null}
                  size={20}
                  className={`cursor-pointer text-black ${!input ? "opacity-50 cursor-not-allowed" : ""}`}
                />
                <Mic
                  onClick={() => {
                    if (!isRecording) {
                      initializeSpeechRecognition();
                    }
                  }}
                  size={20}
                  className={`cursor-pointer ${isRecording ? 'text-red-500' : 'text-black'}`}
                />
              </div>
            </div>
            <p className="text-gray-600 text-sm text-center p-3">
              UEA bot may display inaccurate info. Please crosscheck to verify.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GeminiBody;
