import axios from 'axios';
import * as types from './types';

export const fetchPosts = () => async (dispatch, getState) => {
    const { filter } = getState();
    
    if (filter.units == null) return;

    dispatch({ type: types.FETCH_POSTS_REQUEST });

    const request = {
        ...filter,
        query: getState().filter.query
    };

    axios.post('/api/posts', request)
        .then(res => {
            dispatch({ type: types.FETCH_POSTS_SUCCESS, posts: res.data });
        })
        .catch(error => {
            const message = error.message;
            dispatch({ type: types.FETCH_POSTS_FAILED, message });
        });
}

export const markAllPostRead = () => async (dispatch, getState) => {
    await axios.post('/api/posts/markAllRead', { 
        units: getState().filter.units 
    });
}