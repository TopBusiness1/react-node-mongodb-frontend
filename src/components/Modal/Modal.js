import React from "react";
import { Modal, Button, Form, Col } from "react-bootstrap";

const CustomModal = props => {
  const {
    showModal,
    modalSize,
    closeModal,
    data,
    handleChange,
    handleAddNewPhone
  } = props;
  const { phoneNumber, phoneType, extension, main } = data;

  return (
    <div>
      <Modal show={showModal} size={modalSize} onHide={closeModal}>
        <Form onSubmit={handleAddNewPhone}>
          <Modal.Header closeButton>
            <Modal.Title as="h5">
              Phone <span className="font-weight-light">Information</span>
              <br />
              <small className="text-muted">Add phone details</small>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Row>
              <Form.Group as={Col} className="mb-0">
                <Form.Label>Phone number</Form.Label>
                <Form.Control
                  placeholder="e.g: (512) 555 5555"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={e => handleChange(e, "phoneNumber")}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} className="mb-0">
                <Form.Label>Extension</Form.Label>
                <Form.Control
                  placeholder="e.g: 457845"
                  name="extension"
                  value={extension}
                  onChange={e => handleChange(e, "extension")}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} className="mb-0">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  placeholder="Phone type"
                  name="phoneType"
                  value={phoneType}
                  onChange={e => handleChange(e, "phoneType")}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} className="mb-0">
                <Form.Label>Main</Form.Label>
                <select
                  className="custom-select"
                  name="main"
                  value={main}
                  onChange={e => handleChange(e, "main")}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
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

export default CustomModal;
