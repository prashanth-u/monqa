import React from 'react';
import { List, Segment, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';

class Profile extends React.Component {
    render() {
        const { currentUser } = this.props.users;
        
        if (!currentUser) {
            return (
                <Loader 
                    active
                    inverted 
                    inline='centered' 
                    size='massive' 
                    content='Loading your profile' 
                />
            );
        }

        return (
        <div style={{ margin: '1rem' }}>
            <Segment>
                <List>
                {
                    Object.keys(currentUser).map((key, index) => (
                        <List.Item key={index}>
                            <List.Header>{ key }</List.Header>
                            { currentUser[key] }
                        </List.Item>
                    ))
                }
                </List>
            </Segment>
        </div>
        );
    }
}

const mapStateToProps = ({ users }) => ({ users });
export default connect(mapStateToProps)(Profile);
