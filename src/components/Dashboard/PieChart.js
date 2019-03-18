import React, { Component } from 'react';
import CanvasJSReact from './../../assets/canvasjs.react';

import { withFirebase } from '../Firebase';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class PieChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
			chartData : []
        };
    }

    componentDidMount() {
        this.onListenForMessages();
    }

    onListenForMessages = () => {
        this.setState({ loading: true });

        this.props.firebase
            .posts()
            .orderByChild('createdAt')            
            .on('value', snapshot => {
                const messageObject = snapshot.val();

                if (messageObject) {
                    const messageList = Object.keys(messageObject).map(key => ({
                        ...messageObject[key],
                        uid: key,
                    }));

                    this.setState({
                        posts: messageList,
                        loading: false,
					});
					
					let data=[];
					for(let i=0;i<messageList.length;i++){
						if(data[messageList[i].author] === undefined){
							data[messageList[i].author] = { count :1};
						}
					}
					
					if(data){
						let chartArr = [];
						let authorCount = 0;
						let postCount = messageList.length;
						
						for(let key in data){
							authorCount += data[key].count							
						}
						this.setState({
							chartData:[{name:'Posts',y:postCount},
							{name:'Author', y:authorCount}]
						})
					}

                } else {
                    this.setState({ posts: null, loading: false });
                }
            });
    };

	render() {
		const options = {
			exportEnabled: true,
			animationEnabled: true,
			title: {
				text: "Post vs Author"
			},
			data: [{
				type: "pie",
				startAngle: 75,
				toolTipContent: "<b>{name}</b>: {y}%",
				showInLegend: "true",
				legendText: "{name}",
				indexLabelFontSize: 16,
				indexLabel: "{name} - {y}%",
				dataPoints: this.state.chartData
			}]
		}
		
		return (
		<div>
			<h1>React Pie Chart</h1>
			<CanvasJSChart options = {options} 
				/* onRef={ref => this.chart = ref} */
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}

export default withFirebase(PieChart);