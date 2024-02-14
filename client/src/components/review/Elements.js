import React from "react";
import "./css/review.css";
import { Rating } from 'semantic-ui-react'


class Elements extends React.Component {



	constructor(props, context) {
    super(props, context)
    this.state = {
      rating: 0,
      qNo: this.props.questionType
    }

  }

  changeRating(e, { rating, maxRating } ) {
      this.setState({
        rating: rating
      }, () => {
  this.props.questionRate(this.state.qNo, this.state.rating);

});

      
    }

  render() {
    return(
        <div className="reviewContainers">
            <div className="questions">
              {this.state.qNo}
            </div>
            <div className="reviewBoxSetu">
              <div className="starCss">
                <Rating maxRating={5} onRate={this.changeRating.bind(this)} />
              </div>
            </div>
        </div>
      )
  }
      

}
export default Elements
