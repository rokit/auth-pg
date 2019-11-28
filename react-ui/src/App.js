import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Header from "./components/Header";
import SignupForm from "./pages/SignupForm";

import "normalize.css";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Switch>
          <Route exact path="/">
            <Chat />
          </Route>
          <Route exact path="/signup">
            <SignupForm />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
