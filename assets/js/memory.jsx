import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import $ from 'jquery';

export default function game_init(root) {
  ReactDOM.render(<Memory />, root);
}

// App state for memory is:
// clicks: number of clicks so far
// {randomTiles: [List of tiles in random order]}
// matchedTiles: number of matched tiles 
// flippedTiles: currently flipped and active tiles
//
// A tile is:
// {value: String, index: Int, matched: Bool. visible: Bool}

class Memory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicks: 0,
      randomTiles: this.generateTiles(),
      matchedTiles: 0,
      flippedTiles: [],
    };
  }

  // Generatetiles: generates a random list of tiles by shuffling the possible values
  // Each tile has a value, index, and two booleans for being matched and visible
  generateTiles() {
    let randomTiles = _.shuffle(['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D',
                                 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'])

    return _.map(randomTiles, (value, index) => {
      return {value: value, index: index, matched: false, visible: false};
    });
  }

  reset() {
    this.setState({
      clicks: 0,
      randomTiles: this.generateTiles(),
      matchedTiles: 0,
      flippedTiles: [],
    });
  }

  // flipTile: Flips the tile at certain inded
  // @param index is the index of the tile in the list
  flipTile(index) {
    // map through the list and only make the tile at the index visible
    let xs = _.map(this.state.randomTiles, (tile) => {
      if (tile.index == index) {
        return _.extend(tile, {visible: true});
      }
      else {
        return tile
      }
    });

    // Add the tile to the list of flipped tiles
    let flippedTiles = this.state.flippedTiles;
    flippedTiles.push(this.state.randomTiles[index]);

    // Return a new state and trigger render
    this.setState({
      clicks: this.state.clicks + 1,
      randomTiles: xs,
      matchedTiles: this.state.matchedTiles,
      flippedTiles: flippedTiles,
    });

    // If there are two tiles flipped then check if the match
    if(flippedTiles.length == 2) {
      var that = this;
      setTimeout(function(){that.checkMatch();}, 2000);
    }
  }

  // checkMatch: check if the two flipped tiles match
  checkMatch() {
    let xs = this.state.randomTiles;
    let flippedTiles = this.state.flippedTiles;
    let tile1 = flippedTiles[0];
    let tile2 = flippedTiles[1];
    let matchedTiles = this.state.matchedTiles;

    // If the two values match, then keep the tiles flipped
    // and increment the matched tiles by 2
    if (tile1.value == tile2.value) {
      xs = _.map(xs, (tile) => {
        if (tile.index == tile1.index || tile.index == tile2.index) {
          return _.extend(tile, {matched: true});
        }
        else {
          return tile
        }
      });
      flippedTiles = [];
      matchedTiles+=2;
    }
    // If the two values do not match, flip them again and remove the tiles
    // from the list of flipped tiles
    else {
      xs = _.map(xs, (tile) => {
        if (tile.index == tile1.index || tile.index == tile2.index) {
          return _.extend(tile, {visible: false});
        }
        else {
          return tile
        }
      });
      flippedTiles = [];
    }

    // Return a new state and render
    this.setState({
      clicks: this.state.clicks,
      randomTiles: xs,
      matchedTiles: matchedTiles,
      flippedTiles: flippedTiles,
    });
  }

  render() {
    let tiles = _.map(this.state.randomTiles, (tile, index) => {
      return <TileItem tile={tile} flipTile={this.flipTile.bind(this)} key={index} />;
    });

    let winText = ""
    if (this.state.matchedTiles == 16) {
      winText = "You Win!";
    }

    return (
      <div className="Game">
        <h1>Memory Game</h1>
        <div className="Board">{tiles}</div>
        <div><p className="WinText">{winText}</p></div>
        <div className="Reset"><ResetButton reset={this.reset.bind(this)}/></div>
        <div className="Clicks"><p>Number of clicks taken: {this.state.clicks}</p></div>
      </div>) 
  };
}

function TileItem(props) {
  let tile = props.tile;
  if (tile.matched) {
    return <button className="Tile" id={tile.index} disabled>{tile.value}</button>
  }
  else if (tile.visible) {
    return <button className="Tile" id={tile.index} disabled>{tile.value}</button>
  }
  else {
    return <button className="Tile" id={tile.index} onClick={() => props.flipTile(tile.index)}>Tile</button>
  }
}

function ResetButton(props) {
  return <button className="ResetButton" id="reset" onClick={() => props.reset()}>Reset Game</button>
}
