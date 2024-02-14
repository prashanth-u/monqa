import React from "react";
import { connect } from 'react-redux';
import Iframe from 'react-iframe'
import "../kibana/css/events.css";
import TimeButton from "../components/events/TimeButton.js"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { Dropdown } from 'semantic-ui-react'

var unitData = []

var data = require('../kibana/conf/buttons.json');


var dashboardId = {'system': '2ac000f0-cc8e-11ea-95de-9118e68adf59', 'unit': '76b8d0a0-cc8d-11ea-95de-9118e68adf59'}

var dashboardData = 
[
  {
    key: 'System',
    text: 'System',
    value: '2ac000f0-cc8e-11ea-95de-9118e68adf59'
  },
  {
    key: 'Unit',
    text: 'Unit',
    value: '76b8d0a0-cc8d-11ea-95de-9118e68adf59'
  }
]

class Event extends React.Component {


  createDropdown()
  {
    var allUnits = this.props.currentUser.units
    for (var i=0;i<allUnits.length;i++)
    {
     unitData.push({  key: allUnits[i],text: allUnits[i],value: allUnits[i]})
    }
    unitData.push({  key: 'All',text: 'All',value: 'All'})
  }

  constructor(props, context) {


    super(props, context)
    this.state = {
      darkTheme: '!f',
      from: 'now-6M',
      to: 'now',
      mode: 'quick',
      startDate: new Date(),
      endDate:  new Date(),
      random: 0,
      unit: 'All',
      dashId: dashboardId['system'],
      selected: 'System'
    }
    unitData = [];
    this.createDropdown();
  }

  getAllButtons() {
      let listOfButtons = data
      let i=0
      let allButtons = listOfButtons.map((m) => {
        i = i+1
      return (
            <TimeButton changeView={this.changeView.bind(this)} key={ i} to={m.to}  from={m.from}  display={m.display} section={m.section}/>
          )
        }
      )
      return allButtons
    }

changeView(to, from)
{
    this.setState({ to: to, from: from, mode:  'quick' ,random: this.state.random +1 });
}

changeSearch()
{
	if(this.state.startDate > this.state.endDate || +this.state.startDate === +this.state.endDate)
	{
		alert("Start Date is greater than or equal to End date")
	}
	else
	{
    	this.setState({ from: "'"+this.state.startDate.toISOString()+"'", to: "'"+this.state.endDate.toISOString()+"'", mode:  'absolute' ,random: this.state.random +1 });
	}
}

handleStartChange = date => {
    this.setState({
      startDate: date
    });
  };

  handleEndChange = date => {
    this.setState({
      endDate: date
    });
  };

  changeTheme()
  {
  	if(this.state.darkTheme === '!f')
  	{
    this.setState({ darkTheme: '!t', random: this.state.random +1 });
  	}
  	else
  	{
    this.setState({ darkTheme: '!f', random: this.state.random +1 });

  	}
  }


  handleUnitChange (e, data) {
    this.setState({ unit: data.value, random: this.state.random +1 });
   }


   handleDashboardChange(e, data) {
    this.setState({ dashId: data.value, random: this.state.random +1, unit:'All' });
   }


  refresh()
  {
    this.setState({
      from: 'now-6M',
      to: 'now',
      mode: 'quick',
      startDate: new Date(),
      endDate:  new Date(),
      random: this.state.random +1 ,
    })

  axios.post('/api/search/index', {
    unit: 'MTH9999'
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });


  }
    render() {
    	var url
      if(this.state.unit === 'All')
        {
          url = this.props.properties + "/app/kibana#/dashboard/"+this.state.dashId+"?embed=true&_g=(refreshInterval:(pause:!t,value:0),time:(from:"+this.state.from+",mode:"+this.state.mode+",to:"+this.state.to+"))&_a=(options:(darkTheme:"+this.state.darkTheme+",hidePanelTitles:!f,useMargins:!t))"
        }
        else
        {
          if(this.state.dashId === dashboardId['system'])
          {
            url = this.props.properties + "/app/kibana#/dashboard/"+this.state.dashId+"?embed=true&_g=(refreshInterval:(pause:!t,value:0),time:(from:"+this.state.from+",mode:"+this.state.mode+",to:"+this.state.to+"))&_a=(options:(darkTheme:"+this.state.darkTheme+",hidePanelTitles:!f,useMargins:!t))"
          }
          else
          {
            url = this.props.properties + "/app/kibana#/dashboard/"+this.state.dashId+"?embed=true&_g=(refreshInterval:(pause:!t,value:0),time:(from:"+this.state.from+",mode:"+this.state.mode+",to:"+this.state.to+"))&_a=(filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:AWbJsP0d-laqWN-SkuGu,key:units,negate:!f,type:phrase,value:"+this.state.unit+"),query:(match:(units:(query:"+this.state.unit+",type:phrase))))),options:(darkTheme:"+this.state.darkTheme+",hidePanelTitles:!f,useMargins:!t))"
          }
        }
        return (
        	<>
			<div className="buttonLayout">
				<div className="quickSelect">{this.getAllButtons()}</div>
				<div className="datepickers">
					<div className="startDateText">Start Date:</div>
					<div className="startDatePicker">
      					<DatePicker
        					selected={this.state.startDate}
        					onChange={this.handleStartChange}
      					/>
      				</div>
					<div className="endDateText">End Date:</div>
					<div  className="endDatePicker">
      					<DatePicker
        					selected={this.state.endDate}
        					onChange={this.handleEndChange}
      					/>
      				</div>
      				<div onClick={this.changeSearch.bind(this)} className="searchButton">Search</div>


                            <div className="dashboardDropDown">
  <Dropdown
    placeholder='System'
    fluid
    selection
    options={dashboardData}
    onChange={this.handleDashboardChange.bind(this)}
  />

              </div>


  {this.state.dashId === dashboardId['unit'] &&
        <div className="unitSelectDropDown">
  <Dropdown
    placeholder='Select Unit'
    fluid
    selection
    options={unitData}
    onChange={this.handleUnitChange.bind(this)}
  />


              </div>
      }
              



      				<div className="themePicker" onClick={this.changeTheme.bind(this)}>Theme</div>
              <div className="themePicker" onClick={this.refresh.bind(this)}>Refresh</div>
				</div>
			</div>        	
        	<Iframe url= {url}
        		width="100%"
        		key = {this.state.random}
        		height="700px"
        		id="myId"
        		className="myClassname"
        		display="initial"
        		position="relative"
        	/>
        	</>
  

)
    }
}

const mapStateToProps = ({ users }) => ({ ...users });
export default connect(mapStateToProps)(Event);
