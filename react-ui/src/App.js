import React, {useState} from 'react';
import './App.css';

function App() {
  const [lineInput, setLineInput] = useState("");
  const [messages, setMessages] = useState([]);

  const onLineInputChange = (e) => {
    setLineInput(e.target.value);
  }

  const onLineInputSubmit = (e) => {
    e.preventDefault();
    setMessages([lineInput, ...messages]);
  }

  return (
    <div className="app">
      <header>
      </header>
      <form onSubmit={onLineInputSubmit}>
        <label for="line-input">Line: </label>
        <input id="line-input" value={lineInput} onChange={onLineInputChange} />
      </form>
      <section id="messages">
        {messages.map((message) => {
          return <p>{message}</p>;
        })}
      </section>
    </div>
  );
}

export default App;
