import React from "react";
import "../../kibana/css/events.css";



class  TimeButton extends React.Component {


  changeView()
  {
    this.props.changeView(this.props.to, this.props.from)
  }
  render()
  {
    
        return (<div onClick={this.changeView.bind(this)} className="timeButtons"> {this.props.display}
                  </div>    )
  }
}

export default TimeButton

