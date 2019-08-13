import React from 'react';
import { Link } from 'react-router-dom'
import '../style/Articles.less';
import { italic } from 'ansi-colors';

export default function Articles(props) {
  const { articles, tags } = props;

  const articlesLink = articles.map((post, i) => {

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
      <div key={i} className="tag">
        <Link to='/articles'>
          <label>{tag.name}</label>
        </Link>
      </div>
    );
  });
  return (
    <div className="contents-container">
      <section className="posts-container">
        <div className="post-title">
          Posts
        </div>
        <div className="post-sort">
          <select>
            <option>최신 순</option>
            <option>오래된 순</option>
          </select>
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
        {tagNames}
      </section>
    </div>
  );
}
