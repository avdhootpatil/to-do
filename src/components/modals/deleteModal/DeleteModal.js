import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const DeleteModal = ({ show, onHide, handleDeleteClick }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="delete-modal-container">
        <div>
          <h4>Do you want to delete this task?</h4>
        </div>
        <div>
          <Button
            className="delete-btn mr-4 mt-3"
            onClick={handleDeleteClick(null)}
          >
            Yes
          </Button>
          <Button className="done-btn mt-3" onClick={onHide}>
            No
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteModal;
