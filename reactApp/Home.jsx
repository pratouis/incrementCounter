import React from 'react';
import axios from 'axios';

import Login from './Login.jsx';
import Counter from './Counter.jsx';

const backendURL = 'http://localhost:3000';

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      creds: null
    };
  }

  register(username, password){
    axios.post(backendURL+'/register')
  }

  login(username, password){

  }

  render() {
    return (

    )
  }
}

export default Home;
