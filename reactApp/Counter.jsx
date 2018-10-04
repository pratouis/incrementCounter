import React from 'react';

import { Modal, Button } from 'antd';
import axios from 'axios';
const backendURL = 'http://localhost:3000';

class Counter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      number: this.props.counter,
      modalOpen: false
    }
  }

  onIncrement() {
      this.setState({ modalOpen: true});
  }

  onConfirm(e,x) {
    const newNumber = Math.max(this.state.number+1,this.state.number*2);
    axios.post(backendURL + '/increment', { token: this.props.token, number: newNumber })
      .then(({data}) => {
        if(data.success){
          this.setState({modalOpen: false, number: newNumber})
        }else{
          console.log(data);
        }
      })
      .catch((err) => {
        this.setState({modalOpen: false});
      })
  }

  onCancel(e) {
    this.setState({modalOpen: false});
  }

  render() {
    const newNumber = Math.max(this.state.number+1,this.state.number*2);
      return(
        <div style={{display: 'flex', justifyContent: 'center', height: '100%'}}>

          <div style={{display: 'flex', alignItems: 'center'}}>
            <Button disabled>{this.state.number}</Button>
            <Button type="primary" style={{float: 'right'}} onClick={(e) => this.onIncrement(e)}>Increment</Button>
          </div>


          <Modal
            title="Increment Counter"
            visible={this.state.modalOpen}
            onOk={(e) => this.onConfirm(e,newNumber)}
            okText="Confirm"
            onCancel={(e) => this.onCancel(e)}
          >
            <p>New Number: {newNumber}</p>
          </Modal>
        </div>
      )
  }
};

export default Counter;
