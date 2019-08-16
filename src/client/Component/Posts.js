import React from 'react';
import _ from 'lodash';
import { changeDateFormat } from './utils/changeFormat';
import '../style/Posts.less';

export default function Posts(props) {
  const {
    currentArticleList,
    pageLimit,
    pageIndex,
    totalPostCount,
    onDeleteBtnClick,
    onPaginationClick,
    onSortBtnClick,
    curSortMethod
  } = props;
  const sortBtnClassName = curSortMethod === 'dsc' ? 'fas fa-sort-down' : 'fas fa-sort-up';

  function renderPostList() {
    currentArticleList.length = pageLimit;
    currentArticleList.fill(null, currentArticleList.length - 1, pageLimit);

    return currentArticleList.map((post, i) => {
      if (!post) {
        return <tr key={i} />;
      }

      const {
        id,
        created_at: createDate,
        title,
        by: writer
      } = post;

      return (
        <tr key={i}>
          <th scope="row">{changeDateFormat(createDate, false)}</th>
          <td className="postlist-title">{title}</td>
          <td className="postlist-by">{writer}</td>
          <td className="delete-icon">
            <i
              className="far fa-trash-alt"
              onClick={() => onDeleteBtnClick(id)}
            />
          </td>
        </tr>
      );
    });
  }

  function renderPagination() {
    const lastPageIndex = Math.ceil(totalPostCount / pageLimit) - 1;

    return (
      <div className="postlist-pagination">
        <div className="postlist-pagination-backward">
          {
            pageIndex ? (
              <i
                className="fas fa-2x fa-backward"
                onClick={_.partial(onPaginationClick, pageIndex - 1)}
              />
            ) : null
          }
        </div>
        <div className="postlist-pagination-forward">
          {
            lastPageIndex > pageIndex ? (
              <i
                className="fas fa-2x fa-forward"
                onClick={_.partial(onPaginationClick, pageIndex + 1)}
              />
            ) : null
          }
        </div>
      </div>
    );
  }

  return (
    <div className="admin-post-list">
      <h2>포스트 관리</h2>
      <table className="posts-table">
        <thead>
          <tr>
            <th scope="cols">
              작성일
              <i
                className={sortBtnClassName}
                onClick={onSortBtnClick}
              />
            </th>
            <th scope="cols">제목</th>
            <th scope="cols">작성자</th>
            <th scope="cols">삭제</th>
          </tr>
        </thead>
        <tbody>
          {renderPostList()}
        </tbody>
      </table>
      {renderPagination()}
    </div>
  );
}
