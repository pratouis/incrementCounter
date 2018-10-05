/* Main App of Frontend, controlling flow of login and counter */

import React from 'react';
import axios from 'axios';

/* Child components*/
import Login from './Login.jsx';
import Counter from './Counter.jsx';


/* backendURL is passed to other components as argument, we can update easily */
const backendURL = 'http://localhost:3000';
import { Layout, Icon, Menu, notification } from 'antd';
const { Header, Content } = Layout;
notification.config({
  duration: 2,
});

/* main app, controlling flow of what we see */
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      creds: null,
      counter: 0,
      username: 'Guest'
    };
    this.login = this.login.bind(this);
    this.menuClick = this.menuClick.bind(this);
  }

  /* function that triggers notification of a certain type */
  openNotificationWithIcon(type, title, msg){
    notification[type]({
      message: title,
      description: msg,
    });
  };

  login(username, password) {
    axios.post(backendURL + '/login',{username, password})
    .then(({data}) => {
      /*  on successful login, update creds, username, and counter */
      this.setState({ creds: data.token, counter: data.counter, username });
      // this.openNotificationWithIcon('info', 'Login', data.msg)
    })
    .catch((err) => {
      if(err && err.response){
        this.openNotificationWithIcon('error', 'Login', err.response.data.msg)
      }else{
        this.openNotificationWithIcon('error', 'Network Error', 'check server connection')
      }
    });
  }
  reset(){
    /* write 0 to backend, and update front-end counter */
    axios.post(backendURL+'/increment', {token: this.state.creds, counter: 0 })
      .then(({data})=>{
        this.setState({ counter: 0 })
        this.openNotificationWithIcon('success', 'Counter Reset', data.msg);
      })
      .catch((err) => {
        if(err && err.response){
          this.openNotificationWithIcon('error', 'Unable to Reset', data.msg);
        }else{
          this.openNotificationWithIcon('error', 'Network Error', 'check server connection')
        }
      })
  }

  logout(){
    axios.get(backendURL+'/logout?token='+this.state.creds)
      .then(({data}) => {
        this.setState({ creds: null, username: 'Guest' })
        // this.openNotificationWithIcon('info', 'Logout', data.msg)
      })
      .catch((err) => {
        if(err && err.response){
          // return err.response.data
          this.openNotificationWithIcon('error', 'Logout', data.msg)
        }else{
          this.openNotificationWithIcon('error', 'Network Error', 'check server connection')
        }
      })
  }

  menuClick(e){
    switch(e.key){
      case 'reset':
        this.reset();
        break;
      case 'logout':
        this.logout();
        break;
      default:
        //do nothing
        break;
    }
  }

  render() {
    return (
      <Layout style={{height: '100%'}}>
          <Header style={{background:'rgba(10,10,10,0.1)', display:'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
            {/*  Show generic title if user not logged in*/}
            <Menu
              selectedKeys={[]}
              style={{background: 'initial', display: 'flex'}}
              onClick={this.menuClick}
              mode="horizontal"
            >
              <Menu.Item key="heading" disabled>
                Increment Counter
              </Menu.Item>

              <Menu.Item key="user" disabled>
                <Icon type="user"/> Welcome {this.state.username}
              </Menu.Item>
              {/* Reset and Logout are only click-able if user logged in */}
            <Menu.SubMenu
                disabled={!!!this.state.creds}
                title={<span className="submenu-title-wrapper"><Icon type="ellipsis" theme="outlined" />Options</span>}>
                  <Menu.Item key="reset">
                  <Icon type="rollback" theme="outlined" />Reset Counter
                  </Menu.Item>
                  <Menu.Item key="logout">
                    <Icon type="logout" theme="outlined" />Logging Out
                  </Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </Header>
          <Content style={{height:'100%'}}>
            {/* Render Login page if not logged in, otherwise render counter */}
            {this.state.creds ?
              <Counter
                URL={backendURL}
                token={this.state.creds}
                counter={this.state.counter}
                notification={this.openNotificationWithIcon}
              /> :
              <Login
                URL={backendURL}
                login={this.login}
                notification={this.openNotificationWithIcon}
              />
            }
          </Content>
      </Layout>
    )
  }
}

export default Home;
