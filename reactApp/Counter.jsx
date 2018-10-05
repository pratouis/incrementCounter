import React from 'react';

import { Modal, Button } from 'antd';
import axios from 'axios';

/* Counter Page, keeping track of current count */
class Counter extends React.Component {
  constructor(props){
    super(props);
    /* props:
      URL - to make axios call
      token - to pass credentials
      counter - to initialize Counter components count
      notification - function that shows error messages
    */
    this.state = {
      number: this.props.counter,
      modalOpen: false,
      newNumber: 0
    }
    this.onIncrement = this.onIncrement.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onIncrement() {
    /* calculate newNumber before Modal opens */
    axios.get(`${this.props.URL}/increment?token=${this.props.token}&counter=${this.state.number}`)
      .then(({data}) =>
        this.setState({ modalOpen: true, newNumber: data.newCount })
      )
      .catch((err) => {
        /* if server is not running, might run into trouble*/
        if(err && err.response){
          this.props.notification('error', 'Unable to Get Next Count', err.response.data.msg);
        }else{
          this.props.notification('error', 'Network Error', 'check server connection');
        }
      })
  }

  /* since initial counter comes from parent component, re-render if there is
      a change in counter props passed in to Counter component
  */
  componentWillReceiveProps(newprops){
    this.setState({ number: newprops.counter });
  }


  onConfirm() {
    /* make request to backend to augment our counter, providing token for authentication */
    axios.post(this.props.URL + '/increment', { token: this.props.token, counter: this.state.newNumber })
      .then(({data}) =>
        this.setState({ modalOpen: false, number: this.state.newNumber })
      )
      .catch((err) => {
        if(err && err.response){
          this.props.notification('error', 'Unable to Increment', err.response.data.msg);
        }else{
          this.props.notification('error', 'Network Error', 'check server connection');
        }
        this.setState({ modalOpen: false });
      })
  }

  onCancel() {
    this.setState({ modalOpen: false });
  }

  render() {
      return(
        <div style={{display: 'flex', justifyContent: 'center', height: '100%'}}>

          <div style={{display: 'flex', alignItems: 'center'}}>
            <Button disabled>Count: {this.state.number}</Button>
            <Button type="primary" style={{float: 'right'}} onClick={this.onIncrement}>Increment</Button>
          </div>

          <Modal
            title="Increment Counter"
            visible={this.state.modalOpen}
            onOk={this.onConfirm}
            okText="Confirm"
            onCancel={this.onCancel}
          >
            <p>New Number: {this.state.newNumber}</p>
          </Modal>
        </div>
      )
  }
};

export default Counter;
