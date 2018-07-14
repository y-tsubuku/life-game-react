import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

class Cell extends Component {
  render() {
    const {isAlive, x, y} = this.props

    return (
      <div
        className={isAlive ? "cell-alive" : "cell-dead"}
        onClick={() => this.props.reverseIsAlive(x, y)}
      />
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      xLength: 20,
      yLength: 20,
      board: [],
      isTimerStarted: false,
    }
  }

  componentDidMount() {
    this.initBoard()

    this.next()
    this.startTimer()
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  startTimer = () => {
    this.interval = setInterval(this.next, 50)
    this.setState({isTimerStarted: true})
  }
  stopTimer = () => {
    clearInterval(this.interval)
    this.setState({isTimerStarted: false})
  }

  initBoard = () => {
    const {xLength, yLength} = this.state

    let board = []

    for (let x = 0; x <= xLength; x++) {
      for (let y = 0; y >= -yLength; y--) {
        board = [...board, {"x": x, "y": y, "isAlive": false}]
      }
    }

    this.setState({board: board})
  }

  next = () => {
    const {board, xLength, yLength} = this.state

    let nextBoard = []

    for (let x = 0; x <= xLength; x++) {
      for (let y = 0; y >= -yLength; y--) {
        nextBoard = [...nextBoard, {"x": x, "y": y, "isAlive": this.willAlive(board, x, y)}]
      }
    }

    this.setState({board: nextBoard})
  }

  random = () => {
    const {xLength, yLength} = this.state

    let board = []

    for (let x = 0; x <= xLength; x++) {
      for (let y = 0; y >= -yLength; y--) {
        board = [...board, {"x": x, "y": y, "isAlive": this.getRandomBool()}]
      }
    }

    this.setState({board: board})
  }

  getRandomBool = () => this.getRandomInt(2) === 0

  getRandomInt = max => Math.floor(Math.random() * Math.floor(max))

  willAlive = (board, x, y) => {
    const cell = board.find(cell => cell.x === x && cell.y === y)

    if (!cell) return false // new cell

    const aroundCells = this.getAroundCells(board, x, y)

    const aroundCellsCount = aroundCells.filter(cell => cell.isAlive).length

    if (cell.isAlive) return this.willSurvive(aroundCellsCount)

    return this.willBirth(aroundCellsCount)
  }

  willBirth = aroundCellsCount => aroundCellsCount === 3
  willSurvive = aroundCellsCount => aroundCellsCount === 2 || aroundCellsCount === 3

  getAroundCells = (board, x, y) => board.filter(cell => {
      const xDistance = Math.abs(x - cell.x)
      const yDistance = Math.abs(y - cell.y)
      const totalDistance = xDistance + yDistance

      return totalDistance > 0 && totalDistance < 3 && xDistance !== 2 && yDistance !== 2
    }
  )

  reverseIsAlive = (x, y) => {
    const {board} = this.state
    console.log(x, y)
    const cell = board.find(cell => cell.x === x && cell.y === y)
    const newBoard = [
      ...board.filter(cell => !(cell.x === x && cell.y === y)),
      {"x": x, "y": y, "isAlive": !cell.isAlive}
    ]
    this.setState({board: newBoard})
  }

  renderBoard = () => {
    const {board} = this.state

    const uniqueYs = [...new Set(board.map(cell => cell.y))].slice().sort((a, b) => b - a)

    return (
      uniqueYs.map(y => {
        const cells = board.filter(cell => cell.y === y).slice().sort((a, b) => b.x - a.x)
        return (
          <div className="board-row" key={y}>
            {cells.map(cell =>
              <Cell
                x={cell.x}
                y={cell.y}
                isAlive={cell.isAlive}
                reverseIsAlive={this.reverseIsAlive}
                key={`${cell.x}, ${cell.y}`}
              />
            )}
          </div>
        )
      })
    )
  }

  render() {
    const {isTimerStarted} = this.state

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className={isTimerStarted ? "App-logo-rotating" : "App-logo"} alt="logo"/>
          <h1 className="App-title">Life Game with React</h1>
        </header>

        <div className="buttons">
          {
            isTimerStarted ?
              <button onClick={this.stopTimer}>Stop</button> :
              <button onClick={this.startTimer}>Start</button>
          }
          <button onClick={this.next}>Next</button>
          <button onClick={this.random}>Random</button>
          <button onClick={this.initBoard}>Clear</button>
        </div>

        <div className="board">
          {this.renderBoard()}
        </div>

      </div>
    )
  }
}

export default App
