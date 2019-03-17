import React, { Component } from 'react';

class PostItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editTitle: this.props.posts.title,
      editDesc: this.props.posts.description,
      editAuthor: this.props.posts.author,
      editCategory:this.props.posts.category,
      editStatus:this.props.posts.status
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editTitle: this.props.posts.title,
      editDesc: this.props.posts.description,
      editAuthor: this.props.posts.author,
      editCategory: this.props.posts.category,
      editStatus: this.props.posts.status,
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
  onChangeEditCategory = event => {
    this.setState({ editCategory: event.target.value });
  };
  onChangeEditStatus = event => {
    this.setState({ editStatus: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditPost(this.props.posts,this.state.editTitle);

    this.setState({ editMode: false });
  };

  render() {
    const { posts, onRemoveMessage } = this.props;
    const { editMode, editTitle,editDesc,editAuthor,editCategory,editStatus } = this.state;

    return (
      <li>
        {editMode ? (
          <div>
            <input type="text" placeholder="Title" value={editTitle} onChange={this.onChangeEditTitle} />
            <input type="text" placeholder="Description" value={editDesc} onChange={this.onChangeEditDesc} />
            <input type="text" placeholder="Author" value={editAuthor} onChange={this.onChangeEditAuthor} />
            <select onChange={this.onChangeEditCategory} value={editCategory}>
              <option value="select">Select</option>
              <option value="Blockchain">Blockchain</option>
              <option value="IoT">IoT</option>
              <option value="Game tech">Game tech</option>
              <option value="AI">AI</option>
              <option value="Robotics">Robotics</option>
              <option value="Machine">Machine</option>
              <option value="Learning">Learning</option>
          </select>
          <select onChange={this.onChangeEditStatus} value={editStatus}>
              <option value="select">Select</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
          </select>

          </div>
        ) : (
          <span>            
            {posts.title} {posts.editedAt && <span>(Edited)</span>}
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
