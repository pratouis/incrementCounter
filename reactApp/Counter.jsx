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
    */
    this.state = {
      number: this.props.counter,
      modalOpen: false,
      newNumber: 0
    }
    /* NOTE about newNumber:
      there was a bug where modal's animation is slower than the update of number,
      so the next increment number is shown just after hitting confirm
      therefore we need newNumber in our state
    */
  }

  onIncrement() {
    /* calculate newNumber before Modal opens */
    axios.get(`${this.props.URL}/increment?token=${this.props.token}&counter=${this.state.number}`)
      .then(({data}) => {
        if(data.success){
          this.setState({ modalOpen: true, newNumber: data.newCount });
        }
      })
      .catch((err) => {
        if(err && err.response){
          console.log(err.response.data.msg);
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
