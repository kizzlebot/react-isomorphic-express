import React from 'react'


var Footer = React.createClass({
  render: function() {
    return (
      <footer>
        <div className="container text-center">
          <p className="pull-left">© 2016 Company, Inc. All Rights Reserved</p>
          <ul className="pull-right list-inline">
            <li><a href="https://github.com/sahat/hackathon-starter">GitHub Project</a></li>
            <li><a href="https://github.com/sahat/hackathon-starter/issues">Issues</a></li>
          </ul>
        </div>
      </footer>
    );
  }
});


export default Footer ;