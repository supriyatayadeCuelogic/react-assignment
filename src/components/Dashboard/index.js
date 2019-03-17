import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';

import DonutChart from 'react-donut-chart';

class Dashboard extends Component{
    render (){
        return
            <DonutChart
                data={[{
                    label: 'Give you up',
                    value: 25
                },
                {
                    label: '',
                    value: 75,
                    isEmpty: true
                }]} />
        
    }
}

export default Dashboard;