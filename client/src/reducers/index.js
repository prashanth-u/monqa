import { combineReducers } from 'redux';
import users from './users';
import posts from './posts';
import filter from './filter';
import chat from './chat';

export default combineReducers({ 
    users, 
    posts, 
    filter, 
    chat,
});
