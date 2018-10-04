import React from 'react';
import axios from 'axios';
import { Form, Icon, Input, Button } from 'antd';

const FormItem = Form.Item;

class LoginForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isRegister: false
    };
  }

  register(username, password){
    axios.post(this.props.URL + '/register',{ username, password })
      .then(({data}) => {
        this.setState({ isRegister: false });
      })
      .catch((err) => {
        console.log(err.response.data.msg);
      });
  }

  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(this.state.isRegister){
          if(values.password === values.repeatPassword){
              this.register(values.username.trim(), values.password);
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
      <Form onSubmit={(e) => this.handleSubmit(e)} className="login-form">
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
          <Button type="primary" htmlType="submit" className="login-form-button">
            {this.state.isRegister ? "Register" : "Log In"}
          </Button>
          <br/>
          Or <a href="" onClick={(e) => this.toggleLogin(e)}>{this.state.isRegister ? "login" : "register"} now!</a>
        </FormItem>
      </Form>
      </div>
    </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(LoginForm);

export default WrappedNormalLoginForm;
