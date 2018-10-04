import React from 'react';

class Counter extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      number: 0,
      modalOpen: false,
      newNumber: 0
    }
  }

  onIncrement() {
      const newNumber = Math.max(this.state.number+1,this.state.number*2);
      this.setState({ modalOpen: true, newNumber });
  }

  onConfirm() {

  }

  render() {
      return(
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

          <div>
            <h1 >{this.state.number}</h1>
            <button style={{float: 'right'}} onClick={(e) => this.onIncrement(e)}>Increment</button>
          </div>


          <div>
            {this.state.modalOpen ? `New Number: ${this.state.newNumber}` : ""}
          </div>
        </div>
      )
  }
};

export default Counter;
