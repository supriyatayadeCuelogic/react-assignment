import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import MessageList from './MessageList';

class Messages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description:'',
      category:'',
      loading: false,
    };
  }

  componentDidMount() {
    if (!this.props.messages.length) {
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
    this.props.firebase
      .messages()
      .orderByChild('createdAt')
      // .limitToLast(this.props.limit)
      .on('value', snapshot => {
        this.props.onSetMessages(snapshot.val());

        this.setState({ loading: false });
      });
  };

  componentWillUnmount() {
    this.props.firebase.messages().off();
  }

  onChangeText = event => {
    this.setState({ title: event.target.value });
  };

  onChangeDescription = event => {
    this.setState({ description: event.target.value });
  }

  onChangeCategory = event => {
    this.setState({ category: event.target.value });
  }

  onChangeStatus = event => {
    this.setState({ status: event.target.value });
  }

  onCreateMessage = (event, authUser) => {
    this.props.firebase.messages().push({
      title: this.state.title,
      userId: authUser.uid,
      author: authUser.username,
      description: this.state.description,
      category: this.state.category,
      status: this.state.status,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
      updatedAt: this.props.firebase.serverValue.TIMESTAMP,
    });

    this.setState({ title: '', description:'', status:'', category: ''});

    event.preventDefault();
  };

  onEditMessage = (message, title, description, category, status) => {
    this.props.firebase.message(message.uid).set({
      ...message,
      title,
      description,
      category,
      status,
      editedAt: this.props.firebase.serverValue.TIMESTAMP,
    });
  };

  onRemoveMessage = uid => {
    this.props.firebase.message(uid).remove();
  };

  onNextPage = () => {
    this.props.onSetMessagesLimit(this.props.limit + 5);
  };

  render() {
    const { users, messages } = this.props;
    const { title, description, loading } = this.state;

    return (
      <div>

        {loading && <div>Loading ...</div>}

        {messages && (
          <MessageList
            messages={messages.map(message => ({
              ...message,
              user: users
                ? users[message.userId]
                : { userId: message.userId },
            }))}
            onEditMessage={this.onEditMessage}
            onRemoveMessage={this.onRemoveMessage}
          />
        )}

        {!messages && <div>There are no messages ...</div>}

        <form
          onSubmit={event =>
            this.onCreateMessage(event, this.props.authUser)
          }
        >
          <input
            type="text"
            value={title}
            placeholder="Title"
            onChange={this.onChangeText}
          />
          <br></br>
          <textarea
            type="text"
            value={description}
            placeholder="Description"
            onChange={this.onChangeDescription}
          />
          <br></br>
  
          <select value={this.state.category} onChange={this.onChangeCategory}>
            <option>Category</option>
            <option value="Blockchain" >Blockchain</option>
            <option value="IoT">IoT</option>
            <option value="Game tech">Game tech</option>
            <option value="AI">AI</option>
            <option value="Robotics">Robotics</option>
          </select>
          <br></br>
          <input type="radio" name="status" 
                                   value='draft'
                                   checked={this.state.status === 'draft'} 
                                   onChange={this.onChangeStatus} />Draft
          <input type="radio" name="status" 
                                   value='published'
                                   checked={this.state.status === 'published'} 
                                   onChange={this.onChangeStatus} />Published
          <br></br>
          <br></br>
          <button type="submit">Submit Post</button>
        </form>
      </div>
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
  onSetMessages: messages =>
    dispatch({ type: 'MESSAGES_SET', messages }),
  onSetMessagesLimit: limit =>
    dispatch({ type: 'MESSAGES_LIMIT_SET', limit }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Messages);
