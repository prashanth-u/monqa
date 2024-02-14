import React from "react";
import "./../css/search.css";

class Document extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            display: 'block'
        }
    }

    deleteDocumentFromClient(docName)  {
        this.props.handleDelete(docName)
        this.setState({
            display:'none'
        })

    }

    hideDoc(status)
    {
        if(status === 1)
        {
            alert("Delete Successful")
            this.setState({
                display:'none'
            })
        }
        else
        {
            alert("Delete Failed. Contact Admin.")
        }
    }

    deleteDocumentFromServer(docName)  {
        this.props.handleDeleteServer(docName, this.hideDoc.bind(this))
    }


    render() {
        if(this.props.type === "select")
        {
            return (
            <div style={{display: this.state.display}}>
            <div className="docStyle">
            {this.props.name.name}
            </div>
            <div className="deleteButton" onClick={() => this.deleteDocumentFromClient(this.props.name.name)}>Delete</div>
            </div>
                )
        }
        return (
        <div style={{display: this.state.display}}>
            <div className="docStyle">
            {this.props.name.split("/")[4]}
            </div>
            <div className="deleteButton" onClick={() => this.deleteDocumentFromServer(this.props.name.split("/")[4])}>Delete</div>
        </div>
        )
    }

 

}

export default Document