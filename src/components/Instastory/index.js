import {Component} from 'react'
import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import Slider from 'react-slick'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'Failure',
  inProgress: 'IN_PROGRESS',
}

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
}

const Settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 7,
  slidesToScroll: 1,
}

class InstaStory extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    instaStoriesList: [],
  }

  componentDidMount() {
    this.renderInstaStories()
  }

  onClickTryAgainStories = () => {
    this.renderInstaStories()
  }

  renderInstaStories = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/insta-share/stories'
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
      const updatedData = data.users_stories.map(eachItem => ({
        storyUrl: eachItem.story_url,
        id: eachItem.user_id,
        userName: eachItem.user_name,
      }))
      //  console.log(updatedData)
      this.setState({
        apiStatus: apiStatusConstants.success,
        instaStoriesList: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSlider = () => {
    const {instaStoriesList} = this.state

    return (
      <>
        <Slider {...settings} className="mobile-view-slider">
          {instaStoriesList.map(eachLogo => {
            const {id, storyUrl, userName} = eachLogo
            return (
              <ul className="slick-item" key={id}>
                <li className="slick-story-items">
                  <div className="story-ring">
                    <img
                      className="logo-image"
                      src={storyUrl}
                      alt="user story"
                    />
                  </div>
                  <h1 className="name">{userName}</h1>
                </li>
              </ul>
            )
          })}
        </Slider>

        <Slider {...Settings} className="desktop-view-slider">
          {instaStoriesList.map(eachLogo => {
            const {id, storyUrl, userName} = eachLogo
            return (
              <ul className="slick-item" key={id}>
                <li className="slick-story-items">
                  <div className="story-ring">
                    <img
                      className="logo-image"
                      src={storyUrl}
                      alt="user story"
                    />
                  </div>
                  <h1 className="name">{userName}</h1>
                </li>
              </ul>
            )
          })}
        </Slider>
      </>
    )
  }

  renderFailure = () => (
    <div className="fail-con">
      <img
        src="https://res.cloudinary.com/dmu5r6mys/image/upload/v1645254822/Icon_tgdryp.png"
        className="fail-image"
        alt="failure view"
      />
      <h1 className="fail-heading">Something went wrong. Please try again</h1>
      <p className="fail-para">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="fail-retry"
        type="button"
        onClick={this.onClickTryAgainStories}
        testid="button"
      >
        Try again
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-con" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={25} width={25} />
    </div>
  )

  renderAllStories = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSlider()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="main-container">
        <div className="slick-container">{this.renderAllStories()}</div>
      </div>
    )
  }
}

export default InstaStory
