import React from "react";
import { connect } from 'react-redux';
import sanitizeHtml from 'sanitize-html';

import { searchHTML } from './_search';

function searchText(str, query) {
    // eslint-disable-next-line
    query = new RegExp(query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi')
    return str.replace(query, '<mark>$&</mark>')
}

function Text(props) {
    var { text, query, lines } = props;

    var style = lines ? {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: lines
    } : {}

    var sanitizeOptions;

    // convert HTML to text
    if (props.toText) {
        sanitizeOptions = {
            allowedTags: []
        };
    } else {
        sanitizeOptions = {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            allowedAttributes: {
                'img': sanitizeHtml.defaults.allowedAttributes['img'].concat(['style']),
                'a': sanitizeHtml.defaults.allowedAttributes['a'].concat(['href'])
            }
        };
    }
    
    text = sanitizeHtml(text, sanitizeOptions)

    // may crash on page with lots of text
    if (query !== '') {
        if (props.isHTML) {
            var pos = searchHTML(text, query);

            if (pos.length) {
                for (var i in pos) {
                    text = text.slice(0, pos[i]) 
                        + `<mark>${text[pos[i]]}</mark>` 
                        + text.slice(pos[i]+1);
                    pos = pos.map(j => j + 13);
                }
            }
        } else {
            text = searchText(text, query);
        }
    }

    return (
        <span 
            className='fr-view search-text'
            style={style} 
            dangerouslySetInnerHTML={{__html: text}}
        />
    );
}

const mapStateToProps = ({ filter }) => ({ ...filter });

export default connect(mapStateToProps)(Text);