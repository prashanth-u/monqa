import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Grid } from "semantic-ui-react";
import { useSelector } from 'react-redux';

import NewPostHandler from "../components/NewPost/NewPostHandler";
import AddMultipleButton from '../components/NewPost/AddMultipleButton';
import { USER_TYPES } from "../constants";

export default function NewPost() {
    const { id } = useParams();

    const user = useSelector(state => state.users.currentUser);

    const [posts, setPosts] = useState([null]);
    
    var gridContent = posts.map((post, index) =>
        <NewPostHandler key={index} prefillData={post} />
    );

    var i, j, tempArr, chunk = 2, handlers = [];
    for (i = 0, j = gridContent.length; i < j; i += chunk) {
        tempArr = gridContent.slice(i, i+chunk);
        handlers.push(tempArr);
    }

    const handleAddFromFile = newPosts => {
        if (posts.length === 1 && posts[0] == null) { 
            setPosts([]); 
            setPosts(newPosts); 
        } else setPosts(posts.concat(newPosts));
    };
    
    if (id) {
        return (
            <div style={{ margin: '1rem' }}>
                <NewPostHandler id={id} style={{ marginTop: '.5rem' }}/>
            </div>
        );
    }
    
    return (
        <div style={{ margin: '1rem' }}>
            { user.role === USER_TYPES.ADMIN &&
                <>
                    <Button
                        size="mini"
                        positive
                        icon='plus'
                        content='Add more'
                        onClick={() => setPosts(posts.concat([null]))}
                    />
                    <AddMultipleButton onClick={handleAddFromFile} />
                </>
            }
            <Grid stackable style={{ paddingTop: '1rem' }}>
                { handlers.map((row, index) => (
                    <Grid.Row columns={row.length} key={index}>
                        { row.map((handler, index2) => (
                            <Grid.Column key={index2}>
                                { handler }
                            </Grid.Column>
                        )) }
                    </Grid.Row>
                )) }
            </Grid>
        </div>
    );
}