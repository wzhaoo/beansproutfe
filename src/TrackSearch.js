import React, {Component} from 'react';
import Slider, {Range} from 'rc-slider';
import Track from './Track'

class TrackSearch extends Component{
  constructor(props){
    super(props);
    this.state = {
      text: '',
      suggestions: [
        {
          name: 'LUCY!',
          artists: ['Jaden']
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
      playlist: [],
      acousticness: [0, 1],
      danceability: [0, 1],
      energy: [0, 1],
      instrumentalness: [0, 1],
      liveness: [0, 1],
      loudness: [0, 1],
      speechiness: [0, 1],
      valence: [0, 1],
      tempo: [0, 1],
      popularity: [0, 100],
      trackInfo: '',
      playlistName: ''
    }
    this.searched = false
  }

  updateList(){
    if(this.state.text==='') return
    let queryText = this.state.text.replace(' ', '+')
    let searchURL = `https://api.spotify.com/v1/search?q=${queryText}&type=track&limit=10`
    fetch(searchURL, {
      headers: {
        'Authorization': 'Bearer ' + this.props.accessToken
      }
    }).then(response => response.json())
    .then(data => {
      console.log("SEARCH DATA")
      console.log(data)
      this.setState({
        suggestions: data.tracks.items.map(track=>{
          return {
            name: track.name,
            artist: track.artists[0].name,
            id: track.id
          }
        })
      }, ()=> console.log(this.state.suggestions))
    })
  }

  handleChange = (e) => {
    this.setState({text: e.target.value}, this.updateList)
  }

  handleRange(name, e){
    this.setState({[name]: e})
  }

  handleSearch = (e) => {
    this.searched = true
    console.log(this.state)
    let searchURL = `https://api.spotify.com/v1/recommendations?market=US&seed_tracks=${this.state.suggestions[0].id}&min_acousticness=${this.state.acousticness[0]}&max_acousticness=${this.state.acousticness[1]}&min_danceability=${this.state.danceability[0]}&max_danceability=${this.state.danceability[1]}&min_energy=${this.state.energy[0]}&max_energy=${this.state.energy[1]}&min_instrumentalness=${this.state.instrumentalness[0]}&max_instrumentalness=${this.state.instrumentalness[1]}&min_liveness=${this.state.liveness[0]}&max_liveness=${this.state.liveness[1]}&min_loudness=${(this.state.loudness[0]-1)*60}&max_loudness=${(this.state.loudness[1]-1)*60}&min_popularity=${this.state.popularity[0]*100}&max_popularity=${this.state.popularity[1]*100}&min_speechiness=${this.state.speechiness[0]}&max_speechiness=${this.state.speechiness[1]}&min_tempo=${this.state.tempo[0]*200}&max_tempo=${this.state.tempo[1]*200}&min_valence=${this.state.valence[0]}&max_valence=${this.state.valence[1]}`
    fetch(searchURL, {
      headers: {
        'Authorization': 'Bearer ' + this.props.accessToken
      }
    }).then(response => response.json())
    .then(data => {
      console.log(data)
      this.setState({
        playlist: data.tracks
      }, ()=> console.log(this.state.playlist))
    })
  }

  handleClick(e){
    this.searched = true
    let searchURL = `https://api.spotify.com/v1/recommendations?market=US&seed_tracks=${e.target.id}&min_acousticness=${this.state.acousticness[0]}&max_acousticness=${this.state.acousticness[1]}&min_danceability=${this.state.danceability[0]}&max_danceability=${this.state.danceability[1]}&min_energy=${this.state.energy[0]}&max_energy=${this.state.energy[1]}&min_instrumentalness=${this.state.instrumentalness[0]}&max_instrumentalness=${this.state.instrumentalness[1]}&min_liveness=${this.state.liveness[0]}&max_liveness=${this.state.liveness[1]}&min_loudness=${(this.state.loudness[0]-1)*60}&max_loudness=${(this.state.loudness[1]-1)*60}&min_popularity=${this.state.popularity[0]*100}&max_popularity=${this.state.popularity[1]*100}&min_speechiness=${this.state.speechiness[0]}&max_speechiness=${this.state.speechiness[1]}&min_tempo=${this.state.tempo[0]*200}&max_tempo=${this.state.tempo[1]*200}&min_valence=${this.state.valence[0]}&max_valence=${this.state.valence[1]}`
    fetch(searchURL, {
      headers: {
        'Authorization': 'Bearer ' + this.props.accessToken
      }
    }).then(response => response.json())
    .then(data => {
      console.log(data)
      this.setState({
        playlist: data.tracks,
        trackInfo: e.target.value
      }, ()=> console.log(this.state.playlist))
    })
  }

  setPlaylistName(e){
    this.setState({playlistName: e.target.value})
  }

  savePlaylist(){
    console.log("playlist name: " + this.state.playlistName)
    fetch(`https://api.spotify.com/v1/users/${this.props.userId}/playlists`, {
      method: 'POST',
      body: "{\"name\": \"" + this.state.playlistName + "\",\"description\": \"Playlist based on " + this.state.trackInfo + "\", \"public\":false}",
      headers: {
        'Authorization': 'Bearer ' + this.props.accessToken,
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
    .then(playlist =>{
      console.log('playlist made')
      console.log(playlist)
      console.log(this.state.playlist.map(track => track.uri))
      const sub = this.state.playlist.map(track=> "\"" + track.uri + "\"").join()
      fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
        method: 'POST',
        body: "{\"uris\": [" + sub +"]}",
        headers: {
          'Authorization': 'Bearer ' + this.props.accessToken,
          'Content-Type': 'application/json'
        }
      })
    })
  }


  render() {
    let priorityOptions=['Acousticness', 'Danceability', 'Energy', 'Instrumentalness', 'Liveness',
    'Loudness', 'Speechiness', 'Valence', 'Tempo', 'Popularity']
    return (
      <div class="SearchBox" style={{textAlignVertical: "center",textAlign: "center", height:'50%'}}>
        <button onclick="myFunction()" class="dropbtn">Some rando button</button>
        <h2> </h2>
        <div class='priorities'>
          {priorityOptions.map(text=>{
            return <div>
              <label>{text}</label>
              <Range className={text.toLowerCase()} style={{margin: 'auto', width:'30%'}} defaultValue={[0,1]} min={0} max={1}
              step={0.05} onChange={(e)=>{this.handleRange(text.toLowerCase(), e)}}/>
            </div>  
          })}  
        </div>
        <div>
          <input autoComplete="off" list="suggestions" placeholder='Search a Track!!!' onChange={this.handleChange}/>
        </div> 
        <div>
          <ul>
            {this.state.suggestions !== [] ? this.state.suggestions.map(track => 
            <div>
              <button id={track.id} value={track.name + " by " + track.artist} onClick={this.handleClick.bind(this) }>{track.name}, {track.artist}</button>
            </div>): []}
          </ul>
        </div>
        {this.searched ? 
        <div class='playlist'>
          {this.state.playlist.map(track=>{
            return <Track track={track}/>
          })}
          <div>
            <label for='playlistName'>Playlist Title: </label>
            <input id='playlistName' onChange={this.setPlaylistName.bind(this)}/> <br/>
            <button onClick={this.savePlaylist.bind(this)}>Save to Spotify!</button>
          </div>
        </div> :[]}
      </div>
    )
  }
}
export default TrackSearch;