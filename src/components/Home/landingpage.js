import React from 'react';
import { AuthUserContext } from '../Session';


const landingpage = () => {
    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <div>Hello {authUser.username}</div>
            )}
        </AuthUserContext.Consumer>
    )
}

export default landingpage;