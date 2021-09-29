import produce from "immer";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import uuid from "react-uuid";
import * as yup from "yup";
import { DeleteModal } from "../components/modals/deleteModal";
import { TaskModal } from "../components/modals/task";
import { TaskTable } from "../components/tabs";
import "../styles/todoApp.css";
import getSchema from "../validation/taskValidation";

const TodoPage = () => {
  const [key, setKey] = useState("1");

  const [tasks, setTasks] = useState([]);

  //form states
  const [formFields, setFormFields] = useState({ groupBy: "", search: "" });
  const [isValueChanged, setIsValueChanged] = useState(false);

  //modal state
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState({
    id: 0,
    summary: "",
    description: "",
    dueDate: null,
    priority: "",
    createdOn: "",
    currentState: "",
  });
  const [errors, setErrors] = useState({});
  const [mode, setMode] = useState("");
  const [currentId, setCurrentId] = useState();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  //presets
  const [priorities, setPriorities] = useState([
    { id: 1, name: "None" },
    { id: 2, name: "Low" },
    { id: 3, name: "Medium" },
    { id: 4, name: "High" },
  ]);

  const [groupOptions, setGroupOptions] = useState([
    { id: 1, name: "none" },
    { id: 2, name: "Created On" },
    { id: 3, name: "Pending On" },
    { id: 4, name: "Priority" },
  ]);

  let schema = getSchema();

  useEffect(() => {
    (async () => {
      setKey("1");
    })();
  }, []);

  const changeValue = () => {
    if (isValueChanged) {
      setIsValueChanged(false);
    } else {
      setIsValueChanged(true);
    }
  };

  const clearCurrentTask = () => {
    setCurrentTask({
      id: 0,
      summary: "",
      description: "",
      dueDate: null,
      priority: "",
      createdOn: "",
      currentState: "",
    });
  };

  const clearErrors = () => {
    setErrors({});
  };

  const handleSubmitTaskModal = (props) => (event) => {
    if (isTaskModalVisible) {
      if (props === "close") {
        clearCurrentTask();
        clearErrors();
        setIsTaskModalVisible(false);
        setCurrentId();
      } else {
        try {
          schema.validateSync(currentTask, { abortEarly: false });
          if (mode === "new") {
            tasks.push(currentTask);
          } else if (mode === "edit") {
            let newTasks = [...tasks];
            let index = tasks.findIndex((tsk) => tsk.id === currentId);
            newTasks[index] = currentTask;
            setTasks(newTasks);
          }
          clearCurrentTask();
          setIsTaskModalVisible(false);
          setMode("");
          setCurrentId();
          changeValue();
        } catch (e) {
          if (e instanceof yup.ValidationError) {
            let newEr = produce({}, (draft) => {
              e.inner.forEach((error) => {
                draft[error.path] = [...error.errors];
              });
            });
            setErrors(newEr);
          }
        }
      }
    } else {
      setMode("new");
      setIsTaskModalVisible(true);
    }
  };

  const handleFormChange = (name) => (event) => {
    let nextState = produce(formFields, (draft) => {
      switch (name) {
        case "groupBy":
          draft[name] = event.target.value;
          break;

        case "search":
          draft[name] = event.target.value;
          draft["groupBy"] = "1";
          break;

        default:
          break;
      }
    });

    setFormFields(nextState);
  };

  const handleChange = (name) => (event) => {
    let nextErrors = { ...errors };
    let nextState = produce(currentTask, (draft) => {
      switch (name) {
        case "summary":
          draft[name] = event.target.value;
          draft["priority"] = "1";
          draft["id"] = uuid();
          break;

        case "description":
          draft[name] = event.target.value;

          break;
        case "dueDate":
          draft[name] = new Date(event);
          break;

        case "priority":
          draft[name] = event.target.value;
          break;

        default:
          break;
      }
      draft["createdOn"] = new Date();
      draft["currentState"] = "open";

      try {
        schema.validateSyncAt(name, draft);
        nextErrors[name] = [];
      } catch (e) {
        nextErrors[name] = [...e.errors];
      }
      setErrors(nextErrors);
    });
    setCurrentTask(nextState);
  };

  const handleEditClick = (id) => (event) => {
    event.preventDefault();
    let index = tasks.findIndex((tsk) => tsk.id === id);
    setCurrentTask({ ...tasks[index] });
    setMode("edit");
    setCurrentId(id);
    setIsTaskModalVisible(true);
    changeValue();
  };

  const handleDoneClick = (id) => (event) => {
    event.preventDefault();
    let newTasks = [...tasks];
    let task = { ...newTasks.find((task) => task.id === id) };
    if (task.currentState === "open") {
      task.currentState = "closed";
    } else {
      task.currentState = "open";
    }
    let index = tasks.findIndex((tsk) => tsk.id === id);
    newTasks[index] = task;
    setTasks(newTasks);
    changeValue();
  };

  const handleDeleteClick = (id) => (event) => {
    event.preventDefault();
    if (!isDeleteModalVisible) {
      setIsDeleteModalVisible(true);
      setCurrentId(id);
    } else {
      let newTasks = [...tasks];
      let currentIndex = tasks.findIndex((tsk) => tsk.id === currentId);
      newTasks.splice(parseInt(currentIndex), 1);
      setTasks(newTasks);
      setCurrentId();
      changeValue();
      setIsDeleteModalVisible(false);
    }
  };

  const handleViewClick = (id) => (event) => {
    event.preventDefault();
    setMode("view");
    let index = tasks.findIndex((tsk) => tsk.id === id);
    let task = { ...tasks[index] };
    setCurrentTask(task);
    setCurrentId(id);
    setIsTaskModalVisible(true);
  };

  const searchTasks = (searchTerm) => {
    return function (x) {
      return x.summary.includes(searchTerm) || !searchTerm;
    };
  };

  return (
    <div>
      <div>
        <div className="header-container">
          <h4>ToDo App</h4>
          <Button
            className="add-task-btn"
            onClick={handleSubmitTaskModal(null)}
          >
            +
          </Button>
        </div>
        <hr></hr>
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Group By</Form.Label>
              <Form.Control
                as="select"
                value={formFields.groupBy}
                onChange={handleFormChange("groupBy")}
              >
                {groupOptions.map((opn, index) => (
                  <option key={"grp" + index} value={opn.id}>
                    {opn.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Search</Form.Label>
              <Form.Control
                value={formFields.search}
                onChange={handleFormChange("search")}
              />
            </Form.Group>
          </Row>
        </Form>
      </div>
      <hr></hr>
      <div>
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="todo-tabs mb-3 "
        >
          <Tab eventKey="1" title="All">
            <TaskTable
              tasks={tasks}
              tabKey={key}
              priorities={priorities}
              handleEditClick={handleEditClick}
              handleDoneClick={handleDoneClick}
              handleDeleteClick={handleDeleteClick}
              formFields={formFields}
              searchTasks={searchTasks}
              isValueChanged={isValueChanged}
              handleViewClick={handleViewClick}
            />
          </Tab>
          <Tab eventKey="2" title="Pending">
            <TaskTable
              tasks={tasks}
              tabKey={key}
              priorities={priorities}
              handleEditClick={handleEditClick}
              handleDoneClick={handleDoneClick}
              handleDeleteClick={handleDeleteClick}
              formFields={formFields}
              searchTasks={searchTasks}
              isValueChanged={isValueChanged}
              handleViewClick={handleViewClick}
            />
          </Tab>
          <Tab eventKey="3" title="Completed">
            <TaskTable
              tasks={tasks}
              tabKey={key}
              priorities={priorities}
              handleEditClick={handleEditClick}
              handleDoneClick={handleDoneClick}
              handleDeleteClick={handleDeleteClick}
              formFields={formFields}
              searchTasks={searchTasks}
              isValueChanged={isValueChanged}
              handleViewClick={handleViewClick}
            />
          </Tab>
        </Tabs>
      </div>
      <TaskModal
        handleSubmitTaskModal={handleSubmitTaskModal}
        currentTask={currentTask}
        priorities={priorities}
        errors={errors}
        show={isTaskModalVisible}
        handleChange={handleChange}
        mode={mode}
        onHide={() => {
          setIsTaskModalVisible(false);
        }}
      />
      <DeleteModal
        show={isDeleteModalVisible}
        onHide={() => setIsDeleteModalVisible(false)}
        handleDeleteClick={handleDeleteClick}
      />
    </div>
  );
};

export default TodoPage;
