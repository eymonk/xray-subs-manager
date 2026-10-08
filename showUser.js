import fs from 'fs';
import readline from 'node:readline';

const configPath = '/usr/local/etc/xray/config.json';
const config = JSON.parse(fs.readFileSync(configPath));

// Show all clients.
console.log('\n');
const clients = config.inbounds[0].settings.clients;
clients.forEach((client, ind) => {
    console.log(`${ind+1}) ${client.email}`);
});

if (clients.length) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout, 
    });

    rl.question(`\nEnter client number: `, (number) => {
        const client = clients[parseInt(number)-1];
        if (client) {
            const subData = client.subscriptionData
            console.log(`\n${subData.qrCode}\n${subData.url}\n`);
        } else console.log('\nNo client under this number.\n');
        rl.close();
    });
} else console.log('No clients to show.\n');