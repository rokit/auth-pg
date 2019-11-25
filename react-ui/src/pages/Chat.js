import React, { useState } from "react";

function Chat() {
  const [lineInput, setLineInput] = useState("");
  const [messages, setMessages] = useState([]);

  const onLineInputChange = e => {
    setLineInput(e.target.value);
  };

  const onLineInputSubmit = e => {
    e.preventDefault();
    setMessages([lineInput, ...messages]);
  };

  return (
    <>
      <form onSubmit={onLineInputSubmit}>
        <label htmlFor="line-input">Line: </label>
        <input id="line-input" value={lineInput} onChange={onLineInputChange} />
      </form>
      <section id="messages">
        {messages.map(message => {
          return <p>{message}</p>;
        })}
      </section>
    </>
  );
}

export default Chat;