import AddPost from './AddPost';
import { compose } from 'recompose';
import { withFirebase } from './../../Firebase';

import { withAuthorization, withEmailVerification } from './../../Session';

const condition = authUser => !!authUser;
export default compose(
    withFirebase,
    withEmailVerification,
    withAuthorization(condition),
  )(AddPost);