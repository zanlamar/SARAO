const fs = require('fs');
const path = require('path');
const successColor = '\x1b[32m%s\x1b[0m';
const checkSign = '\u{2705}';
const dotenv = require('dotenv').config({path: 'src/.env'}); ;

const firebaseConfig = `export const firebaseConfig = {
    firebaseConfig: {
        apiKey: '${process.env.apiKey}',
        authDomain: '${process.env.authDomain}',
        projectId: '${process.env.projectId}',
        storageBucket: '${process.env.storageBucket}',
        messagingSenderId: '${process.env.messagingSenderId}',
        appId: '${process.env.appId}',
        measurementId: '${process.env.measurementId}',
    }
};

`;
const environment = `export const environment = {
    supabase: {
        url: '${process.env.url}',
        anonKey: '${process.env.anonKey}',
    }
};

`;
const storage = `export const storage = {
    supabaseUrl: '${process.env.supabaseUrl}',
};

`;

const targetPath = path.join(__dirname, './src/environments/environment.ts');

fs.appendFile(targetPath, firebaseConfig, (err) => {
    if (err) {
        console.error(err);
        throw err;
    } else {
        console.log(successColor, `${checkSign} Successfully generated firebaseConfig environment.ts`);
    }
});

fs.appendFile(targetPath, environment, (err) => {
    if (err) {
        console.error(err);
        throw err;
    } else {
        console.log(successColor, `${checkSign} Successfully generated environment environment.ts`);
    }
});

fs.appendFile(targetPath, storage, (err) => {
    if (err) {
        console.error(err);
        throw err;
    } else {
        console.log(successColor, `${checkSign} Successfully generated storage environment.ts`);
    }
});