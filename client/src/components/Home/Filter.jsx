import React from "react";
import { Button, Segment } from "semantic-ui-react";
import { connect } from 'react-redux';

import { resetFilter } from '../../actions/filter';
import { TOGGLE_READ, TOGGLE_SOLVE_STATUS, TOGGLE_UNIT } from '../../actions/types';
import Animation from "../Animation";
import SearchBar from "../SearchBar";

function FilterButton({text, onClick, active, color}) {
    return (
        <span>
            <Button
                size='mini' 
                color={active ? color : null}
                basic={!active}
                onClick={onClick} 
                content={text}
            />&nbsp;
        </span>
    );
}

function Filter(props) {

    const { filter } = props;
    const { currentUser } = props.users;
    const handleReset = () => {
        props.dispatch(resetFilter(currentUser.units));
    }
    
    if (!filter.units) return null;

    return (
        <Animation open={props.open} show={
            <Segment secondary>
                <SearchBar
                    placeholder='Search post title, body and/or tags'
                />
                <Button 
                    size='mini'
                    icon='repeat' 
                    content='Reset' 
                    onClick={handleReset} 
                />
                <b style={{ margin: '0 1rem 0 .7rem' }}>|</b>
                {
                    currentUser.units.map((unit, index) => (
                        <FilterButton
                            key={index}
                            text={unit}
                            onClick={() => props.dispatch({ type: TOGGLE_UNIT, unit })}
                            active={filter.units.includes(unit)}
                            color={'blue'}
                        />
                    ))
                }
                <b style={{ margin: '0 1rem 0 .7rem' }}>|</b>
                {
                    [true, false].map((status, index) => (
                        <FilterButton
                            key={index}
                            text={status ? 'Solved' : 'Unsolved'}
                            onClick={() => props.dispatch({ type: TOGGLE_SOLVE_STATUS, status })}
                            active={filter.solveStatus.includes(status)}
                            color='green'
                        />
                    ))
                }
                <b style={{ margin: '0 1rem 0 .7rem' }}>|</b>
                {
                    <FilterButton
                        text='Read'
                        onClick={() => props.dispatch({ type: TOGGLE_READ })}
                        active={filter.read}
                        color='orange'
                    />
                }
            </Segment>
        } />
    );
}

const mapStateToProps = ({ filter, users }) => ({ filter, users });

export default connect(mapStateToProps)(Filter);
