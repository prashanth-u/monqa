import * as types from '../actions/types';

const initialState = {
    loading: null,
    error: null,
    messages: null,
    room: null,
    visible: true,
    anonymous: false,
    sidebarOpen: true,
}

// TODO: FETCH_MESSAGES_REQUEST

export default function(state = initialState, action) {
    switch (action.type) {
        case types.FETCH_MESSAGES_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                messages: null
            };

        case types.FETCH_MESSAGES_SUCCESS:
            return { 
                ...state, 
                loading: false,
                error: null,
                messages: action.messages 
            };

        case types.FETCH_MESSAGES_FAILED:
            return {
                ...state, 
                loading: false, 
                error: action.error,
                messages: null
            }

        case types.CHANGE_ROOM: 
            return {
                ...state,
                room: action.room
            }

        case types.RESET_ROOM:
            return {
                ...state,
                room: null,
                messages: null
            }

        case types.TOGGLE_VISIBLE:
            return {
                ...state,
                visible: !state.visible
            }

        case types.TOGGLE_ANONYMOUS:
            const newAnonymous = !state.anonymous;
            const newVisible = newAnonymous ? false : state.visible;
            return {
                ...state,
                anonymous: newAnonymous,
                visible: newVisible
            }

        case types.TOGGLE_SIDEBAR:
            return {
                ...state,
                sidebarOpen: !state.sidebarOpen
            }

        default:
            return state;
    }
}
