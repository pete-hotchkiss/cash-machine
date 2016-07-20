# Cash Point Application

![alt text](cash-machine-app.png "Cash Machine Application")


## Installing
### Get the code
First up, clone this git repo to your local environment
```
git clone https://github.com/pete-hotchkiss/cash-machine
```

### Install project dependencies
Point your command line to the root folder you've cloned the git repos into and ensure all the npm dependencies are installed
```javascript
npm install
```
Install all the bower dependencies
```javascript
bower install
```

### Running the test
The app was built under TDD methodologies using Karma/Jasmine. TO view the tests at the command line enter
```
karma start tests/karma.conf.js --single-run
```


## Running the App
The app runs on a temporary local server via gulp. To start the app enter
```
gulp serve
```

This will run the default configuration of the app. If you want to switch out the algorithm to control how the cash machine prioritises how it returns the transaction then you should use an additional ```--withdrawal``` flag

By default the application assumes you'd like it to run in _'least'_ mode - that is the transaction uses the smallest possible number of coins/notes. However, to return the most possible £20 notes spin up the server using
```
gulp serve -w denomination
```

This argument will only accept two values at present either _least_ or _denomination_. The server start will fail if you try and pass an invalid argument

Additionally, if you want to override the value of the priority denomination ( which defaults to £20 ) then you can pass an additional ```--value``` argument along with your desired denomination value. *Note:* The value must be one of the denominations available and be passed in single units - i.e. £10 = 1000. The _cli_ will warn you if you try and pass an invalid value HandheldFriendly
```
gulp serve -w denomination --value 1000 // Will prioritise £10 notes in the resulting withdrawal
```

## Additional configuration considerations
The starting state of the _float_ is defined in a ```JSON``` file found in ```./app/data/float.json```. This contains details of all the possible denominations of currency including their type - i.e. _coin_ or _note_. The _"denomination"_ values should not be changed ( note all these are stored in single units so 1p = 1 and £1 = 100) but the amount value can be adjusted as desired  
