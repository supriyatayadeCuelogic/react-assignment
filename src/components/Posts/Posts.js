import React, { Component } from 'react';

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import PostList from './PostList';

class Posts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            description: '',
            author: '',
            category: '',
            status: '',
            loading: false,
            posts: [],
            limit: 5,
            formValid: true
        };
    }

    componentDidMount() {
        this.onListenForMessages();
    }

    onListenForMessages = () => {
        this.setState({ loading: true });

        this.props.firebase
            .posts()
            .orderByChild('createdAt')
            .limitToLast(this.state.limit)
            .on('value', snapshot => {
                const messageObject = snapshot.val();

                if (messageObject) {
                    const messageList = Object.keys(messageObject).map(key => ({
                        ...messageObject[key],
                        uid: key,
                    }));

                    this.setState({
                        posts: messageList,
                        loading: false,
                    });
                } else {
                    this.setState({ posts: null, loading: false });
                }
            });
    };

    componentWillUnmount() {
        this.props.firebase.posts().off();
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

        if (this.state.title === "" || this.state.description === "" ||
            this.state.category === "" || this.state.author === "" || this.state.status === "") {
            this.setState({
                formValid: false
            })
            console.log(this.state);
        } else {
            this.props.firebase.posts().push({
                title: this.state.title,
                description: this.state.description,
                author: this.state.author,
                category: this.state.category,
                status: this.state.status,
                userId: authUser.uid,
                createdAt: this.props.firebase.serverValue.TIMESTAMP
            });

            this.setState({ title: '', description: '', author: '', category: '', status: '' });

            event.preventDefault();
        }
    };

    onEditPost = (message, title,description,author,category,status) => {

        this.props.firebase.posts(message.uid).set({
            ...message,
            title,description,author,category,status,
            updatedAt: this.props.firebase.serverValue.TIMESTAMP,
        });
    };

    onRemovePost = uid => {
        this.props.firebase.posts(uid).remove();
    };

    onNextPage = () => {
        this.setState(
            state => ({ limit: state.limit + 5 }),
            this.onListenForMessages,
        );
    };

    render() {
        const { users } = this.props;
        const { title, description, author, category, status, posts, loading,formValid } = this.state;

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        {loading && <div>Loading ...</div>}

                        {posts && (
                            <PostList
                                posts={posts.map(post => ({
                                    ...post,
                                    user: users
                                        ? users[post.userId]
                                        : { userId: post.userId },
                                }))}
                                onEditPost={this.onEditPost}
                                onRemovePost={this.onRemovePost}
                            />
                        )}

                        {!posts && <div>There are no posts ...</div>}

                        <form onSubmit={event => this.onCreateMessage(event, authUser)} >
                            {!formValid ? <p>All fields are required</p> : null}    
                            <input type="text" placeholder="Title" name="title" value={title} onChange={this.onChangeText} />
                            <input type="text" placeholder="Description" name="description" value={description} onChange={this.onChangeDesc} />
                            <input type="text" placeholder="Author" name="author" value={author} onChange={this.onChangeAuthor} />
                            <select onChange={this.onChangeCategory} name="category" value={category}>
                                <option value="">Select</option>
                                <option value="Blockchain">Blockchain</option>
                                <option value="IoT">IoT</option>
                                <option value="Game tech">Game tech</option>
                                <option value="AI">AI</option>
                                <option value="Robotics">Robotics</option>
                                <option value="Machine">Machine</option>
                                <option value="Learning">Learning</option>
                            </select>
                            <select onChange={this.onChangeStatus} name="status" value={status}>
                                <option value="">Select</option>
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                            </select>
                            <button type="submit" disabled={!this.state.formValid}>Save</button>
                        </form>
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

export default withFirebase(Posts);
