import React, { Component } from 'react';

class MessageItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editTitle: this.props.message.text,
      editDescription: this.props.message.description,
      editCategory:this.props.message.category,
      editStatus: this.props.message.status
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editTitle: this.props.message.title,
      editDescription: this.props.message.description,
      editCategory:this.props.message.category,
      editStatus: this.props.message.status
      
    }));
  };

  onChangeEditText = event => {
    this.setState({ editTitle: event.target.value });
  };

  onChangeEditDescription = event => {
    this.setState({ editDescription: event.target.value });
  };

  onChangeEditCategory = event => {
    this.setState({ editCategory: event.target.value });
  };

  onChangeEditStatus = event => {
    this.setState({ editStatus: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditMessage(
      this.props.message, 
      this.state.editTitle,
      this.state.editDescription,
      this.state.editCategory,
      this.state.editStatus
    );
    this.setState({ editMode: false });
  };
  

  render() {
    const { message, onRemoveMessage } = this.props;
    const { editMode, editTitle, editDescription, editCategory, editStatus } = this.state;

    return (
      <li>
        {editMode ? (
          <div>
          <input
            type="text"
            value={editTitle}
            onChange={this.onChangeEditText}
          />
          <textarea
            type="text"
            value={editDescription}
            placeholder="Description"
            onChange={this.onChangeEditDescription}
          />
          <select value={editCategory} onChange={this.onChangeEditCategory}>
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
                                   checked={editStatus === 'draft'} 
                                   onChange={this.onChangeEditStatus} />Draft
          <input type="radio" name="status" 
                                   value='published'
                                   checked={editStatus === 'published'} 
                                   onChange={this.onChangeEditStatus} />Published
          </div>
          
        ) : (
          <span>
            <strong>
              {message.user.username || message.user.userId}
            </strong>{' '}
            {message.title}
          </span>
        )}

        {editMode ? (
          <span>
            <button onClick={this.onSaveEditText}>Save</button>
            <button onClick={this.onToggleEditMode}>Reset</button>
          </span>
        ) : (
          <button onClick={this.onToggleEditMode}>Edit</button>
        )}

        {!editMode && (
          <button
            type="button"
            onClick={() => onRemoveMessage(message.uid)}
          >
            Delete
          </button>
        )}
      </li>
    );
  }
}

export default MessageItem;