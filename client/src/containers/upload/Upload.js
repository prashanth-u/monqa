import React from "react";
import axios from 'axios';
import {Dimmer, Loader} from "semantic-ui-react";
import Document from '../../components/nlp/upload/Document.js'
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react'

class Upload extends React.Component {

unitOptions = [];
  
createDropDownElements(units)
{
  for(var elements = 0; elements<units.length; elements ++)
  {
    this.unitOptions.push({key: units[elements], value: units[elements], text: units[elements] })
  }

}
  removeFileFromSelection(docName)
  {

  for( var i = 0; i < this.state.files.length; i++){ 
    if ( this.state.files[i].name === docName) {
      this.state.files.splice(i, 1); 
   }
  }

  }

  removeFileFromServer(docName,hideDoc)
  {
        var obj = this

        this.setState({
          loading: true,
          message: "Deleting Document "+ docName + " & Reindexing."
        })
        axios.get('/api/otp/'+obj.state.unit).then(function (response) {

          axios.delete("/doc_search/document/delete/"+response.data, {
            data: {
              documentName: docName,
              unit: obj.state.unit
            }
          }).then(function(res) {
            if (res.data === "success")
            {
                      obj.setState({
          loading: false
        })


              hideDoc(1)
            }
            else
            {
obj.setState({
          loading: true,
          message: "Failed to Delete. Please Contact Admin"
        })
              hideDoc(0)
            }
          })

        })

  }

    componentDidMount()
    {
        this.getCurrentDocuments(this.state.unit)
    }
    uploadDocuments()
    {
        if(this.state.files.length > 0)
        {
        const data = new FormData() 
        this.setState({
            loading: true,
            message: "Uploading Documents",
        })
        for(var x = 0; x<this.state.files.length; x++) {
            data.append('file', this.state.files[x])
        }
        var obj = this
        axios.get('/api/otp/'+obj.state.unit).then(function (response) {



axios.post("/doc_search/document/upload/"+obj.state.unit+"/"+response.data, data, { }).then(res => { // then print response status


                if(res.data === 'success')
                {
                            obj.setState({
                                message: "Indexing Documents",
                            })

                            axios.get('/api/otp/'+obj.state.unit).then(function (resp) {

                                axios.post('/doc_search/index/'+obj.state.unit+"/"+resp.data).then(res => {
                                obj.setState({
                                  message: "Indexing Successful. Refresh page!"
                                })

                                })

                            })                
                }
                else if (res.data === 'In Progress')
                {
                            obj.setState({
                                message: "Indexing In Progress. Try Again Later.",
                            })
                }


            }).catch((reason: AxiosError) => {
    if (reason.response.status === 405) {
                            obj.setState({
                                message: "Indexing In Progress. Try Again Later.",
                            })
    } else {
                            obj.setState({
                                message: "Try Again Later.",
                            })
    }
  })

        })

        }
        else
        {
            alert("No Documents to Upload")
        }



    }

    getDocsFromClick(){
      let listOfDocuments = this.state.files
      let i=0
      let allDocuments = listOfDocuments.map((m) => {
        i = i+1
      return (
            <Document handleDelete = {this.removeFileFromSelection.bind(this)} type="select" key = {i+1} name={m} />
          )
        }
      )
      return allDocuments
    }

    handleDomainsSelectChange(e, data)
  {
      this.setState({
        unit: data.value
      },   () =>      this.getCurrentDocuments(this.state.unit)
    );

  }

    getDocsFromDB(){
      let listOfDocuments = this.state.currentDocuments
      let i=0
      let allDocuments = listOfDocuments.map((m) => {
        i = i+1
      return (
            <Document  handleDeleteServer={this.removeFileFromServer.bind(this)} key = {i+1} name={m} />
          )
        }
      )
      return allDocuments
    }
    render() {
        if(this.state.loading === true)
        {
            return (
                <Dimmer active inverted>
                    <Loader inline='centered' size='massive' inverted content={this.state.message} />
                </Dimmer>
                )
        }

        return (
            <div>
                        <Dropdown
              placeholder='Select Unit'
              style={{ marginLeft:"1%", float:"right"}}
              selection
              options={this.unitOptions}
              onChange={this.handleDomainsSelectChange.bind(this)} 
              defaultValue = {this.state.unit}
            />

            <div className="fileContainer">

                {this.getDocsFromDB()}

            </div>

            <div className="fileContainer">

                {this.getDocsFromClick()}

            </div>

                            <input className="inputFile"
                    type="file"
                    accept=".pdf, .ppt, .pptx"
                    onChange={event => {this.setState({files: this.state.files.concat(Array.from(event.target.files))});}}
                    multiple
                />

                <div className="uploadButton" onClick={this.uploadDocuments.bind(this)} >Upload</div>

            </div>
        )
    }

    getCurrentDocuments(unit)
    {
        var obj = this
                axios.get('/api/otp/'+ unit).then(function (response) {

                axios.get('/doc_search/document/'+unit+"/"+response.data).then(res => {
                        obj.setState({
                            loading: false,
                            currentDocuments: res.data.files
                        })
                    })
                  })
    }

    constructor(props) {
        super(props);
        const { currentUser } = this.props.users;
        this.state = {
            files: [],
            loading: true,
            unit: currentUser['units'][0],
            currentDocuments: [],
            message: "Loading"
        };
        this.createDropDownElements(currentUser['units'])
    }

 

}

const mapStateToProps = ({ users }) => ({ users });
export default connect(mapStateToProps)(Upload);
