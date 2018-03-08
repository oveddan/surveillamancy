import React, { Component } from 'react';
import axios from 'axios'
import logo from './logo.svg';
import './App.css';

// predict the contents of an image by passing in a url
const toImageUriStyle = ({
  imageUri, width, height
}) => ({
  background: `url(data:image/png;base64,${imageUri})`,
  width,
  height
})

const vowels = ['a', 'e', 'i', 'o', 'u', 'y']

const prefix = (firstLetter) => vowels.includes(firstLetter) ? 'An' : 'A'

const cameraTypes = [
  'city',
  'kitchen',
  'sport',
  'bar',
  'service',
  'entertainment',
  'interesting',
  'restaurant',
  'village',
  'airliner',
  'server',
  'animal',
  'religion',
  'mall',
  'square',
  'laundry',
  'barbershop',
  'architecture',
  'warehouse',
  'coffeehouse',
  'beach'
]

const serverBaseUrl = process.env.SERVER_BASE_URL || 'http://localhost:5000'

class App extends Component {
  state = {
    imageUri: null
  }

  handleLoadImage = (e, visionType) => {
    this.setState({
      loading: true,
      visionType
    })
    axios.get(`${serverBaseUrl}?cameraType=${visionType}`)
      .then(({data: { imageUri, width, height, visions, location }}) => {
        this.setState({
          imageUri,
          width,
          height,
          visions,
          location,
          loading: false
        })

      })
      .catch(function (error) {
        console.log(error);
      })
  }

  seeANewVision = (e) => {
    e.preventDefault()

    this.setState({ visions: null, imageUri: null, visionType: null })
  }

  isOnLandingPage() {
    return !this.state.loading && !this.state.visions
  }

  isLoading() {
    return this.state.loading
  }

  isViewingVisions() {
    return !this.state.loading && this.state.visions
  }

  render() {
    return (
      <div className="jumbotron jumbotron-fluid">
        <div className='container'>
          <h2 className='display-4'>
            {this.isOnLandingPage() && (<div>Which camera <br/><span>tickles your fancy?</span></div>)}
            {this.isLoading() && (
              <div className='loading'>
                {`Finding you ${prefix(this.state.visionType[0]).toLowerCase()} `}
                <span>{`${this.state.visionType} `}</span>
                &nbsp;camera somewhere in the world
              </div>
            )}
            {this.isViewingVisions() && (
              <div>
                {
                `You are connected to ${prefix(this.state.visionType[0]).toLowerCase()} ` +
                    `${this.state.visionType} camera in`}
                    <span>{`${this.state.location}, `}</span>
                    and you see:<br/>
              </div>
            )}
          </h2>
          {!this.state.visionType && (
            <p className="lead">
              {cameraTypes.map(cameraType => (
                <button key={cameraType} type="button" className="btn btn-light" onClick={(e) => this.handleLoadImage(e, cameraType)}>
                  {`${prefix(cameraType[0])} ${cameraType} camera`}
                </button>
              ))}
            </p>
          )}
          {!this.state.loading && this.state.visions && (
            <p><a href='#' onClick={this.seeANewVision} >Voyeur another camera</a></p>
          )}
          {this.state.imageUri && (
            <div className='row'>
              <div className='col-md-5'>
                {this.state.visions.map(({ interpretation, name }, i) => (
                  <p className='lead' key={i}>
                    <strong>{`${name}. `}</strong>
                    {`${interpretation}`}
                  </p>
                ))}
              </div>
              <div className='col-md-7'>
                <div style={toImageUriStyle(this.state)} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
