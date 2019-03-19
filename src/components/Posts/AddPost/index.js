import AddPost from './AddPost';
import React, { Component } from 'react';
import { compose } from 'recompose';

class AddPost extends Component{
    constructor(props) {
        super(props);    
    }
    render(){
        <AddPost />
    }
}

export default compose(withFirebase)(AddPost);