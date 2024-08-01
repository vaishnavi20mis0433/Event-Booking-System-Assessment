import React, { Component } from 'react';

import './Auth.css';
import AuthContext from '../context/auth-context';

class AuthPage extends Component {

  state = {
    isLogin: true
  }

  static contextType = AuthContext;
  
  constructor(props) {
    super(props);
    
    this.emailElRef = React.createRef();
    this.passwordElRef = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin }
    });
  };

  submitHandler = (event) => {
    event.preventDefault();
    const email = this.emailElRef.current.value;
    const password = this.passwordElRef.current.value;

    if(email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: email,
        password: password
      }
    };

    if(!this.state.isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!) {
            createUser(input: { email: $email, password: $password }) {
              _id
              email
            }
          }
        `,
        variables: {
          email: email,
          password: password
        }
      };
    }

    fetch('http://localhost:8000/api', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(requestBody)
    })
    .then(res => {
      if(res.status !== 200 && res.status !== 200) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(responseData => {
      if(this.state.isLogin) {
        this.context.login(
          responseData.data.login.token,
          responseData.data.login.userId,
          responseData.data.login.tokenExpiration);
      }
    })
    .catch(err => {
      console.log(err);
    });
  };

  render() {
    return (<form className="auth-form" onSubmit={this.submitHandler}>
      <div className="form-control">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" ref={this.emailElRef} />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" autoComplete="on" ref={this.passwordElRef}/>
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={this.switchModeHandler}>
          Switch to {this.state.isLogin ? 'Signup' : 'Login'}
        </button>
      </div>
    </form>);
  }
}

export default AuthPage;
