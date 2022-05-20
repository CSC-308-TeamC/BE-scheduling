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
      cy.visit("http://localhost:3000/form");
    });

    it("WHEN I enter user and job and submit the form", () => {
      cy.intercept("POST", "http://localhost:5000/users").as("addUser");
      cy.get("form").within(() => {
        cy.get('input[name="name"]').type("Pamela");
        cy.get('input[name="job"]').type("Sw Eng");
        cy.get('input[type="button"]').click();
        //Or
        //cy.contains('Submit').click()
      });
      cy.wait("@addUser");
    });

    it("THEN a new user is added to the table with the given name and job", () => {
      cy.visit("http://localhost:3000/users-table");
      cy.get("tbody").find("tr").as("rows");
      cy.get("@rows").last().should("contain", "Pamela");
      cy.get("@rows").last().should("contain", "Sw Eng");
    });
  });

  context("Unsuccessfull post", () => {
    let rowsLengthBefore = 0;
    before(() => {
      cy.visit("http://localhost:3000/users-table");
      cy.get("tbody")
        .find("tr")
        .then(($rows) => {
          rowsLengthBefore = $rows.length;
        });
    });

    it("GIVEN I navigate to the add user page", () => {
      cy.visit("http://localhost:3000/form");
    });

    it("WHEN I enter user and and invalid job (1 char only) and submit the form", () => {
      cy.intercept("POST", "http://localhost:5000/users").as("addUser");
      cy.get("form").within(() => {
        cy.get('input[name="name"]').type("Pamela");
        cy.get('input[name="job"]').type("S");
        cy.get('input[type="button"]').click();
        //Or
        //cy.contains('Submit').click()
      });
      cy.wait("@addUser");
    });

    it("THEN the user is not added to the table", () => {
      cy.visit("http://localhost:3000/users-table");
      cy.get("tbody")
        .find("tr")
        .as("rows")
        .should("have.length", rowsLengthBefore);
    });
  });
});
