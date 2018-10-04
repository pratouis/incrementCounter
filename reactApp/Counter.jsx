import React from 'react';

import { Modal, Button } from 'antd';
import axios from 'axios';


class Counter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      number: this.props.counter,
      modalOpen: false,
      newNumber: 0
    }
  }

  onIncrement() {
    /* there was a bug where modal's animation is slower than the update of number,
      so the next increment number is shown just after hitting confirm
      therefore we need newNumber in our state
      */
      /*
      It probably makes little computational difference to recalculate
        max everytime increment is clicked
    */
      if(this.state.newNumber === this.state.number){
        const newNumber = Math.max(this.state.number+1,this.state.number*2);
        this.setState({ modalOpen: true, newNumber: newNumber });
      }else{
        this.setState({ modalOpen: true})
      }
  }

  onConfirm(e) {

    axios.post(this.props.URL + '/increment', { token: this.props.token, number: this.state.newNumber })
      .then(({data}) => {
        if(data.success){
          this.setState({modalOpen: false, number: this.state.newNumber })
        }else{
          this.setState({modalOpen: false });
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
      return(
        <div style={{display: 'flex', justifyContent: 'center', height: '100%'}}>

          <div style={{display: 'flex', alignItems: 'center'}}>
            <Button disabled>{this.state.number}</Button>
            <Button type="primary" style={{float: 'right'}} onClick={(e) => this.onIncrement(e)}>Increment</Button>
          </div>

          <Modal
            title="Increment Counter"
            visible={this.state.modalOpen}
            onOk={(e) => this.onConfirm(e)}
            okText="Confirm"
            onCancel={(e) => this.onCancel(e)}
          >
            <p>New Number: {this.state.newNumber}</p>
          </Modal>
        </div>
      )
  }
};

export default Counter;
