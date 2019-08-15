import React, { Component } from 'react';
import changeDateFormat from './utils/changeDateFormat.js';
import '../style/ArticleDetail.less';

export default class AticlesDetail extends Component {

  componentDidMount() {
    const { currentArticleData } = this.props;
    const articleTitle = this.props.match.params.articleTitle;

    if (currentArticleData.id) {
      this.props.loadDetail(articleTitle, currentArticleData.id);
    } else {
      this.props.loadDetail(articleTitle);
    }
  }

  renderArticle (data) {
    const renderTagNames = data.tagNames.map((tag, i) => {
      return <label key={i}>#{tag}</label>
    })
    return (
      <div>
        <div><button className="backbtn" onClick={this.props.history.goBack}>목록으로</button></div>
        <div className="detail-post-id">포스트 번호 : {data.id}</div>
        <div className="detail-title">{data.title}</div>
        <div className="detail-create-info">
          <div className="detail-by">작성자 : {data.by}</div>
          <div className="detail-date">
            {
              `작성 시간 : ${changeDateFormat(data.created_at, true)}`
            }
          </div>
          <div className="detail-tags">{renderTagNames}</div>
        </div>
        <div className="post-detail-paragraph">{data.body}</div>
      </div>
    );
  }

  renderComments (list) {
    list.sort(function (a, b) {
      return new Date(a.created_at) - new Date(b.created_at);
    });

    return list.map((data, i) => {
      return (
        <div className="comment-container" key={i}>
          <div className="comment-id">{data.id}</div>
          <div className="comment-contents">
            <div className="comment-info">
              <div>{data.by}</div>
              <div>
                {
                  `작성 시간 : ${new Date(data.created_at).getFullYear()}년
                   ${new Date(data.created_at).getMonth() + 1}월
                   ${new Date(data.created_at).getDate()}일
                   ${new Date(data.created_at).getHours()}시
                   ${new Date(data.created_at).getMinutes()}분
                   ${new Date(data.created_at).getSeconds()}초`
                }
              </div>
            </div>
            <div className="comment-mention">{data.text}</div>
          </div>
        </div>
      );
    });
  }

  render () {
    if (!Object.keys(this.props.currentArticleData).length) {
      return <div>Loading.....</div>
    }

    return (
      <section className="post-detail">
        <div>
          {this.renderArticle(this.props.currentArticleData)}
        </div>
        <div className="post-comments-container">
          <div className="post-comments-title">
            Comments
          </div>
          {this.renderComments(this.props.commentsOnCurArticle)}
        </div>
      </section>
    );
  }
}
