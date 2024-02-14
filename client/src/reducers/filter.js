import * as types from '../actions/types';

// adds att to selected if not in selected
// otherwise removes att from selected
function toggle(selected, att) {
    const s = selected.slice();
    const i = s.indexOf(att);
    i === -1 ? s.push(att) : s.splice(i, 1);
    return s.slice();
}

const initialState = {
    query: '',
    read: true,
    units: null,
    solveStatus: [true, false],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case types.SET_UNITS:
        case types.RESET_FILTER:
            return { ...initialState, units: action.units, }

        case types.TOGGLE_UNIT:
            return { 
                ...state, 
                units: toggle(state.units, action.unit),
            }; 

        case types.FOCUS_UNIT:
            return { ...state, units: [action.unit] };

        case types.TOGGLE_SOLVE_STATUS:
            return { 
                ...state, 
                solveStatus: toggle(state.solveStatus, action.status) 
            };

        case types.TOGGLE_READ:
            return { ...state, read: !state.read };

        case types.RESET_SEARCH:
            return { ...state, query: '' };

        case types.UPDATE_SEARCH:
            return { ...state, query: action.query }

        default:
            return state;
    }
}
