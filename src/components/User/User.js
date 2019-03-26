import React, { Component } from 'react';
import axios from 'axios';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';

class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: []
        }
    }

    componentDidMount() {
        axios.get('https://randomuser.me/api/?results=10&inc=name,registered&nat=fr')
            .then(json => {
                this.setState({ list: json.data.results });
                console.log(json);
            })
    }

    render() {
        const {list} = this.state;
        return (
            <div>
                {list.map(item => (
                    <li key={item.registered.date}>{item.name.first + item.name.last}</li>
                ))}
            </div>
        )
    }
}

const condition = authUser => !!authUser;
export default compose(withAuthorization(condition))(User);