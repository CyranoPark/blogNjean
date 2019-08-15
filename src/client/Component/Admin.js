import React, { Component } from 'react';
import { Route, Switch, Link, Redirect } from 'react-router-dom';
import { getPostList, deleteArticle } from './utils/api';
import Posts from './Posts';
import Theme from './Theme';

export default class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentArticleList : [],
      totalPostCount : 0,
      pageIndex : 0,
      pageLimit : 10,
      curSortMethod : 'dsc',
      sortMethods : ['dsc', 'asc']
    };

    this.onPaginationClick = this.getListOfNewPage.bind(this);
    this.onDeleteBtnClick = this.deletePost.bind(this);
    this.onSortBtnClick = this.changecurSortMethod.bind(this);
  }

  componentDidMount() {
    const { curSortMethod, pageLimit, pageIndex } = this.state;

    getPostList(pageLimit, curSortMethod, pageIndex)
      .then(articles => {
        const { posts, total_post_count } = articles;

        this.setState({
          currentArticleList : posts,
          totalPostCount : total_post_count
        });
      })
  }

  getListOfNewPage(newIndex) {
    const { curSortMethod, pageLimit } = this.state;

    getPostList(pageLimit, curSortMethod, newIndex)
      .then(articles => {
        const { posts } = articles;

        this.setState({
          currentArticleList : posts,
          pageIndex : newIndex
        });
      })
  }

  deletePost(articleId) {
    const { curSortMethod, pageLimit, pageIndex } = this.state;

    deleteArticle(articleId)
      .then((res) => {
        alert(`${res.result}`);

        getPostList(pageLimit, curSortMethod, pageIndex)
          .then(articles => {
            const { posts, total_post_count } = articles;

            this.setState({
              currentArticleList : posts,
              totalPostCount : total_post_count
            });
          })
      })
  }

  changecurSortMethod() {
    const { curSortMethod, sortMethods, pageLimit, pageIndex } = this.state;
    const willChangeSortMethod = curSortMethod === sortMethods[0] ? sortMethods[1] : sortMethods[0];

    getPostList(pageLimit, willChangeSortMethod, pageIndex)
      .then(articles => {
        const { posts } = articles;

        this.setState({
          currentArticleList : posts,
          curSortMethod : willChangeSortMethod
        });
      })

  }

  render() {
    const {currentArticleList, totalPostCount, pageIndex, pageLimit, curSortMethod } = this.state;

    if (!currentArticleList.length) {
      return <div>loading...</div>
    }
    return (
    <div>
        <Route
          exact path='/admin'
          render={() => <Redirect to='/admin/posts' />}
        />
        <Route
            path='/admin/posts'
            render={props =>
              <Posts
                {...props}
                currentArticleList={currentArticleList}
                totalPostCount={totalPostCount}
                pageIndex={pageIndex}
                pageLimit={pageLimit}
                curSortMethod={curSortMethod}
                onPaginationClick={this.onPaginationClick}
                onDeleteBtnClick={this.onDeleteBtnClick}
                onSortBtnClick={this.onSortBtnClick}
              />
            }
          />
        <Route
          exact path='/admin/theme'
          render={props =>
            <Theme
              {...props}
              onThemeBtnClick={this.props.onThemeBtnClick}
            />
          }
        />
    </div>
    );
  }
}
