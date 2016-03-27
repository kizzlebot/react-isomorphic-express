import React from 'react';



var Contact = React.createClass({
  render: function() {
    return (
      <div>
        <div className="page-header">
          <h3>Contact Form</h3>
        </div>
        <form role="form" method="POST" className="form-horizontal">
          <input type="hidden" name="_csrf" />
          <div className="form-group">
            <label htmlFor="name" className="col-sm-2 control-label">Name</label>
            <div className="col-sm-8">
              <input type="text" name="name" id="name" autofocus="autofocus" className="form-control" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email" className="col-sm-2 control-label">Email</label>
            <div className="col-sm-8">
              <input type="text" name="email" id="email" className="form-control" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="message" className="col-sm-2 control-label">Body</label>
            <div className="col-sm-8">
              <textarea type="text" name="message" id="message" rows={7} className="form-control" defaultValue={""} />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-8">
              <button type="submit" className="btn btn-primary"><i className="fa fa-envelope" />Send</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
});

export default Contact;