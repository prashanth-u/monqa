import axios from 'axios';
import * as types from './types';

export const changeRoom = room => async dispatch => {
    dispatch({ type: types.CHANGE_ROOM, room });
    dispatch({ type: types.FETCH_MESSAGES_REQUEST });

    axios.get(`/api/messages/${room}`)
        .then(res => {
            const messages = res.data;
            dispatch({ type: types.FETCH_MESSAGES_SUCCESS, messages })
        })
        .catch(err => {
            const error = err.message;
            dispatch({ type: types.FETCH_MESSAGES_FAILED, error })
        });
}

export const refreshMessages = () => async (dispatch, getState) => {
    const { room } = getState().chat;

    if (room) {
        axios.get(`/api/messages/${room}`)
        .then(res => {
            const messages = res.data;
            dispatch({ type: types.FETCH_MESSAGES_SUCCESS, messages })
        });
    }
}