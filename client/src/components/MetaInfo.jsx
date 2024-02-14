import React from "react";
import { Icon } from "semantic-ui-react";
import * as moment from "moment";

import { USER_TYPES } from '../constants';

export default class MetaInfo extends React.Component {
    render() {
        const { user, date, editedDate } = this.props.post;
    
        var color;
        if (user.role === USER_TYPES.ADMIN) {
            color = 'green';
        }
    
        return (
            <>
                <Icon name='user circle' color={color} />
                {user.name}&nbsp;-&nbsp;
                {moment(date).format('D MMM YYYY, h:mm a')}
                { editedDate && ' - Edited' }
            </>
        );
    }
}
