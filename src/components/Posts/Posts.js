import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import PostList from './PostList';
import SimpleReactValidator from 'simple-react-validator';

import { Link } from 'react-router-dom';
import withPost from './../../hoc/withPost';


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
        if (!this.props.posts) {
            this.setState({ loading: true });
        }
        this.onListenForMessages();
    }

    componentDidUpdate(props) {
        if (props.limit !== this.props.limit) {
          this.onListenForMessages();
        }
      }

    onListenForMessages = () => {
        this.setState({ loading: true });
        let userDetails = JSON.parse(localStorage.getItem('authUser'));

        this.props.firebase
            .posts()
            .orderByChild('userId').equalTo(userDetails.uid)
            .limitToLast(this.state.limit)
            .on('value', snapshot => {
                this.props.onSetMessages(snapshot.val());

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

    onEditPost = (message, title, description, category, status) => {
        this.props.firebase.post(message.uid).set({
            ...message,
            title, description, category, status,
            updatedAt: this.props.firebase.serverValue.TIMESTAMP,
        });
    };

    onRemovePost = uid => {
        this.props.firebase.post(uid).remove();
    };

    onNextPage = () => {
        this.props.onSetMessagesLimit(this.props.limit + 5);
    };

    render() {
        const { users } = this.props;
        const { posts, loading } = this.state;

        return (
            
            <AuthUserContext.Consumer>
                {authUser => (
                    <div className="container">
                        {loading && <div>Loading ...</div>}

                        <Link to="/newpost">Add new post</Link>

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



                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}


const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
    messages: Object.keys(state.messageState.messages || {}).map(
      key => ({
        ...state.messageState.messages[key],
        uid: key,
      }),
    ),
    limit: state.messageState.limit,
  });
  
  const mapDispatchToProps = dispatch => ({
    onSetMessages: posts =>
      dispatch({ type: 'POSTS_SET', posts }),
    onSetMessagesLimit: limit =>
      dispatch({ type: 'POSTS_LIMIT_SET', limit }),
  });

export default compose(
    withFirebase,
    connect(
      mapStateToProps,
      mapDispatchToProps,
    ),
    withPost
  )(Posts);
