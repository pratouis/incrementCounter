import React from 'react';
import axios from 'axios';
import { Form, Icon, Input, Button } from 'antd';

const FormItem = Form.Item;

class LoginForm extends React.Component {
  constructor(props){
    super(props);
    /* props:
      URL - to make axios call
      login - handles axios login request and token storage
      notification - function that shows error messages
    */
    this.state = {
      isRegister: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleLogin = this.toggleLogin.bind(this);

  }
  /* register is internal to LoginForm, just toggling whether isRegister state */
  register(username, password){
    axios.post(this.props.URL + '/register',{ username, password })
      .then(({data}) => {
        this.setState({ isRegister: false });
        this.props.notification('success', 'Register Success', err.response.data.msg);

      })
      .catch((err) => {
        if(err && err.response){
          this.props.notification('error', 'Unable to Register', err.response.data.msg);
        }else{
          this.props.notification('error', 'Network Error', 'check server connection')
        }
      });
  }

  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      /* if fields are not blank, make appropriate axios calls*/
      if (!err) {
        if(this.state.isRegister){
          if(values.password === values.repeatPassword){
              this.register(values.username.trim(), values.password);
          }else{
            this.props.notification('error', 'Unable to Register', 'passwords don\'t match');
          }
        }else{
          this.props.login(values.username.trim(), values.password);
        }
      }
    });
  }

  toggleLogin(e){
    e.preventDefault();
    this.setState({isRegister: !this.state.isRegister});
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (

      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px'}}>
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{paddingRight: '5px'}}/>} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        {this.state.isRegister ?
          <FormItem>
            {getFieldDecorator('repeatPassword', {
              rules: [{ required: true, message: 'Please input your Password!' }]
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
            )}
          </FormItem>
        : <pre />}
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button" style={{marginRight: '10px'}}>
            {this.state.isRegister ? "Register" : "Log In"}
          </Button>
          Or <a href="" onClick={this.toggleLogin}>{this.state.isRegister ? "login" : "register"} now!</a>
        </FormItem>
      </Form>
      </div>
    </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(LoginForm);

export default WrappedNormalLoginForm;
