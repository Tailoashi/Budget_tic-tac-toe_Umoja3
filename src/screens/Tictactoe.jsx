import { useEffect, useState } from 'react'
import './index.css'

export function Tictactoe({isPlayerOne, isHouse, resolver, move}){
  const initialBoard = [
    ['','',''],
    ['','',''],
    ['','','']
  ]
  const [ playerOneTurn, setIsPlayerOneTurn ] = useState(true)
  const [ board, setBoard ] = useState(initialBoard)
  const [ played, setPlayed ] = useState([])

  const playMove = (number) => {
    setPlayed(played => {
      played.push(number)
      return played
    })
    const piece = playerOneTurn ? 'X' : 'O'
    switch (number) {
      case 1:
        setBoard(board => board.map((row, index) => {
          if(index === 0){
            row[0] = piece  
          }
          return row
        }))
        break;
      case 2:
        setBoard(board => board.map((row, index) => {
          if(index === 0){
            row[1] = piece  
          }
          return row
        }))
        break;
      case 3:
        setBoard(board => board.map((row, index) => {
          if(index === 0){
            row[2] = piece  
          }
          return row
        }))
        break;
      case 4:
        setBoard(board => board.map((row, index) => {
          if(index === 1){
            row[0] = piece  
          }
          return row
        }))
        break;
      case 5:
        setBoard(board => board.map((row, index) => {
          if(index === 1){
            row[1] = piece  
          }
          return row
        }))
        break;
      case 6:
        setBoard(board => board.map((row, index) => {
          if(index === 1){
            row[2] = piece  
          }
          return row
        }))
        break;
      case 7:
        setBoard(board => board.map((row, index) => {
          if(index === 2){
            row[0] = piece  
          }
          return row
        }))
        break;
      case 8:
        setBoard(board => board.map((row, index) => {
          if(index === 2){
            row[1] = piece  
          }
          return row
        }))
        break;
      case 9:
        setBoard(board => board.map((row, index) => {
          if(index === 2){
            row[2] = piece  
          }
          return row
        }))
        break;
      default:
        console.log('Invalid move logged')
        break;
    }
    setIsPlayerOneTurn(x => !x)
  
  }

  

  const onCellClick = e => {
    const number = parseInt(e.currentTarget.id)
    if(!played.includes(number)){
      playMove(number)
      resolver.resolve(number)
    }
  }

  return(
    <div className="section">
      {
        isHouse ?
        <>
          <h4>Player 1: 'X'</h4>
          <h4>Player 2: 'O'</h4>
        </>
        :
        <h4>Your piece: {isPlayerOne ? 'X': 'O'}</h4>
      }
      <table>
        <tbody>
          {
            board.map((row, index) => {
              let adjustment = 3*index + 1
              return <tr key={index}>
                {
                  row.map((cell, cellIndex) => (
                    <td 
                      id={adjustment + cellIndex}
                      key={adjustment + cellIndex}
                      onClick={isHouse ? () => {} : onCellClick}
                      className={(played.includes(adjustment + cellIndex) || isHouse ) ? 'disabled' : ''}
                    >{cell}</td>
                  ))
                }
              </tr>
            })
          }
        </tbody>
      </table>
    </div>
  )
}