# MyEAN Tech Challenge ([Live Demo](https://myean.herokuapp.com/))
*MyEAN -> MySQL + ExpressJS + AngularJS + NodeJS*

Prerequisites :
- *NodeJS*
- *MySQL*

Steps to run project :
- Go to your my.ini and make bellow mentioned necessary changes :
  ```sh
  max_allowed_packet = 100M
  innodb_log_file_size = 100M
  ```
  Save file and restart MySQL.
- Create new schema named -> __myean__
- Make necessary changes into __/MyEANTechChallenge/server/config/config-local.json/"DB"__ for connection to your local MySQL.
- After cloning repository, cd into the project directory and execute below mentioned command :
  ```sh
  npm i
  ```
- Start node server by execuring below mentioned command :
  ```sh
  npm start
  ```
  
Once you see below mentioned messages in your terminal/cmd :
  ```sh
  Connection has been established successfully.
  Server listening on port : 3003
  ```
open http://localhost:3003/ in browser.

Cheers!
