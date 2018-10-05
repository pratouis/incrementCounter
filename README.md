Increment Counter
------
A simple website that allows for users to login and increment a counter that doubles each time
#### How to Run
Create an `env.sh` file that looks like 
```
export MONGODB_URI="mongodb://<dbuser>:<dbpassword>@123456789.mlab.com:5555/my-database"
```
Source `env.sh` and run `npm start` to start the server, and open your local [index.html](./build/index.html) in your browser.

#### Requirements
- requests by frontend must be authenticating by backend 
- increment counter in backend by doubling formula
- login page and counter page

#### Additional Features
- persistence with registration and login
- antd design
- reset counter 
- logout 

#### Notes on Commit History
###### First Version

Originally, I had the frontend calculating the next count, rather than the server (see [this commit](https://github.com/pratouis/incrementCounter/commit/6e5c391ad6a83de71b1a7f2bed0d5f71a82054ed)).

The front-end was writing to the back-end whenever a user confirmed they wanted to increment the counter.

###### Second Version

The front-end now makes a call to ask what the next count is, in addition to a write call updating the count associated with the user in the backend.  
