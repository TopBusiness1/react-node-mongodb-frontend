import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);
    props.setTitle("Home");
  }

  render() {
    return (
      <div className="container text-center">
        <h4 className="font-weight-bold py-3 mb-4">Welcome to Case Tracker</h4>
        <div>
          <p>
            <Button as={Link} to="/contacts" variant="primary" size="lg">
              Contacts
            </Button>
          </p>
          <p>
            <Button as={Link} to="/records" variant="primary" size="lg">
              Medical Records
            </Button>
          </p>
        </div>
      </div>
    );
  }
}

export default Home;
