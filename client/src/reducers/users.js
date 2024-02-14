import * as types from '../actions/types';

const initialState = {
    currentUser: null,
    loading: false,
    error: false,
    message: null
}

// TODO: rename to user

export default function(state = initialState, action) {
    switch (action.type) {
        case types.FETCH_CURRENT_USER_REQUEST:
            return { 
                currentUser: null,
                loading: true, 
                error: false,
                message: null
            }

        case types.FETCH_CURRENT_USER_SUCCESS:
            return { 
                currentUser: action.user,
                loading: false, 
                error: false,
                message: null
            }

        case types.FETCH_CURRENT_USER_FAILED:
            return { 
                currentUser: null,
                loading: false, 
                error: true,
                message: action.message
            }

        default:
            return state;
    }
}
