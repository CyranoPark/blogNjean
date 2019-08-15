import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import debounce from 'lodash.debounce';
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
    const scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    const scrollTop = Math.max(
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
    const clientHeight = document.documentElement.clientHeight;

    if (scrollHeight - scrollTop - clientHeight <= 200) {
      const newPageIndex = this.props.pageIndex + 1;
      this.props.onScrollDown(newPageIndex);
    }
  };

  render () {
    const { articles, filteredArticlesByTag, isTagClicked, tags, changePostsSorting, currentSorting } = this.props;
    let targetArticleList;

    if (isTagClicked) {
      targetArticleList = filteredArticlesByTag;
    } else {
      targetArticleList = articles;
    }

    const articlesLink = targetArticleList.map((post, i) => {

      const tagsOnArticles = post.tags.map((tag, i) => {
        for (let i = 0; i < tags.length; i++) {
          if (tags[i].id === tag) {
            return <label key={i}>#{tags[i].name}</label>;
          }
        }
      });

      const createdDate = `${new Date(post.created_at).getFullYear()}년 ${new Date(post.created_at).getMonth() + 1}월 ${new Date(post.created_at).getDate()}일`

      return (
        <Link key={i} to={`/articles/${post.title.replace('?', "_")}`}>
          <li className="post-item">
            <img src={post.thumbnail_image_url}/>
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
        <li key={i} className="tag" onClick={_.partial(this.props.onTagClick, tag.id)}>
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
            <span onClick={changePostsSorting}>
              시간 순
              <i
                className={currentSorting === 'dsc' ? 'fas fa-sort-down' : 'fas fa-sort-up'}
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
