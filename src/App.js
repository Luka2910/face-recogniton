import './App.css';
import React,{Component} from 'react';
import Navigation from "./components/Navigation/Navigation"
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank'
import FaceRecogintion from './components/FaceRecognition/FaceRecognition'
import ParticlesBg from 'particles-bg'
import Clarifai from 'clarifai'
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register'

const app = new Clarifai.App({
  apiKey: "b2c8db56f3dd435e9689591391949aa0",
 });


class App extends Component {
  constructor(){
    super()
    this.state={
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedin:false,
      user:{
        id:'',
        name:'',
        email:'',
        entries:0,
        joined:''

      }
    }
  }
  loadUser=(data)=>{
    this.setState({user:{
      id:data.id,
      name:data.name,
      email:data.email,
      entries:data.entries,
      joined:data.joined
    }})
  }

  componentDidMount(){
    fetch('http://localhost:3000/')
    .then(response=>response.json())
    .then(data=>console.log(data));
  }
  calculateFaceLocation=(data)=>{
    const clarifaiFace=data.outputs[0].data.regions[0].region_info.bounding_box;
    const image=document.getElementById('inputImage');
    const height=Number(image.height);
    const width=Number(image.width);
    return{
      leftCol:clarifaiFace.left_col*width,
      topRow:clarifaiFace.top_row*height,
      rightCol:width-(clarifaiFace.right_col*width),
      bottomRow:height-(clarifaiFace.bottom_row*height)
    }
  }
  displayFaceBox=(box)=>{
    console.log(box);
    this.setState({box:box});
  }

  onInputChange=(event)=>{
    this.setState({input:event.target.value})
  }
  onButtonSubmit = () => {
    this.setState({imageUrl:this.state.input})
    app.models
   .predict(
   Clarifai.FACE_DETECT_MODEL,
   // THE JPG
   this.state.input
   )
   .then((response) => {
    if(response){
      fetch('http://localhost:3000/image',{
        method:'put',
        headers:{'Content-type':'application/json'},
        body:JSON.stringify({
          id:this.state.user.id
        })
      }).then(response=>response.json())
      .then(count=>{
        this.setState(Object.assign(this.state.user,{entries:count}))
      })
    }
    this.displayFaceBox(this.calculateFaceLocation(response));
   })
   .catch((err) => {
    console.log(err);
   });
   };   
  onRouteChange=(route)=>{
    if(route==='signout'){
      this.setState({isSignedin:false})
    }else if(route==='home'){
      this.setState({isSignedin:true})
    }
    this.setState({route:route});
  }

  render(){
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true}/>
        <Navigation isSignedin={this.state.isSignedin} onRouteChange={this.onRouteChange}/>
        {this.state.route==='home'
         ? <div>
         <Logo/>
         <Rank name={this.state.user.name} entries={this.state.user.entries}/>
         <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
         <FaceRecogintion imageUrl={this.state.imageUrl} box={this.state.box}/>
       </div>
         :this.state.route==='signin'?
         <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
         :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        
        }
      </div>
    );
  }
 
}

export default App;
