import { connection } from "./connection";
import { RowDataPacket } from "mysql2";
import { getUserChoresCompleted } from "./completedChore";
import { getChoreValue } from "./chore";
import { getUserPurchases } from "./purchase";
import { getWeekDifference } from "../lib/getWeekDifference";

export enum UserType {
    Child = 'child',
    Parent = 'parent',
}

export interface User extends RowDataPacket {
    id: number,
    username: string,
    password: string,
    time_created: number,
    balance: number,
    role: UserType,
    allowance: number,
    household: string,
    nickname: string,
}

export const getUser = async (userId: number): Promise<User> => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(`SELECT * FROM users WHERE id=?;`, [userId], (err, result: User[]) => {
                resolve(result[0]);
            })
        } catch {
            reject("Error getting user by ID.");
        }
    });
}

export const getUserByUsername = async (username: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(`SELECT * FROM users WHERE username='?';`, [username], (err, result: User[]) => {
                resolve(result[0]);
            })
        } catch {
            reject("Error getting user by ID.");
        }
    });
}

export const getUserNickname = async (userId: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(`SELECT * FROM users WHERE id=?;`, [userId], (err, result: User[]) => {
                resolve(result[0].nickname);
            })
        } catch {
            reject("Error getting user by ID.");
        }
    });
}

export const getUserHousehold = async (userId: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(`SELECT * FROM users WHERE id=?;`, [userId], (err, result: User[]) => {
                resolve(result[0].household);
            })
        } catch {
            reject("Error getting user by ID.");
        }
    });
}

export const getUserStartingBalance = async (userId: number): Promise<number> => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(`SELECT * FROM users WHERE id=?;`, [userId], (err, result: User[]) => {
                resolve(result[0].balance);
            })
        } catch {
            reject("Error getting user by ID.");
        }
    });
}

export const getUserAllowance = async (userId: number): Promise<number> => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(`SELECT * FROM users WHERE id=?;`, [userId], (err, result: User[]) => {
                resolve(result[0].allowance);
            })
        } catch {
            reject("Error getting user by ID.");
        }
    });
}

export const getUserDateCreated = async (userId: number): Promise<Date> => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(`SELECT * FROM users WHERE id=?;`, [userId], (err, result: User[]) => {
                resolve(new Date(result[0].time_created));
            })
        } catch {
            reject("Error getting user by ID.");
        }
    });
}

export const getUserTotalBalance = async (userId: number) => {
    const startingBalance = await getUserStartingBalance(userId);
    const choresCompleted = await getUserChoresCompleted(userId);

    let balance = startingBalance;

    for (const chore of choresCompleted) {
        const choreValue = await getChoreValue(chore.id);

        balance += choreValue;
    }

    const userPurchases = await getUserPurchases(userId);

    for (const purchase of userPurchases) {
        balance -= purchase.amount;
    }

    const allowance = await getUserAllowance(userId);
    const dateAccountCreated = await getUserDateCreated(userId);
    const weeksSinceCreated = getWeekDifference(new Date(), dateAccountCreated);
    balance += allowance * weeksSinceCreated;

    return balance;
}