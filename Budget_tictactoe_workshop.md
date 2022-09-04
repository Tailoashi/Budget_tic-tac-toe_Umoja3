<p align="center">
  <a href="" rel="noopener">
 <img src="https://docs.reach.sh/assets/logo.png" alt="Project logo"></a>
</p>
<h3 align="center">Budget Tic-Tac-Toe</h3>

<div align="center">


</div>

---

<p align="center"> Workshop : Budget Tic-Tac-Toe
    <br> 
</p>

## Budget tic-tac-toe
When writing a reach program it is very essential to understand the project you are trying to build, the next step is to explore the ways this can implemented in Reach.
Firstly let understand the logic of the game
# Logic
The Budget tic-tac-toe is like the normal tic-tac-toe, but the goal is not just to win, but to stay within a budget. Each move comes at a cost equivalent to the number of wins attainable in that space. A draw splits the pot without returning your initial stake.The smart contract of this dapp is written in reachlang.

This Workshop assumes you have completed at least on of the tutorials in the reach [docs](https://docs.reach.sh/tut/)
Running the command `./reach init` on your command line or on your terminal generates two files as shown below
* `index.rsh` ---> This file contains the smart contract
* `index.mjs` ---> This file is used to test the smart contract
`index.rsh`
```js
'reach 0.1';

export const main = Reach.App(() => {
  const A = Participant('Alice', {
    // Specify Alice's interact interface here
  });
  const B = Participant('Bob', {
    // Specify Bob's interact interface here
  });
  init();
  // The first one to publish deploys the contract
  A.publish();
  commit();
  // The second one to publish always attaches
  B.publish();
  commit();
  // write your program here
  exit();
});
```
`index.mjs`
```js
import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(100);

const [ accAlice, accBob ] =
  await stdlib.newTestAccounts(2, startingBalance);
console.log('Hello, Alice and Bob!');

console.log('Launching...');
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

console.log('Starting backends...');
await Promise.all([
  backend.Alice(ctcAlice, {
    ...stdlib.hasRandom,
    // implement Alice's interact object here
  }),
  backend.Bob(ctcBob, {
    ...stdlib.hasRandom,
    // implement Bob's interact object here
  }),
]);

console.log('Goodbye, Alice and Bob!');
```
We first start by creating the functions we are going to use in program and write assertions to ensure the functions work properly
```js
"reach 0.1";

const checkAlignment = (board, number) => {
  const [ a, b, c ] = board[0];
  const [ d, e, f ] = board[1];
  const [ g, h, i ] = board[2];
  if(
    ((a == number)&&(b == number)&&(c == number)) ||
    ((d == number)&&(e == number)&&(f == number)) ||
    ((g == number)&&(h == number)&&(i == number)) ||
    ((a == number)&&(d == number)&&(g == number)) ||
    ((b == number)&&(e == number)&&(h == number)) ||
    ((c == number)&&(f == number)&&(i == number)) ||
    ((a == number)&&(e == number)&&(i == number))
  ){
    return true;
  }
  else {
    return false;
  };
};

assert(checkAlignment([[1,1,1],[0,0,0],[0,0,0]], 1) == true);
assert(checkAlignment([[1,0,0],[1,0,0],[1,0,0]], 1) == true);
assert(checkAlignment([[1,0,0],[0,1,0],[0,0,1]], 1) == true);
assert(checkAlignment([[1,0,1],[0,0,0],[0,0,0]], 1) == false);
```
* `checkAlignment` ---> This function is used to check the alignment on the board periodically to determine a win or no win.
* We then use the assert() function to ensure the function works
```js
const canStillPlay = (board) => {
  const [ a, b, c ] = board[0];
  const [ d, e, f ] = board[1];
  const [ g, h, i ] = board[2];
  if(
    (a != 0)&&(b != 0)&&(c != 0)&&
    (d != 0)&&(e != 0)&&(f != 0)&&
    (g != 0)&&(h != 0)&&(i != 0)
  ){
    return false;
  }
  else{
    return true;
  };
};
assert(canStillPlay([[1,1,1],[0,0,0],[0,0,0]]) == true);
assert(canStillPlay([[1,1,1],[2,1,2],[2,1,1]]) == false);
```
* `canStillPlay` ---> This function checks if the they is still a space in the board for the users to play or make a move
* We then use the assert() function to ensure the function works

```js
const playMove = (board, number, move) => {
  const [ a, b, c ] = board[0];
  const [ d, e, f ] = board[1];
  const [ g, h, i ] = board[2];

  if(move == 1){
    return [
      [ number, b, c],
      [d, e, f],
      [g, h, i]
    ];
  }
  else if(move == 2){
    return [
      [ a, number, c],
      [d, e, f],
      [g, h, i]
    ];
  }
  else if(move == 3){
    return [
      [ a, b, number],
      [d, e, f],
      [g, h, i]
    ];
  }
  else if(move == 4){
    return [
      [ a, b, c],
      [number, e, f],
      [g, h, i]
    ];
  }
  else if(move == 5){
    return [
      [ a, b, c],
      [d, number, f],
      [g, h, i]
    ];
  }
  else if(move == 6){
    return [
      [ a, b, c],
      [d, e, number],
      [g, h, i]
    ];
  }
  else if(move == 7){
    return [
      [ a, b, c],
      [d, e, f],
      [number, h, i]
    ];
  }
  else if(move == 8){
    return [
      [ a, b, c],
      [d, e, f],
      [g, number, i]
    ];
  }
  else if(move == 9){
    return [
      [ a, b, c],
      [d, e, f],
      [g, h, number]
    ];
  }
  else {
    return board;
  }
};
assert(playMove([[0,0,0],[0,0,0],[0,0,0]], 1, 1) == [[1,0,0],[0,0,0],[0,0,0]]);
assert(playMove([[0,0,0],[0,0,0],[0,0,0]], 2, 9) == [[0,0,0],[0,0,0],[0,0,2]]);
```
* `playMove` ---> This is function simply enables users make a move on the board
* We also use the assert() function to check if the functions work properly

```js
const isValid = (board, move) => {
  const [ a, b, c ] = board[0];
  const [ d, e, f ] = board[1];
  const [ g, h, i ] = board[2];
  if(move == 1){
    if(a == 0) return true;
    else return false;
  }
  else if(move == 2){
    if(b == 0) return true;
    else return false;
  }
  else if(move == 3){
    if(c == 0) return true;
    else return false;
  }
  else if(move == 4){
    if(d == 0) return true;
    else return false;
  }
  else if(move == 5){
    if(e == 0) return true;
    else return false;
  }
  else if(move == 6){
    if(f == 0) return true;
    else return false;
  }
  else if(move == 7){
    if(g == 0) return true;
    else return false;
  }
  else if(move == 8){
    if(h == 0) return true;
    else return false;
  }
  else if(move == 9){
    if(i == 0) return true;
    else return false;
  }
  else return false;
};
assert(isValid([[1,1,1],[0,0,0],[0,0,0]], 1) == false);
assert(isValid([[1,1,1],[0,0,0],[0,0,0]], 9) == true);
```
* `isValid` ---> This function is used to check if a players move is valid, to ensure no player playes on the box of the board.
* The assert() function is used to check the functionality of the function created above is accurate

```js
const [isResult, Player1_WIN, DRAW, Player2_WIN] = makeEnum(3);

const Player = {
    move: Fun([], UInt),
    viewOpponentMove: Fun([UInt], Null),
    acceptwagerAndMoveCost: Fun([UInt, UInt], Null),
    viewOutcome: Fun([UInt], Null)
};
```
* We didn't create a function in the code block above,rather we defined parameters we would use in the program and we also defined the similar functions that the two players have in common

```js
export const main = Reach.App(() => {
    const House = Participant('House', {
        wager: UInt,
        costOfMove: UInt,
        viewMove: Fun([UInt, UInt], Null),
        viewOutcome: Fun([UInt], Null)
    });
    const Player1 = Participant('Player1', {
        ...Player
    });
    const Player2 = Participant('Player2', {
        ...Player
    });
    init();
})
```
* We begin writting the Reach program here
* The program consists of 3 participants, the house and the 2 players, we define all the functions availabe for each of this participants 
* We initalize the reach application with the init()

```js
House.only(() => {
        const wager = declassify(interact.wager);
        const costOfMove = declassify(interact.costOfMove);
    });
House.publish(wager, costOfMove);
commit();

Player1.only(() => {
    interact.acceptwagerAndMoveCost(wager, costOfMove);
});
Player1.publish()
  .pay(wager);
commit();
Player2.only(() => {
    interact.acceptwagerAndMoveCost(wager, costOfMove);
});
Player2.publish()
  .pay(wager);
```
In this code snippet we use a lot of inbuilt reach functions such as
* `only()` --> This function is used to access the functions avalabe for the participant chosen, we use if to acccess the function available to the 3 participants 
* `declassify()` --> This function is used to convert the values gotten from the function to a readable format
* `publish()` --> We use this publish function to publish information in the smartcontract, it makes this information available to everyone in the smart contract 
* `pay()` --> This function enables participant pay in money to the smart contract

We use all this functions mentioned above in the code snippet to do the following
* The house participant uses it propose a wager, the cost per move and publish it
* The Player participants use it to accept or deney the proposed wager and cost per move, and publish their resoponse, if accepted they pay the wager.


```js
var [ board, keepGoing, outcome, amount ] = [ [[0,0,0],[0,0,0],[0,0,0]], true, DRAW, 0 ];
    invariant(balance() == (2 * wager + amount * costOfMove));
    while(keepGoing && (outcome == DRAW)) {
        commit();
        Player1.only(() => {
            const p1move = declassify(interact.move());
        });
        Player1.pay(costOfMove)
          .publish(p1move);

        Player2.interact.viewOpponentMove(p1move);
        House.interact.viewMove(p1move, 1);

        const board1 = playMove(board, 1, p1move);

        if(checkAlignment(board1, 1)){
          [ board, keepGoing, outcome, amount ] = [ board1, false, Player1_WIN, amount + 1 ];
          continue;
        }
        else if(!canStillPlay(board1)){
          [ board, keepGoing, outcome, amount ] = [ board1, false, DRAW, amount + 1 ];
          continue;
        };

        commit();
        Player2.only(() => {
          const p2move = declassify(interact.move());
        });
        Player2.pay(costOfMove)
          .publish(p2move);

        Player1.interact.viewOpponentMove(p2move);
        House.interact.viewMove(p2move, 2);

        const board2 = playMove(board1, 2, p2move);

        if(checkAlignment(board2, 2)){
          [ board, keepGoing, outcome, amount ] = [ board2, false, Player2_WIN, amount + 2 ];
          continue;
        }
        else if(!canStillPlay(board2)){
          [ board, keepGoing, outcome, amount ] = [ board2, false, DRAW, amount + 2 ];
          continue;
        };

        [ board, keepGoing, outcome, amount ] = [ board2, true, DRAW, amount + 2];
        continue;
    };
```
We use a while loop in the code block above to allow users play in multiple times till they is a winner. This isn't like the normal while loops you see in python or javascript, they are key thing that enables a while loop work in reach such as
* `var` ---> This is used to make variables mutable in the while loop, In reach the variables are immutable which means they can't be change. We use this to make certain variables mutable so we could update them in the while loop
* `continue` ---> we use the continue after every incrementation or change in the mutable variables

This code block is the detemines who wins the game. we use all the functions we defined above in this section of the code to do the following
* Collect the player moves and reduces the funds in the pot by the cost per move declared by the house
* We use the viewOpponentMove() function to allow each player view eachothers move
* The players use the playMove() functions to register a move
* The program uses the checkAlignment() function to check if they is a winner after each loop and uses the canStillPlay() function to determine if a player can still make a move 

```js
if (outcome == Player1_WIN) {
        transfer(wager * 2).to(Player1);
    } else if (outcome == Player2_WIN) {
        transfer(wager * 2).to(Player2);
    } else {
        transfer(wager).to(Player1);
        transfer(wager).to(Player2);
    };
transfer(balance()).to(House);

Player1.interact.viewOutcome(outcome);
Player2.interact.viewOutcome(outcome);
House.interact.viewOutcome(outcome);

commit();
exit()
```
Some important inbuilt function was used in this code block
* `transfer()`---> This function is used to transfer funds out of the smart contract
* `balance()` ---> This function sums up all the funds in the contract
* `commit()` ----> This function is used to exit a consunsus step
* `exit()` ---> This exits the Reach Application

* We use the if-else statement to determine who to transfer the funds in the contract to based on the condition which player wins
* We them transfer this the remaining balance in the contract to the house.
* Each participant sees the outcome of the game and the application ends and exits

Full index.rsh code
```js
"reach 0.1";

const checkAlignment = (board, number) => {
  const [ a, b, c ] = board[0];
  const [ d, e, f ] = board[1];
  const [ g, h, i ] = board[2];
  if(
    ((a == number)&&(b == number)&&(c == number)) ||
    ((d == number)&&(e == number)&&(f == number)) ||
    ((g == number)&&(h == number)&&(i == number)) ||
    ((a == number)&&(d == number)&&(g == number)) ||
    ((b == number)&&(e == number)&&(h == number)) ||
    ((c == number)&&(f == number)&&(i == number)) ||
    ((a == number)&&(e == number)&&(i == number))
  ){
    return true;
  }
  else {
    return false;
  };
};

assert(checkAlignment([[1,1,1],[0,0,0],[0,0,0]], 1) == true);
assert(checkAlignment([[1,0,0],[1,0,0],[1,0,0]], 1) == true);
assert(checkAlignment([[1,0,0],[0,1,0],[0,0,1]], 1) == true);
assert(checkAlignment([[1,0,1],[0,0,0],[0,0,0]], 1) == false);

const canStillPlay = (board) => {
  const [ a, b, c ] = board[0];
  const [ d, e, f ] = board[1];
  const [ g, h, i ] = board[2];
  if(
    (a != 0)&&(b != 0)&&(c != 0)&&
    (d != 0)&&(e != 0)&&(f != 0)&&
    (g != 0)&&(h != 0)&&(i != 0)
  ){
    return false;
  }
  else{
    return true;
  };
};
assert(canStillPlay([[1,1,1],[0,0,0],[0,0,0]]) == true);
assert(canStillPlay([[1,1,1],[2,1,2],[2,1,1]]) == false);

const playMove = (board, number, move) => {
  const [ a, b, c ] = board[0];
  const [ d, e, f ] = board[1];
  const [ g, h, i ] = board[2];

  if(move == 1){
    return [
      [ number, b, c],
      [d, e, f],
      [g, h, i]
    ];
  }
  else if(move == 2){
    return [
      [ a, number, c],
      [d, e, f],
      [g, h, i]
    ];
  }
  else if(move == 3){
    return [
      [ a, b, number],
      [d, e, f],
      [g, h, i]
    ];
  }
  else if(move == 4){
    return [
      [ a, b, c],
      [number, e, f],
      [g, h, i]
    ];
  }
  else if(move == 5){
    return [
      [ a, b, c],
      [d, number, f],
      [g, h, i]
    ];
  }
  else if(move == 6){
    return [
      [ a, b, c],
      [d, e, number],
      [g, h, i]
    ];
  }
  else if(move == 7){
    return [
      [ a, b, c],
      [d, e, f],
      [number, h, i]
    ];
  }
  else if(move == 8){
    return [
      [ a, b, c],
      [d, e, f],
      [g, number, i]
    ];
  }
  else if(move == 9){
    return [
      [ a, b, c],
      [d, e, f],
      [g, h, number]
    ];
  }
  else {
    return board;
  }
};
assert(playMove([[0,0,0],[0,0,0],[0,0,0]], 1, 1) == [[1,0,0],[0,0,0],[0,0,0]]);
assert(playMove([[0,0,0],[0,0,0],[0,0,0]], 2, 9) == [[0,0,0],[0,0,0],[0,0,2]]);


const isValid = (board, move) => {
  const [ a, b, c ] = board[0];
  const [ d, e, f ] = board[1];
  const [ g, h, i ] = board[2];
  if(move == 1){
    if(a == 0) return true;
    else return false;
  }
  else if(move == 2){
    if(b == 0) return true;
    else return false;
  }
  else if(move == 3){
    if(c == 0) return true;
    else return false;
  }
  else if(move == 4){
    if(d == 0) return true;
    else return false;
  }
  else if(move == 5){
    if(e == 0) return true;
    else return false;
  }
  else if(move == 6){
    if(f == 0) return true;
    else return false;
  }
  else if(move == 7){
    if(g == 0) return true;
    else return false;
  }
  else if(move == 8){
    if(h == 0) return true;
    else return false;
  }
  else if(move == 9){
    if(i == 0) return true;
    else return false;
  }
  else return false;
};
assert(isValid([[1,1,1],[0,0,0],[0,0,0]], 1) == false);
assert(isValid([[1,1,1],[0,0,0],[0,0,0]], 9) == true);

const [isResult, Player1_WIN, DRAW, Player2_WIN] = makeEnum(3);

const Player = {
    move: Fun([], UInt),
    viewOpponentMove: Fun([UInt], Null),
    acceptwagerAndMoveCost: Fun([UInt, UInt], Null),
    viewOutcome: Fun([UInt], Null)
};

export const main = Reach.App(() => {
    const House = Participant('House', {
        wager: UInt,
        costOfMove: UInt,
        viewMove: Fun([UInt, UInt], Null),
        viewOutcome: Fun([UInt], Null)
    });
    const Player1 = Participant('Player1', {
        ...Player
    });
    const Player2 = Participant('Player2', {
        ...Player
    });
    init();

    House.only(() => {
        const wager = declassify(interact.wager);
        const costOfMove = declassify(interact.costOfMove);
    });
    House.publish(wager, costOfMove);
    commit();

    Player1.only(() => {
        interact.acceptwagerAndMoveCost(wager, costOfMove);
    });
    Player1.publish()
      .pay(wager);
    commit();
    Player2.only(() => {
        interact.acceptwagerAndMoveCost(wager, costOfMove);
    });
    Player2.publish()
    .pay(wager);

    var [ board, keepGoing, outcome, amount ] = [ [[0,0,0],[0,0,0],[0,0,0]], true, DRAW, 0 ];
    invariant(balance() == (2 * wager + amount * costOfMove));
    while(keepGoing && (outcome == DRAW)) {
        commit();
        Player1.only(() => {
            const p1move = declassify(interact.move());
        });
        Player1.pay(costOfMove)
          .publish(p1move);

        Player2.interact.viewOpponentMove(p1move);
        House.interact.viewMove(p1move, 1);

        const board1 = playMove(board, 1, p1move);

        if(checkAlignment(board1, 1)){
          [ board, keepGoing, outcome, amount ] = [ board1, false, Player1_WIN, amount + 1 ];
          continue;
        }
        else if(!canStillPlay(board1)){
          [ board, keepGoing, outcome, amount ] = [ board1, false, DRAW, amount + 1 ];
          continue;
        };

        commit();
        Player2.only(() => {
          const p2move = declassify(interact.move());
        });
        Player2.pay(costOfMove)
          .publish(p2move);
        
        Player1.interact.viewOpponentMove(p2move);
        House.interact.viewMove(p2move, 2);

        const board2 = playMove(board1, 2, p2move);

        if(checkAlignment(board2, 2)){
          [ board, keepGoing, outcome, amount ] = [ board2, false, Player2_WIN, amount + 2 ];
          continue;
        }
        else if(!canStillPlay(board2)){
          [ board, keepGoing, outcome, amount ] = [ board2, false, DRAW, amount + 2 ];
          continue;
        };

        [ board, keepGoing, outcome, amount ] = [ board2, true, DRAW, amount + 2];
        continue;
    };
    
    if (outcome == Player1_WIN) {
        transfer(wager * 2).to(Player1);
    } else if (outcome == Player2_WIN) {
        transfer(wager * 2).to(Player2);
    } else {
        transfer(wager).to(Player1);
        transfer(wager).to(Player2);
    };
    transfer(balance()).to(House);

    Player1.interact.viewOutcome(outcome);
    Player2.interact.viewOutcome(outcome);
    House.interact.viewOutcome(outcome);

    commit();
})
```
Full index.mjs code for testing
```js
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


const Player2 = {
  ...Player,  
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
```
