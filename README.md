# Rock, paper and scissors 
Rock, paper and scissors online game. 
 
Available for online play at: 
https://rps-ttgames.herokuapp.com 
 
## Running 
 
* NodeJS v8 or higher is required 
 
Just run 
``` 
$> npm run start 
``` 
The server should be available at ```http://localhost:3000``` 
 
## Testing 
 
First you need to install the packages to run the tests 
We use [mocha](https://www.npmjs.com/package/mocha) as the test engine, [expect.js](https://www.npmjs.com/package/expect.js/v/0.3.1) for better assertions and [sinon](https://www.npmjs.com/package/sinon) for mocking. 
``` 
$> npm install 
``` 
After installing all packages, you can run 
 
``` 
$> npm test # To run one time 
$> npm run watch # To watch your directory and run everytime you save a file 
``` 