import React, { useState } from "react";
import "./SignupForm.css";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onChange = e => {
    let inputName = e.target.name;
    let value = e.target.value;
    switch (inputName) {
      case "email":
        setEmail(value);
        break;
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    let data = {
      email,
      username,
      pw: password,
    };
    let res = await fetch(`/story/add-user`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!res) return;

    let res_json = await res.json();
    if (!res_json) return;
    console.log('res_json', res_json);
  };

  return (
    <form className="signup-form" onSubmit={onSubmit}>
      <div>
        <label>Email:</label>
        <input type="text" name="email" value={email} onChange={onChange} />
      </div>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={onChange}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
        />
      </div>
      <div>
        <input type="submit" value="Submit" />
      </div>
    </form>
  );
}

export default SignupForm;
