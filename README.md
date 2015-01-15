#ToDown

ToDown is a website that uses FreeBase as source of data

## Description

This website provide you an interface to search informations about movies and save this infos into "cards".  

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

Later you will be able to share your "cards" with other peoples.  
One of the features we really want to add is a reminder when a movie is now available into DVD or BluRay. To do this there is 3 possible ways : 
- First the server scan all the movies in your cards and warn you if there is a new release.  
- An other way is to wait 3 months (or more) after the theater release and warn the user.  
- And finaly, you can wait 3 months after the add of the card in the user list and send the notification.  
