# JSCRIPT 400 Final  Project

## Overview
For our final project we will be utilizing movie data found from Kaggle.com which includes a collection of movies found on Netflix, Prime Video, Hulu and Disney+ as seen [here](https://www.kaggle.com/ruchi798/movies-on-netflix-prime-video-hulu-and-disney). This application allows users to search the vast database for movie information using refined search queries based on many search parameters such as year, genre, age, rating, keywords, and more. Users can also create an account for additional features such as the ability to save movies to their own collection as "viewed movies" or "want to watch" movies and even add reviews and ratings of the movies they have seen. This is the perfect application for those who love to record and catalog the movies they have watched for future reference.

Here is a sample of the movie data.
![movie data sample](https://res.cloudinary.com/dcokaa0ia/image/upload/v1597605631/samples/movieData_srpkmq.png)

## Route Endpoints

### Movie Endpoints
GET /movies		    Retrieves all movies<br/>
GET /movies/:id	    Retrieves a specific movie<br/>
POST /movies		Adds a new movie to database (Requires Admin Role)<br/>
PUT /movies/:id	    Updates a specific movie (Requires Admin Role)<br/>
DELETE /movies/:id	removes a movie from database (Requires Admin Role)<br/>

### Login Endpoints
POST /login			    Logs a user into their account<br/>
POST /login/signup		Creates a new user account<br/>
POST /login/logout		Logs a user out<br/>
POST /login/password 	Allows user to change password<br/>

### Saved Endpoints (All of these routes require authentication)
GET /saved  		            Retrieves a users collection of watchlist and favorite movies<br/>
POST /saved/watchlist           Adds movie to users watchlist<br/>
POST /saved/movieFavorites      Adds movie to users favorites<br/>
DELETE /saved/watchlist	        Removes a movie from users watchlist<br/>
DELETE /saved/movieFvorites     Removes a movie from users favorites<br/>

### Review Endpoints (All of these routes require authentication)
GET /review/movie    Retrieves all reviews of a movie<br/>
GET /review          Retrieves all reviews by user<br/>
POST /review         Adds movie review by user<br/>
PUT /review          Updates a movie review for user <br/>
DELETE /review	     Removes a review of a movie by a user <br/>

## Route Status
All login routes complete<br/>
All login route tests complete<br/>
All saved routes in progress<br/>
All saved route tests in progress<br/>
Movie routes?<br/>
Movie route test?<br/>
Review route not started<br/>
Review route tests not started<br/>
Not sure if we'll need user routes.  We may not have time to develop admin features.<br/>

##UI
UI has been created to interact with the routes<br/>
All mustache files for views have been created<br/>

## Deployment
Movie data has been loaded to MongoDB Atlas<br/>
Heroku cluster created and connected to MongoDB Atlas with auto deploy from github master functioning<br/>
App renders???<br/>

##Notes
Time permitting, a migration may be created to load the data to mongo atlas<br/>

##Deployment URL
https://secret-retreat-78826.herokuapp.com/
