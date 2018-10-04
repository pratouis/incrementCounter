import React from 'react';
import axios from 'axios';


import Login from './Login.jsx';
import Counter from './Counter.jsx';

const backendURL = 'http://localhost:3000';
import { Layout, Header, Content } from 'antd';
import { message } from 'antd';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      creds: null,
      messages: [],
      counter: 0
    };
  }

  // register(username, password){
  //   axios.post(backendURL+'/register')
  //     .then(({success, msg}) => )
  // }

  login(username, password) {
    axios.post(backendURL + '/login',
    // {
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     'Content-Type' : 'application/json'
    //   },
    //   withCredentials: true,
    //   credentials: 'same-origin',
    //   data: {
    //     username,
    //     password
    //   }
    // }
    {username, password}
  )
    .then(({data}) => {
      this.setState({ creds: data.token, counter: data.counter });
    })
    .catch((err) => {
      this.setState({messages: [err.response.data]})
    });
  }


  render() {
    return (
      <Layout style={{height: '100%'}}>
          {/* {this.state.messages.map((({success, msg}) =>
            success ? message.success(msg) : message.error(msg)
          ))} */}

          {this.state.creds ? <Counter token={this.state.creds} counter={this.state.counter} /> : <Login login={(user,pwd) => this.login(user,pwd)}/>}
      </Layout>
    )
  }
}

export default Home;
