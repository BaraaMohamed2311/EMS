# Employees Management System App 

## Features (General)

- Roles are given to users so users with higher roles can edit data of lower roles but not vice versa.

- Variable Permissions 

- User has to have "Display Salary" or "Modify Salary" Permissions to view other users' salaries

- List of users only accessed by users with higher roles than "<span style="color:#29d199">Employee</span>"

- New users can register emails but cannot log in untill they get accepted from waiting list 

- Users Can upload profile images

- Important Actions like ( Deleting User , Accept Registration , Decline Registration ) sends emails by default to user

- Any Other changes you can use Mailer Page to send emails


## Performance 

- Users' list are requested as chuncks

- Users from list are cached at localStorage

- User's profile image must have limited size

- Logged in user data are cached at localStorage

- In roles table instead of adding all users with <span style="color:#29d199">Employee</span> role, If users do not exist or exists but no role is given then by default their role is <span style="color:#29d199">Employee</span>

- Used connection pool so number of connections created is limited and users are queued

## Security 

- Used rate limiter to prevent many requests (password discovery attack)

- Used hpp to prevent http pollution requests (duplicate request's parameters)

- Client side & Server side checking 
    - For images type & size
    - For data modification ( @ client we delete un authorized input fields & at server we check roles & perms)

## Extra

- Used OOP to visualize and have understanding of each user role capabilities

- Abstracted execution of queries to function for multiple use

## Testing

- User1: baraamohamed2311@gmail.com / <span style="color:#f4ce14">SuperAdmin</span> / id : 3001   passwords : 1234
- User2: daniel.daniels6551@gmail.com / <span style="color:#594eca">Admin</span> /   id : 2999  passwords : 1234 
- User3: julia.palmer7728@gmail.com / <span style="color:#29d199">Employee</span> /  id : 2998  passwords : 1234
