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
            loading: false,
            posts: [],
            limit: 5,
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


    onCreateMessage = (event, authUser) => {
        debugger;
        this.props.firebase.posts().push({
            title: this.state.title,
            description: this.state.description,
            author: this.state.author,
            userId: authUser.uid,
            createdAt: this.props.firebase.serverValue.TIMESTAMP
        });

        this.setState({ text: '', description: '', author: '' });

        event.preventDefault();
    };

    onEditPost = (message, text) => {
        this.props.firebase.posts(message.uid).set({
            ...message,
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
        const { title,description,author, posts, loading } = this.state;

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        {!loading && posts && (
                            <button type="button" onClick={this.onNextPage}>
                                More
              </button>
                        )}

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

                        <form
                            onSubmit={event =>
                                this.onCreateMessage(event, authUser)
                            }
                        >
                            <input
                                type="text"
                                value={title}
                                onChange={this.onChangeText}
                            />
                            <input type="text" value={description} onChange={this.onChangeDesc} />
                            <input type="text" value={author} onChange={this.onChangeAuthor} />

                            <button type="submit">Send</button>
                        </form>
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

export default withFirebase(Posts);
