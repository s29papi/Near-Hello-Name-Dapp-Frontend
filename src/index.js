import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { initContract } from './utils'

initContract()
  .then(() => {
ReactDOM.render(

    <App />,

  document.getElementById('root')
);
});
