/*
istanbul ignore file
*/
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import Tasklist from './task1_TodoList/Tasklist';
import reportWebVitals from './reportWebVitals';
import Candidate from './webRTC/Candidate'
import Admin from './webRTC/Admin'
import HttpAdmin from './webRTC/HttpAdmin'
ReactDOM.render(
  
  <React.StrictMode>
    <HttpAdmin/>
    
   
    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
