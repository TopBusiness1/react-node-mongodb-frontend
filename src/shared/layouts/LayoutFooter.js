import React, { Component } from "react";
import { connect } from "react-redux";

class LayoutFooter extends Component {
  render() {
    return (
      <nav className={`layout-footer footer bg-${this.props.footerBg}`}>
        <div className="container-fluid container-p-x pb-3">
          <div className="pt-3">
            <span className="footer-text font-weight-bolder">Case Tracker</span>{" "}
            ©
          </div>
        </div>
      </nav>
    );
  }
}

export default connect(store => ({
  footerBg: store.theme.footerBg
}))(LayoutFooter);
