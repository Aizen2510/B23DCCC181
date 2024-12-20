import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [color, setColor] = useState('white');
  const [colorHistory, setColorHistory] = useState([]);

  const hexToColorName = (hex) => {
    const colorNames = {
      '#cdf639': 'Lime Green',
      '#ff5733': 'Red',
      '#3498db': 'Blue',
      '#2ecc71': 'Emerald',

    };
    return colorNames[hex] || hex;
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex].text = taskInput;
      setTasks(updatedTasks);
      setEditIndex(null);
    } else {
      setTasks([...tasks, { text: taskInput, completed: false }]);
    }
    setTaskInput('');
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleToggleComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const handleEditTask = (index) => {
    setTaskInput(tasks[index].text);
    setEditIndex(index);
  };

  const handleSearchImages = (e) => {
    e.preventDefault();
    axios
      .get(`https://pixabay.com/api/?key=46166847-40e887f0f1cbd269c98d3b401&q=${query.trim()}&image_type=photo`)
      .then((response) => setImages(response.data.hits))
      .catch((error) => console.log(error));
  };

  const changeColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setColor(randomColor);
    setColorHistory((prevHistory) => [randomColor, ...prevHistory]);
  };

  const undoColor = () => {
    if (colorHistory.length > 1) {
      setColorHistory((prevHistory) => prevHistory.slice(1));
      setColor(colorHistory[1]);
    }
  };

  return (
    <div className="App">
      <div className="main-container">
        <div className="todoList">
          <h1>Todo List</h1>
          <form onSubmit={handleAddTask}>
            <input
              type="text"
              placeholder="Nội dung công việc"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            />
            <button type="submit">{editIndex !== null ? 'Lưu lại' : 'Thêm'}</button>
          </form>
          <ul>
            {tasks.map((task, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(index)}
                />
                {editIndex === index ? (
                  <input
                    type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                  />
                ) : (
                  <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                    {task.text}
                  </span>
                )}
                <button onClick={() => handleEditTask(index)}>Chỉnh sửa</button>
                <button onClick={() => handleDeleteTask(index)}>Xóa</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="imageSearch">
          <h1>Tìm kiếm hình ảnh</h1>
          <form onSubmit={handleSearchImages}>
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Tìm</button>
          </form>
          <div className="image-grid">
            {images.map((image) => (
              <img key={image.id} src={image.webformatURL} alt={image.tags} />
            ))}
          </div>
        </div>

        <div className="colorChanger">
          <h1>Random Color</h1>
          <button onClick={changeColor}>Change Background Color</button>
          <button onClick={undoColor}>Undo</button>
          <div>
            <h3>Current Color: <span>{hexToColorName(color)}</span></h3>
            <div className="color-box" style={{ backgroundColor: color }}></div>
          </div>
          <ul className="colorHistory">
            {colorHistory.map((clr, index) => (
              <li key={index}>{hexToColorName(clr)}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
