import { DeleteOutlined, EditOutlined, UpOutlined } from "@ant-design/icons";
import produce from "immer";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";

const TaskTable = ({
  tasks,
  tabKey,
  priorities,
  handleEditClick,
  handleDoneClick,
  handleDeleteClick,
  formFields,
  searchTasks,
  isValueChanged,
  handleViewClick,
}) => {
  const [taskList, setTaskList] = useState([]);
  const [fieldSort, setFieldSort] = useState({
    summary: false, // false -> DESC, true -> ASC
    priority: false,
    createdOn: false,
    dueBy: false,
  });

  useEffect(() => {
    (() => {
      let newTasks = [];

      if (tabKey === "1") {
        newTasks = [...tasks];
      }

      if (tabKey === "2") {
        newTasks = tasks.filter((task) => task.currentState === "open");
      }

      if (tabKey === "3") {
        newTasks = tasks.filter((task) => task.currentState === "closed");
      }
      setTaskList(newTasks);
    })();
  }, [isValueChanged, tabKey]);

  const handleSort = (name) => (event) => {
    event.preventDefault();
    let nextState = produce(fieldSort, (draft) => {
      if (draft[name]) {
        draft[name] = false;
      } else {
        draft[name] = true;
      }
    });
    setFieldSort(nextState);

    let newTasks = [...taskList];
    newTasks = newTasks.sort((a, b) =>
      fieldSort[name]
        ? a[name] > b[name]
          ? 1
          : -1
        : a[name] < b[name]
        ? 1
        : -1
    );
    setTaskList(newTasks);
  };

  return (
    <div>
      <Table bordered size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>
              Summary
              <Button className="sort-button" variant="link">
                <UpOutlined
                  onClick={handleSort("summary")}
                  className={`${fieldSort.summary ? `` : `rotate-icon`} `}
                />
              </Button>
            </th>
            <th>
              Priority
              <Button className="sort-button" variant="link">
                <UpOutlined
                  onClick={handleSort("priority")}
                  className={`${fieldSort.priority ? `` : `rotate-icon`} `}
                />
              </Button>
            </th>
            <th>
              Created On
              <Button className="sort-button" variant="link">
                <UpOutlined
                  onClick={handleSort("createdOn")}
                  className={`${fieldSort.createdOn ? `` : `rotate-icon`} `}
                />
              </Button>
            </th>
            <th>
              Due By
              <Button className="sort-button" variant="link">
                <UpOutlined
                  onClick={handleSort("dueBy")}
                  className={`${fieldSort.dueBy ? `` : `rotate-icon`} `}
                />
              </Button>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {taskList
            .filter(searchTasks(formFields.search))
            .map((item, index) => (
              <tr key={"task" + index}>
                <td></td>
                <td onClick={handleViewClick(item.id)} className="task-cell">
                  <span
                    className={`d-block t-cell clip-summary ${
                      item.currentState === "closed" ? `task-complete` : null
                    }`}
                  >
                    {item.summary}
                  </span>
                </td>
                <td onClick={handleViewClick(item.id)} className="task-cell">
                  <span
                    className={`d-block t-cell ${
                      item.currentState === "closed" ? `task-complete` : null
                    }`}
                  >
                    {item.priority
                      ? priorities[parseInt(item.priority) - 1].name
                      : ""}
                  </span>
                </td>
                <td onClick={handleViewClick(item.id)} className="task-cell">
                  <span
                    className={`d-block t-cell ${
                      item.currentState === "closed" ? `task-complete` : null
                    }`}
                  >
                    {item.createdOn
                      ? moment(item.createdOn).format("ll").toString()
                      : null}
                  </span>
                </td>
                <td onClick={handleViewClick(item.id)} className="task-cell">
                  <span
                    className={`d-block t-cell ${
                      item.currentState === "closed" ? `task-complete` : null
                    }`}
                  >
                    {item.dueDate
                      ? moment(item.dueDate).format("ll").toString()
                      : null}
                  </span>
                </td>
                <td>
                  <Button
                    className="mr-3 edit-btn "
                    onClick={handleEditClick(item.id)}
                  >
                    <EditOutlined />
                  </Button>
                  <Button
                    className="mr-3 done-btn "
                    onClick={handleDoneClick(item.id)}
                  >
                    {item.currentState === "closed" ? "Re-open" : "Done"}
                  </Button>
                  <Button
                    className="delete-btn"
                    onClick={handleDeleteClick(item.id)}
                  >
                    <DeleteOutlined />
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TaskTable;
