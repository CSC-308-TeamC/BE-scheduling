/**
 * Feature: Add new user
 *
 * Scenario: Successfull post
 *    GIVEN I navigate to the add user page
 *    WHEN I enter user and job and submit the form
 *    THEN a new user is added to the table with the given name and job
 *
 * Scenario: Unsuccessfull post
 *    GIVEN I navigate to the add user page
 *    WHEN I enter user and and invalid job (1 char only) and submit the form
 *    THEN the user is not added to the table
 */

describe("Add new user", () => {
  context("Successfull post", () => {
    it("GIVEN I navigate to the add user page", () => {
      cy.visit("https://dog-groomings.herokuapp.com/");
    });

    it("WHEN I enter user and job and submit the form", () => {
      cy.intercept("POST", "https://dog-grooming-api.herokuapp.com/users").as(
        "addUser"
      );
      cy.get("form").within(() => {
        cy.get('input[name="_id"]').type("6285376bd9a4447f1b7235e0");
        cy.get('input[name="email"]').type("doggys@gmail.com");
        cy.get('input[name="password"]').type(
          "$2a$08$UnmkCxMkxk7wboRKrbyr5OcRAPHTRkEcPcwZ/8uNLd3ZFWqbqXjN2"
        );
        cy.get('input[name="administrator"]').type("false");
        cy.get('input[name="__v"]').type("0");
        //cy.get('input[type="doggys@gmail.com"]').click();
        //Or
        cy.contains("Sign In").click();
      });
      cy.wait("@addUser");
    });

    it("THEN a new user is added to the table with the given name and job", () => {
      cy.visit("https://dog-groomings.herokuapp.com/");
      cy.get("tbody").find("tr").as("rows");
      cy.get("@rows").last().should("contain", "Pamela");
      cy.get("@rows").last().should("contain", "Sw Eng");
    });
  });
});

//   context("Unsuccessfull post", () => {
//     let rowsLengthBefore = 0;
//     before(() => {
//       cy.visit("http://localhost:3000/users-table");
//       cy.get("tbody")
//         .find("tr")
//         .then(($rows) => {
//           rowsLengthBefore = $rows.length;
//         });
//     });

//     it("GIVEN I navigate to the add user page", () => {
//       cy.visit("http://localhost:3000/form");
//     });

//     it("WHEN I enter user and and invalid job (1 char only) and submit the form", () => {
//       cy.intercept("POST", "http://localhost:5000/users").as("addUser");
//       cy.get("form").within(() => {
//         cy.get('input[name="name"]').type("Pamela");
//         cy.get('input[name="job"]').type("S");
//         cy.get('input[type="button"]').click();
//         //Or
//         //cy.contains('Submit').click()
//       });
//       cy.wait("@addUser");
//     });

//     it("THEN the user is not added to the table", () => {
//       cy.visit("http://localhost:3000/users-table");
//       cy.get("tbody")
//         .find("tr")
//         .as("rows")
//         .should("have.length", rowsLengthBefore);
//     });
//   });
// });
