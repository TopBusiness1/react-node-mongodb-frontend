import React, { Component } from "react";
import {
  Form,
  Button,
  Col,
  Card,
  Tabs,
  Tab,
  Row,
  Table,
  InputGroup,
  ButtonGroup
} from "react-bootstrap";
import moment from "moment";
import { Link } from "react-router-dom";
import produce from "immer";
import DatePicker from "../../../components/DatePickers/DatePicker";
import FileUpload from "../../../components/FileUpload/FileUpload";
import ReactQuill from "../../../components/Editor/ReactQuill";
import Modal from "../../../components/Modal/Modal";
import AddressModal from "../../../components/Modal/AddressModal";
import axios from "../../../shared/helpers/axios-base";
import queryString from "query-string";
import {
  DeleteAlert,
  SuccessSweetAlert,
  ReactSwal
} from "../../../components/SweetAlerts/SweetAlert";
import CustomTagsInput from "../../../components/TagsInput/TagsInput";

class AddContact extends Component {
  constructor(props) {
    super(props);
    props.setTitle("Add new contact - Forms");

    this.state = {
      data: {
        name: {
          salutation: "",
          first: "",
          last: ""
        },
        company: {
          name: "",
          title: "",
          tags: []
        },
        address: [],
        phone: [],
        biography: {
          dob: "",
          gender: "",
          socialSecurityNumber: "",
          drivingLicenseNumber: "",
          picture: "",
          socialLinks: {
            facebook: "",
            twitter: "",
            linkedIn: ""
          }
        },
        marketing: {
          referredByContact: "",
          referredByAdvertising: "",
          referredByEmployee: "",
          referredTo: "",
          abcd: "",
          tags: []
        },
        notes: "",
        contactType: ""
      },
      startDate: "",
      endDate: moment()
        .add(5, "days")
        .toDate(),
      showModal: false,
      newPhone: {
        phoneNumber: "",
        extension: "",
        phoneType: "",
        main: false
      },
      showAddressModal: false,
      newAddress: {
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        addressType: "",
        primaryAddress: false
      },
      isEdit: false,
      tag: "",
      allContactData: []
    };
  }

  componentDidMount() {
    const params = queryString.parse(this.props.location.search);
    if (params.n) {
      this.setState({ isEdit: true });

      // Load data
      this.loadData(`/contacts/${params.n}`).then(data => {
        const { biography, ...otherData } = data;
        biography.dob = biography.dob ? new Date(biography.dob) : "";
        const newData = {
          ...otherData,
          biography
        };
        this.setState({ data: newData });
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
  setDates({
    startDate = this.state.data.biography.dob,
    endDate = this.state.endDate
  }) {
    if (moment(startDate).isAfter(endDate)) {
      endDate = startDate;
    }
    const data = produce(this.state.data, draft => {
      draft.biography.dob = startDate;
    });
    this.setState({ data, endDate });
  }

  handleDateChange = date => {
    this.setDates({ startDate: date });
  };

  handleAddPhoneField = e => {
    e.preventDefault();
    this.setState({ showModal: true });
  };

  handleAddNewPhone = e => {
    e.preventDefault();
    const { newPhone } = this.state;
    const phone = produce(this.state.data.phone, draft => {
      draft.push(newPhone);
    });
    const data = produce(this.state.data, draft => {
      draft.phone = phone;
    });
    this.setState({
      data,
      newPhone: { phoneNumber: "", phoneType: "", extension: "", main: false }
    });
    this.closeModal(e);
  };

  handleAddNewAddress = e => {
    e.preventDefault();
    const { newAddress } = this.state;
    const address = produce(this.state.data.address, draft => {
      draft.push(newAddress);
    });
    const data = produce(this.state.data, draft => {
      draft.address = address;
    });
    this.setState({
      data,
      newAddress: {
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        addressType: "",
        primaryAddress: false
      }
    });
    this.closeAddressModal(e);
  };

  handleAddAddressField = e => {
    e.preventDefault();
    this.setState({ showAddressModal: true });
  };

  handleDeletePhoneField = (e, index) => {
    e.preventDefault();
    const self = this;
    DeleteAlert().then(function(result) {
      if (result.value) {
        const data = produce(self.state.data, draft => {
          delete draft.phone[index];
        });
        self.setState({ data });
        ReactSwal.fire("Deleted!", "Your record has been deleted.", "success");
      } else {
        ReactSwal.fire("Cancelled", "Your record is safe :)", "error");
      }
    });
  };

  handleDeleteAddress = (e, index) => {
    e.preventDefault();
    const self = this;
    DeleteAlert().then(function(result) {
      if (result.value) {
        const data = produce(self.state.data, draft => {
          delete draft.address[index];
        });
        self.setState({ data });
        ReactSwal.fire("Deleted!", "Your record has been deleted.", "success");
      } else {
        ReactSwal.fire("Cancelled", "Your record is safe :)", "error");
      }
    });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  closeAddressModal = () => {
    this.setState({ showAddressModal: false });
  };

  handleChange = (e, objectName, fieldName) => {
    const data = produce(this.state.data, draft => {
      draft[objectName][fieldName] = e.target.value;
    });
    this.setState({ data });
  };

  handleChangeGender = (e, objectName, fieldName, value) => {
    const data = produce(this.state.data, draft => {
      draft[objectName][fieldName] = value;
    });
    this.setState({ data });
  };

  handleChangeRoot = (e, fieldName) => {
    const data = produce(this.state.data, draft => {
      draft[fieldName] = e.target.value;
    });
    this.setState({ data });
  };

  handleNotesChange = text => {
    const data = produce(this.state.data, draft => {
      draft.notes = text;
    });
    this.setState({ data });
  };

  handlePhoneChange = (e, fieldName) => {
    e.preventDefault();
    const newPhone = produce(this.state.newPhone, draft => {
      draft[fieldName] = e.target.value;
    });
    this.setState({ newPhone });
  };

  handleAddressChange = (e, fieldName) => {
    e.preventDefault();
    const newAddress = produce(this.state.newAddress, draft => {
      draft[fieldName] =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
    });
    this.setState({ newAddress });
  };

  handleChangeSocialLinks = (e, objectName, fieldName) => {
    e.preventDefault();
    const data = produce(this.state.data, draft => {
      draft.biography[objectName][fieldName] = e.target.value;
    });
    this.setState({ data });
  };

  handleChangeTagInput(tag) {
    this.setState({ tag });
  }

  handleChangeTags = (tags, objectName, fieldName) => {
    const data = produce(this.state.data, draft => {
      draft[objectName][fieldName] = tags;
    });
    this.setState({ data });
  };

  selectCountry = val => {
    const newAddress = produce(this.state.newAddress, draft => {
      draft.country = val;
    });
    this.setState({ newAddress });
  };

  selectState = val => {
    const newAddress = produce(this.state.newAddress, draft => {
      draft.state = val;
    });
    this.setState({ newAddress });
  };

  handleSubmitContact = e => {
    e.preventDefault();
    const { data, isEdit } = this.state;
    const params = queryString.parse(this.props.location.search);

    if (isEdit) {
      axios
        .put(`/contacts/${params.n}`, data)
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
              window.location.href = "/contacts";
            }, 2000);
          }
        })
        .catch(err => alert("Record not updated"));
    } else {
      axios
        .post("/contacts", data)
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
              window.location.href = "/contacts";
            }, 2000);
          }
        })
        .catch(err => alert("Record not saved"));
    }
  };

  render() {
    const {
      showModal,
      data,
      newPhone,
      isEdit,
      showAddressModal,
      newAddress,
      allContactData
    } = this.state;
    const {
      name,
      company,
      address,
      phone,
      biography,
      marketing,
      notes,
      contactType
    } = data;
    const { socialLinks } = biography;
    return (
      <div>
        <Modal
          showModal={showModal}
          modalSize={null}
          closeModal={this.closeModal}
          data={newPhone}
          handleChange={this.handlePhoneChange}
          handleAddNewPhone={this.handleAddNewPhone}
        />
        <AddressModal
          showModal={showAddressModal}
          modalSize={null}
          closeModal={this.closeAddressModal}
          data={newAddress}
          handleChange={this.handleAddressChange}
          handleAddNewAddress={this.handleAddNewAddress}
          selectCountry={this.selectCountry}
          selectState={this.selectState}
        />
        <h4 className="font-weight-bold py-3 mb-4">
          <span className="text-muted font-weight-light">Forms /</span>
          {isEdit ? "Edit contact data" : "Add new contact"}
        </h4>
        <div className="text-right">
          <Button as={Link} to="/contacts">
            Go back
          </Button>
        </div>
        <br />
        <Card className="mb-4">
          <Card.Header as="h6">{isEdit ? "Edit" : "New"}</Card.Header>
          <Card.Body>
            <Form onSubmit={this.handleSubmitContact}>
              <Form.Row>
                <Form.Group as={Col} md={4}>
                  <Form.Label>Salutation</Form.Label>
                  <select
                    value={name.salutation}
                    name="salutation"
                    onChange={e => this.handleChange(e, "name", "salutation")}
                    className="custom-select"
                  >
                    <option value="">Select</option>
                    <option value="Mr">Mr.</option>
                    <option value="Ms">Ms.</option>
                    <option value="Mrs">Mrs.</option>
                  </select>
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <Form.Label>First</Form.Label>
                  <Form.Control
                    placeholder="First name"
                    name="first"
                    value={name.first}
                    onChange={e => this.handleChange(e, "name", "first")}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <Form.Label>Last</Form.Label>
                  <Form.Control
                    placeholder="Last name"
                    name="last"
                    value={name.last}
                    onChange={e => this.handleChange(e, "name", "last")}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md={4}>
                  <Form.Label>Company</Form.Label>
                  <Form.Control
                    placeholder="Company name"
                    name="name"
                    value={company.name}
                    onChange={e => this.handleChange(e, "company", "name")}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    placeholder="Title"
                    name="title"
                    value={company.title}
                    onChange={e => this.handleChange(e, "company", "title")}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <Form.Label>Contact Type</Form.Label>
                  <Form.Control
                    placeholder="Contact Type"
                    name="contactType"
                    value={contactType}
                    onChange={e => this.handleChangeRoot(e, "contactType")}
                    required
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Tags</Form.Label>
                  <CustomTagsInput
                    value={company.tags}
                    name="tags"
                    onChange={tags =>
                      this.handleChangeTags(tags, "company", "tags")
                    }
                    inputValue={this.state.tag}
                    onChangeInput={this.handleChangeInput}
                  />
                </Form.Group>
              </Form.Row>

              <div className="nav-tabs-top nav-responsive-xl">
                <Tabs defaultActiveKey="general" style={{ margin: 0 }}>
                  <Tab eventKey="general" title="General">
                    <Card.Body>
                      <Row>
                        <Col sm={12} xl={6}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between"
                            }}
                          >
                            <h6>Address</h6>
                            <i
                              style={{ fontSize: "1.5rem", cursor: "pointer" }}
                              className="fas fa-plus-circle"
                              title="Add address"
                              onClick={this.handleAddAddressField}
                            ></i>
                          </div>
                          <Table size="sm">
                            <thead>
                              <tr>
                                <th>Street</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Country</th>
                                <th>Zip Code</th>
                                <th>Type</th>
                                <th>#</th>
                              </tr>
                            </thead>
                            <tbody>
                              {address &&
                                address.map((item, index) => (
                                  <tr key={index.toString()}>
                                    <td>{item.street}</td>
                                    <td>{item.city}</td>
                                    <td>{item.state}</td>
                                    <td>{item.country}</td>
                                    <td>{item.zipCode}</td>
                                    <td>{item.addressType}</td>
                                    <td>
                                      {index >= 0 && (
                                        <i
                                          style={{
                                            cursor: "pointer"
                                          }}
                                          title="Delete"
                                          className="fas fa-trash-alt"
                                          onClick={e =>
                                            this.handleDeleteAddress(e, index)
                                          }
                                        ></i>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </Table>
                        </Col>
                        <Col sm={12} xl={6}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between"
                            }}
                          >
                            <h6>Phone</h6>
                            <i
                              style={{ fontSize: "1.5rem", cursor: "pointer" }}
                              className="fas fa-plus-circle"
                              title="Add phone"
                              onClick={this.handleAddPhoneField}
                            ></i>
                          </div>
                          <Table size="sm">
                            <thead>
                              <tr>
                                <th>Phone Number</th>
                                <th>Extension</th>
                                <th>Type</th>
                                <th>Main</th>
                                <th>#</th>
                              </tr>
                            </thead>
                            <tbody>
                              {phone &&
                                phone.map((item, index) => (
                                  <tr key={index.toString()}>
                                    <td>{item.phoneNumber}</td>
                                    <td>{item.extension}</td>
                                    <td>{item.phoneType}</td>
                                    <td>
                                      {item.main && item.main === "true"
                                        ? "Yes"
                                        : "No"}
                                    </td>
                                    <td>
                                      {index >= 0 && (
                                        <i
                                          style={{
                                            cursor: "pointer"
                                          }}
                                          title="Delete"
                                          className="fas fa-trash-alt"
                                          onClick={e =>
                                            this.handleDeletePhoneField(
                                              e,
                                              index
                                            )
                                          }
                                        ></i>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Tab>
                  <Tab eventKey="biography" title="Biography">
                    <Card.Body>
                      <Form.Row>
                        <Form.Group as={Col} md={3}>
                          <Form.Label>Date of Birth</Form.Label>
                          <DatePicker
                            startDate={biography.dob}
                            handleDateChange={this.handleDateChange}
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                          <Form.Label>Gender</Form.Label>
                          <div>
                            <ButtonGroup>
                              <Button
                                onClick={e =>
                                  this.handleChangeGender(
                                    e,
                                    "biography",
                                    "gender",
                                    "male"
                                  )
                                }
                                active={biography.gender === "male"}
                              >
                                Male
                              </Button>
                              <Button
                                onClick={e =>
                                  this.handleChangeGender(
                                    this,
                                    "biography",
                                    "gender",
                                    "female"
                                  )
                                }
                                active={biography.gender === "female"}
                              >
                                Female
                              </Button>
                            </ButtonGroup>
                          </div>
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                          <Form.Label>Social Security Number</Form.Label>
                          <Form.Control
                            placeholder="Social Security Number"
                            name="socialSecurityNumber"
                            value={biography.socialSecurityNumber}
                            onChange={e =>
                              this.handleChange(
                                e,
                                "biography",
                                "socialSecurityNumber"
                              )
                            }
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                          <Form.Label>Driver's License Number</Form.Label>
                          <Form.Control
                            placeholder="Driver's License Number"
                            name="drivingLicenseNumber"
                            value={biography.drivingLicenseNumber}
                            onChange={e =>
                              this.handleChange(
                                e,
                                "biography",
                                "drivingLicenseNumber"
                              )
                            }
                          />
                        </Form.Group>
                      </Form.Row>

                      <Row style={{ margin: 10, padding: 5 }}>
                        <Col sm={12} xl={6}>
                          <FileUpload />
                        </Col>
                        <Col sm={12} xl={6}>
                          <Form.Group>
                            <Form.Label>Facebook</Form.Label>
                            <InputGroup>
                              <InputGroup.Prepend>
                                <InputGroup.Text>
                                  <i className="fab fa-facebook-f"></i>
                                </InputGroup.Text>
                              </InputGroup.Prepend>
                              <Form.Control
                                placeholder=""
                                value={socialLinks.facebook}
                                name="facebook"
                                onChange={e =>
                                  this.handleChangeSocialLinks(
                                    e,
                                    "socialLinks",
                                    "facebook"
                                  )
                                }
                              />
                            </InputGroup>
                          </Form.Group>

                          <Form.Group>
                            <Form.Label>Twitter</Form.Label>
                            <InputGroup>
                              <InputGroup.Prepend>
                                <InputGroup.Text>
                                  <i className="fab fa-twitter"></i>
                                </InputGroup.Text>
                              </InputGroup.Prepend>
                              <Form.Control
                                placeholder=""
                                value={socialLinks.twitter}
                                name="twitter"
                                onChange={e =>
                                  this.handleChangeSocialLinks(
                                    e,
                                    "socialLinks",
                                    "twitter"
                                  )
                                }
                              />
                            </InputGroup>
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Linked In</Form.Label>
                            <InputGroup>
                              <InputGroup.Prepend>
                                <InputGroup.Text>
                                  <i className="fab fa-linkedin-in"></i>
                                </InputGroup.Text>
                              </InputGroup.Prepend>
                              <Form.Control
                                placeholder=""
                                value={socialLinks.linkedIn}
                                name="linkedIn"
                                onChange={e =>
                                  this.handleChangeSocialLinks(
                                    e,
                                    "socialLinks",
                                    "linkedIn"
                                  )
                                }
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Tab>
                  <Tab eventKey="marketing" title="Marketing">
                    <Card.Body>
                      <Form.Row>
                        <Form.Group as={Col} md={3}>
                          <Form.Label>Referred By Contact</Form.Label>
                          <select
                            className="custom-select"
                            value={marketing.referredByContact}
                            name="referredByContact"
                            onChange={e =>
                              this.handleChange(
                                e,
                                "marketing",
                                "referredByContact"
                              )
                            }
                          >
                            <option value="">Select Referral Source</option>
                            {allContactData &&
                              allContactData
                                .filter(
                                  item =>
                                    item.contactType &&
                                    item.contactType.toLowerCase() === "client"
                                )
                                .map((val, index) => (
                                  <option
                                    value={val._id}
                                    key={index.toString()}
                                  >
                                    {val.name.last}
                                  </option>
                                ))}
                          </select>
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                          <Form.Label>Referred By Advertising</Form.Label>
                          <select
                            className="custom-select"
                            value={marketing.referredByAdvertising}
                            name="referredByAdvertising"
                            onChange={e =>
                              this.handleChange(
                                e,
                                "marketing",
                                "referredByAdvertising"
                              )
                            }
                          >
                            <option value="">
                              Select Referred By Advertising
                            </option>
                            {allContactData &&
                              allContactData
                                .filter(
                                  item =>
                                    item.contactType &&
                                    item.contactType.toLowerCase() === "vendor"
                                )
                                .map((val, index) => (
                                  <option
                                    value={val._id}
                                    key={index.toString()}
                                  >
                                    {val.name.last}
                                  </option>
                                ))}
                          </select>
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                          <Form.Label>Referred By Employee</Form.Label>
                          <Form.Control
                            placeholder="Referred By Employee"
                            value={marketing.referredByEmployee}
                            name="referredByEmployee"
                            onChange={e =>
                              this.handleChange(
                                e,
                                "marketing",
                                "referredByEmployee"
                              )
                            }
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                          <Form.Label>Referred To</Form.Label>
                          <select
                            className="custom-select"
                            value={marketing.referredTo}
                            name="referredTo"
                            onChange={e =>
                              this.handleChange(e, "marketing", "referredTo")
                            }
                          >
                            <option value="">Select Referred To</option>
                            {allContactData &&
                              allContactData
                                .filter(
                                  item =>
                                    item.contactType &&
                                    item.contactType.toLowerCase() === "client"
                                )
                                .map((val, index) => (
                                  <option
                                    value={val._id}
                                    key={index.toString()}
                                  >
                                    {val.name.last}
                                  </option>
                                ))}
                          </select>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group as={Col} md={2}>
                          <Form.Label>ABCD</Form.Label>
                          <select
                            className="custom-select"
                            value={marketing.abcd}
                            name="abcd"
                            onChange={e =>
                              this.handleChange(e, "marketing", "abcd")
                            }
                          >
                            <option value=""></option>
                            <option value="a">A</option>
                            <option value="b">B</option>
                            <option value="c">C</option>
                            <option value="d">D</option>
                          </select>
                        </Form.Group>
                        <Form.Group as={Col} md={10}>
                          <Form.Label>Marketing Tags</Form.Label>
                          <CustomTagsInput
                            value={marketing.tags}
                            name="marketing.tags"
                            onChange={tags =>
                              this.handleChangeTags(tags, "marketing", "tags")
                            }
                            inputValue={this.state.tag}
                            onChangeInput={this.handleChangeInput}
                          />
                        </Form.Group>
                      </Form.Row>
                    </Card.Body>
                  </Tab>
                  <Tab eventKey="notes" title="Notes">
                    <Card.Body>
                      <ReactQuill
                        notes={notes}
                        handleChange={this.handleNotesChange}
                      />
                    </Card.Body>
                  </Tab>
                </Tabs>
              </div>
              <br />
              <Button variant="primary" type="submit">
                {isEdit ? "Update" : "Save"}
              </Button>

              <Button
                style={{ marginLeft: 15 }}
                variant="light"
                as={Link}
                to="/contacts"
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

export default AddContact;
