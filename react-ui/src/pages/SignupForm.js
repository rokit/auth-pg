import React, { useState, useEffect } from "react";
import "./SignupForm.css";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: ""
  });

  useEffect(() => {
    if (!window.gapi) return;
    window.gapi.signin2.render("g-signin2", {
      scope: "https://www.googleapis.com/auth/plus.login",
      width: 200,
      height: 50,
      longtitle: true,
      theme: "dark",
      onsuccess: onGoogleSignIn
    });
  }, []);

  const onGoogleSignIn = async googleUser => {
    console.log("googleUser", googleUser);
    let id_token = googleUser.getAuthResponse().id_token;
    let res = await fetch(`/auth/google`, {
      method: "POST",
      body: JSON.stringify({ id_token }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    let json = await res.json();
    console.log("json response", json);
  };

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
      pw: password
    };
    let res = await fetch(`/story/add-user`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!res) return;

    let res_json = await res.json();
    if (!res_json) return;
    console.log("res_json", res_json);
  };

  return (
    <main className="main-sign">
      <div className="content">
        <section id="sign-up">
          <form className="sign-form" onSubmit={onSubmit}>
            <h2>Sign Up with Email</h2>
            <div>
              <input
                type="text"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="email"
              />
              <p className="email-error">{errors.email}</p>
            </div>
            <div>
              <input
                type="text"
                name="username"
                value={username}
                onChange={onChange}
                placeholder="username"
              />
              <p className="username-error">{errors.username}</p>
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="password"
              />
              <p className="password-error">{errors.password}</p>
            </div>
            <div>
              <input type="submit" value="Submit" />
            </div>
          </form>
        </section>

        <section className="or">Or</section>

        <section>
          <h2>Sign Up with Social Media</h2>
          <div id="g-signin2"></div>
        </section>
      </div>
    </main>
  );
}

export default SignupForm;
