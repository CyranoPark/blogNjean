import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Articles from './Articles';
import Admin from './Admin';
import AticlesDetail from './ArticleDetail';
import ErrorMessage from './ErrorMessage';
import Menu from './Menu';
import { getPostList, getAllTags, getArticleDetail, getCommentsOnArticle } from './utils/api';
import '../style/App.less';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      articles: [],
      filteredArticlesByTag: [],
      tags: [],
      pageIndex: 0,
      pageLimit: 10,
      currentArticleData: {},
      commentsOnCurArticle: [],
      currentSorting: 'dsc',
      sortMethods: ['dsc', 'asc'],
      isTagClicked: false,
      isPageLoadError: false,
      currentTheme: 'white',
      themes: ['white', 'second', 'third']
    };

    this.loadArticle = this.fetchArticleDetail.bind(this);
    this.changePostsSorting = this.changeArticlesSort.bind(this);
    this.onScrollDown = this.getAdditionalList.bind(this);
    this.onTagClick = this.filterArticlesByTag.bind(this);
    this.onBackButtonClick = this.goBackBeforeError.bind(this);
    this.onThemeBtnClick = this.changeTheme.bind(this);
  }

  componentDidMount() {
    const { pageLimit, currentSorting, pageIndex } = this.state;

    getPostList(pageLimit, currentSorting, pageIndex)
      .then((articleList) => {
        const { posts } = articleList;

        getAllTags().then((allTags) => {
          this.setState({
            articles: posts,
            tags: allTags
          });
        });
      });
  }

  changeArticlesSort() {
    const {
      filteredArticlesByTag,
      pageLimit,
      pageIndex,
      currentSorting,
      sortMethods,
      isTagClicked
    } = this.state;

    let curSortMethod;
    if (currentSorting === sortMethods[0]) {
      curSortMethod = sortMethods[1];
    } else {
      curSortMethod = sortMethods[0];
    }
    console.log(curSortMethod)
    if (isTagClicked) {
      filteredArticlesByTag.sort(function (a, b) {
        if (currentSorting === sortMethods[0]) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        return new Date(a.created_at) - new Date(b.created_at);
      });

      this.setState({
        filteredArticlesByTag : filteredArticlesByTag,
        currentSorting: curSortMethod,
        pageIndex: 0
      });

    } else {
      getPostList(pageLimit, curSortMethod, pageIndex)
      .then((articles) => {
        const { posts } = articles;

        this.setState({
          articles: posts,
          currentSorting: curSortMethod,
          pageIndex: 0
        });
      });
    }
  }

  fetchArticleDetail(articleTitle, articleID) {
    const { articles, tags : tagList } = this.state;

    let postId = articleID

    if (!articleID) {
      articles.forEach(article => {
        if (article.title.replace("?", "_") === articleTitle) {
          postId = article.id;
        }
      });
    }

    getArticleDetail(postId)
      .then((detail) => {
        const tagsOnArticles = detail.tags.map(tag => {
          for (let i = 0; i < tagList.length; i++) {
            if (tagList[i].id === tag) {
              return tagList[i].name;
            }
          }
        });
        detail.tagNames = tagsOnArticles;

        return detail;
      })
      .then((detail) => {
        getCommentsOnArticle(postId)
          .then((comments) => {
            this.setState({
              currentArticleData : detail,
              commentsOnCurArticle: comments
            });
          })
      })
      .catch (() => {
        this.setState({
          isPageLoadError: true
        });
      });
  }

  getAdditionalList(requestIndex) {
    const {
      pageIndex,
      pageLimit,
      currentSorting,
      articles
    } = this.state;

    if (requestIndex <= pageIndex) {
      return;
    } else {
      getPostList(pageLimit, currentSorting, pageIndex)
      .then((articleList) => {
        const { posts } = articleList;
        const mergedPosts = articles.concat(posts);

        this.setState({
          articles: mergedPosts,
          pageIndex: requestIndex
        });
      });
    }
  }

  filterArticlesByTag(tagId) {
    const { articles, sortMethods } = this.state;
    const filteredPosts = articles.filter(article => {
      if (article.tags.includes(tagId)) {
        return article;
      }
    })
    this.setState({
      filteredArticlesByTag: filteredPosts,
      currentSorting : sortMethods[0],
      isTagClicked: true
    });
  }

  goBackBeforeError () {
    this.setState({
      isPageLoadError: false
    });
  }

  changeTheme(themeIndex) {
    this.setState({
      currentTheme: this.state.themes[themeIndex]
    });
  }

  render() {
    const {
      currentTheme,
      articles,
      filteredArticlesByTag,
      tags, currentArticleData,
      currentSorting,
      pageIndex,
      isTagClicked,
      commentsOnCurArticle,
      isPageLoadError
    } = this.state;

    if (isPageLoadError) {
      return (
        <Route
          render={props =>
            <ErrorMessage
              {...props}
              onBackButtonClick={this.onBackButtonClick}
            />
          }
        />
      );
    }

    return (
      <div id={`theme-${currentTheme}`}>
        <header className="title">Hanjun Blog N Jean</header>
        <div className="app">
          <Route component={Menu} />
          <section className="contents">
          <Switch>
            <Route
              exact path="/"
              render={() => <Redirect to="/articles" />}
            />
            <Route
              exact path="/articles"
              render={props =>
                <Articles
                  {...props}
                  articles={articles}
                  filteredArticlesByTag={filteredArticlesByTag}
                  tags={tags}
                  pageIndex={pageIndex}
                  onTagClick={this.onTagClick}
                  onScrollDown={this.onScrollDown}
                  isTagClicked={isTagClicked}
                  changePostsSorting={this.changePostsSorting}
                  currentSorting={currentSorting}
                />
              }
            />
            <Route
              path='/articles/:articleTitle'
              render={props => {
                if (!articles.length) {
                  return null;
                }
                return (
                  <AticlesDetail
                    {...props}
                    tags={tags}
                    loadDetail={this.loadArticle}
                    currentArticleData={currentArticleData}
                    commentsOnCurArticle={commentsOnCurArticle}
                  />
                );
              }}
            />
            <Route
              path='/admin'
              render={(props) =>
                <Admin
                  {...props}
                  onThemeBtnClick={this.onThemeBtnClick}
                />
              }
            />
          </Switch>
          </section>
        </div>
      </div>
    );
  }
}
