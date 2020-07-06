import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import $ from "jquery";
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap/dist/js/bootstrap.min.js";
import './index.css';
import {GlobalProvider} from "./context/GlobalContext";

ReactDOM.render(
  <React.StrictMode>
    <GlobalProvider>
    	<App />
    </GlobalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
