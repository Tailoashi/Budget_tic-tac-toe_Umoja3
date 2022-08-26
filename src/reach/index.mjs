import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
import { ask, yesno } from '@reach-sh/stdlib/ask.mjs';
const stdlib = loadStdlib(process.env);

class Board {
  constructor(){
    this.board = [
      ['[ ]', '[ ]', '[ ]'],
      ['[ ]', '[ ]', '[ ]'],
      ['[ ]', '[ ]', '[ ]']
    ]
    this.played = []
    this.playerOneTurn = true
  }
  drawBoard(){
    for(let row of this.board){
      console.log(`${row[0]} ${row[1]} ${row[2]}`)
    }
  }
  move(number){
    this.played.push(number)
    const piece = this.playerOneTurn ? '[X]' : '[O]'
    switch (number) {
      case 1:
        this.board[0][0] = piece
        break;
      case 2:
        this.board[0][1] = piece
        break;
      case 3:
        this.board[0][2] = piece
        break;
      case 4:
        this.board[1][0] = piece
        break;
      case 5:
        this.board[1][1] = piece
        break;
      case 6:
        this.board[1][2] = piece
        break;
      case 7:
        this.board[2][0] = piece
        break;
      case 8:
        this.board[2][1] = piece
        break;
      case 9:
        this.board[2][2] = piece
        break;
      default:
        console.log('Invalid move logged')
        break;
    }
    this.playerOneTurn = !this.playerOneTurn
    this.drawBoard()
  }
  isInvalidMove(number){
    return this.played.includes(number)
  }
}

const Tictactoe = new Board()

//create test account
const startingBalance = stdlib.parseCurrency(100);
const acc = await stdlib.newTestAccount(startingBalance);

//Set up functions for checking balance
const fmt = (x) => stdlib.formatCurrency(x, 4);
const getBalance = async () => fmt(await stdlib.balanceOf(acc));

const before = await getBalance()
console.log('Your starting balance is: ' + before)

//define outcome enum
const OUTCOME = ['Player One Wins', 'Draw', 'Player Two Wins'];

//Define common interface for both players
const Player = {

  move: async () => {
    const move = await ask('Play a move using the above as a mapping of the board', x => {
      x = parseInt(x)
      if((x < 0)||(x > 9)||Tictactoe.isInvalidMove(x)){
        throw Error('Invalid move');
      }
      else {
        return x;
      }
    })
    Tictactoe.move(move)
    
    return move;
  },

  viewOutcome: async (outcome) => {
    const outcomeDecimal = parseInt(outcome);
    console.log(OUTCOME[outcomeDecimal])

    console.log(`Your account balance is ${await getBalance()}`)
  },


  viewOpponentMove: (move) => {
    const moveDecimal = parseInt(move)
    console.log(moveDecimal)
    Tictactoe.move(moveDecimal)
  },

  acceptwagerAndMoveCost: async (wager, cost) => {
    const wagerDecimal = parseInt(wager)
    const costDecimal = parseInt(cost)

    const accept = await ask(`Do you accept wager of ${wagerDecimal} and move cost of ${costDecimal}`, yesno)

    if(accept){
      return
    }
    else {
      process.exit()
    }
  }
};

const House = {
  viewMove: (move) => {
    const moveDecimal = parseInt(move)
    console.log(moveDecimal)
    Tictactoe.move(moveDecimal)
  },

  viewOutcome: async (outcome) => {
    const outcomeDecimal = parseInt(outcome);
    console.log(OUTCOME[outcomeDecimal])

    console.log(`Your account balance is ${await getBalance()}`)
  }  
}

//Define interface for Player1
const Player1 = {
  ...Player,  //add common player interface to Player1's interface
};


//Define interface for Player2
const Player2 = {
  ...Player,  //add common player interface to Player2's interface
};

//Where the actual game starts
const program = async () => {

  let isHouse = false
  let isPlayer1 = false

  isHouse = await ask(
    `Do you want to deploy the contract?`,
    yesno
  )

  if(!isHouse){
    isPlayer1 = await ask(
      `Do you want to attach as player one, if no, you're player two`,
      yesno
    )
  }
  const who = isHouse? 'House' : isPlayer1 ? 'Player One' : 'Player Two';

  console.log(`Starting as ${who}`);

  //Contract gets initialized here
  let ctc = null; 
  if(isHouse){
    ctc = acc.contract(backend);
    const wager = await ask('How much is the wager?', parseInt)
    const costOfMove = await ask('How much does each move cost', parseInt)

    backend.House(ctc, {
      wager,
      costOfMove,
      ...House
    })

    console.log('Deploying contract...');

    const info = JSON.stringify(await ctc.getInfo(), null, 1) //fetch contract info
    console.log(info); //display info
    Tictactoe.drawBoard()
  }  
  else if(isPlayer1){
    const info = await ask(
      `Please paste the contract information of the contract you want to subscribe to:`, 
      JSON.parse
    );
    ctc =  acc.contract(backend, info);
    backend.Player1(ctc, Player1);
    console.log("Successfully connected"); 
    Tictactoe.drawBoard()

    console.log(('Board Mapping'))
    console.log('[ 1, 2, 3 ]')
    console.log('[ 4, 5, 6 ]')
    console.log('[ 7, 8, 9 ]')
  }
  else{
    const info = await ask(
      `Please paste the contract information of the contract you want to subscribe to:`, 
      JSON.parse
    );
    ctc = acc.contract(backend, info);
    backend.Player2(ctc, Player2);
    console.log("Successfully connected");
    Tictactoe.drawBoard()

    console.log(('Board Mapping'))
    console.log('[ 1, 2, 3 ]')
    console.log('[ 4, 5, 6 ]')
    console.log('[ 7, 8, 9 ]')
  }
}

await program();

