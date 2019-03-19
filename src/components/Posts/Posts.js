import React, { Component } from 'react';

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import PostList from './PostList';
import SimpleReactValidator from 'simple-react-validator';

import { Link } from 'react-router-dom';


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
            limit: 5
        };

        this.validator = new SimpleReactValidator();
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

    

    onNextPage = () => {
        this.setState(
            state => ({ limit: state.limit + 5 }),
            this.onListenForMessages,
        );
    };

    render() {
        const { users } = this.props;
        const { posts, loading} = this.state;

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div className="container">
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

                        <Link to="/newpost">Add new post</Link>
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

export default withFirebase(Posts);
