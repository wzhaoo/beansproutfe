import React, {Component} from 'react'
import {Modal} from 'react-bootstrap'

class ModalWindow extends Component{
    constructor(props){
        super(props)
        this.state = {
            playlist: [],
            relatedArtists: [],
            albums: [],
        }
        this.allSongs = []
    }

    componentDidMount(){
        fetch(`https://api.spotify.com/v1/artists/${this.props.id}/related-artists`, {
            headers: {
                'Authorization': 'Bearer ' + this.props.accessToken
            }
        }).then(response => response.json())
        .then(data => {
            this.setState({
                relatedArtists: data.items
            })
        })
        .then(()=>{
            this.state.relatedArtists.forEach(artist =>{
                fetch(`https://api.spotify.com/v1/artists/${artist.id}/albums`, {
                    headers: {
                        'Authorization': 'Bearer ' + this.props.accessToken
                    }
                }).then(response => response.json())
                .then(data =>{
                    this.setState(state => ({albums: [...state.albums, data.items]}))
                })
            })
        })
        .then(()=>{
            this.state.albums.forEach(album =>{
                fetch(`	https://api.spotify.com/v1/albums/${album.id}/tracks`, {
                    headers: {
                        'Authorization': 'Bearer ' + this.props.accessToken
                    }
                }).then(resposne => response.json())
                .then(data =>{
                    this.allSongs.concat(data.items)
                })
            })
        })
        .then(calculate())
        .then(quickSort(0, this.state.allSongs.length))
    }

    calculate(){

    }
    
    quickSort(low, high){
        if(low < high){
            let pivTrack = this.state.allSongs[high]
            let i = low - 1
            for(let j = low; j<high; j++){
                if(compareTracks(this.allSongs[j], pivTrack)<0){
                    i++
                    const temp = this.allSongs[i]
                    this.allSongs[i] = this.allSongs[j]
                    this.allSongs[j] = temp
                }
            }
            const temp = this.allSongs[i+1]
            this.allSongs[i+1] = this.allSongs[high]
            this.allSongs[high] = temp
            let piv = i+1
            quickSort(low, piv-1)
            quickSort(piv+1, high)
        }
    }
    compare(track1, track2){
        let sum = 0
        for(let i = 0; i<this.props.priorities.length; i++){
            
        }
    }
}
export default ModalWindow