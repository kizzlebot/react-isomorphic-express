import React from 'react';
import { render } from 'react-dom';

import githubApi from "apis/github";
import favicon from "favicon.ico";

import Header from './partials/header';
import Footer from './partials/footer';


import InlineCss from "react-inline-css";
import Transmit from "react-transmit";




// var App = React.createClass({
//   render(){
//     return (
//       <div>
//         <Header ref={'header'} />

//         <div className={'container'}>
//          {React.cloneElement(this.props.children, {
//            key: this.props.location.pathname
//          })}
//         </div>
//         <Footer/>
//       </div>
//     );
//   }
// });

// export default App;





const stylesheet = require("!raw!sass!./style/css/main.scss");


const fetchStargazers  = (page, per_page = 100) => {
  return githubApi.browse(
    ["repos", "RickWong/react-isomorphic-starterkit", "stargazers"],
    { query: { page, per_page } }
  ).then(json => {
    return (json || []).map(({id, login}) => ({id, login}));
  }).catch(error => {
    throw error;
  });
};

/**
 * App React application entry-point for both the server and client.
 */
class App extends React.Component {
  /**
   * componentWillMount() runs on server and client.
   */
  componentWillMount () {
    if (__SERVER__) {
      console.log("Hello server");
    }

    if (__CLIENT__) {
      console.log("Hello client");
    }
  }

  /**
   * componentDidUpdate() only runs on the client.
   */
  componentDidUpdate (prevProps, prevState) {
    if (!this.props.additionalStargazers) {
      return;
    }

    this.loadMoreStargazersOnClient();
  }

  /**
   * Load more stargazers.
   */
  loadMoreStargazersOnClient () {
    const {additionalStargazers = [], transmit} = this.props;
    let {nextPage, pagesToFetch} = transmit.variables;

    if (--pagesToFetch <= 0) {
      return;
    }

    ++nextPage;

    transmit.forceFetch({
      nextPage,
      pagesToFetch,
      additionalStargazers
    }, "additionalStargazers");
  }

  /**
   * Runs on server and client.
   */
  render () {
    const repositoryUrl = "https://github.com/RickWong/react-isomorphic-starterkit";
    const avatarSize    = 32;
    const avatarUrl     = (id) => `https://avatars.githubusercontent.com/u/${id}?v=3&s=${avatarSize}`;

    /**
     * This is a Transmit fragment.
     */
    let {stargazers, additionalStargazers} = this.props;

    if (additionalStargazers) {
      stargazers = stargazers.concat(additionalStargazers);
    }

    return (
      <InlineCss stylesheet={stylesheet} namespace="App">
          <Header ref={'header'} />
          <div className={'container'}>
            {React.cloneElement(this.props.children, {
              key: this.props.location.pathname
            })}
            <div className={'row'}>
              {stargazers && stargazers.map(user =>
                <a key={user.id} href={"https://github.com/"+user.login} title={user.login} target="_blank">
                  <img className="avatar" src={avatarUrl(user.id)} alt={user.login} />
                </a>
              )}
            </div>
          </div>
          <Footer/>

      </InlineCss>
    );
  }
}

/**
 * Use Transmit to query and return GitHub stargazers as a Promise.
 */
export default Transmit.createContainer(App, {
  initialVariables: {
    nextPage:       2,
    pagesToFetch:   15,
    additionalStargazers: []
  },
  fragments: {
    /**
     * Load first stargazers.
     */
    stargazers: () => fetchStargazers(1),
    /**
     * Load more stargazers deferred.
     */
    additionalStargazers: ({nextPage, additionalStargazers}) => {
      return () => fetchStargazers(nextPage).then(newStargazers => {
        newStargazers = newStargazers.map(({id, login}) => {
          return { id, login };
        });

        return additionalStargazers.concat(newStargazers);
      });
    }
  }
});

