import React, { Component } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import './Post.css';

class PostItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editTitle: this.props.posts.title,
      editDesc: this.props.posts.description,
      editAuthor: this.props.posts.author,
      editCategory: this.props.posts.category,
      editStatus: this.props.posts.status
    };

    this.validator = new SimpleReactValidator();
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
  
  onChangeEditCategory = event => {
    this.setState({ editCategory: event.target.value });
  };
  onChangeEditStatus = event => {
    this.setState({ editStatus: event.target.value });
  };

  onSaveEditText = () => {
    if (this.validator.allValid()) {
      this.props.onEditPost(this.props.posts, this.state.editTitle, this.state.editDesc,this.state.editCategory, this.state.editStatus);

      this.setState({ editMode: false });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  render() {

    const { posts, onRemovePost } = this.props;
    const { editMode, editTitle, editDesc, editCategory, editStatus } = this.state;

    return (
      <li>
        {editMode ? (
          <div className="form-group col-md-6">
            <label>Title</label>
            <input type="text" className="form-control" value={editTitle} onChange={this.onChangeEditTitle} />
            <label>Description</label>
            <input type="text" className="form-control" value={editDesc} onChange={this.onChangeEditDesc} />
            <label>Category</label>
            <select onChange={this.onChangeEditCategory} className="form-control" value={editCategory}>
              <option value="">Select</option>
              <option value="Blockchain">Blockchain</option>
              <option value="IoT">IoT</option>
              <option value="Game tech">Game tech</option>
              <option value="AI">AI</option>
              <option value="Robotics">Robotics</option>
              <option value="Machine">Machine</option>
              <option value="Learning">Learning</option>
            </select>
            <label>Status</label>
            <select onChange={this.onChangeEditStatus} className="form-control" value={editStatus}>
              <option value="">Select</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>

          </div>
        ) : (
            <label><span>
              {posts.title} {posts.editedAt && <span>(Edited)</span>}
            </span></label>
          )}

        {editMode ? (
          <span>
            <button onClick={this.onSaveEditText} className="btn btn-primary editBtn">Save</button>
            <button onClick={this.onToggleEditMode} className="btn btn-primary">Reset</button>
          </span>
        ) : (
            <button onClick={this.onToggleEditMode} className="btn btn-primary editBtn">Edit</button>
          )}

        {!editMode && (
          <button type="button" onClick={() => onRemovePost(posts.uid)} className="btn btn-primary">  Delete </button>
        )}
      </li>
    );
  }
}

export default PostItem;
