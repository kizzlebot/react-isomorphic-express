import React from 'react';


var LinkedIn = React.createClass({
  render() {
    return (
      <div>
        <div className="page-header">
          <h2><i className="fa fa-linkedin-square" />LinkedIn API</h2>
        </div>
        <div className="btn-group btn-group-justified"><a href="https://github.com/Kuew/node-linkedin" target="_blank" className="btn btn-primary"><i className="fa fa-book" />Node LinkedIn Docs</a><a href="http://developer.linkedin.com/documents/authentication" target="_blank" className="btn btn-primary"><i className="fa fa-check-square-o" />Getting Started</a><a href="http://developer.linkedin.com/apis" target="_blank" className="btn btn-primary"><i className="fa fa-code-fork" />API Endpoints</a></div>
        <h3 className="text-primary">My LinkedIn Profile</h3>
        <div className="well well-sm">
          <div className="row">
            <div className="col-sm-12">
              <div className="col-sm-2"><br />
              </div>
              <div className="col-sm-10">
              </div>
            </div>
          </div><br />
          <div className="row">
            <div className="col-sm-12">
              <dl className="dl-horizontal">
                <dt className="text-muted">Current</dt>
                <dt className="text-muted">Connections</dt>
                <dd> connections
                </dd>
              </dl>
              <div className="text-center">
                {/* small.text-muted= profile.publicProfileUrl*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default LinkedIn;