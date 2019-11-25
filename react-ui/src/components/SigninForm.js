import React, { Component } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../redux/actions";

import "./SigninForm.css";

class SigninForm extends Component {
  state = {
    email: "",
    password: ""
  };
  handleChange = e => {
    let inputName = e.target.name;
    let value = e.target.value;
    this.setState({
      [inputName]: value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.attemptSignin(this.state.email, this.state.password);
  };

  render() {
    return (
      <form className="signin-form" onSubmit={this.handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>
    );
  }
}

const mapStateToProps = state => {
  return {
    error: state.auth.get("error")
  };
};

function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SigninForm);
