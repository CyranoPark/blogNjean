import React, { Component } from 'react';
import { changeDateFormat } from './utils/changeFormat';
import arraySortByDate from './utils/arraySortByDate'
import '../style/ArticleDetail.less';

export default class AticlesDetail extends Component {

  componentDidMount() {
    const { loadDetail } = this.props;
    const articleTitle = this.props.match.params.articleTitle;

    loadDetail(articleTitle);
  }

  renderArticle(data) {
    const renderTagNames = data.tagNames.map((tag, i) => {
      return <button key={i} type="button">#{tag}</button>;
    });

    return (
      <div>
        <div>
          <button
            className="backbtn"
            onClick={this.props.history.goBack}
            type="button"
          >
            목록으로
          </button>
        </div>
        <div className="detail-post-id">포스트 번호 : {data.id}</div>
        <div className="detail-title">{data.title}</div>
        <div className="detail-create-info">
          <div className="detail-by">작성자 : {data.by}</div>
          <div className="detail-date">
            {`작성 시간 : ${changeDateFormat(data.created_at, true)}`}
          </div>
          <div className="detail-tags">{renderTagNames}</div>
        </div>
        <div className="post-detail-paragraph">{data.body}</div>
      </div>
    );
  }

  renderComments(list) {
    arraySortByDate(list, 'created_at', false);
    return list.map((data, i) => {
      return (
        <div className="comment-container" key={i}>
          <div className="comment-id">{data.id}</div>
          <div className="comment-contents">
            <div className="comment-info">
              <div>{data.by}</div>
              <div>
                {`작성 시간 : ${changeDateFormat(data.created_at, true)}`}
              </div>
            </div>
            <div className="comment-mention">{data.text}</div>
          </div>
        </div>
      );
    });
  }

  render() {
    const {currentArticleData, commentsOnCurArticle} = this.props;

    if (!Object.keys(currentArticleData).length) {
      return <div>Loading.....</div>;
    }

    return (
      <section className="post-detail">
        <div>
          {this.renderArticle(currentArticleData)}
        </div>
        <div className="post-comments-container">
          <div className="post-comments-title">
            Comments
          </div>
          {this.renderComments(commentsOnCurArticle)}
        </div>
      </section>
    );
  }
}
