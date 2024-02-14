import React, { Fragment } from "react";
import { Label } from "semantic-ui-react";

function formatLabels(lbls) {
    return lbls.map((lbl, index) => {
        if (index) {
            return (
                <Fragment key={index}>
                    &nbsp;-&nbsp;
                    {lbl}
                </Fragment>
            );
        } 
        else return (<Fragment key={index}>{lbl}</Fragment>)
    });
}

function formatBtns(btns) {
    return btns.map((btn, index) => {
        if (index) {
            return (
                <Fragment key={index}>
                    &nbsp;&nbsp;
                    {btn}
                </Fragment>
            );
        } 
        else return (<Fragment key={index}>{btn}</Fragment>)
    });
}

export default function Toolbar(props) {
    return (
        <Label prompt attached={props.position || 'top'} align='center'
            style={{ backgroundColor: props.color }}
        >
            { 
                props.left && 
                <span style={{ textAlign: "left", float: "left" }}>
                    { formatBtns(props.left) }
                </span>
            }
            {
                props.right &&
                <span style={{ textAlign: "right", float: "right" }}>
                    { formatLabels(props.right) }
                </span>
            }      
        </Label>
    );
}
