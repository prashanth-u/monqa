import React from "react";
import "./css/search.css";
import axios from 'axios'
import Review from './Review.js';
class NLPSection extends React.Component {

  questionError=false;

	  constructor(props, context) {
    super(props, context)
    this.state = {
      questions: [],
      references: [],
      text: this.props.question,
      loadingQuestion: true,
      loadingReferences:true
    }
  }

downloadMaterial(name)
{
  var obj = this
  var nameOfFile = (name.split("::::")[0])
  var format = nameOfFile.split(".")[nameOfFile.split(".").length - 1]
  axios.get('/api/otp/'+obj.props.unit).then(function (response) {
    axios.get('/doc_search/document/download/'+obj.props.unit+"/"+name.split("::::")[0]+"/"+response.data, { responseType: 'blob' }).then(function(response){
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name + "." + format );
      document.body.appendChild(link);
      link.click();
    })
  })

}
getAllQuestions(){
      let listOfQuestions = this.state.questions
      let j=900
      let allMessages = listOfQuestions.map((m) => {
        j = j+1
      return (<>
                <div key = {j} className="questionContainer">
                  <div className="questionNlp">Q: {m.question}</div>
                  <div className="answerNlp">A: {m.answer} </div>

                </div>
                </>
          )
        }
      )
      return allMessages

}

timeout(ms, promise) {
  var cl = this
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      cl.questionError = true
     cl.setState({loadingQuestion: false})
    }, ms)
    promise.then(resolve, reject)
  })
}


  getAllReferences() {
      let listOfReferences = this.state.references
      var allMessages

      if(listOfReferences === "error" || listOfReferences.length === 0)
      {
          allMessages = <><div className="noReferences"> No references found!</div></>
      }
      else
      {
      let i=0
      allMessages = listOfReferences.map((m) => {
        i = i+1
      return (<>
              <div key={i} className="refDetailContainer">
                <div onClick={()=>this.downloadMaterial(m.key)} key = {i} className="refElements">{m.key.split("::::")[0]}</div>
                <div className="pageDetails">{" Page: " + m.key.split("::::")[1]}</div>
              </div>
                <hr/>
                </>
          )
        }
      )      }

      return allMessages
    }

  componentDidMount()
  {
    if(this.state.text !== '')
    {
var self = this

                axios.get('/api/otp/'+self.props.unit).then(function (response) {



    axios.post('/doc_search/query/'+self.props.unit+"/"+response.data,{question:self.state.text}).then(function (response) {

        if( response.data === "error")
        {
                      self.setState({
                        references: "error",
                        loadingReferences: false
                      })

        }
        else
        {
        var t = 0
        var locRef = []
        for (var key of Object.keys(response.data)) {
            if(response.data[key] > 0)
            {
            t=t+1
            locRef.push({"key": key, "score": response.data[key]})
            }
            if(t===10)
            {
              break;
            }
        }
            self.setState({
              references: locRef,
                            loadingReferences: false

            })
        }
        

    })










                })


    }

this.timeout(5000, fetch('/api/question', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: this.state.text,
    unitName: this.props.unit
  })
})).then(res => {
  self.setState({
        loadingReferences: false
      })    
  res.json().then(data =>
  {
    var localQuestions = []
    if (data.answers[0].answer === "No good match found in KB.")
    {

    }
    else
    {
      for(var q=0; q<data.answers.length; q++)
      {
        localQuestions.push({question: data.answers[q].questions[0], answer: data.answers[q].answer})
      }

      this.setState({
          questions: localQuestions
          }
        )    

    }
  })




})


  }
    render() {

      if(this.questionError === true && this.state.references === "error")
      {
        return(
          <div className="setUpError">Document Searching failed. Contact the Admin.</div>
        )
      }
      if(this.state.loadingQuestion === true)
      {
        return (
                      <div className="nlpContainer">
<div className="loadingAssistant">Finding answers ...</div>

</div>
        )
      }

      if(this.state.loadingReferences === true)
      {
        return (
                      <div className="nlpContainer">
<div className="loadingAssistant">Finding answers ...</div>

</div>
        )
      }

      if(this.state.text === '')
      {
        return (<></>)
      }
      else{
        return(

          <>


            <div className="nlpContainer">
              <div  className="questionContainerMain">

                {this.getAllQuestions()}
              </div>
            <div className="referencesContainer">
              <div className="headerText">References</div>
                            <div className="nlpReferences">

                          {this.getAllReferences()}
                                        </div>


            </div>

            <Review unit={this.props.unit}/>

            </div>


          </>

          )

      }


    }
}
export default NLPSection
