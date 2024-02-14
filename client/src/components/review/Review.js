import React from "react";
import axios from 'axios'
import "./css/review.css";
import Elements from "./Elements.js"
import { Button } from 'semantic-ui-react'
import { connect } from 'react-redux';


class Review extends React.Component {

	constructor(props, context) {
    super(props, context)
    this.state = {
      q1Rating:'NA',
      q2Rating:'NA',
      q3Rating:'NA',
      q4Rating:'NA',
      q5Rating:'NA',
      q1: this.props.properties.question[0],
      q2: this.props.properties.question[1],
      q3: this.props.properties.question[2],
      q4: this.props.properties.question[3],
      q5: this.props.properties.question[4],
    }

    
  }

  setRating(qNo, rating) {

    if(qNo ===  this.state.q1){
      this.setState({
        q1Rating: rating
      });
    }
    else if(qNo ===  this.state.q2){
            this.setState({

        q2Rating: rating
      })
    }
    else if(qNo ===  this.state.q3){
            this.setState({

        q3Rating: rating
      })
    }
    else if(qNo ===  this.state.q4){
            this.setState({

        q4Rating: rating
      })
    }
    else if(qNo ===  this.state.q5){
            this.setState({

        q5Rating: rating
      })
    }
  }

  sendRatings() {
    if(this.state.q1Rating === 'NA' || this.state.q2Rating === 'NA' || this.state.q3Rating === 'NA' || this.state.q4Rating === 'NA' || this.state.q5Rating === 'NA'  )
    {
      alert("Rating incomplete")
    }
    else
    {

      axios.post(`/api/review`, null, { params: {
        q1Rating: this.state.q1Rating,
        q2Rating: this.state.q2Rating,
        q3Rating: this.state.q3Rating,
        q4Rating: this.state.q4Rating,
        q5Rating: this.state.q5Rating,
        q1: this.props.properties.question[0],
        q2: this.props.properties.question[1],
        q3: this.props.properties.question[2],
        q4: this.props.properties.question[3],
        q5: this.props.properties.question[4]
  }}).then(function (response) {
    if(response.data==="Forbidden Request"){
      alert("Already reviewed")
    }
    else
    {
      alert("Success")
      window.location.href = "/"
    }
  }).catch(err => console.warn(err));
    }

  }


  render() {
    return(
      <div className="review-container">
        <Elements questionType={this.state.q1} questionRate = {this.setRating.bind(this)}/>
        <Elements questionType={this.state.q2} questionRate = {this.setRating.bind(this)}/>
        <Elements questionType={this.state.q3} questionRate = {this.setRating.bind(this)}/>
        <Elements questionType={this.state.q4} questionRate = {this.setRating.bind(this)}/>
        <Elements questionType={this.state.q5} questionRate = {this.setRating.bind(this)}/>
        <div className="submitButton">
              <div className="buttonMargin">
        <Button onClick={this.sendRatings.bind(this)} content='Submit' />
      </div>

        </div>
      </div>

      )
  }

}

const mapStateToProps = ({ current_user }) => ({ ...current_user });
export default connect(mapStateToProps)(Review);

