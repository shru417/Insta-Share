import {Component} from 'react'

import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {GiHamburgerMenu} from 'react-icons/gi'
import {ImCross} from 'react-icons/im'
import {FaSearch} from 'react-icons/fa'

import './index.css'

class Header extends Component {
  state = {
    isShowCon: false,
    isShowSearch: false,
  }

  onClickHamIcon = () => {
    this.setState({isShowCon: true})
  }

  onClickCloseButton = () => {
    this.setState({isShowCon: false})
  }

  onClickSearchTab = () => {
    this.setState({isShowSearch: true})
  }

  onClickLogoutButton = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  onChangeSearchInput = event => {
    const {changeSearchInput} = this.props
    changeSearchInput(event.target.value)
  }

  onClickSearchIcon = () => {
    const {enterSearchInput} = this.props
    enterSearchInput()
  }

  render() {
    const {isShowCon, isShowSearch} = this.state
    const {searchInput} = this.props
    return (
      <>
        <nav className="navbar navbar-expand-lg">
          <div className="navbar-sub-container">
            <ul className="logo-heading-con">
              <Link to="/">
                <li>
                  <img
                    src="https://res.cloudinary.com/dmu5r6mys/image/upload/v1645095409/Group_uiqlwh.png"
                    alt="website logo"
                    className="website-logo"
                  />
                </li>
              </Link>
              <li>
                <h1 className="nav-heading">Insta Share</h1>
              </li>
            </ul>
            <button
              className="ham-button"
              type="button"
              onClick={this.onClickHamIcon}
              testid="hamburgerMenuIcon"
            >
              <GiHamburgerMenu className="icon" />
            </button>
            <div className="desktop-tabs-con">
              <div className="desktop-search-container">
                <input
                  className="input-search"
                  onChange={this.onChangeSearchInput}
                  value={searchInput}
                  type="search"
                  placeholder="Search Caption"
                />
                <button
                  type="button"
                  className="search-button"
                  testid="searchIcon"
                  onClick={this.onClickSearchIcon}
                >
                  <FaSearch className="search-icon" />
                </button>
              </div>
              <ul className="nav-tabs-con">
                <Link to="/" className="link">
                  <li>
                    <p className="tab">Home</p>
                  </li>
                </Link>
                <Link to="/my-profile" className="link">
                  <li>
                    <p className="tab">Profile</p>
                  </li>
                </Link>
                <li>
                  <button
                    className="logout-button"
                    type="button"
                    onClick={this.onClickLogoutButton}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {isShowCon && (
          <ul className="tabs-con">
            <Link to="/" className="link">
              <li>
                <p className="tab">Home</p>
              </li>
            </Link>
            <li>
              <button
                type="button"
                className="search-tab-button"
                onClick={this.onClickSearchTab}
              >
                <p className="tab">Search</p>
              </button>
            </li>
            <Link to="/my-profile" className="link">
              <li>
                <p className="tab">Profile</p>
              </li>
            </Link>
            <li>
              <button
                className="logout-button"
                type="button"
                onClick={this.onClickLogoutButton}
              >
                Logout
              </button>
            </li>
            <button
              className="ham-button"
              type="button"
              onClick={this.onClickCloseButton}
              testid="closeIcon"
            >
              <ImCross className="close-icon" />
            </button>
          </ul>
        )}
        {isShowSearch && (
          <div className="search-container">
            <input
              className="input-search"
              onChange={this.onChangeSearchInput}
              value={searchInput}
              type="search"
              placeholder="Search Caption"
            />
            <button
              type="button"
              className="search-button"
              onClick={this.onClickSearchIcon}
              testid="searchIcon"
            >
              <FaSearch className="search-icon" />
            </button>
          </div>
        )}
      </>
    )
  }
}
export default withRouter(Header)
