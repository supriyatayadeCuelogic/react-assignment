import React, { Component } from 'react';

class PostItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.posts.title,
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.posts.title,
    }));
  };

  onChangeEditTitle = event => {
    this.setState({ editTitle: event.target.value });
  };
  onChangeEditDesc = event => {
    this.setState({ editDesc: event.target.value });
  };
  onChangeEditAuthor = event => {
    this.setState({ editAuthor: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditMessage(this.props.posts, this.state.editText);

    this.setState({ editMode: false });
  };

  render() {
    const { posts, onRemoveMessage } = this.props;
    const { editMode, editTitle,editDesc,editAuthor } = this.state;
debugger;
    return (
      <li>
        {editMode ? (
          <div>
            <input type="text" value={editTitle} onChange={this.onChangeEditTitle} />
            <input type="text" value={editDesc} onChange={this.onChangeEditDesc} />
            <input type="text" value={editAuthor} onChange={this.onChangeEditAuthor} />
            

          </div>
        ) : (
          <span>            
            {posts.text} {posts.editedAt && <span>(Edited)</span>}
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
            onClick={() => onRemoveMessage(posts.uid)}
          >
            Delete
          </button>
        )}
      </li>
    );
  }
}

export default PostItem;
