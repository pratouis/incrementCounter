import React from 'react';

import { Form, Icon, Input, Button, Checkbox } from 'antd';

const FormItem = Form.Item;

class LoginForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isRegister: false
    };
  }
  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
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
      <h3 style={{padding: '20px'}}>Increment Counter</h3>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Form onSubmit={(e) => this.handleSubmit(e)} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
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
