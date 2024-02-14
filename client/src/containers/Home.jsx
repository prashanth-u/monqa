import React from "react";
import { Link } from "react-router-dom";
import { Button, Grid, Loader, Header }  from "semantic-ui-react";
import { connect } from 'react-redux';

import CardList from "../components/Home/CardList";
import Filter from "../components/Home/Filter";
import { fetchPosts, markAllPostRead } from '../actions/posts';
import { resetFilter } from '../actions/filter';
import { POST_TYPES } from "../constants";

const { FAQ, POST, ANNOUNCEMENT } = POST_TYPES;

function getWidths(collapsed) {
    var widths = {};

    if (!collapsed[FAQ] && !collapsed[POST] && !collapsed[ANNOUNCEMENT]) {
        widths = { [FAQ]: 4, [POST]: 8, [ANNOUNCEMENT]: 4 };
    } else if (!collapsed[FAQ] && !collapsed[POST]) {
        widths = { [FAQ]: 4, [POST]: 12 };
    } else if (!collapsed[POST] && !collapsed[ANNOUNCEMENT]) {
        widths = { [POST]: 10, [ANNOUNCEMENT]: 6 };
    } else if (!collapsed[FAQ] && !collapsed[ANNOUNCEMENT]) {
        widths = { [FAQ]: 4, [ANNOUNCEMENT]: 12 };
    } else if (!collapsed[FAQ]) {
        widths = { [FAQ]: 16 };
    } else if (!collapsed[POST]) {
        widths = { [POST]: 16 };
    } else if (!collapsed[ANNOUNCEMENT]) {
        widths = { [ANNOUNCEMENT]: 16 };
    }

    return widths;
}

// TODO: Convert to hook so that posts are refreshed each time?

class Home extends React.Component {
    state = { filterOpen: true, collapsed: {} }
    updateFilter = false;

    componentDidMount() {
        if (this.props.users.currentUser) {
            const { currentUser } = this.props.users;
            this.props.dispatch(resetFilter(currentUser.units));
            this.props.dispatch(fetchPosts());
        }

        var collapsed = {};
        Object.values(POST_TYPES).forEach(type => {
            collapsed[type] = false;
        });
        this.setState({ collapsed });
    }

    handleFilterToggle = () => this.setState(state => ({ filterOpen: !state.filterOpen }))
    
    markAllPostsAsRead = () => {
        // FIXME
        this.props.dispatch(markAllPostRead())
            .then(() => this.props.dispatch(fetchPosts()));
    }

    handleCollapse = type => {
        var { collapsed } = this.state;
        collapsed[type] = !collapsed[type];
        this.setState({ collapsed });
    }

    componentDidUpdate(prevProps) {
        if (this.props.filter !== prevProps.filter) {
            this.updateFilter = !this.updateFilter;
            this.props.dispatch(fetchPosts());
        }

        if (this.props.users !== prevProps.users && this.props.users.currentUser) {
            const { currentUser } = this.props.users;
            this.props.dispatch(resetFilter(currentUser.units));
            this.props.dispatch(fetchPosts());
        }
    }

    render() {
        const { posts } = this.props;
        const { collapsed, filterOpen } = this.state;

        var widths = getWidths(collapsed);
        const collapseBarVisible = Object.values(collapsed).some(val => val);

        return (
            // TODO: make this into a wrapper component
            <div style={{ margin: '1rem' }}>
                <Link to='/post/new'>
                    <Button
                        size='mini'
                        positive
                        icon='plus'
                        content='New post'
                    />
                </Link>
                <Button
                    size='mini'
                    icon='filter'
                    content={filterOpen ? 'Hide filter' : 'Show filter'}
                    onClick={this.handleFilterToggle}
                />
                <Button
                    size='mini'
                    icon='circle'
                    content='Mark all read'
                    onClick={this.markAllPostsAsRead}
                />
                <Filter key={this.updateFilter} open={filterOpen} />
                {/* TODO: move this to own component */}
                { collapseBarVisible &&
                    <Grid columns='equal' stackable style={{ marginTop: '.5rem' }}>
                        { Object.values(POST_TYPES).map(type => {
                            return !collapsed[type] ? 
                                (window.innerWidth <= 767 ? null : <Grid.Column />) : (
                                <Grid.Column>
                                    <Header 
                                        as='h4' 
                                        style={{ cursor: 'pointer' }}
                                        textAlign='center' 
                                        onClick={() => this.handleCollapse(type)}
                                        color='grey'
                                        content={`Show ${type}s`}
                                    />
                                </Grid.Column>
                            );
                        }) }
                    </Grid>
                }
                <Grid stackable style={{ marginTop: '-1rem'}}>
                    { posts.loading ? 
                        <Loader 
                            active 
                            inline='centered' 
                            content="Fetching posts"
                            style={{ marginTop: "5rem" }} 
                        /> :
                        Object.values(POST_TYPES).map((type, index) => {
                            return collapsed[type] ? null : (
                                <CardList 
                                    key={index}
                                    width={widths[type]}
                                    title={type + 's'}
                                    posts={posts.posts.filter(post => post.category === type)}
                                    onCollapse={() => this.handleCollapse(type)}
                                />
                            );
                        })
                    }
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = ({ filter, posts, users }) => ({ filter, posts, users });
export default connect(mapStateToProps)(Home);
