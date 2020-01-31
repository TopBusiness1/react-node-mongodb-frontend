import React from "react";
import { Modal, Button, Form, Col } from "react-bootstrap";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

const AddressModal = props => {
  const {
    showModal,
    modalSize,
    closeModal,
    data,
    handleChange,
    handleAddNewAddress,
    selectCountry,
    selectState
  } = props;
  const {
    street,
    city,
    state,
    country,
    zipCode,
    addressType,
    primaryAddress
  } = data;

  return (
    <div>
      <Modal show={showModal} size={modalSize} onHide={closeModal}>
        <Form onSubmit={handleAddNewAddress}>
          <Modal.Header closeButton>
            <Modal.Title as="h5">
              Address <span className="font-weight-light">Information</span>
              <br />
              <small className="text-muted">Add address details</small>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Row>
              <Form.Group as={Col} className="mb-0">
                <Form.Label></Form.Label>
                <Form.Check
                  type="checkbox"
                  id="primary-address"
                  label="Primary Address"
                  name="primaryAddress"
                  value={primaryAddress}
                  onChange={e => handleChange(e, "primaryAddress")}
                  className="custom-control"
                />
              </Form.Group>
              <Form.Group as={Col} className="mb-0">
                <Form.Label>Address type</Form.Label>
                <select
                  value={addressType}
                  name="type"
                  onChange={e => handleChange(e, "addressType")}
                  className="custom-select"
                  required
                >
                  <option value="">Select</option>
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                </select>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} className="mb-0">
                <Form.Label>Street</Form.Label>
                <Form.Control
                  placeholder="Street"
                  name="street"
                  value={street}
                  onChange={e => handleChange(e, "street")}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} className="mb-0">
                <Form.Label>City</Form.Label>
                <Form.Control
                  placeholder="City"
                  name="city"
                  value={city}
                  onChange={e => handleChange(e, "city")}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} className="mb-0">
                <Form.Label>Zip Code</Form.Label>
                <Form.Control
                  placeholder="Zip Code"
                  name="zipCode"
                  value={zipCode}
                  onChange={e => handleChange(e, "zipCode")}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} className="mb-0">
                <Form.Label>Country</Form.Label>
                <CountryDropdown
                  className="custom-select"
                  name="country"
                  value={country}
                  onChange={val => selectCountry(val)}
                />
              </Form.Group>
              <Form.Group as={Col} className="mb-0">
                <Form.Label>State</Form.Label>
                <RegionDropdown
                  className="custom-select"
                  name="state"
                  country={country}
                  value={state}
                  onChange={val => selectState(val)}
                />
              </Form.Group>
            </Form.Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="default" onClick={closeModal}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AddressModal;
