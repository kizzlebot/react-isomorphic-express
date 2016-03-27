import React from 'react'
import {Link} from 'react-router';



var APIs= React.createClass({
  getInitialState(){
    return {};
  },
  _getAPIs(){
    var Apis = {
      'GitHub':{
        style:{backgroundColor: '#000'},
        src:"http://i.imgur.com/2AaBlpf.png"
      },
      'Twitter':{
        style:{backgroundColor: '#00abf0'},
        src:"http://i.imgur.com/EYA2FO1.png"
      },
      'Facebook':{
        style:{backgroundColor: '#3b5998'},
        src:"http://i.imgur.com/jiztYCH.png"
      },
      'Foursquare':{
        style:{backgroundColor: '#1cafec'},
        src:"http://i.imgur.com/PixH9li.png"
      },
      'Instagram':{
        style:{backgroundColor: '#947563'},
        src:"http://i.imgur.com/aRc6LUJ.png"
      },
      'Last.fm':{
        style:{backgroundColor: '#d21309'},
        src:"http://i.imgur.com/KfZY876.png"
      },
      'LinkedIn':{
        style:{backgroundColor: '#007bb6'},
        src:"http://i.imgur.com/sYmVWAw.png"
      },
      'Steam':{
        style:{backgroundColor: '#000'},
        src:"http://i.imgur.com/1xGmKBX.jpg"
      },
      'Stripe':{
        style:{backgroundColor: '#3da8e5'},
        src:"http://i.imgur.com/w3s2RvW.png"
      },
      'PayPal':{
        style:{backgroundColor: '#000'},
        src:"http://i.imgur.com/JNc0iaX.png"
      },
      'Twilio':{
        style:{backgroundColor: '#fd0404'},
        src:"http://i.imgur.com/mEUd6zM.png"
      },
      'Tumblr':{
        style:{backgroundColor: '#304e6c'},
        src:"http://i.imgur.com/rZGQShS.png"
      },
      'Web Scraping':{
        style:{backgroundColor: '#fff'},
        src:"http://i.imgur.com/RGCVvyR.png"
      },
      'Venmo':{
        style:{backgroundColor: '#1f93cf'},
        src:"http://i.imgur.com/90tl9C8.gif"
      },
      'Yahoo':{
        style:{backgroundColor: '#3d048b'},
        src:"http://i.imgur.com/Cl6WJAu.png"
      },
      'Clockwork SMS':{
        style:{backgroundColor: '#000'},
        src:"http://i.imgur.com/YcdxZ5F.png"
      },
      'Aviary':{
        style:{backgroundColor: 'linear-gradient(to bottom, #1f3d95 0%,#04aade 100%)'},
        src:"http://i.imgur.com/npBRwMI.png"
      },
      'Lob':{
        style:{backgroundColor: '#176992'},
        src:"http://i.imgur.com/bmgfsSg.png"
      },
      'BitGo':{
        style:{backgroundColor: '#142834'},
        src:"http://i.imgur.com/v753soI.png"
      },
      'File Upload':{
        style:{backgroundColor: '#fff'},
        src:"http://i.imgur.com/UPTzIdC.png"
      },
      'Pinterest':{
        style:{backgroundColor: '#bd081c'},
        src:"http://i.imgur.com/JNNRQSm.png"
      }
    }

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


  render() {
    if (!this.props.children)  {
      return (
        <div>
          <h2>API Examples</h2>
          <hr />
          <div className="row">
            {this._getAPIs()};
          </div>
        </div>
      );
    }
    else{
      return (
        <div>
          {this.props.children}
        </div>
      );
    }
  }
});



export default APIs;