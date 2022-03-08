import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  renderPassword = () => {
    const {password} = this.state
    return (
      <>
        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          type="password"
          className="input"
          id="password"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
      </>
    )
  }

  renderUsername = () => {
    const {username} = this.state

    return (
      <>
        <label htmlFor="username" className="label">
          Username
        </label>
        <input
          className="input"
          id="username"
          type="text"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
      </>
    )
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {showError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <>
        <div className="mainCon">
          <div className="image-con">
            <img
              src="https://res.cloudinary.com/dmu5r6mys/image/upload/v1645091251/OBJECTS_ctprc5.png"
              alt="website login"
              className="login-image"
            />
          </div>
          <form className="form-con" onSubmit={this.submitForm}>
            <div className="login-subCon">
              <div className="logo-con">
                <img
                  src="https://res.cloudinary.com/dmu5r6mys/image/upload/v1645095409/Group_uiqlwh.png"
                  alt="website logo"
                  className="logo"
                />
                <h1 className="heading">Insta Share</h1>
              </div>
              <div className="input-main-container">
                <div className="input-con">{this.renderUsername()}</div>
                <div className="input-con">{this.renderPassword()}</div>
                <button type="submit" className="submit-btn">
                  Login
                </button>
              </div>
              {showError && <p className="error">*{errorMsg}</p>}
            </div>
          </form>
        </div>
      </>
    )
  }
}

export default Login
