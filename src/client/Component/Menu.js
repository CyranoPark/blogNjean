import React from 'react';
import { Link } from 'react-router-dom';
import '../style/Menu.less';

export default function Menu(props) {
  const resetArticlesPage = props.resetArticlesPage;

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
            <Link to="/">Home</Link>
          </li>
          <li className="articles">
            <Link to="/articles" onClick={resetArticlesPage}>articles</Link>
          </li>
          <li className="admin">
            <Link to="/admin">admin</Link>
          </li>
          {renderAdminMenu(props.location.pathname)}
        </ul>
      </div>
    </section>
  );
}
