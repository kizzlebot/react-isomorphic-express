import React from 'react';






var GithubAPI = React.createClass({
  render() {
    return (
      <div>
        <h2><i className="fa fa-github" />GitHub API</h2>
        <div className="btn-group btn-group-justified"><a href="http://developer.github.com/guides/getting-started/" target="_blank" className="btn btn-primary"><i className="fa fa-check-square-o" />Getting Started</a><a href="https://apigee.com/console/github" target="_blank" className="btn btn-primary"><i className="fa fa-laptop" />API Console</a><a href="http://developer.github.com/v3/" target="_blank" className="btn btn-primary"><i className="fa fa-file-text-o" />Documentation</a></div><br />
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h3 className="panel-title">Repository Information</h3>
          </div>
          <div className="panel-body">
            <div className="row">
              <div className="col-xs-4"><img src="https://github.global.ssl.fastly.net/images/modules/logos_page/Octocat.png" className="img-rounded img-responsive" /></div>
              <div className="col-xs-8">

                <h4></h4>
                <ul className="list-inline">
                  <li><i className="fa fa-eye-slash" /></li>
                  <li><i className="fa fa-star" /></li>
                  <li><i className="fa fa-code-fork" /></li>
                  <li><i className="fa fa-code" /></li>
                </ul><strong>DESCRIPTION</strong>
                {/* p= repo.description*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});






export default GithubAPI;