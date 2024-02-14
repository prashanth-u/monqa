import React from "react";
import { Transition } from "semantic-ui-react";

export default function Animation(props) {
    const animation = { show: 'fade down', hide: 'fade up' };
    
    var duration
    if (props.hide) {
        duration = { show: 300, hide: 0 };
    } else {
        duration = 300;
    }

    return (
        <>
            <Transition
                visible={props.open}
                animation={animation.show} 
                duration={duration}
            >
                { props.show }
            </Transition>
            { props.hide && (
                <Transition
                    visible={!props.open}
                    animation={animation.hide} 
                    duration={duration}
                >
                    { props.hide }
                </Transition>
            ) }
        </>
    );
}
