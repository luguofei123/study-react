import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import App from './views/Layout'
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
// 由于是使用脚手架创建项目，默认会开启严格模式，在严格模式下，React 的开发环境会刻意执行两次渲染，用于突出显示潜在问题。
root.render(
  <React.StrictMode>

    <Router><App /></Router>

  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
