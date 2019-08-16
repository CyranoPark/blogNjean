import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import debounce from 'lodash.debounce';
import findTagName from './utils/findTagName';
import { changeDateFormat, changeTitleFormat } from './utils/changeFormat';
import '../style/Articles.less';

export default class Articles extends Component {
  constructor(props) {
    super(props);

    this.onArticlesScroll = debounce(this.onPageEndScroll.bind(this), 200);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onArticlesScroll);
  }

  componentDidUpdate() {
    if (this.props.isTagClicked) {
      window.removeEventListener('scroll', this.onArticlesScroll);
    } else {
      window.addEventListener('scroll', this.onArticlesScroll);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onArticlesScroll);
  }

  onPageEndScroll() {
    const { pageIndex, onScrollDown } = this.props;

    const scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    const scrollTop = Math.max(
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
    const { clientHeight } = document.documentElement;

    if (scrollHeight - scrollTop - clientHeight <= 200) {
      const newPageIndex = pageIndex + 1;
      onScrollDown(newPageIndex);
    }
  }

  render() {
    const {
      articles,
      filteredArticlesByTag,
      isTagClicked,
      tags,
      selectedTag,
      changePostsSorting,
      currentSorting,
      onTagClick,
      onTagCancleBtnClick
    } = this.props;

    const sortIconClassName = currentSorting === 'dsc' ? 'fas fa-sort-down' : 'fas fa-sort-up';
    const targetArticleList = isTagClicked ? filteredArticlesByTag : articles;
    const renderSelectedTagName = (
      isTagClicked ? (
        <div className="selected-tag">
          <span onClick={onTagCancleBtnClick}>
            #
            {findTagName(selectedTag, tags)}
            <i className="fas fa-times" />
          </span>
        </div>
      ) : null
    );

    const articlesLink = targetArticleList.map((post, i) => {
      const tagsOnArticles = post.tags.map((tag, index) => {
        return (
          <button key={index} type="button">
            #
            {findTagName(tag, tags)}
          </button>
        );
      });

      const createdDate = changeDateFormat(post.created_at, false);

      return (
        <Link key={i} to={`/articles/${changeTitleFormat(post.title)}`}>
          <li className="post-item">
            <img src={post.thumbnail_image_url} alt={post.title} />
            <div className="post-detail-info">
              <h3>{post.title}</h3>
              <div className="post-create-data">
                <p>written by {post.by}</p>
                <p>created at {createdDate}</p>
                <p>{post.comments_count} comments</p>
              </div>
              <div className="tags-on-article">{tagsOnArticles}</div>
            </div>
          </li>
        </Link>
      );
    });

    const tagNames = tags.map((tag, i) => {
      return (
        <li key={i} className="tag" onClick={_.partial(onTagClick, tag.id)}>
          #
          {tag.name}
        </li>
      );
    });

    return (
      <div className="contents-container">
        <section className="posts-container">
          <div className="post-title">
            Posts
          </div>
          <div className="post-sort">
            <div className="selected-tag">
              {renderSelectedTagName}
            </div>
            <span onClick={changePostsSorting}>
              시간 순
              <i
                className={sortIconClassName}
              />
            </span>
          </div>
          <div className="post">
            <ul className="post-list">
              {articlesLink}
            </ul>
          </div>
        </section>
        <section className="tags-container">
          <div className="tag-title">
            Tags
          </div>
          <ul className="tag-list">
            {tagNames}
          </ul>
        </section>
      </div>
    );
  }
}
