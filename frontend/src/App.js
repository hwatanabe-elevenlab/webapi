import React from 'react';
import * as AWS from 'aws-sdk/global';
// import logo from './logo.svg';
import './App.css';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import awsConfiguration from './awsConfiguration';
import { withAuthenticator } from 'aws-amplify-react';

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId
});

AWS.config.region = awsConfiguration.region;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      username: '',
      name: '',
      phoneNumber: '',
      result: '',
      currentUser: '',
      smsCode: '',
    }

    this.signUp = this.signUp.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.changedUsernameHandler = this.changedUsernameHandler.bind(this);
    this.changedNameHandler = this.changedNameHandler.bind(this);
    this.changedPhoneNumberHandler = this.changedPhoneNumberHandler.bind(this);
    this.changedEmailHandler = this.changedEmailHandler.bind(this);
    this.changedPasswordHandler = this.changedPasswordHandler.bind(this);
    this.changedSMSCodeHandler = this.changedSMSCodeHandler.bind(this);
    this.confirmSMS = this.confirmSMS.bind(this);
    this.loginByEmail = this.loginByEmail.bind(this);
    this.loginByYahoo = this.loginByYahoo.bind(this);
  }

  componentDidMount() {
    // if (window.location) {
    //   const id_token = this.getHashParam('code');

    //   fetch('https://userinfo.yahooapis.jp/yconnect/v2/attribute', {
    //     headers: {
    //       Authorization: 'Bearer ' + id_token
    //     }
    //   }).then((resp) => resp.json()).then((json) => this.setState({result: JSON.stringify(json)}));
    //   console.log(id_token);
    // }
  }

  getHashParam(key) {
    const keyandparam = window.location.hash.slice(1).split('&');
    const hashparams = {};
    for (let val of keyandparam) {
      let tmp = val.split('=');
      hashparams[tmp[0]] = tmp[1];
    }
    return hashparams[key];
  }

  signUp() {
    const attributes = [
      new CognitoUserAttribute({Name: 'name',???Value: this.state.name}),
      new CognitoUserAttribute({Name: 'email',???Value: this.state.email}),
      new CognitoUserAttribute({Name: 'phone_number',???Value: this.state.phoneNumber}),
    ];

    userPool.signUp(this.state.username, this.state.password, attributes, [], (err, result) => {
      console.log(this.state);
      if (err) {
        this.setState({result: JSON.stringify(err)});
        return;
      }
      this.setState({result: JSON.stringify(result)});
    });
  }

  login() {
    const authenticationData = {
      Username: this.state.username,
      Password: this.state.password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
      Username: this.state.username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    const self = this;
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        var accessToken = result.getAccessToken().getJwtToken();
        const loginsKey = `cognito-idp.${awsConfiguration.region}.amazonaws.com/${awsConfiguration.UserPoolId}`;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: awsConfiguration.IdentityPoolId,
          Logins: {
            [loginsKey]: accessToken,
          }
        });

        AWS.config.credentials.refresh(error => {
          if (error) {
            this.setState({result: JSON.stringify(error)});
          } else {
            this.setState({result: JSON.stringify(result)});
          }
        })
      },

      onFailure: function(err) {
        self.setState({result: JSON.stringify(err)});
      },
    });
  }

  decodeJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
  };

  logout() {
    const user = userPool.getCurrentUser();
    if (!user) {
      return;
    }
    const userData = {
      Username: user.username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.signOut();
  }

  // TODO Yahoo??????
  loginByYahoo() {
    const clientID = 'dj00aiZpPVNVaUVwU05CYldGbiZzPWNvbnN1bWVyc2VjcmV0Jng9ODE-';
    const redirect_uri = 'http://localhost:3000/';
    const uri = 'https://auth.login.yahoo.co.jp/yconnect/v2/authorization'
      + '?response_type=code+id_token'
      + '&client_id=' + clientID
      + '&redirect_uri=' + redirect_uri
      + '&state=aaaa'
      + '&scope=openid+profile'
      + '&nonce=aaaa';
    window.location.href = uri;
    // console.log(this.getYahooAccessToken());
  }

  async getYahooAccessToken() {
    const applicationId = 'dj00aiZpPVNVaUVwU05CYldGbiZzPWNvbnN1bWVyc2VjcmV0Jng9ODE-';
    const secret = '';
    const redirect_uri = 'http://localhost:3000/';
    const uri = 'https://auth.login.yahoo.co.jp/yconnect/v1/token'
      + '?grant_type=authorization_code'
      + '&code=RUGH4u6Q'
      + '&redirect_uri=' + redirect_uri;
    const resp = await fetch(uri, {
      headers: {
        Authorization: 'Basic ' + new Buffer(applicationId + ':' + secret).toString('base64'),
        'content-type': 'application/x-www-form-urlencoded',
      }
    });
    return await resp.json();
  }

  // ????????????
  changedUsernameHandler(event) {
    this.setState({username: event.target.value});
  }

  // ??????
  changedNameHandler(event) {
    this.setState({name: event.target.value});
  }

  // ?????????????????????
  changedEmailHandler(event) {
    this.setState({email: event.target.value});
  }

  // ???????????????
  changedPasswordHandler(event) {
    this.setState({password: event.target.value});
  }

  // ????????????
  changedPhoneNumberHandler(event) {
    this.setState({phoneNumber: event.target.value});
  }

  // ?????????????????????????????????
  getCurrentUser() {
    const user = userPool.getCurrentUser();
    console.log(user);
    this.setState({currentUser: JSON.stringify(user)});
  }

  // SMS???????????????
  changedSMSCodeHandler(event) {
    this.setState({smsCode: event.target.value});
  }

  // SMS???????????????
  confirmSMS() {
    const userData = {
      Username: this.state.username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    const self = this;
    cognitoUser.confirmRegistration(this.state.smsCode, true, function(err, result) {
      if (err) {
        self.setState({result: err.message || JSON.stringify(err)});
        return;
      }
      self.setState({result: JSON.stringify(result)});
    });
  }

  loginByEmail() {

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <form>
            <label>????????????</label><br></br>
            <input type="text" placeholder="Username" onChange={this.changedUsernameHandler} /><input readOnly value=""></input><br></br>

            <label>???????????????</label><br></br>
            <input type="password" placeholder="Password" onChange={this.changedPasswordHandler} /><input readOnly value=""></input><br></br>

            <label>?????????????????????</label><br></br>
            <input type="email" placeholder="Email" onChange={this.changedEmailHandler} /><input readOnly value=""></input><br></br>

            <label>????????????</label><br></br>
            <input type="text" placeholder="Phone number" onChange={this.changedPhoneNumberHandler} /><input readOnly value=""></input><br></br>

            <label>??????</label><br></br>
            <input type="text" placeholder="Name" onChange={this.changedNameHandler} /><input readOnly value=""></input><br></br>

            <label>SMS???????????????</label><br></br>
            <input type="text" placeholder="SMS Code" onChange={this.changedSMSCodeHandler} /><br></br>

            <hr></hr>
            <small>?????????????????? ?????? Cognito</small><br></br>
            <button type="button" onClick={this.signUp}>SignUp</button>
            <button type="button" onClick={this.login}>Login</button>
            <button type="button" onClick={this.loginByEmail}>Login(email)</button>
            <button type="button" onClick={this.logout}>Logout</button>
            <button type="button" onClick={this.loginByYahoo}>Yahoo Login</button>
            <button type="button" onClick={this.confirmSMS}>SMS??????</button>

            <hr></hr>
            <small>?????????????????? ?????? ?????????????????? ?????? Cognito</small><br></br>
          </form>
          <p>hwatanabe.elevenlab@gmail.com</p>
          <span>58dG%kBM3811</span>
          <textarea defaultValue={this.state.result}></textarea>
          <p>????????????????????????</p>
          <button onClick={this.getCurrentUser}>getCurrentUser</button>
          <textarea defaultValue={this.state.currentUser}></textarea>

          {/* <img src={logo} className="App-logo" alt="logo" /> */}
        </header>
      </div>
    );
  }
}

export default App;
