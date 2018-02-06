import React, { Component } from 'react';
import './App.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/fontawesome-free-solid'
import { faPause } from '@fortawesome/fontawesome-free-solid'
import { faQuestion } from '@fortawesome/fontawesome-free-solid'

class Modal extends Component {
  render() {
    return (
      <div id="myModal" className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <span className="close">&times;</span>
            <h2>Rules</h2>
          </div>
          <div className="modal-body">
            <p>The Game of Life is a grid of square cells, each of which is in one of two possible states: Alive or Dead. Every cell interacts with its eight neighbours. At each step in time, the following transitions occur:</p>
            <ul>
              <li>Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.</li>
              <li>Any live cell with two or three live neighbours lives on to the next generation.</li>
              <li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
              <li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
            </ul>
          </div>
          <div className="modal-footer">
            <a className="modal-footer" href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">Learn more</a>
          </div>
        </div>
      </div>
    )
  }
}

class Box extends Component {
  selectBox = () => {
    this.props.selectBox(this.props.row, this.props.col)
  }
  render() {
    return (
      <div
        className={this.props.boxClass}
        id={this.props.id}
        onClick={this.selectBox}
      />
    )
  }
}

class Grid extends Component {
  render() {
    const width = this.props.cols * 17
    const rowsArr = []
    let boxClass = ""
    for (let i = 0; i < this.props.rows; i++) {
      for (let j = 0; j < this.props.cols; j++) {
        let boxId = i + "_" + j
        boxClass = this.props.grid[i][j] ? "box on" : "box off"
        rowsArr.push(
          <Box
            boxClass={boxClass}
            key={boxId}
            boxId={boxId}
            row={i}
            col={j}
            selectBox={this.props.selectBox}
          />
        )
      }
    }
    return (
      <div className="grid" style={{ width: width }}>
        {rowsArr}
      </div>
    )
  }
}

class Controls extends Component {
  constructor(props) {
    super(props);
    // icons used on  controls
    this.playIcon = (
      <FontAwesomeIcon icon={faPlay} />
    )
    this.pauseIcon = (
      <FontAwesomeIcon icon={faPause} />
    )
    this.questionIcon = (
      <FontAwesomeIcon icon={faQuestion} />
    )
  }
  // When the user clicks on the button, 
  // toggle between hiding and showing the dropdown content
  toggleSpeedDropdown = () => {
    document.getElementById("speedDropdown").classList.toggle("show");
  }
  toggleSizeDropdown = () => {
    document.getElementById("sizeDropdown").classList.toggle("show");
  }
  // show the about modal
  showModal = () => {
    document.getElementById('myModal').style.display = "block";
  }
  // set the grid size from drop down
  setGridSize = (e) => {
    this.props.gridSize(e.target.id)
  }

  render() {
    return (
      <div className="center">
        <button className="btn" onClick={this.props.playPauseButton}>
          {this.props.isPlaying && this.pauseIcon}
          {!this.props.isPlaying && this.playIcon}
        </button>
        <button className="btn" onClick={this.props.clear}>
          Clear
        </button>
        <div className="dropdown">
          <button id="speedBtn" onClick={this.toggleSpeedDropdown} className="dropbtn">Speed</button>
          <div id="speedDropdown" className="dropdown-content">
            <a id="slow" onClick={this.props.slow}>Slow</a>
            <a id="fast" onClick={this.props.fast}>Fast</a>
          </div>
        </div>
        <button className="btn" onClick={this.props.seed}>
          Seed
					</button>
        <div className="dropdown">
          <button id="sizeBtn" onClick={this.toggleSizeDropdown} className="dropbtn">Grid Size</button>
          <div id="sizeDropdown" className="dropdown-content">
            <a id="mobile" onClick={this.setGridSize}>mobile</a>
            <a id="medium" onClick={this.setGridSize}>medium</a>
            <a id="large" onClick={this.setGridSize}>large</a>
          </div>
        </div>
        <button id="myBtn" onClick={this.showModal} className="btn">{this.questionIcon}</button>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.speed = 100
    this.rows = 28
    this.cols = 17
    this.state = {
      isPlaying: false,
      generation: 0,
      grid: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
    }
  }
// select current square
  selectBox = (row, col) => {
    let gridCopy = arrayClone(this.state.grid)
    gridCopy[row][col] = !gridCopy[row][col]
    this.setState({
      grid: gridCopy
    })
  }
// seed the board randomly
  seed = () => {
    let gridCopy = arrayClone(this.state.grid)
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (Math.floor(Math.random() * 4) === 1) {
          gridCopy[i][j] = true
        }
      }
    }
    this.setState({
      grid: gridCopy
    })
  }
  // start play
  startPlay = () => {
    clearInterval(this.intervalId)
    this.intervalId = setInterval(this.play, this.speed)
  }
// toggle pause and play
  playPauseButton = () => {
    clearInterval(this.intervalId)
    if (!this.state.isPlaying) {
      this.intervalId = setInterval(this.play, this.speed)
    }
    this.setState({
      isPlaying: !this.state.isPlaying
    })
  }
// slow down time
  slow = () => {
    this.speed = 1000
    if(this.state.isPlaying){
      this.startPlay()
    } else {
      this.playPauseButton()
    }
  }
// speed up time
  fast = () => {
    this.speed = 100
    if(this.state.isPlaying){
      this.startPlay()
    } else {
      this.playPauseButton()
    }
  }
// clear the board
  clear = () => {
    var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    this.setState({
      grid: grid,
      generation: 0
    });
  }
// switch game board size
  gridSize = (size) => {
    switch (size) {
      case "medium":
        this.cols = 50;
        this.rows = 30;
        break;
      case "large":
        this.cols = 70;
        this.rows = 50;
        break;
      default:
        this.cols = 17;
        this.rows = 28;
    }
    this.clear();

  }
// start game
  play = () => {
    const g = this.state.grid
    const g2 = arrayClone(this.state.grid)
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let count = 0
        if (i > 0) if (g[i - 1][j]) count++
        if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++
        if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++
        if (j < this.cols - 1) if (g[i][j + 1]) count++
        if (j > 0) if (g[i][j - 1]) count++
        if (i < this.rows - 1) if (g[i + 1][j]) count++
        if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++
        if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++
        if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false
        if (!g[i][j] && count === 3) g2[i][j] = true
      }
    }
    this.setState({
      grid: g2,
      generation: this.state.generation + 1
    })
  }

  componentDidMount() {
    this.seed()
    this.playPauseButton()
  }

  render() {
    return (
      <div>
        <h1>Conway's Game of Life</h1>
        <Controls
          isPlaying={this.state.isPlaying}
          playPauseButton={this.playPauseButton}
          slow={this.slow}
          fast={this.fast}
          clear={this.clear}
          seed={this.seed}
          gridSize={this.gridSize}
        />
        <Grid
          grid={this.state.grid}
          rows={this.rows}
          cols={this.cols}
          selectBox={this.selectBox}
        />
        <h2>Generations: {this.state.generation}</h2>
        <Modal/>
      </div>
    )
  }
}
// make clone of array
function arrayClone(arr) {
  return arr.map(e => ({ ...e }))
}

export default App;