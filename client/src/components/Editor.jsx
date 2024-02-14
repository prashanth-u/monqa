import React from "react";
import JoditEditor from "jodit-react";

// TODO: Convert this to hook
export default class Editor extends React.Component {
    state = { msg: null }

    config = {
        enter: 'DIV',
        askBeforePasteHTML: false,
        enableDragAndDropFileToEditor: true,
        uploader: {
            url: '/api/uploadFile',
            setMsg: (msg) => { 
                this.setState({ msg });
            },
            prepareData: (data) => {
                this.setState({ msg: 'Uploading files...'});
                return data;
            },
            process: function(res) {
                return res;
            },
            isSuccess: (res) => { 
                if (res.error) {
                    this.setState({ msg: res.error });
                    return false;
                }
                return true;
            },
            defaultHandlerSuccess: function(data) {
                this.options.uploader.setMsg(null);
                if (data.type.includes('image')) {
                    this.selection.insertImage(data.link, null, 400);
                } else {
                    this.selection.insertHTML(`<a href="${data.link}">${data.name}</a>`)
                }
            },
            error: function() { return },
        }
    }

    render() {
        // todo: clean up msg. (change to a popup?)
        return (
            <div>
                { this.state.msg }
                <JoditEditor
                    value={this.props.value}
                    onChange={this.props.onModelChange}
                    config={this.config}
                />
            </div>   
        );
    }
}