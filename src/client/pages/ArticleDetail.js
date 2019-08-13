import React, { Component } from 'react';

export default class AticlesDetail extends Component {

  componentDidMount() {
    this.props.loadDetail(this.props.match.params.articleTitle);
  }

  renderArticle (data) {
    return (
      <div>
        <div>{data.id}</div>
        <div>{data.by}</div>
        <div>{data.created_at}</div>
        <div>{data.title}</div>
        <div>{data.body}</div>
      </div>
    );
  }

  render () {
    if (!Object.keys(this.props.currentArticleData).length) {
      return <div>Loading.....</div>
    }

    return (<>
    {this.renderArticle(this.props.currentArticleData)}
    </>);
  }
}
