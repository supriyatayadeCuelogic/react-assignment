import React, { Component } from 'react';
import { compose } from 'recompose';
import PieChart from './PieChart';

import DoughnutChart from './DoughnutChart';
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

export default compose(withFirebase)(DoughnutChrt,PieChart);