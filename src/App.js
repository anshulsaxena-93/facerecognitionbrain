import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '2a2caa0d534a4eb8a14930ebb89a525f'
});

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn : false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifariFace = data.outputs[0].data.regions[0].region_info.bounding_box;

    //do DOM manipulation
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    //console.log(width);
    //console.log(height);

    return {
      leftCol: clarifariFace.left_col * width,
      topRow: clarifariFace.top_row * height,
      rightCol: width - (clarifariFace.right_col * width),
      bottomRow: height - (clarifariFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({
      box: box
    });
  }

  onInputChange = (event) => {
    //console.log(event.target.value);
    this.setState({
      input: event.target.value
    })
  }

  onButtonSubmit = () => {
    this.setState({
      imageUrl: this.state.input
    });
    console.log('click');
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input
    ).then(response => this.displayFaceBox(this.calculateFaceLocation(response))
    ).catch(error => console.log(error));
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState({
        isSignedIn :false
      });
    }else if(route === 'home'){
      this.setState({
        isSignedIn: true
      });
    }
    this.setState({
      route : route
    });
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        {
          this.state.route === 'home' ?
          <div>
          <Logo />
          <Rank />
          <ImageLinkForm
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit} />
          <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
        </div> :
          ( this.state.route === 'signin' ? 
            <SignIn onRouteChange={this.onRouteChange} /> :
            <Register onRouteChange={this.onRouteChange} />
          )     
        }
      </div>
    );
  }
}

export default App;
