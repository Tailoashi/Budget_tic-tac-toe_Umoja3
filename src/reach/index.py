from threading import Thread
from reach_rpc import mk_rpc
import time


def main():
    rpc, rpc_callbacks = mk_rpc()

    starting_balance = rpc("/stdlib/parseCurrency", 100)
    House_acc = rpc("/stdlib/newTestAccount", starting_balance)
    Player1_acc = rpc("/stdlib/newTestAccount", starting_balance)
    Player2_acc = rpc("/stdlib/newTestAccount", starting_balance)
    
    
    def get_address(s):
        return(rpc("/acc/getAddress", s))
    def fmt(x):
        return rpc("/stdlib/formatCurrency", x, 4)

    def get_balance(w):
        return fmt(rpc("/stdlib/balanceOf", w))

    Housectc = rpc("/acc/contract", House_acc)
    Housebalance = get_balance(House_acc)
    player1balance = get_balance(Player1_acc)
    player2balance = get_balance(Player2_acc)
    print(Housebalance)
    print(player1balance)
    print(player2balance)
    board = ["-","-","-",
            "-","-","-",
            "-","-","-"]
    player2_moves = []
    player2_moves = []
    player1 = "x"
    player2 = "o"
    winset1 = [3, 5, 7]
    winset2 = [1, 5, 9]
    winset3 = [1, 2, 3]
    winset4 = [4, 6, 5]
    winset5 = [7, 8, 9]
    winset6 = [1, 6, 7]
    winset7 = [2, 5, 8]
    winset8 = [3, 4, 9]


    def printboard(board):
        print(board[0] + "|" + board[1] + "|" +  board[2])
        print("----------")
        print(board[3] + "|" + board[4] + "|" +  board[5])
        print("----------")
        print(board[6] + "|" + board[7] + "|" +  board[8])
    
    def checknum(winset,lists):
        newlist = []
        if winset[0] in lists:
            newlist.append(winset[0])
        if winset[1] in lists:
            newlist.append(winset[1]) 
        if winset[2] in lists:
            newlist.append(winset[2]) 
        return newlist
    
    def getnum(func1,func2,func3,func4,func5,func6,func7,func8):
        if len(func1) == 3:
            return func1
        elif len(func2) == 3:
            return func2
        elif len(func3) == 3:
            return func3
        elif len(func4) == 3:
            return func4
        elif len(func5) == 3:
            return func5
        elif len(func6) == 3:
            return func6
        elif len(func7) == 3:
            return func7
        elif len(func8) == 3:
            return func8
    
    def House():
        wager = int(input("Input the wager: "))
        #printboard(board)
        rpc_callbacks(
            "/backend/House",
            Housectc,
            dict(
                wager = rpc("/stdlib/parseCurrency", wager)
            )
        )
    house = Thread(target = House)
    house.start()

    def Player1():
        def Player1moves():
            p1move = int(input("enter a number from 1-9 to play your move player1:"))
            #player1_moves.append(p1move)
            if p1move >=1 and p1move <=9 and board[p1move-1] == "-":
                board[p1move-1] = player1
                printboard(board)
            else:
                print("sorry space occupied")
            return p1move
        
        def acceptwager(wager):
            print('player1 accepted wager')
        
        def sorting(num1,num2,num3,num4):
            lists = [num1,num2,num3,num4]
            sortedlist =  getnum(checknum(winset1, lists),checknum(winset2, lists),checknum(winset3, lists),checknum(winset4, lists),checknum(winset5, lists),checknum(winset6, lists),checknum(winset7, lists),checknum(winset8, lists))
            if sortedlist == None :
                newsorted = [num1,num2,num3]
                return newsorted
            else:
                return sortedlist
        
        Player1ctc = rpc("/acc/contract", Player1_acc, rpc("/ctc/getInfo", Housectc))

        rpc_callbacks(
            "/backend/Player1",
            Player1ctc,
            dict(Player1moves = Player1moves,acceptwager = acceptwager, sort = sorting)
        )
        rpc("/forget/ctc", Player1ctc)
    player_1 = Thread(target = Player1)
    player_1.start()

    def Player2():
        def Player2moves():
            p2move = int(input("enter a number from 1-9 to play your move player2:"))
            #player2_moves.append(p2move)
            if p2move >=1 and p2move <=9 and board[p2move-1] == "-":
                board[p2move-1] = player2
                printboard(board)
            else:
                print("sorry space occupied")
            return p2move
        
        def acceptwager(wager):
            print('player2 accepted wager')
        def sorting(num1,num2,num3,num4):
            lists = [num1,num2,num3,num4]
            sortedlist =  getnum(checknum(winset1, lists),checknum(winset2, lists),checknum(winset3, lists),checknum(winset4, lists),checknum(winset5, lists),checknum(winset6, lists),checknum(winset7, lists),checknum(winset8, lists))
            if sortedlist == None :
                newsorted = [num1,num2,num3]
                return newsorted
            else:
                return sortedlist
        Player2ctc = rpc("/acc/contract", Player2_acc, rpc("/ctc/getInfo", Housectc))

        rpc_callbacks(
            "/backend/Player2",
            Player2ctc,
            dict(Player2moves = Player2moves,acceptwager = acceptwager, sort = sorting)
        )

        rpc(
            "/forget/ctc", Player2ctc
            )
    player_2 = Thread(target = Player2)
    player_2.start()

    house.join()
    player_1.join()
    player_2.join()
    Housebalance2 = get_balance(House_acc)
    player1balance2 = get_balance(Player1_acc)
    player2balance2 = get_balance(Player2_acc)
    print(Housebalance2)
    print(player1balance2)
    print(player2balance2)

    rpc("/forget/acc",House_acc, Player1_acc, Player2_acc)
    rpc("/forget/ctc", Housectc)
   
if __name__ == "__main__":
    main() 
    
