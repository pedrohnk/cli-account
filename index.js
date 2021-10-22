const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs");


function buildAccount() {
    inquirer.prompt([
        {
            name: "accountName",
            message: "Insert your username: "
        }
    ]).then((answer) => {
        const accountName = answer["accountName"];

        console.info(accountName);

        if(!fs.existsSync("accounts")) {
            fs.mkdirSync("accounts")
        }

        if(fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black("This account is already exists, choose another username!"))
            buildAccount();
            return;
        }

        fs.writeFileSync
        (
            `accounts/${accountName}.json`, 
            '{"balance": 0}', 
             function (error) {
                console.log(error)
             },
        );

        console.log(chalk.green("Congratulations, your account is already created!"));
        operation();
    }).catch((error) => {
        console.log(error)
    });
};

function createAccount() {
    console.log(chalk.bgGreen.black("Congratulations for choosing our bank!"));
    console.log(chalk.green("Next, define the options for your account: "));
    
    buildAccount();
};

function accountAlreadyExists(accountName) {
    if(!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.white("This account does not exist!"));
        return false;
    } 

    return true;
};

function getAccountBalance() {
    inquirer.prompt([
        {
            name: "accountName",
            message: "What is your account name?"
        }
    ]).then((answer) => {
        const accountName = answer["accountName"];
        const accountData = getAccount(accountName);

        if(!accountAlreadyExists(accountName)) {
            return getAccountBalance();
        }

        console.log(chalk.bgBlue.white(`Hello! Your balance is: R$ ${accountData.balance}.`));
        operation();

    }).catch((error) => {
        console.log(error)
    });
}

function addAmount(accountName, amount) {
    const accountData = getAccount(accountName);
   
    if(!amount) {
        console.log(chalk.bgRed.white("An error has ocourred, try again later!"));
        return deposit();
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);
    fs.writeFileSync
    (
        `accounts/${accountName}.json`, 
        JSON.stringify(accountData),
        function(error) {
            console.log(error)
        }
    );

    console.log(chalk.bgGreen.white(`Was deposit an ammount of R$ ${amount} in your account!`));
    operation();
};

function getAccount(accountName) {
   const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
       encoding: "utf-8",
       flag: "r"
   });

   return JSON.parse(accountJSON);
};

function removeAmount(accountName, amount) {
    const accountData = getAccount(accountName);

    if(!amount) {
        console.log(chalk.bgRed.white("An error has ocourred, try again later!"));
        return withdraw();
    }

    if(accountData.balance < amount) {
        console.log(chalk.bgRed.white("Your insert amount is above your available account balance!"));
        return withdraw();
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (error) {
            console.log(error);
        }
    );

    console.log(chalk.bgGreen.white(`Was realized an withdraw of R$${amount} in your account!`));
    operation();
};

function deposit() {
    inquirer.prompt([
        {
            name: "accountName",
            message: "What is your account name?"
        }
    ]).then((answer) => {
        const accountName = answer["accountName"];

        if(!accountAlreadyExists(accountName)) {
            return deposit();
        }

        inquirer.prompt([
            {
                name: "amount",
                message: "What amount do you need to deposit?",
            }
        ]).then((answer) => {
            const amount = answer["amount"];
            addAmount(accountName, amount);
        }).catch((error) => {
            console.log(error)
        });

    }).catch((error) => {
        console.log(error)
    })
};

function withdraw() {
    inquirer.prompt([
        {
            name: "accountName",
            message: "What is your account name?"
        }
    ]).then((answer) => {
        const accountName = answer["accountName"];

        if(!accountAlreadyExists(accountName)) {
           return withdraw();
        }

        inquirer.prompt([
            {
                name: "amount",
                message: "What a amount do you need draw?"
            }
        ]).then((answer) => {
            const amount = answer["amount"];

            removeAmount(accountName, amount);
        }).catch((error) => {
            console.log(error)
        });

    }).catch((error) => {
        console.log(error)
    });
};

function exitOperation() {
    console.log(chalk.bgBlue.white("Thank you for using Accounts App!"));

    process.exit();
};

function operation() {
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What operation do you need realize?",
            choices: [
                "New Account",
                "Consult balance",
                "Deposit",
                "Withdraw",
                "Exit"
            ],
        }
    ]).then((answer) => {
        const action = answer["action"]
        
        switch(action) {
            case "New Account":
                createAccount();
                break;
            case "Consult balance":
                getAccountBalance();
                break;
            case "Deposit":
                deposit();
                break;
            case "Withdraw":
                withdraw();
                break;
            case "Exit":
                exitOperation();
                break;
        }
    }).catch((error) => {
        console.log(error)
    });
};

operation();


