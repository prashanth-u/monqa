import * as types from '../actions/types';

const initialState = {
    posts: null,
    loading: true,
    error: false,
    message: null
}

export default function(state = initialState, action) {
    switch (action.type) {
        case types.FETCH_POSTS_REQUEST:
            return { 
                ...state, 
                loading: true,
                error: false, 
                message: null,
            };

        case types.FETCH_POSTS_SUCCESS:
            return {
                ...state,
                posts: action.posts, 
                loading: false,
                error: false, 
                message: null,
            };

        case types.FETCH_POSTS_FAILED:
            return {
                ...state,
                loading: false,
                error: true, 
                message: action.message,
            };

        default:
            return state;
    }
}
