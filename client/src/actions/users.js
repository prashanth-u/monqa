import axios from 'axios';
import * as types from './types';

export const fetchUser = () => async dispatch => {
    dispatch({ type: types.FETCH_CURRENT_USER_REQUEST });

    axios.get('/api/user/current')
        .then(res => {
            dispatch({ 
                type: types.FETCH_CURRENT_USER_SUCCESS, 
                user: res.data 
            });
        })
        .catch(err => {
            dispatch({ 
                type: types.FETCH_CURRENT_USER_FAILED, 
                message: err.message 
            });
        });
};