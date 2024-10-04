# Employees Management System App 

## Features (General)

- Roles are given to users so users with higher roles can edit data of lower roles but not vice versa.

- Variable Permissions 

- User has to have "Display Salary" or "Modify Salary" Permissions to view other users' salaries

- List of users only accessed by users with higher roles than **🟢 Employee**

- New users can register emails but cannot log in until they get accepted from waiting list 

- Users Can upload profile images

- Important Actions like (Deleting User, Accept Registration, Decline Registration) sends emails by default to user

- Any Other changes you can use Mailer Page to send emails

## Performance 

- Users' list are requested as chunks

- Users from list are cached at localStorage

- User's profile image must have limited size

- Logged in user data are cached at localStorage

- In roles table instead of adding all users with **🟢 Employee** role, If users do not exist or exists but no role is given then by default their role is **🟢 Employee**

- Used connection pool so number of connections created is limited and users are queued

- Used <Image> provided by next for better SEO & performance

## Security 

- Used rate limiter to prevent many requests (password discovery attack)

- Used hpp to prevent http pollution requests (duplicate request's parameters)

- Client side & Server side checking 
    - For images type & size
    - For data modification (at client we delete unauthorized input fields & at server we check roles & perms)

## Extra

- Used OOP to visualize and have understanding of each user role capabilities

- Abstracted execution of queries to function for multiple use

## Testing

- User1: baraamohamed2311@gmail.com / **⭐ SuperAdmin** / id : 3001 passwords : 1234
- User2: daniel.daniels6551@gmail.com / **🟣 Admin** / id : 2999 passwords : 1234 
- User3: julia.palmer7728@gmail.com / **🟢 Employee** / id : 2998 passwords : 1234

## Testing

## Api Docs

https://documenter.getpostman.com/view/30506181/2sAXxMespT



## Usage 

1. next.config.mjs make sure to comment "localhost:5500/api" if you were to containerize

2. if you were to containerize but use db on your host then use .env.dev file 

3. 
    - If .env.local => Do not run compose and make changes that you want in app, client is :3000 &      server is :5500 & and db must be at your host
    
    *   Ems/ems/ => npm run dev  , Ems/Server/ => npm run start

    - If .env.dev => client runs on :3000 & server :5500 & db should be at your host

    * docker-compose --env-file ./Server/.env.dev up -d --build

    - If .env.prod => client runs on :3050 & server :3050/api & db is at mysql contianer

    * docker-compose --env-file ./Server/.env.prod up -d --build