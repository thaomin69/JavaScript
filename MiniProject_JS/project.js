//1. Gửi một số tiền
//2. Xác định số dòng đặt cược
//3. Thu số tiền người chơi đặt cược vào
//4. Quay máy 
//5. Kiểm tra if user won
//6. Cung cấp user tiền nếu họ thắng. Thua thì thu tiền cược của user
//7. Play again


const prompt = require('prompt-sync')();

const ROWS = 3;
const COLS = 3;

//
const SYMBOLS_COUNT = {
    "A": 2, //chỉ có 2 chữ A trong tất cả
    "B": 4,
    "C": 6,
    "D": 8
}

//SYMBOL_COUNT["A"] -> 2
const SYMBOLS_VALUES = {
    "A": 5, //Nếu nhận được một dòng 'A' thì sẽ nhân nó lên 5 
    "B": 4,
    "C": 3,
    "D": 2
}


//1. Gửi tiền
const deposit = () => {
    while(true){
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);

        if(isNaN(numberDepositAmount) || numberDepositAmount <= 0){
            console.log("Invalid deposit amount, try again.")
        }
        else{
            return numberDepositAmount;
        }
    }
};

//2. Lấy số dòng user đặt cược
const getNumberOfLines = () => {
    while(true){
        const lines = prompt("Enter the number of lines to bet on (1 - 3): ");
        const numberOfLines = parseFloat(lines);

        if(isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3){
            console.log("Invalid number of lines, try again.")
        }
        else{
            return numberOfLines;
        }
    }
};

//3. Thu tiền
//Số tiền đặt cược sẽ dựa vào số dư của họ
const getBet = (balance, lines) => {
    while(true){
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet);

        if(isNaN(numberBet) || numberBet <= 0 || numberBet > (balance / lines)){
            console.log("Invalid bet, try again.")
        }
        else{
            return numberBet;
        }
    }
};

//4. Quay máy
const spin = () => {
    const symbols = [];

    //'symbol' sẽ nhận giá trị của key, 'count' sẽ nhận giá trị của value
    for(const[symbol, count] of Object.entries(SYMBOLS_COUNT)){
        // console.log(symbol, count);
        for(let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }

    //[A, B, C]
    // 0  1  2
    const reels = [[], [], []]; //mỗi mảng con đại diện cho 1 cột bên trong máy
    for(let i = 0; i < COLS; i++){
        const reelSymbols = [...symbols]; //trong mỗi lần lặp thì mảng này đc khởi tạo bằng cách sao chép toàn bộ mảng key trong symbols
        for(let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length)
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
    // console.log(symbols);
};

//Func: Hoán vị
const transpose = (reels) => {
    const rows = [];

    for(let i = 0; i < ROWS; i++){
        rows.push([]);
        for(let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
};

const printRows = (rows) => {
    for(const row of rows){
        // let rowString = "A | B | C";
        let rowString = "";
        // ["A", "B", "C"]
        for(const [i, symbol] of row.entries()){
            rowString += symbol;
            // "A | B | C"
            if(i != row.length - 1){
                rowString += " | "
            }
        }
        console.log(rowString);
    }
};


//5. Kiểm tra if user won
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for(let row = 0; row < lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for(const symbol of symbols){
            if(symbol != symbols[0]){
                allSame = false;
                break;
            }
        }

        if(allSame){
            winnings += bet * SYMBOLS_VALUES[symbols[0]];
        }

    }
    return winnings;
};

//6. Play again 
const game = () => {
    let balance = deposit(); //let để có thể thay đổi giá trị thay vì dùng const
    //const depositAmount = deposit();
    //console.log(depositAmount);
    
    while(true){
        console.log("You have a balance of $" + balance);
        const numberOfLines = getNumberOfLines();
        //console.log(numberOfLines);

        const bet = getBet(balance, numberOfLines);
        //console.log(bet); 

        balance -= bet * numberOfLines;

        const reels = spin();
        //console.log(reels);

        const rows = transpose(reels);
        printRows(rows);

        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("You won, $" + winnings.toString());

        if(balance <= 0){
            console.log("You ran out of money!!!");
            break;
        }

        const playAgain = promp1t("Do you want to play again (y/n)?");
        if(playAgain != "y") break;

    }
};

//---------------------------------------------------------------------------
game();


//[[A B C], [D D D], [A A A]] //các columns
//chuyển thành rows -> dùng hoán vị ma trận
//A D A
//B D A
//C D A

//Note: Điều chỉnh lại chỉ cho đặt bet là số nguyên