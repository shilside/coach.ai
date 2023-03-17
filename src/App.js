//create a react component that inputs a text area message then performs a fetch request to localhost:3001 and gets back a response as a data.message and displays that message in a box below
import React, { useState, useRef, useEffect } from "react";
import "./normal.css";
import "./App.css";

function App() {
  //add state for input and chatlog
  const [input, setInput] = useState("");
  const [chatlog, setLog] = useState([]);

  const chatlogRef = useRef(null);

  useEffect(() => {
    chatlogRef.current.scrollTop = chatlogRef.current.scrollHeight;
  }, [chatlog]);

  const [showDropdown, setShowDropdown] = useState(false);

  function handleDropdownClick() {
    setShowDropdown(!showDropdown);
  }
  //add a clear chatlog
  function clearChat() {
    setLog([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let newLog = [...chatlog, { role: "user", message: `${input}` }];
    if (chatlog.length === 0) {
      newLog = [...newLog];
    }
    setInput("");
    setLog(newLog);

    // // fetch response to the api combining the chat log array of messages and sending it as a message to localhost:3001 as a post method

    const messages = newLog.map((message) => message.message).join("\n");

    const newResponse = await fetch("http://localhost:3001", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messages,
      }),
    });
    const data = await newResponse.json();
    console.log(data);
    setLog([...newLog, { role: "assistant", message: `${data.message}` }]);
    const mylog = document.querySelector(".chat-log");
    mylog.scrollTop = mylog.scrollHeight;
  }

  return (
    <div className="App">
      <aside className="sidemenu">
        <h2>Coaches</h2>
        <div className="dropdown">
          Choose a Coach
          <span className="dropicon" onClick={handleDropdownClick}>
            <select id="coach-selector">
              <option value="pep">Pep Guardiola</option>
              <option value="arteta">Mikel Arteta</option>
              <option value="mourinho">Jose Mourinho</option>
              <option value="zidane">Zinedine Zidane</option>
            </select>
            {/* <i class="fa-regular fa-square-caret-down"></i> */}
          </span>
        </div>
      </aside>
      <section className="chatbox">
        <h1>Coach AI</h1>
        <div className="chat-log" ref={chatlogRef}>
          <WelcomeMessage />
          {chatlog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              rows={1}
              className="chat-input-textarea"
              value={input}
              placeholder="Ask for any Football/Soccer tips"
              onChange={(e) => setInput(e.target.value)}
            ></input>
          </form>
        </div>
      </section>
    </div>
  );
}

const ChatMessage = ({ message }) => {
  return (
    <div
      className={`chat-message ${message.role === "assistant" && "chatGPT"}`}
    >
      <div className="chat-message-center">
        <div
          className={`avatar ${message.role === "assistant" && "chatGPT"}`}
        ></div>
        <div className="message">
          {/* display message from textarea to chatbox */}
          <p>{message.message}</p>
        </div>
      </div>
    </div>
  );
};

const WelcomeMessage = () => {
  return (
    <div className="chat-message chatGPT">
      <div className="chat-message-center">
        <div className="avatar chatGPT"></div>
        <div className="message">
          <p>Hey it's Pep Guardiola, how can I assist you today?</p>
        </div>
      </div>
    </div>
  );
};

export default App;
