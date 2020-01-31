import React, { Component } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "../../../shared/helpers/axios-base";
import "../../../vendor/styles/pages/authentication.scss";

class AuthenticationLoginV2 extends Component {
  constructor(props) {
    super(props);
    props.setTitle("Login");

    this.state = {
      credentials: {
        email: "",
        password: "",
        rememberMe: false
      },
      isLoggedIn: false,
      error: false
    };
  }

  onValueChange(field, e) {
    this.setState({
      credentials: {
        ...this.state.credentials,
        [field]: field === "rememberMe" ? e.target.checked : e.target.value
      }
    });
  }

  prevent(e) {
    e.preventDefault();
  }

  dismissAlert = () => {
    this.setState({ error: false });
  };

  handleLogin = e => {
    e.preventDefault();
    const { rememberMe, ...payload } = this.state.credentials;
    axios
      .post("/login", payload)
      .then(res => {
        if (res.status === 201) {
          localStorage.setItem("token", res.data.access_token);
          this.setState({ isLoggedIn: true });
        }
      })
      .catch(err => this.setState({ error: true }));
  };

  render() {
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
            {this.state.error && (
              <div>
                <Alert
                  dismissible
                  variant="dark-danger"
                  onClose={this.dismissAlert}
                >
                  Invalid email or password!
                </Alert>
              </div>
            )}
            <div className="p-4 p-sm-5">
              <h5 className="text-center text-muted font-weight-normal mb-4">
                Login to Your Account
              </h5>

              {/* Form */}
              <form onSubmit={this.handleLogin}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={this.state.credentials.email}
                    onChange={e => this.onValueChange("email", e)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label className="d-flex justify-content-between align-items-end">
                    <div>Password</div>
                    {/* <a
                      href="#d"
                      onClick={this.prevent}
                      className="d-block small"
                    >
                      Forgot password?
                    </a> */}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    value={this.state.credentials.password}
                    onChange={e => this.onValueChange("password", e)}
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center m-0">
                  <Form.Check
                    type="checkbox"
                    custom
                    checked={this.state.credentials.rememberMe}
                    onChange={e => this.onValueChange("rememberMe", e)}
                    label="Remember me"
                    className="m-0"
                    id="login-remember-me"
                  />
                  <Button variant="primary" type="submit">
                    Sign In
                  </Button>
                </div>
              </form>
              {/* / Form */}
            </div>
            <Card.Footer className="py-3 px-4 px-sm-5">
              <div className="text-center text-muted">
                Don't have an account yet? <Link to="/register">Sign Up</Link>
              </div>
            </Card.Footer>
          </Card>
        </div>
      </div>
    );
  }
}

export default AuthenticationLoginV2;
