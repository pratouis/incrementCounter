import React from 'react';
import axios from 'axios';

import Login from './Login.jsx';
import Counter from './Counter.jsx';

/* backendURL is passed to other components as argument, we can update easily */
const backendURL = 'http://localhost:3000';
import { Layout, Icon } from 'antd';
const { Header, Content } = Layout;

/* main app, controlling flow of what we see */
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      creds: null,
      counter: 0
    };
  }

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
      /*
        on successful login, update creds, username, and counter
      */
      this.setState({ creds: data.token, counter: data.counter, username });
    })
    .catch((err) => {
      if(err && err.response){
        // console.log(err.response.data);
      }
    });
  }


  render() {
    return (
      <Layout style={{height: '100%'}}>
          <Header style={{background:'rgba(10,10,10,0.1)', display:'flex', justifyContent: 'center', alignItems: 'c'}}>
            {/*  Show generic title if user not logged in*/}
            {this.state.creds ?
              (<h3>
                <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                Welcome {this.state.username}
              </h3>
              ) : <h3>Increment Counter</h3>}
          </Header>
          <Content style={{height:'100%'}}>
            {/* Render Login page if not logged in, otherwise render counter */}
            {this.state.creds ?
              <Counter URL={backendURL} token={this.state.creds} counter={this.state.counter} /> :
              <Login URL={backendURL} login={(user,pwd) => this.login(user,pwd)}/>
            }
          </Content>
      </Layout>
    )
  }
}

export default Home;
