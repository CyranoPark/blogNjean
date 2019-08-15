import React, { Component } from 'react';
import changeDateFormat from './utils/changeDateFormat.js';
import '../style/Posts.less';

export default class Posts extends Component {
  constructor(props) {
    super(props);

  }

  renderPostList() {
    const { currentArticleList, pageLimit, onDeleteBtnClick } = this.props;

    currentArticleList.length = pageLimit;
    currentArticleList.fill(null, currentArticleList.length - 1, pageLimit)

    return currentArticleList.map((post, i) => {
      if (!post) {
        return <tr key={i}></tr>;
      }

      const { created_at : createDate, title, by } = post;
      return (
        <tr key={i}>
          <th scope="row">{changeDateFormat(createDate, false)}</th>
          <td className="postlist-title">{title}</td>
          <td className="postlist-by">{by}</td>
          <td className="delete-icon">
            <i
              className="far fa-trash-alt"
              onClick={() => onDeleteBtnClick(post.id)}
            />
          </td>
        </tr>
      );
    });
  }

  renderPagination() {
    const { totalPostCount, pageLimit, pageIndex, onPaginationClick } = this.props;
    const lastPageIndex = Math.ceil(totalPostCount / pageLimit) - 1;

    return (
      <div className="postlist-pagination">
        <div className="postlist-pagination-backward">
          {
            pageIndex ?
            <i
              className="fas fa-2x fa-backward"
              onClick={() => onPaginationClick(pageIndex - 1)}
            /> : null
          }
        </div>
        <div className="postlist-pagination-forward">
          {
            lastPageIndex > pageIndex ?
            <i
              className="fas fa-2x fa-forward"
              onClick={() => onPaginationClick(pageIndex + 1)}
            /> : null
          }
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="admin-post-list">
        <h2>포스트 관리</h2>
        <table className="posts-table">
          <thead>
            <tr>
                <th scope="cols">작성일
                  <i
                    className={this.props.curSortMethod === 'dsc' ? 'fas fa-sort-down' : 'fas fa-sort-up'}
                    onClick={this.props.onSortBtnClick}
                  />
                </th>
                <th scope="cols">제목</th>
                <th scope="cols">작성자</th>
                <th scope="cols">삭제</th>
            </tr>
          </thead>
          <tbody>
            {this.renderPostList()}
          </tbody>
        </table>
        {this.renderPagination()}
      </div>
    );
  }

}