import React from 'react';
import {Link} from 'react-router';


var Home = React.createClass({
  generateLorem: function(){
    var Apis = {
      // 'GitHub':{
      //   style:{backgroundColor: '#000'},
      //   src:"http://i.imgur.com/2AaBlpf.png"
      // },

      // 'Facebook':{
      //   style:{backgroundColor: '#3b5998'},
      //   src:"http://i.imgur.com/jiztYCH.png"
      // },
      // 'Foursquare':{
      //   style:{backgroundColor: '#1cafec'},
      //   src:"http://i.imgur.com/PixH9li.png"
      // },

      // 'Last.fm':{
      //   style:{backgroundColor: '#d21309'},
      //   src:"http://i.imgur.com/KfZY876.png"
      // },
      // 'Web Scraping':{
      //   style:{backgroundColor: '#fEF'},
      //   src:"http://i.imgur.com/RGCVvyR.png"
      // }
    };


    return Object.keys(Apis).map((e, i) => {
      var api = Apis[e];
      return (
        <div key={e} className="col-sm-4">
          <Link to={`/api/${e.toLowerCase().replace(/\./g,' ').replace(' ', '')}`} >
            <div style={api.style} className="panel panel-default">
              <div className="panel-body"><img src={api.src} height={40} /> {e}</div>
            </div>
          </Link>
        </div>
      );
    })
  },
  render: function() {
    return (
      <div>
        <h1>DevMusic</h1>
        <p className="lead">Your music aggregator</p>
        <hr />
        <div className="row">
          {this.generateLorem()}
        </div>
      </div>
    );
  }
});



export default Home;