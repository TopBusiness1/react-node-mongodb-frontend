import React, { Component } from "react";
import { Form, Button, Col, Card } from "react-bootstrap";
import moment from "moment";
import { Link } from "react-router-dom";
import axios from "../../../shared/helpers/axios-base";
import DatePicker from "../../../components/DatePickers/DatePicker";
import queryString from "query-string";
import { SuccessSweetAlert } from "../../../components/SweetAlerts/SweetAlert";

class AddRecord extends Component {
  constructor(props) {
    super(props);
    props.setTitle("Add new record - Forms");

    this.state = {
      provider: "",
      client: "",
      requested: {
        recordDate: "",
        recordAffidavitDate: "",
        billDate: "",
        billAffidavitDate: ""
      },
      received: {
        recordDate: "",
        recordAffidavitDate: "",
        billDate: "",
        billAffidavitDate: ""
      },
      notes: "",
      startDate: new Date(),
      endDate: moment()
        .add(5, "days")
        .toDate(),
      isEdit: false,
      allContactData: []
    };
  }

  componentDidMount() {
    const params = queryString.parse(this.props.location.search);
    if (params.n) {
      this.setState({ isEdit: true });
      // Load data
      this.loadData(`/medical/${params.n}`).then(data => {
        const {
          recordDate,
          recordAffidavitDate,
          billDate,
          billAffidavitDate
        } = data.requested;
        this.setState({
          isEdit: true,
          provider: data.provider,
          client: data.client,
          notes: data.notes,
          requested: {
            recordDate: recordDate ? new Date(data.requested.recordDate) : "",
            recordAffidavitDate: recordAffidavitDate
              ? new Date(data.requested.recordAffidavitDate)
              : "",
            billDate: billDate ? new Date(data.requested.billDate) : "",
            billAffidavitDate: billAffidavitDate
              ? new Date(data.requested.billAffidavitDate)
              : ""
          },
          received: {
            recordDate: data.received.recordDate
              ? new Date(data.received.recordDate)
              : "",
            recordAffidavitDate: data.received.recordAffidavitDate
              ? new Date(data.received.recordAffidavitDate)
              : "",
            billDate: data.received.billDate
              ? new Date(data.received.billDate)
              : "",
            billAffidavitDate: data.received.billAffidavitDate
              ? new Date(data.received.billAffidavitDate)
              : ""
          }
        });
      });
    }

    this.loadAllContactData("/contacts").then(data => {
      this.setState({ allContactData: data });
    });
  }

  async loadData(url) {
    const response = await axios.get(url);
    return response.data;
  }

  async loadAllContactData(url) {
    const res = await axios.get(url);
    return res.data;
  }

  // Date pickers
  setDates({ startDate = this.state.startDate, endDate = this.state.endDate }) {
    if (moment(startDate).isAfter(endDate)) {
      endDate = startDate;
    }

    this.setState({
      startDate,
      endDate
    });
  }

  handleDateChange = (date, objectName, fieldName) => {
    this.setState(prevState => ({
      ...prevState[objectName],
      [objectName]: {
        ...prevState[objectName],
        [fieldName]: date
      }
    }));
  };

  handleChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmitRecord = e => {
    e.preventDefault();
    const { provider, client, requested, received, notes, isEdit } = this.state;
    const payload = {
      provider,
      client,
      requested,
      received,
      notes
    };
    const params = queryString.parse(this.props.location.search);

    if (isEdit) {
      axios
        .put(`/medical/${params.n}`, payload)
        .then(res => {
          if (res.status === 200) {
            const options = {
              title: "Update",
              text: "Updated successfully",
              showCancelButton: false,
              type: "success"
            };
            SuccessSweetAlert(options);
            setTimeout(function() {
              window.location.href = "/records";
            }, 2000);
          }
        })
        .catch(err => alert("Record not updated"));
    } else {
      axios
        .post("/medical", payload)
        .then(res => {
          if (res.status === 201) {
            const options = {
              title: "Save",
              text: "Saved successfully",
              showCancelButton: false,
              type: "success"
            };
            SuccessSweetAlert(options);
            setTimeout(function() {
              window.location.href = "/records";
            }, 2000);
          }
        })
        .catch(err => alert("Record not saved"));
    }
  };

  render() {
    const {
      provider,
      client,
      requested,
      received,
      notes,
      isEdit,
      allContactData
    } = this.state;
    return (
      <div>
        <h4 className="font-weight-bold py-3 mb-4">
          <span className="text-muted font-weight-light">Forms /</span>
          {isEdit ? "Edit record" : "Add new record"}
        </h4>
        <div className="text-right">
          <Button as={Link} to="/records">
            Go back
          </Button>
        </div>
        <br />
        <Card className="mb-4">
          <Card.Header as="h6">{isEdit ? "Edit" : "New"}</Card.Header>
          <Card.Body>
            <Form onSubmit={this.handleSubmitRecord}>
              <Form.Row>
                <Form.Group as={Col} md={6}>
                  <Form.Label>Medical Provider</Form.Label>
                  <select
                    className="custom-select"
                    value={provider}
                    name="provider"
                    onChange={this.handleChange}
                    required
                  >
                    <option>Select provider</option>
                    {allContactData &&
                      allContactData
                        .filter(
                          item =>
                            item.contactType &&
                            item.contactType.toLowerCase() ===
                              "medical provider"
                        )
                        .map((val, index) => (
                          <option value={val._id} key={index.toString()}>
                            {val.name.last}
                          </option>
                        ))}
                  </select>
                </Form.Group>
                <Form.Group as={Col} md={6}>
                  <Form.Label>Client</Form.Label>
                  <select
                    className="custom-select"
                    value={client}
                    name="client"
                    onChange={this.handleChange}
                    required
                  >
                    <option>Select client</option>
                    {allContactData &&
                      allContactData
                        .filter(
                          item =>
                            item.contactType &&
                            item.contactType.toLowerCase() === "client"
                        )
                        .map((val, index) => (
                          <option value={val._id} key={index.toString()}>
                            {val.name.last}
                          </option>
                        ))}
                  </select>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group className="form-inline" as={Col} md={4}>
                  <Form.Label>Requested</Form.Label>
                </Form.Group>
                <Form.Group as={Col} md={2}>
                  <Form.Label>Records</Form.Label>
                  <DatePicker
                    startDate={requested.recordDate}
                    handleDateChange={date =>
                      this.handleDateChange(date, "requested", "recordDate")
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md={2}>
                  <Form.Label>Affidavits</Form.Label>
                  <DatePicker
                    startDate={requested.recordAffidavitDate}
                    handleDateChange={date =>
                      this.handleDateChange(
                        date,
                        "requested",
                        "recordAffidavitDate"
                      )
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md={2}>
                  <Form.Label>Bills</Form.Label>
                  <DatePicker
                    startDate={requested.billDate}
                    handleDateChange={date =>
                      this.handleDateChange(date, "requested", "billDate")
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md={2}>
                  <Form.Label>Affidavits</Form.Label>
                  <DatePicker
                    startDate={requested.billAffidavitDate}
                    handleDateChange={date =>
                      this.handleDateChange(
                        date,
                        "requested",
                        "billAffidavitDate"
                      )
                    }
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group className="form-inline" as={Col} md={4}>
                  <Form.Label>Received</Form.Label>
                </Form.Group>
                <Form.Group as={Col} md={2}>
                  <Form.Label>Records</Form.Label>
                  <DatePicker
                    startDate={received.recordDate}
                    handleDateChange={date =>
                      this.handleDateChange(date, "received", "recordDate")
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md={2}>
                  <Form.Label>Affidavits</Form.Label>
                  <DatePicker
                    startDate={received.recordAffidavitDate}
                    handleDateChange={date =>
                      this.handleDateChange(
                        date,
                        "received",
                        "recordAffidavitDate"
                      )
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md={2}>
                  <Form.Label>Bills</Form.Label>
                  <DatePicker
                    startDate={received.billDate}
                    handleDateChange={date =>
                      this.handleDateChange(date, "received", "billDate")
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md={2}>
                  <Form.Label>Affidavits</Form.Label>
                  <DatePicker
                    startDate={received.billAffidavitDate}
                    handleDateChange={date =>
                      this.handleDateChange(
                        date,
                        "received",
                        "billAffidavitDate"
                      )
                    }
                  />
                </Form.Group>
              </Form.Row>

              <Form.Group>
                <Form.Label>Notes</Form.Label>

                <Form.Control
                  as="textarea"
                  placeholder="write..."
                  name="notes"
                  value={notes}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                {isEdit ? "Update" : "Save"}
              </Button>
              <Button
                style={{ marginLeft: 15 }}
                variant="light"
                as={Link}
                to="/records"
              >
                Cancel
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default AddRecord;
