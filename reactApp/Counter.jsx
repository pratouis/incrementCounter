import React from 'react';

class Counter extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      number: 0
    }
  }

  onClick() {
      
  }

  render() {
      return(
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

          <div>
            <h1 >{this.state.number}</h1>
            <button style={{float: 'right'}}>Increment</button>

          </div>
        </div>
      )
  }
};

export default Counter;
