#ToDown

ToDown is a website that uses FreeBase as source of data

## Description

This website provide you an interface to search informations about movies and save this infos into "cards".  
Later you will be able to share your "cards" with other peoples.

## Install and launch

```
sudo apt-get install nodejs npm
git clone https://github.com/eicnam/ToDown.git
cd ToDown/
npm install -g bower
cd app/
npm install
cd public/
bower install
cd ..
node server.js
http://localhost:8080
```
!! in some cases you have to launch "nodejs" instead of "node"


## Technologies used 

- MongoDB (hosted on MongoLab)
- Express
- AngularJS
- NodeJS
- Angular Material
- Twitter OAuth
- Freebase API
- OpenShift (NodeJS host)

## Future upgrades  

One of the features we really want to add is a reminder when a movie is now available into DVD or BluRay.
