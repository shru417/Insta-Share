import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import InstaStory from '../Instastory'
import InstaPost from '../InstaPost'
import SearchPostCard from '../SearchPostCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'Failure',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    searchResultsList: [],
    searchInput: '',
  }

  componentDidMount() {
    this.renderSearchResults()
  }

  renderSearchResults = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
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
      const updatedData = data.posts.map(eachItem => ({
        createdAt: eachItem.created_at,
        likeCount: eachItem.likes_count,
        postId: eachItem.post_id,
        profilePic: eachItem.profile_pic,
        userId: eachItem.user_id,
        userName: eachItem.user_name,
        caption: eachItem.post_details.caption,
        imageUrl: eachItem.post_details.image_url,
        comment: eachItem.comments,
      }))
      //  console.log(updatedData)
      this.setState({
        apiStatus: apiStatusConstants.success,
        searchResultsList: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  changeSearchInput = searchInput => {
    this.setState({searchInput})
  }

  enterSearchInput = () => {
    this.renderSearchResults()
  }

  onClickTryAgain = () => {
    this.renderSearchResults()
  }

  renderSearchPosts = () => {
    const {searchResultsList} = this.state

    return (
      <>
        {searchResultsList.length === 0 ? (
          <div className="search-fail-con">
            <img
              src="https://res.cloudinary.com/dmu5r6mys/image/upload/v1645432829/Group_1_v48lae.png"
              alt="search not found"
              className="search-fail-image"
            />
            <h1 className="search-fail-heading">Search Not Found</h1>
            <p className="search-fail-para">
              Try different keyword or search again
            </p>
          </div>
        ) : (
          <>
            <h1 className="search-heading">Search Results</h1>
            <ul className="posts-main-container">
              {searchResultsList.map(eachPost => (
                <SearchPostCard key={eachPost.postId} postDetails={eachPost} />
              ))}
            </ul>
          </>
        )}
      </>
    )
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={25} width={25} />
    </div>
  )

  renderFailure = () => (
    <div className="fail-con">
      <img
        src="https://res.cloudinary.com/dmu5r6mys/image/upload/v1645288486/Group_7737_m7roxw.png"
        alt="failure view"
        className="failure view"
      />
      <p className="fail-heading">Something went wrong. Please try again</p>
      <button
        className="fail-retry"
        type="button"
        onClick={this.onClickTryAgain}
      >
        Try again
      </button>
    </div>
  )

  renderAllSearchResults = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSearchPosts()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header
          changeSearchInput={this.changeSearchInput}
          enterSearchInput={this.enterSearchInput}
        />
        {searchInput !== '' ? (
          <div className="search-results-container">
            {this.renderAllSearchResults()}
          </div>
        ) : (
          <div className="home-container">
            <InstaStory />
            <hr className="home-line" />
            <InstaPost />
          </div>
        )}
      </>
    )
  }
}
export default Home
