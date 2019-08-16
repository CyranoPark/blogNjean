import React from 'react';
import { Link } from 'react-router-dom';
import '../style/ErrorMessage.less';

export default function ErrorMessage() {
  return (
    <div className="notfound-container">
      <div className="notfound">
        <div className="notfound-404">
          <h1>Oops!</h1>
          <h2>404 - The Page can not be found</h2>
        </div>
        <a href="/">Go TO Homepage</a>
      </div>
    </div>
  );
}
