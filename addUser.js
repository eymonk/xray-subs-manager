import fs from 'fs';
import readline from 'node:readline';
import crypto from 'crypto';
import { exec, execSync } from 'node:child_process';

const configPath = '/usr/local/etc/xray/config.json';
const configData = fs.readFileSync(configPath);
const config = JSON.parse(configData);
const clients = config.inbounds[0].settings.clients;
const shortIds = config.inbounds[0].streamSettings.realitySettings.shortIds;

const sni = ''; // sni for reality
const serverIp = ''; // your xray vps ip
const pbk = ''; // xray server public key


function generateShortId() {
    return crypto.randomBytes(8).toString('hex');
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('\nEnter username: ', (username) => {
    const email = username;
    let allowAddition = true;
    clients.forEach((client) => {
        if (client.email === email) allowAddition = false;
    });
    if (allowAddition) {
        exec('xray uuid',  (error, stdout, stderr) => {
            if (error) console.error(`Execution error: ${error.message}`);
            else if (stderr) console.error(`Standard Error output: ${stderr}`) 
            else {
                const uuid = stdout.substring(0, 36);
                const shortId = generateShortId();
                const clientUrl = `vless://${uuid}@${serverIp}:443?security=reality&path=%2F&host=&mode=auto&sni=${sni}&fp=firefox&pbk=${pbk}&sid=${shortId}&spx=%2F&type=xhttp&encryption=none#${email}`;
                const qrCodeData = execSync('qrencode -t ansiutf8', { input: clientUrl });
                const qrCode = qrCodeData.toString();

                shortIds.push(shortId);
                clients.push({
                    email,
                    shortId,
                    id: uuid,
                    subscriptionData: {
                        qrCode,
                        url: clientUrl,
                    }
                });

                console.log('\nAll users:');
                clients.forEach((client, ind) => console.log(`${ind+1}. ${client.email}`));
                console.log(`\n${email} qr:\n${qrCode}`);
                console.log(`\n${email} url:\n${clientUrl}\n`);

                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                execSync('systemctl restart xray');
            }
        });
    } else console.log('There is already such a name in the config.');
    rl.close();
});
