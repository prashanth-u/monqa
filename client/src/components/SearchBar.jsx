import React, { useState, useEffect } from "react";
import { Icon, Input } from "semantic-ui-react";
import { useSelector, useDispatch } from 'react-redux';

import { UPDATE_SEARCH, RESET_SEARCH } from '../actions/types';

export default function SearchBar({ placeholder }) {
    const dispatch = useDispatch();

    const query = useSelector(state => state.filter.query);
    useEffect(() => setText(query), [query]);

    const [text, setText] = useState('');

    const onKeyDown = e => {
        if (e.key === 'Enter') {
            dispatch({ type: UPDATE_SEARCH, query: e.target.value });
        }
    };

    const handleClear = () => {
        setText('');
        dispatch({ type: RESET_SEARCH });
    };

    return (
        <Input
            fluid
            size='large'
            style={{ margin: "0.5rem 0 1rem 0" }}
            icon={ text ? 
                <Icon link name='times' onClick={handleClear} /> :
                <Icon name='search' />
            }
            placeholder={placeholder}
            value={text}
            onKeyDown={onKeyDown}
            onChange={(e, { value }) => setText(value)}
        />
    );
}
