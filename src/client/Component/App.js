import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Articles from './Articles';
import Admin from './Admin';
import AticlesDetail from './ArticleDetail';
import ErrorMessage from './ErrorMessage';
import Menu from './Menu';
import {
  getPostList,
  getAllTags,
  getArticleDetail,
  getCommentsOnArticle
} from './utils/api';
import { changeTitleFormat } from './utils/changeFormat';
import arraySortByDate from './utils/arraySortByDate';
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
      selectedTag: null,
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
    this.onTagCancleBtnClick = this.unpackTagFilter.bind(this);
    this.resetArticlesPage = this.resetArticleList.bind(this);
  }

  componentDidMount() {
    const { pageLimit, currentSorting, pageIndex } = this.state;
    const fetchArticleList = getPostList(pageLimit, currentSorting, pageIndex);
    const fetchAllTags = getAllTags();

    Promise.all([fetchArticleList, fetchAllTags])
      .then(([{ posts }, tagList]) => {
        this.setState({
          articles: posts,
          tags: tagList
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
    }

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

  fetchArticleDetail(articleTitle) {
    const { articles, tags: tagList } = this.state;
    let postId;

    articles.forEach((article) => {
      if (changeTitleFormat(article.title) === articleTitle) {
        postId = article.id;
      }
    });
    const fetchArticleComments = getCommentsOnArticle(postId);
    const fetchArticleContents = getArticleDetail(postId)
      .then((detail) => {
        const tagsOnArticles = detail.tags.map((tag) => {
          for (let i = 0; i < tagList.length; i++) {
            if (tagList[i].id === tag) {
              return tagList[i].name;
            }
          }
          return false;
        });

        detail.tagNames = tagsOnArticles;
        return detail;
      });

    Promise.all([fetchArticleContents, fetchArticleComments])
      .then(([contents, comments]) => {
        this.setState({
          currentArticleData: contents,
          commentsOnCurArticle: comments
        });
      })
      .catch(() => {
        this.setState({
          isPageLoadError: true
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

    const willChangeSortMethod = currentSorting === sortMethods[0] ? sortMethods[1] : sortMethods[0];

    if (isTagClicked) {
      let filteredArticleList;

      if (currentSorting === sortMethods[0]) {
        filteredArticleList = arraySortByDate(filteredArticlesByTag, 'created_at', sortMethods[1]);
      } else {
        filteredArticleList = arraySortByDate(filteredArticlesByTag, 'created_at', sortMethods[0]);
      }

      this.setState({
        filteredArticlesByTag: filteredArticleList,
        currentSorting: willChangeSortMethod
      });
    } else {
      getPostList(pageLimit, willChangeSortMethod, pageIndex)
        .then((articles) => {
          const { posts } = articles;

          this.setState({
            articles: posts,
            currentSorting: willChangeSortMethod
          });
        });
    }
  }

  filterArticlesByTag(tagId) {
    const { articles, sortMethods } = this.state;
    const filteredPosts = articles.filter((article) => {
      if (article.tags.includes(tagId)) {
        return article;
      }
      return false;
    });
    arraySortByDate(filteredPosts, 'created_at', sortMethods[0]);

    this.setState({
      filteredArticlesByTag: filteredPosts,
      currentSorting: sortMethods[0],
      selectedTag: tagId,
      isTagClicked: true
    });
  }

  resetArticleList() {
    const { pageLimit, sortMethods } = this.state;
    const fetchArticleList = getPostList(pageLimit, sortMethods[0], 0);
    const fetchAllTags = getAllTags();

    Promise.all([fetchArticleList, fetchAllTags])
      .then(([{ posts }, tagList]) => {
        this.setState({
          articles: posts,
          tags: tagList,
          selectedTag: null,
          isTagClicked: false,
          pageIndex: 0,
        });
      });
  }

  unpackTagFilter() {
    this.setState({
      selectedTag: null,
      isTagClicked: false
    });
  }

  goBackBeforeError() {
    this.setState({
      isPageLoadError: false
    });
  }

  changeTheme(themeIndex) {
    const { themes } = this.state;
    this.setState({
      currentTheme: themes[themeIndex]
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
      selectedTag,
      commentsOnCurArticle,
      isPageLoadError
    } = this.state;

    if (isPageLoadError) {
      return <Route component={ErrorMessage} />;
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
                render={(props) =>
                  <Articles
                    {...props}
                    articles={articles}
                    filteredArticlesByTag={filteredArticlesByTag}
                    tags={tags}
                    pageIndex={pageIndex}
                    onTagClick={this.onTagClick}
                    onTagCancleBtnClick={this.onTagCancleBtnClick}
                    onScrollDown={this.onScrollDown}
                    isTagClicked={isTagClicked}
                    selectedTag={selectedTag}
                    changePostsSorting={this.changePostsSorting}
                    currentSorting={currentSorting}
                  />
                }
              />
              <Route
                path="/articles/:articleTitle"
                render={(props) =>
                  articles.length ? (
                    <AticlesDetail
                      {...props}
                      tags={tags}
                      loadDetail={this.loadArticle}
                      currentArticleData={currentArticleData}
                      commentsOnCurArticle={commentsOnCurArticle}
                    />
                  ) : null
                }
              />
              <Route
                path="/admin"
                render={(props) =>
                  <Admin
                    {...props}
                    onThemeBtnClick={this.onThemeBtnClick}
                    resetArticlesPage={this.resetArticlesPage}
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
