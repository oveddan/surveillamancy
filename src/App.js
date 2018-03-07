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

class App extends Component {
  state = {
    imageUri: null
  }

  handleLoadImage = (e, visionType) => {
    this.setState({
      loading: true,
      visionType
    })
    axios.get(`http://localhost:5000?cameraType=${visionType}`)
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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Voyeurmancy</h1>
          <h3>Interpret your surveillance of the world</h3>
        </header>
        {!this.state.visionType && (
          <p className="App-intro">
            Choose what type of camera to voyeur:
            <ul>
              {cameraTypes.map(cameraType => (
                <li>
                <a href='#' onClick={(e) => this.handleLoadImage(e, cameraType)}>{cameraType}</a>
                </li>
              ))}
            </ul>
          </p>
        )}
        {this.state.loading && (
          <p>{`Voyuering a ${this.state.visionType} camera...`}</p>
        )}
        {this.state.visions && (
          <ul>
            {this.state.visions.map((vision , i) => (
              <li key={i}>{`${vision.name} : ${vision.interpretation}`}</li>
            ))}
          </ul>
        )}
        {!this.state.loading && this.state.visions && (
          <p><a href='#' onClick={this.seeANewVision} >Voyeur another camera</a></p>
        )}
        {this.state.imageUri && (
          <div>
            <h1>{`${this.state.visionType} camera ${this.state.location}`}</h1>
            <div style={toImageUriStyle(this.state)} />
          </div>
        )}
      </div>
    );
  }
}

export default App;
