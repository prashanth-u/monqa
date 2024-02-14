import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Loader } from "semantic-ui-react";

import './App.css';
import Landing from './Landing';
import Home from "./Home";
import Chat from "./Chat";
import Upload from "./upload/Upload";
import Event from "./Event";
import Admin from "./Admin";
import Post from "./Post";
import Search from "./Search";
import NewPost from "./NewPost";
import Request from './Request';
import Navbar from '../components/Navbar';
import Restricted from "./Restricted";
import { SET_UNITS } from '../actions/types';
import { fetchUser } from '../actions/users';
import Review from "../components/review/Review"
import axios from 'axios';

class App extends Component {

    constructor() {
        super();
        this.state = { properties: {} };
    }

    componentDidMount() {
        this.props.dispatch(fetchUser());
    }

    componentDidUpdate(prevProps) {
        const { currentUser } = this.props.users;
        const prevCurrentUser = prevProps.users.currentUser;
        if (JSON.stringify(prevCurrentUser) !== JSON.stringify(currentUser) 
            && currentUser) {
            this.props.dispatch({ type: SET_UNITS, units: currentUser.units });
            fetch(`/api/properties`)
                .then(res => res.json())
                .then(json => this.setState({ properties: json }));
        axios.post('/api/registerauth').then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
        }
    }

    render() {
        const { users } = this.props;
    
        if (users.loading) {
            return (
                <Loader 
                    active 
                    inline='centered' 
                    style={{ marginTop: "5rem" }}   
                    content="Fetching your details" 
                />
            )
        }
        
        const { currentUser } = users;
        
        if (!currentUser) return <Landing />

        if (currentUser.units.length === 0) return <Request />
        
        const { kibanaUrl, events } = this.state.properties;
        const search = props => <Search {...props} />;

        const upload = props => <Restricted><Upload {...props} /></Restricted>;
        const event = props => <Restricted><Event properties={kibanaUrl} {...props} /></Restricted>;
        const admin = props => <Restricted><Admin {...props} /></Restricted>;
        const review = props => <Review properties={this.state.properties} {...props} />;

        return (
            <BrowserRouter>
                <Navbar />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/post/new/:id?" component={NewPost} />
                    <Route exact path="/post/:id" component={Post} />
                    <Route exact path="/chat" component={Chat} />
                    <Route exact path="/docsearch" component={search} />
                    <Route exact path="/uploaddoc" component={upload} />
                    <Route exact path="/admin" component={admin} />
                    <Route exact path="/review" render={review} />
                    { 
                        events && 
                        <Route exact path="/events" component={event} />
                    }
                </Switch>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = ({ users }) => ({ users });

export default connect(mapStateToProps)(App);
