# xray-subs-manager

Simple xray-core vps users manager.
Adds, shows and removes users, shows users qr-codes and urls.


***

### To use
1. Install nodejs, qrencode and clone the repo to your vps.
```
sudo apt install nodejs
sudo apt install qrencode
git clone https://github.com/eymonk/xray-subs-manager.git
```

2. Add these details in addUser.js file:
```
const sni = ''; // sni for reality
const serverIp = ''; // your xray vps ip
const pbk = ''; // xray server public key
```

3. Run one of the commands:

- add user: 
```
node ./xray-subs-manager/addUser.js
```
- remove user:  
```
node ./xray-subs-manager/removeUser.js
```
- show user:
```
node ./xray-subs-manager/showUser.js
```

***

**current caveats:**
1. Was written for ubuntu, you may add pr to adopt for your system.
2. At the moment "clientUrl" with xray config settings is partly hardcoded (vless+reality+xhttp+firefox).



