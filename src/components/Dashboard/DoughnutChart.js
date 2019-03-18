import React, { Component } from 'react';
import CanvasJSReact from './../../assets/canvasjs.react';
import { withFirebase } from '../Firebase';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;


 
class DoughnutChart extends Component {
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
						if(data[messageList[i].category] === undefined){
							data[messageList[i].category] = { count :1};
						}else{
							data[messageList[i].category].count = data[messageList[i].category].count +1;
						}
					}
					
					if(data){
						let chartArr = [];
						for(let key in data){
							let dt = {'name':key, y:data[key].count}
							chartArr.push(dt);
						}
						this.setState({
							chartData:chartArr
						})
					}

                } else {
                    this.setState({ posts: null, loading: false });
                }
            });
    };


	render() {
		const options = {
			animationEnabled: true,
			title: {
				text: "Post list by category"
			},
			subtitles: [{
				text: "",
				verticalAlign: "center",
				fontSize: 24,
				dockInsidePlotArea: true
			}],
			data: [{
				type: "doughnut",
				showInLegend: true,
				indexLabel: "{name}: {y}",
				yValueFormatString: "#,###'%'",
				dataPoints: this.state.chartData
			}]
		}
		
		return (
		<div>
			<CanvasJSChart options = {options} 
				/* onRef={ref => this.chart = ref} */
			/>
			
		</div>
		);
	}
}

export default withFirebase(DoughnutChart);