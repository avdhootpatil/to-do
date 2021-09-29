import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const TaskModal = ({
  show,
  onHide,
  priorities,
  errors,
  handleSubmitTaskModal,
  handleChange,
  currentTask,
  mode,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Summary</Form.Label>
            <Form.Control
              type="text"
              value={currentTask.summary}
              onChange={handleChange("summary")}
              disabled={mode === "view" ? true : false}
            />
            <Form.Control.Feedback
              type="invalid"
              className="ml-1 d-block error"
            >
              {errors.summary && errors.summary[0]}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={currentTask.description}
              onChange={handleChange("description")}
              className="desc"
              disabled={mode === "view" ? true : false}
            />
            <Form.Control.Feedback
              type="invalid"
              className="ml-1 d-block error "
            >
              {errors.description && errors.description[0]}
            </Form.Control.Feedback>
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Due Date</Form.Label>
              <DatePicker
                selected={
                  currentTask.dueDate
                    ? moment(currentTask.dueDate).toDate()
                    : null
                }
                onChange={handleChange("dueDate")}
                dateFormat="dd/MM/yyyy"
                className={`task-datepicker ${
                  mode === "view" ? `disabled-datepicker` : ``
                }`}
                disabled={mode === "view" ? true : false}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                value={currentTask.priority}
                onChange={handleChange("priority")}
                disabled={mode === "view" ? true : false}
              >
                {priorities.map((pr, index) => (
                  <option key={"pr" + index} value={pr.id}>
                    {pr.name}
                  </option>
                ))}
              </Form.Control>{" "}
            </Form.Group>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="delete-btn"
          onClick={handleSubmitTaskModal("close")}
          disabled={mode === "view" ? true : false}
        >
          Close
        </Button>
        <Button
          className="done-btn"
          onClick={handleSubmitTaskModal("save")}
          disabled={mode === "view" ? true : false}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskModal;
