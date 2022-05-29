# BE-scheduling

## Accessible FrontEnd Link: 
https://dog-groomings.herokuapp.com/

## Accessible BackEnd Link: 
https://dog-grooming-api.herokuapp.com/

## Quick Start Instructions
  1. Clone Github Repository to Local Machine.
  2. Run `npm install` to install all necessary packages.
  3. Create .env file in the root folder.
  4. Add the following variables:    
          `MONGODB_URI:`        Description: The URL to the cloud hosted DB  
          `PASSWORD_SALT:`      Salt used in encrypting passwords  
          `TOKEN_SECRET:`       Used to verifty user JWT  
          `PORT:`               Port to utilize should the connection to the cloud hosted DB fail
  5. Run `npm run dev` to launch.

## CI/CD Steps:
          npm ci
          npm run build --if-present
          npm test

## Include CI/CD details
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "dog-grooming-api"
          heroku_email: {"user@gmail.com"}
         
## Automated Acceptance Testing
 ### `npx cypress open`

Launches the test runner for Cypress API.\
See the section about [running tests](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Hooks) for more information.

## UI Protoyping Schema:
https://www.figma.com/file/YFBYd05CtpXAUl1H2whxEb/Rush%3A-Web-app-prototyping-kit-(Community)?node-id=102%3A408

## Product Spec Documentation:
https://docs.google.com/document/d/1-tYBP6pn_fnwizhPB3ZhvTtMLqb8_aKRsvDxsaNPS-c/edit?usp=sharing

# Testing Coverage Reports
###In Memory Tests  
![In-Memory-Code-Covage](https://user-images.githubusercontent.com/91435899/170849346-31e03fe4-dae9-43dd-89f2-1bb9bec9787b.png)  
###Mock Tests  
![mock-tests-coverage](https://user-images.githubusercontent.com/74291980/170851364-90bb1ff9-4377-46ff-a7be-b0584ef5a5ff.PNG)

