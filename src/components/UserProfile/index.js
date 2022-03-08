import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class UserProfile extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    userProfileList: [],
    postsList: [],
    storiesList: [],
  }

  componentDidMount() {
    this.renderUserProfile()
  }

  renderUserProfile = async () => {
    const {match} = this.props
    const {params} = match
    const {userId} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/insta-share/users/${userId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      //  console.log(data)
      const formattedData = {
        followersCount: data.user_details.followers_count,
        followingCount: data.user_details.following_count,
        id: data.user_details.id,
        postsCount: data.user_details.posts_count,
        profilePic: data.user_details.profile_pic,
        userBio: data.user_details.user_bio,
        userId: data.user_details.user_id,
        userName: data.user_details.user_name,
      }
      //  console.log(formattedData)
      const postsData = data.user_details.posts.map(eachItem => ({
        postId: eachItem.id,
        image: eachItem.image,
      }))
      //  console.log(postsData)
      const storiesData = data.user_details.stories.map(eachItem => ({
        storyId: eachItem.id,
        storyImage: eachItem.image,
      }))
      //  console.log(storiesData)
      this.setState({
        userProfileList: formattedData,
        postsList: postsData,
        storiesList: storiesData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderUserProfileList = () => {
    const {userProfileList, storiesList, postsList} = this.state

    const {
      followersCount,
      followingCount,
      postsCount,
      profilePic,
      userBio,
      userName,
      userId,
    } = userProfileList

    return (
      <>
        <Header />
        <div className="user-profile-main-con">
          <div className="mobile-view">
            <h1 className="username-mobile">{userName}</h1>
            <div className="image-followers-following-posts-container">
              <img src={profilePic} alt="user profile" className="profilePic" />
              <div className="desktop">
                <p className="username-desktop">{userName}</p>
                <ul className="subCons-container">
                  <li className="subCon">
                    <p className="count">{postsCount}</p>
                    <p className="count-heading">posts</p>
                  </li>
                  <li className="subCon">
                    <p className="count">{followersCount}</p>
                    <p className="count-heading">followers</p>
                  </li>
                  <li className="subCon">
                    <p className="count">{followingCount}</p>
                    <p className="count-heading">following</p>
                  </li>
                </ul>
                <p className="username-main-desktop">{userId}</p>
                <p className="bio-desktop">{userBio}</p>
              </div>
            </div>
            <p className="username-main-mobile">{userId}</p>
            <p className="bio-mobile">{userBio}</p>
          </div>

          <div className="desktop-view-styling">
            <ul className="story-container">
              {storiesList.map(eachItem => (
                <li key={eachItem.storyId} storyDetails={eachItem}>
                  <img
                    src={eachItem.storyImage}
                    alt="user story"
                    className="storyImage"
                  />
                </li>
              ))}
            </ul>
            <hr className="line" />
            <div className="icon-heading-con">
              <BsGrid3X3 className="posts-icon" />
              <h1 className="posts-heading">Posts</h1>
            </div>
            {postsList.length > 0 ? (
              <div className="posts-container">
                <ul className="ul">
                  {postsList.map(eachItem => (
                    <li
                      key={eachItem.postId}
                      postsDetails={eachItem}
                      className="list-item"
                    >
                      <img
                        src={eachItem.image}
                        alt="user post"
                        className="post-image"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="no-posts-display">
                <div className="icon-con">
                  <BiCamera className="no-posts-icon" />
                </div>
                <h1 className="no-posts-para">No Posts</h1>
              </div>
            )}
          </div>
        </div>
      </>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={25} width={25} />
    </div>
  )

  onClickTryAgainUserProfile = () => {
    this.renderUserProfile()
  }

  renderFailure = () => (
    <div className="fail-con">
      <img
        src="https://res.cloudinary.com/dmu5r6mys/image/upload/v1645288486/Group_7737_m7roxw.png"
        alt="failure view"
        className="fail-image"
      />
      <p className="fail-heading">Something went wrong. Please try again</p>
      <button
        className="fail-retry"
        type="button"
        onClick={this.onClickTryAgainUserProfile}
      >
        Try again
      </button>
    </div>
  )

  renderAllUserProfile = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderUserProfileList()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="user-profile-con">{this.renderAllUserProfile()} </div>
    )
  }
}
export default UserProfile
