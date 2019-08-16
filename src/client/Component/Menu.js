import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import '../style/Menu.less';

export default function Menu(props) {
  const reLoadPage = window.location.reload.bind(window.location);

  function renderAdminMenu(currentPath) {
    if (currentPath.includes('/admin')) {
      return (
        <ul className="submenu-list">
          <li className="submenu-posts">
            <Link to="/admin/posts">posts</Link>
          </li>
          <li className="submenu-theme">
            <Link to="/admin/theme">theme</Link>
          </li>
        </ul>
      );
    }
    return null;
  }

  return (
    <section className="menu">
      <div className="menu-title">
        MENU
      </div>
      <div>
        <ul className="menu-list">
          <li className="home">
            <Link to="/" onClick={reLoadPage}>Home</Link>
          </li>
          <li className="articles">
            <Link to="/articles" onClick={reLoadPage}>articles</Link>
          </li>
          <li className="admin">
            <Link to="/admin" onClick={reLoadPage}>admin</Link>
          </li>
          {renderAdminMenu(props.location.pathname)}
        </ul>
      </div>
    </section>
  );
}
