import * as types from './types';

// TODO: shouldnt need to provide units here
export const resetFilter = units => dispatch => {
    dispatch({ type: types.RESET_FILTER, units });
}