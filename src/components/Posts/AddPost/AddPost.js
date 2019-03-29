import React, { Component } from 'react';
import { AuthUserContext } from './../../Session';
import { withFirebase } from './../../Firebase';
import SimpleReactValidator from 'simple-react-validator';


class AddPost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            description: '',
            author: '',
            category: '',
            status: ''
        };

        this.validator = new SimpleReactValidator();
    }


    onChangeText = event => {
        this.setState({ title: event.target.value });
    };
    onChangeDesc = event => {
        this.setState({ description: event.target.value });
    }
    onChangeAuthor = event => {
        this.setState({ author: event.target.value });
    }
    onChangeCategory = event => {
        this.setState({ category: event.target.value });
    }
    onChangeStatus = event => {
        this.setState({ status: event.target.value });
    }

    onCreateMessage = (event, authUser) => {

        if (this.validator.allValid()) {
            this.props.firebase.posts().push({
                title: this.state.title,
                description: this.state.description,
                category: this.state.category,
                status: this.state.status,
                userId: authUser.uid,
                author: authUser.username,
                createdAt: this.props.firebase.serverValue.TIMESTAMP
            });

            this.setState({ title: '', description: '', author: '', category: '', status: '' });

            event.preventDefault();
            window.location.href='/home';
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    };

    


    render() {
        const { title, description, category, status} = this.state;

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                <div>
                    <form onSubmit={event => this.onCreateMessage(event, authUser)} >
                        <div className="form-group col-md-6">
                            <h1>Create new post</h1>
                            <label>Title</label>
                            <input type="text" className="form-control" name="title" value={title} onChange={this.onChangeText} required />
                            {this.validator.message('title', title, 'required')}

                            <label>Description</label>
                            <input type="text" className="form-control" name="description" value={description} onChange={this.onChangeDesc} required />
                            {this.validator.message('description', description, 'required')}

                            <label>Category</label>
                            <select onChange={this.onChangeCategory} className="form-control" name="category" value={category} required>
                                <option value="">Select</option>
                                <option value="Blockchain">Blockchain</option>
                                <option value="IoT">IoT</option>
                                <option value="Game tech">Game tech</option>
                                <option value="AI">AI</option>
                                <option value="Robotics">Robotics</option>
                                <option value="Machine">Machine</option>
                                <option value="Learning">Learning</option>
                            </select>
                            {this.validator.message('category', category, 'required')}

                            <label>Status</label>
                            <select onChange={this.onChangeStatus} className="form-control" name="status" value={status} required>
                                <option value="">Select</option>
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                            </select>
                            {this.validator.message('status', status, 'required')}

                            <button type="submit" className="btn btn-primary">Save</button>
                        </div>
                    </form>
                </div>
                )}
            </AuthUserContext.Consumer>
        );
    }

}

export default withFirebase(AddPost);