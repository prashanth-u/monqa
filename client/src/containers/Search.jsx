import React from "react";
import { Icon, Input } from "semantic-ui-react";
import { Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux';

import NLPSection from '../components/nlp/NLPSection.js';
import QNAAnswers from '../components/Search/QNAAnswers';

class Search extends React.Component {
  key;
  unitOptions = [];
  
  createDropDownElements(units) {
    for(var elements = 0; elements < units.length; elements++) {
      this.unitOptions.push({
        key: units[elements], 
        value: units[elements], 
        text: units[elements] 
      });
    }
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      textValue: '',
      selected: '',
      unit: ''
    }
    this.key = 0;
    const { currentUser } = this.props.users;
    this.createDropDownElements(currentUser['units']);
  }

  onChangeKey(e) {
    this.setState({ textValue: e.target.value });
  }

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if(e.target.value !== "") {
        if(this.state.unit !== "") {
          ++this.key
          this.setState({
            selected: this.state.textValue
          });
        } else {
          alert("please select a unit!")
        }
      }
    }
  }

  handleDomainsSelectChange(e, data) {
    ++this.key
    this.setState({ 
      unit: data.value, 
      selected: this.state.textValue 
    });
  }

  render() {
    const { selected, unit } = this.state;

    return(
      <>
        <div className="searchBarNlp">
          <div className="askMeText"> Ask me a question: </div>
          <Input
              fluid
              style={{ marginLeft:"1%", float:"left", width:'73%' }}
              icon={<Icon name='search' />}
              placeholder='Search'
              onChange={this.onChangeKey.bind(this)}
              onKeyDown={this._handleKeyDown.bind(this)}
          />
          <Dropdown
            fluid
            placeholder='Select Unit'
            style={{ marginLeft:"1%", float:"left", width:'10%' }}
            selection
            options={this.unitOptions}
            onChange={this.handleDomainsSelectChange.bind(this)} 
          />
        </div>
        <br />
        { (selected !== '' && unit !== '') && 
          <QNAAnswers 
            unit={unit} 
            question={selected}
          />
        }
        { selected !== '' && 
          <NLPSection 
            key={this.key} 
            question={selected} 
            unit={unit}
          />
        }
      </>
    )
  }
}

const mapStateToProps = ({ users }) => ({ users });
export default connect(mapStateToProps)(Search);
