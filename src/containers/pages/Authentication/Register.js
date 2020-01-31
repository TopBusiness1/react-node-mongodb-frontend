import React, { Component } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "../../../shared/helpers/axios-base";
import "../../../vendor/styles/pages/authentication.scss";

class AuthenticationRegisterV2 extends Component {
  constructor(props) {
    super(props);
    props.setTitle("Register");

    this.state = {
      credentials: {
        name: "",
        email: "",
        password: ""
      },
      isSignedUp: false
    };
  }

  onValueChange(field, e) {
    this.setState({
      credentials: {
        ...this.state.credentials,
        [field]: e.target.value
      }
    });
  }

  prevent(e) {
    e.preventDefault();
  }

  handleSubmit = e => {
    e.preventDefault();
    const { credentials } = this.state;
    axios.post("/users", credentials).then(res => {
      if (res.status === 201) {
        this.setState({ isSignedUp: true });
      }
    });
  };

  render() {
    if (this.state.isSignedUp) {
      window.location.href = "/login";
    }
    const isAuthenticated = localStorage.getItem("token");
    if (isAuthenticated) {
      window.location.href = "/";
    }
    return (
      <div
        className="authentication-wrapper authentication-2 ui-bg-cover ui-bg-overlay-container px-4"
        style={{
          backgroundImage: `url('${process.env.PUBLIC_URL}/img/bg/1.jpg')`
        }}
      >
        <div className="ui-bg-overlay bg-dark opacity-25"></div>

        <div className="authentication-inner py-5">
          <Card>
            {this.state.isSignedUp && (
              <div>
                <Alert
                  dismissible
                  variant="dark-success"
                  onClose={this.dismissAlert}
                >
                  Registered Successfully! Login to continue
                </Alert>
              </div>
            )}
            <div className="p-4 px-sm-5 pt-sm-5">
              <h5 className="text-center text-muted font-weight-normal mb-4">
                Create an Account
              </h5>

              {/* Form */}
              <form onSubmit={this.handleSubmit}>
                <Form.Group>
                  <Form.Label>Your name</Form.Label>
                  <Form.Control
                    value={this.state.credentials.name}
                    onChange={e => this.onValueChange("name", e)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Your email</Form.Label>
                  <Form.Control
                    value={this.state.credentials.email}
                    onChange={e => this.onValueChange("email", e)}
                    type="email"
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={this.state.credentials.password}
                    onChange={e => this.onValueChange("password", e)}
                    minLength="5"
                    required
                  />
                </Form.Group>
                <Button variant="primary" block className="mt-4" type="submit">
                  Sign Up
                </Button>
                <div className="text-light small mt-4">
                  By clicking "Sign Up", you agree to our&nbsp;
                  <a href="#d" onClick={this.prevent}>
                    terms of service and privacy policy
                  </a>
                  . We’ll occasionally send you account related emails.
                </div>
              </form>
              {/* / Form */}
            </div>
            <Card.Footer className="py-3 px-4 px-sm-5">
              <div className="text-center text-muted">
                Already have an account? <Link to="/login">Sign In</Link>
              </div>
            </Card.Footer>
          </Card>
        </div>
      </div>
    );
  }
}

export default AuthenticationRegisterV2;
