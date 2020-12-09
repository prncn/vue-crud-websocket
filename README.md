# Canister
A basic CRUD client that imitates Twitter's functionalities. Create posts on a timeline  
or comment on existing ones, and follow your activity on your profile.

## User Login
User login and authentication is somewhat streamlined, yet aims to provide some standard  
use case and functions you would expect. In fact, there is no username/password auth and instead  
users login with their session IP. This makes account profiles somewhat temporary but it still
emulates basic user experience with a user database and profile data.  

## MEVN
Build with the MEVN stack: MongoDB, Express, Vue, and NodeJS. Frontend is created with  
Vuetify. Express handles the server side aspects such as database (MongoDB) communication, REST-API, and the websocket. 