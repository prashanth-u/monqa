import React from "react";
import "./css/search.css";
import axios from 'axios'


class Review extends React.Component {



	  constructor(props, context) {
    super(props, context)
    this.state = {
      display: "review"
    }
      this.reviewAnswers = this.reviewAnswers.bind(this);

    }

    reviewAnswers(reviewCode)
    {
      var self = this
      axios.post('/api/events/nlpEvent',{reviewCode: reviewCode, unit: self.props.unit}).then(function (response) {
        self.setState({display: response.data})
      })
    }

    render()
    {
      if(this.state.display === "review")
      {
        return (
          <>

            <div className="reviewBox">
                      <div className="rateMe">Rate me:</div>
              <div onClick={()=>this.reviewAnswers(1)} className="reviewButton1">Excellent</div>
              <div onClick={()=>this.reviewAnswers(2)} className="reviewButton2">Alright</div>
              <div onClick={()=>this.reviewAnswers(3)} className="reviewButton3">Bad</div>
            </div>
          </>
        )
      }
      else if(this.state.display === "success")
      {
        return (
          <>
            <div className="reviewBox">
              <div className="onSuccess">Success!</div>
            </div>
          </>
        )
      }
      else
      {
        return (
          <>
            <div className="reviewBox">
              <div className="onFailed">Failed! Contact Admin</div>
            </div>
          </>
        )
      }
    }


}
export default Review
