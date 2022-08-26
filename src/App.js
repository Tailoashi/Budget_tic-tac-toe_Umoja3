import './App.css';
import { loadStdlib } from '@reach-sh/stdlib';
import { ALGO_MyAlgoConnect as MyAlgoConnect } from '@reach-sh/stdlib';
import * as backend from './reach/build/index.main.mjs'
import { useState } from 'react';
import { views, Loader } from './utils/';
import { ConnectAccount, PasteContractInfo, SelectRole, ViewWinner, WaitForAttacher } from './screens';
import { AcceptTerms } from './screens/AcceptTerms';


const initialBoard = [
  ['','',''],
  ['','',''],
  ['','','']
]

const miniViews = {
  PLAY_TURN: 'Play turn',
  WAIT_FOR_TURN: 'Wait for turn',
  SPECTATE: 'Spectate'
}

const reach = loadStdlib('ALGO');
reach.setWalletFallback(reach.walletFallback( { providerEnv: 'TestNet', MyAlgoConnect } ));
const fmt = (x) => reach.formatCurrency(x, 4);

function App() {
  const [ account, setAccount ] = useState({})
  const [ view, setView ] = useState(views.CONNECT_ACCOUNT)
  const [ miniView, setMiniView ] = useState(miniViews.SPECTATE)
  const [ contractInfo, setContractInfo ] = useState()
  const [ isPlayerOne, setIsPlayerOne ] = useState(false)
  const [ isHouse, setIsHouse ] = useState(false)
  const [ winner, setWinner ] = useState('one')
  const [ resolver, setResolver ] = useState({ resolve: ()=>{}})
  const [ wager, setWager ] = useState(1)
  const [ costOfMove, setCostOfMove ] = useState(1)
  const [ board, setBoard ] = useState(initialBoard)
  const [ played, setPlayed ] = useState([])

  const reachFunctions = {
    connect: async (secret, mnemonic = false) => {
      let result = ""
      try {
        const account = mnemonic ? await reach.newAccountFromMnemonic(secret) : await reach.getDefaultAccount();
        setAccount(account);
        setView(views.DEPLOY_OR_ATTACH);
        result = 'success';
      } catch (error) {
        result = 'failed';
      }
      return result;
    },

    deploy: async () => {
      setIsHouse(true);
      const contract = account.contract(backend);
      backend.House(contract, {
        ...House,
        wager,
        costOfMove
      });
      setView(views.DEPLOYING);
      const ctcInfo = JSON.stringify(await contract.getInfo(), null, 2)
      setContractInfo(ctcInfo);
      setView(views.WAIT_FOR_ATTACHER)
    },

    attach: (contractInfo) => {
      setView(views.ATTACHING)
      const contract = account.contract(backend, JSON.parse(contractInfo));
      console.log(isPlayerOne)
      isPlayerOne ? 
        backend.Player1(contract, Player1) 
        : 
        backend.Player2(contract, Player2)
    }
  }

  //Participant Objects
  const Common = {
    acceptwagerAndMoveCost: (wager, moveCost) => {
      return new Promise((resolve) => {
        setWager(fmt(reach.parseCurrency(wager)))
        setCostOfMove(fmt(reach.parseCurrency(moveCost)))
        setView(views.ACCEPT_TERMS)
        setResolver({ 
          resolve: () => {
            setView(views.GAME_AREA)
            setMiniView(miniViews.WAIT_FOR_TURN)
            resolve()}
          })
      })
    },

    move: () => {
      return new Promise((resolve) => {
        setMiniView(miniViews.PLAY_TURN)
        setResolver({
          resolve: (move) => {
            setMiniView(miniViews.WAIT_FOR_TURN)
            resolve(move)
          }
        })
      })
    },

    viewOutcome: (outcome) => {
      const outcomeDecimal = parseInt(outcome)
      setWinner(outcomeDecimal)
      setView(views.VIEW_WINNER)
    },

    viewOpponentMove: (move) => {
      const moveDecimal = parseInt(move)
      const player = isPlayerOne ? 2 : 1
      playMove(moveDecimal, player)
    }

  }

  const House = {
    viewMove: (move, player) => {
      const moveDecimal = parseInt(move)
      const playerDecimal = parseInt(player)
      setView(views.GAME_AREA)
      setMiniView(miniViews.SPECTATE)
      playMove(moveDecimal, playerDecimal)
    },

    viewOutcome: (outcome) => {
      const outcomeDecimal = parseInt(outcome)
      setWinner(outcomeDecimal)
      setView(views.VIEW_WINNER)
    }
  }

  const Player1 = {
    ...Common
  }

  const Player2 = {
    ...Common
  }


  const playMove = (number, player) => {
    setPlayed(played => {
      played.push(number)
      return played
    })
    let piece = null
    if(player === 1){
      piece = 'X'
    }
    else {
      piece = 'O'
    }
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
  }

  const onCellClick = e => {
    const number = parseInt(e.currentTarget.id)
    if(!played.includes(number)){
      const player = isPlayerOne ? 1 : 2
      playMove(number, player)
      resolver.resolve(number)
    }
  }

  return (
    <div className="App">
      <div className='top'>
        <h1>BUDGET TICTACTOE</h1>
      </div>
      <header className="App-header">
        {
          view === views.CONNECT_ACCOUNT && 
          <ConnectAccount connect={reachFunctions.connect}/>
        }

        {
          view === views.DEPLOY_OR_ATTACH &&
          <SelectRole 
            deploy={reachFunctions.deploy} 
            attach={(player1 = true) => {
              player1 ? setIsPlayerOne(true) : setIsPlayerOne(false)
              setView(views.PASTE_CONTRACT_INFO)}
            }
            setWager={(w) => setWager(w)}
            setCostOfMove={(m) => setCostOfMove(m)}
          />
        }

        {
          (view === views.DEPLOYING || view === views.ATTACHING) &&
          <Loader />
        }

        {
          view === views.PASTE_CONTRACT_INFO &&
          <PasteContractInfo attach={reachFunctions.attach}/>
        }

        {
          view === views.WAIT_FOR_ATTACHER &&
          <WaitForAttacher info={contractInfo}/>
        }

        {
          view === views.ACCEPT_TERMS &&
          <AcceptTerms 
            wager={wager} 
            accept={resolver.resolve} 
            decline={() => setView(views.DEPLOY_OR_ATTACH)}
            costOfMove={costOfMove}
          />
        }

        {
          view === views.VIEW_WINNER &&
          <ViewWinner winner={winner}/>
        }

        {
          view === views.GAME_AREA &&
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
            {
              miniView === miniViews.WAIT_FOR_TURN &&
              <h5>Waiting for opponent...</h5>
            }
            {
              miniView === miniViews.PLAY_TURN &&
              <h5>Your turn to play</h5>
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
                            onClick={(isHouse || miniView === miniViews.WAIT_FOR_TURN) ? () => {} : onCellClick}
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
        }
      </header>
    </div>
  );
}

export default App;
