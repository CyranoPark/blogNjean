import React, { Component } from 'react';
import { Route, Switch, Link, Redirect } from 'react-router-dom';
import Articles from './Articles';
import Admin from './Admin';
import AticlesDetail from './ArticleDetail';
import { getPostList, getAllTags, getTagInfo, getArticleDetail } from './utils/api';
import '../style/App.less';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      articles: [],
      tags: [],
      currentArticleData: {}
    };
    this.loadArticle = this.accessArticleDetail.bind(this);
  }

  componentDidMount() {
    getPostList(10, 'dsc', 0)
      .then((articles) => {
        const { posts } = articles;

        getAllTags().then((allTags) => {
          this.setState({
            articles: posts,
            tags: allTags
          });
        });
      });
  }

  accessArticleDetail(articleTitle) {
    let articleID;
    this.state.articles.forEach(element => {
      if (element.title.replace("?","_") === articleTitle) {
        articleID = element.id;
      }
    });

    getArticleDetail(articleID)
      .then((detail) => {
        this.setState({
          currentArticleData : detail
        });
      })
  }

  render() {
    const { articles, tags, currentArticleData } = this.state;

    if (!articles.length) {
      return <div>loading...</div>;
    }
    return (
      <>
      <header className="title">Hanjun Blog N Jean</header>
      <div className="app">
        <section className="menu">
          <div className="menu-title">
            MENU
          </div>
          <div>
            <ul className="menu-list">
              <li className="Home"><Link to="/">Home</Link></li>
              <li className="Articles"><Link to="/articles">articles</Link></li>
              <li className="Admin"><Link to="/admin">admin</Link></li>
            </ul>
          </div>
        </section>
        <section className="contents">
        <Switch>
          <Route
            exact path="/"
            render={() => <Redirect to="/articles" />}
          />
          <Route
            exact path="/articles"
            render={props => <Articles {...props} articles={articles} tags={tags} />}
          />
          <Route path="/admin" component={Admin} />
          <Route
            exact path='/articles/:articleTitle'
            render={props => <AticlesDetail {...props} loadDetail={this.loadArticle}  currentArticleData={currentArticleData}/>}
          />
        </Switch>
        </section>
      </div>
      </>
    );
  }
}
