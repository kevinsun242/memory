import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import $ from 'jquery';

export default function game_init(root) {
  ReactDOM.render(<Memory />, root);
}

// App state for memory is:
// {tiles: [List of tiles]}
//
//
// A tile is:
// {value: String, matched: Bool}

class Memory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicks: 0,
      randomTiles: this.generateTiles(),
      matchedTiles: [],
      flippedTiles: [],
    };
  }

  generateTiles() {
    let randomTiles = _.shuffle(['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D',
                                 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'])

    return _.map(randomTiles, (value, index) => {
      return {value: value, index: index, matched: false, visible: false};
    });
  }

  flipTile(index) {
    let xs = _.map(this.state.randomTiles, (tile) => {
      if (tile.index == index) {
        return _.extend(tile, {visible: true});
      }
      else {
        return tile
      }
    });

    let flippedTiles = this.state.flippedTiles.slice();
    flippedTiles.push(this.state.randomTiles[index])

    this.setState({
      clicks: this.state.clicks + 1,
      randomTiles: xs,
      matchedTiles: this.state.matchedTiles,
      flippedTiles: flippedTiles,
    });
  }

  render() {
    let tiles = _.map(this.state.randomTiles, (tile, index) => {
      return <TileItem tile={tile} flipTile={this.flipTile.bind(this)} key={index} />;
    });

    return (
      <div className="Game">
        <h1>Memory Game</h1>
        <div className="Board">{tiles}</div>
      </div>) 
  };
}

function TileItem(props) {
  let tile = props.tile;
  if (tile.matched) {
    return <button class="Tile" id={tile.index}>{tile.value}</button>
  }
  else if (tile.visible) {
    return <button class="Tile" id={tile.index}>{tile.value}</button>
  }
  else {
    return <button class="Tile" id={tile.index} onClick={() => props.flipTile(tile.index)}>Tile</button>
  }
}
