import fs from 'fs';
import readline from 'node:readline';
import { execSync } from 'node:child_process';

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

    rl.question(`\nEnter client number to remove: `, (number) => {
        const client = clients[parseInt(number)-1];
        if (client) {
            const clientName = client.email;
            const clientInd = clients.indexOf(client);
            clients.splice(clientInd, 1);
            console.log(`\nRemoved "${clientName}" from clients.\n`);
            console.log(`All clients:\n`);
            clients.forEach((client, ind) => console.log(`${ind+1}) ${client.email}.`));
            console.log('\n');
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            execSync('systemctl restart xray');
        } else console.log('\nNo client under this number.\n');
        rl.close();
    });
} else console.log('No clients to show.\n');