import React, { useState, useEffect } from "react";
import moment from "moment";
import "./App.css";
import { BASE_URL } from "./config/apiURL";
import { GET_TODOS, CREATE_TODO, DELETE_TODO } from "./config/apiEndPoints";
import { getCall, postCall, deleteCall } from "./config/apiService";
import CustomPopup from "./components/CustomPopup/CustomPopup";
import Preloader from "./components/Preloader";

const DEL_ICON = require("./assets/icons/delete_icon.png");

function App() {
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  const [todoTitle, setTodoTitle] = useState("");
  const [todoContent, setTodoContent] = useState("");
  const [currentItem, setCurrentItem] = useState({});

  const [visibility, setVisibility] = useState(false);

  const popupCloseHandler = (e) => {
    setVisibility(e);
  };

  const toggleDeletePopup = (item) => {
    setVisibility(!visibility);
    setCurrentItem(item);
  };

  const getTodos = async () => {
    setLoading(true);
    await getCall(`${BASE_URL}${GET_TODOS}`)
      .then((res) => {
        console.log("response data getTodos ===> ", res);
        setTodos(res.data);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };

  const _handleAddTodo = () => {
    const data = {
      title: todoTitle,
      content: todoContent,
    };

    postCall(`${BASE_URL}${CREATE_TODO}`, data)
      .then((res) => {
        console.log("response data create todo =====> ", res);
        getTodos();
      })
      .catch((err) => console.log(err));
  };

  const _handleDeleteTodo = () => {
    deleteCall(`${BASE_URL}${DELETE_TODO}/${currentItem?._id}`)
      .then((res) => {
        console.log("response data delete todo =====> ", res);
        setVisibility(!visibility);
        getTodos();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    console.log("current selected item is ====> ", currentItem);
  }, [currentItem]);

  useEffect(() => {
    console.log("todos ====> ", todos);
  }, [todos]);

  return (
    <div className="App">
      <div className="mainContainer">
        <h1 className="mainHeading">Welcome to Todo App!</h1>

        <div className="todosBox">
          <div className="inputContainer">
            <input
              className="inputBox"
              placeholder="Enter todo title here..."
              value={todoTitle}
              onChange={(e) => setTodoTitle(e.target.value)}
            />
            <div className="addBtn" onClick={() => _handleAddTodo()}>
              <p>Add</p>
            </div>
          </div>
          {loading ? (
            <Preloader />
          ) : (
            todos.map((item) => (
              <div style={{ background: "#16347a", borderRadius: "10px" }}>
                <div className="todoItem" key={item._id}>
                  <p style={{ color: "#FFFFFF" }}>{item.title}</p>
                  <p style={{ color: "#FFFFFF" }}>{item.content}</p>
                  <div
                    className="iconButton"
                    onClick={() => toggleDeletePopup(item)}
                  >
                    <img src={DEL_ICON} alt="delete-icon" className="icon" />
                  </div>
                </div>
                <div style={{ paddingLeft: "10px", paddingBottom: "1px" }}>
                  <i>
                    <p style={{ color: "#FFFFFF" }}>
                      Created At: {moment(item?.createdAt).format("hh:mm A, ")}
                      {moment(item?.createdAt).format("MMM D, YYYY")} (
                      {moment(item?.createdAt).fromNow()})
                    </p>
                  </i>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <CustomPopup
        onClose={popupCloseHandler}
        show={visibility}
        title="Delete Todo"
      >
        <p>Are you sure you want to delete this todo?</p>

        <div className="popupBtnDiv">
          <div className="okayBtn" onClick={() => _handleDeleteTodo()}>
            <h3>OK</h3>
          </div>
          <div className="cancelBtn" onClick={() => setVisibility(!visibility)}>
            <h3>Cancel</h3>
          </div>
        </div>
      </CustomPopup>
    </div>
  );
}

export default App;
