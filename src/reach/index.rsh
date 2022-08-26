"reach 0.1";

// const board = [
//   [0,0,0],
//   [0,0,0],
//   [0,0,0]
// ];

// board = [
//   a, b, c,
//   d, e, f,
//   g, h, i
// ]

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

        // require((p1move > 0) && (p1move < 10));
        // require(isValid(board, p1move));

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
        
        // require((p2move > 0) && (p2move < 10));
        // require(isValid(board, p2move));

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
