import React, {Component} from 'react';
import TrackSearch from './TrackSearch';
import ArtistSearch from './ArtistSearch';
import Track from './Track';
import './App.css';
import querystring from 'query-string';
import Slider, {Range} from 'rc-slider'
import 'rc-slider/assets/index.css';

class App extends Component{
  constructor(){
    super();
    this.clientId = ''
    this.clientSecret = ''
    this.state = {
      serverData: {
        user: {
          name: 'Daddy'
        }
      },
      topTracks: [
        {
          name: 'LUCY!',
          artists:['Jaden']
        },
        {
          name: 'Alien Boy',
          artists: ['Oliver Tree']
        },
        {
          name: 'Strangers',
          artists: ['Mt. Joy']
        }
      ],
      isArtist: false
    }
    
  }

  handleClick(e){
    this.setState(state =>({isArtist: !state.isArtist}))
  }

  componentDidMount(){
    let parsed = querystring.parse(window.location.search)
    let accessToken = parsed.access_token
    this.token = accessToken
    if(!accessToken) return
    console.log("accessToken:" + accessToken)
    fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    }).then(response => response.json())
    .then(data => {
      this.setState({serverData: {user: {name: data.display_name, id: data.id}}})
    })

    fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term', {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    }).then(response => response.json())
    .then(data => {
      console.log('TRACKS DATA')
      console.log(data)
      this.setState({
        topTracks: data.items.map(track =>{
          return {
            name: track.name,
            artists: track.artists,
            album: track.album
          }
        })
      })
    })
  }
  

  render(){
    let centerStyle = {textAlignVertical: "center",textAlign: "center"}
    return (
      <div class="App" >
        {this.state.serverData.user.name !== 'Daddy' ?
         <div>
            <h1 style={centerStyle}>Welcome {this.state.serverData.user.name}!</h1>
            <h2>Make playlists from your musical favorites</h2>
            <button onClick={this.handleClick.bind(this)}>Artists or Tracks</button>
            {this.state.isArtist? 
              <ArtistSearch accessToken={this.token} userId={this.state.serverData.user.id}/>:
              <TrackSearch accessToken={this.token} userId={this.state.serverData.user.id}/>
            }
            <h2 style={centerStyle}>Your recent top tracks:</h2>
            {this.state.topTracks.slice(0,3).map(value =><Track track={value} style={centerStyle}/>)}
          </div> : <button onClick={()=>window.location='http://localhost:8888/login'}
          style={centerStyle}>Sign in with Spotify!</button>
        }
      </div>
    )
  }
}



export default App;