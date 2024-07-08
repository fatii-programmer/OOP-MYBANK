
// #! /user/bin/env node

import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";

// customer Class
class Customer {
    firstName: string;
    lastName: string;
    age: Number;
    gender: string;
    mobNumber: number;
    accNumber: number;

    constructor(fName: string, lName: string, age: number, gender: string, mob: number, acc: number) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}
// interface BankAccount 
interface BankAccount {
    accNumber: number,
    balance: number,
}
// class Bank
class Bank {
    customer: Customer[] = [];
    account: BankAccount[] = [];

    addCustomer(obj: Customer) {
        this.customer.push(obj)
    }

    addAccountNumber(obj: BankAccount) {
        this.account.push(obj)
    }
    transection(accobj: BankAccount) {
        let NewAccounts = this.account.filter(acc => acc.accNumber !== accobj.accNumber);
        this.account = [...NewAccounts, accobj]
    }
}

let myBank = new Bank();

// customer create
// faker ki madad se hum first name last name or loop banayenge
for (let i: number = 1; i <= 3; i++) {
    let fName = faker.person.firstName('male')
    let lName = faker.person.lastName()
    // parsIntsure  string ko number  me convert kar dega
    let num = parseInt(faker.phone.number("3#########"));
    const cus = new Customer(fName, lName, 25 * i, "male", num, 1000 + i)
    myBank.addCustomer(cus);
    myBank.addAccountNumber({ accNumber: cus.accNumber, balance: 100 * i })
}

// Bank Funtionality
async function bankService(bank: Bank) {
   do{ let service = await inquirer.prompt({
    type: "list",
    name: "select",
    message: "Please Select the Service",
    choices: ["View Balance", "Cash Withdraw", "Cash Deposit","Exit"],
});

// View Balance
if (service.select == "View Balance") {
    let res = await inquirer.prompt({
        type: "input",
        name: "num",
        message: "Pleas enter your account number",
    });

    let account = myBank.account.find((acc) => acc.accNumber == res.num)
    if (!account) {
        console.log(chalk.red.bold.italic("Invalid Account Number"));

    }
    if (account) {
        let name = myBank.customer.find((item) => item.accNumber == account?.accNumber)
        console.log(`Dear ${chalk.green.italic("name?.firstName")} ${chalk.green.italic(name?.lastName)} your Account Balance is is ${chalk.bold.blueBright(
            `$${account.balance}`
        )}`
        );



    }
}

// Cash Withdraw
if (service.select == "Cash Withdraw") {
    let res = await inquirer.prompt({
        type: "input",
        name: "num",
        message: "Pleas enter your account number",
    });

    let account = myBank.account.find((acc) => acc.accNumber == res.num)
    if (!account) {
        console.log(chalk.red.bold.italic("Invalid Account Number"));

    }
    if (account) {
        let ans = await inquirer.prompt({
            type: "number",
            message: "Pleas enter your amout.",
            name: "rupee",
        });
        if (ans.rupee > account.balance) {
            console.log(chalk.red.bold("Mojuda balance nakafi hia..."));

        }
        let newBalance = account.balance - ans.rupee
        // trancsaction method call 
        bank.transection({ accNumber: account.accNumber, balance: newBalance });

    }


}
// Cash Deposit
if (service.select == "Cash Deposit") {
    let res = await inquirer.prompt({
        type: "input",
        name: "num",
        message: "Pleas enter your account number",
    });

    let account = myBank.account.find((acc) => acc.accNumber == res.num)
    if (!account) {
        console.log(chalk.red.bold.italic("Invalid Account Number"));

    }
    if (account) {
        let ans = await inquirer.prompt({
            type: "number",
            message: "Pleas enter your amout.",
            name: "rupee",
        });
        let newBalance = account.balance + ans.rupee
        // trancsaction method call 
        bank.transection({ accNumber: account.accNumber, balance: newBalance });
    }


}
if(service.select == "Exit"){
    return;
}
}
   while(true)
}

bankService(myBank);
