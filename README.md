Increment Counter
------


##### First Version
A simple website that allows for users to login and increment a counter that doubles each time

Originally, I had the frontend calculating the next count, rather than the server (see [this commit](https://github.com/pratouis/incrementCounter/commit/6e5c391ad6a83de71b1a7f2bed0d5f71a82054ed)).

The front-end was writing to the back-end whenever a user confirmed they wanted to increment the counter.

##### Second Version

The front-end now makes a call to ask what the next count is, in addition to a write call updating the count associated with the user in the backend.  
