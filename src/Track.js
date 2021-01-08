import React, {Component} from 'react';

class Track extends Component{
    render(){
        return (
            <div class="Track" style = {{textAlignVertical: "center",textAlign: "center", 
            display: 'inline-block', width: '30%'}}>
                {this.props.track.album? <img src={this.props.track.album.images[0].url} width='150' height='150'/> : []}
                <h3>{this.props.track.name}</h3>
                <h4>{this.props.track.artists[0].name}</h4>
            </div>
        );
    }
}

export default Track