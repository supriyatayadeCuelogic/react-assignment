import React, { Component } from 'react';
import { compose } from 'recompose';
import PieChart from './PieChart';

import DoughnutChart from './DoughnutChart';

import { withAuthorization, withEmailVerification } from '../Session';
import { withFirebase } from '../Firebase';

class DoughnutChrt extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chartData: null,
            posts:null
        };
    }

    

    render () {
        return (
        <div>
            <DoughnutChart />
            <PieChart />
        </div>
        )
    }
}

const condition = authUser => !!authUser;
export default compose(
    withFirebase,
    withEmailVerification,
    withAuthorization(condition),
  )(DoughnutChrt);