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
  context("Successful post", () => {
    it("GIVEN I navigate to the add user page", () => {
      cy.visit("https://dog-groomings.herokuapp.com/");
    });

    it("WHEN I enter user and job and submit the form", () => {
      cy.intercept("POST", "https://dog-grooming-api.herokuapp.com/users").as(
        "addUser"
      );
      cy.get("form").within(() => {
        cy.get("input.form-control").eq(0).type("doggys@gmail.com");
        cy.get("input.form-control").eq(1).type("ThisPassword1");

        cy.get("button.btn.btn-primary").eq(0).click();
      });
    });

    it("THEN the user is brought to the dashboard with any upcoming appointments if available", () => {
      cy.visit("https://dog-groomings.herokuapp.com/dashboard");
      //cy.get("div.card-body").should("contain", "No Upcoming Appointments");
    });
  });
});

context("Unsuccessful post", () => {
  it("GIVEN I navigate to the add user page", () => {
    cy.visit("https://dog-groomings.herokuapp.com/");
  });

  it("WHEN I enter user and job and submit the form", () => {
    cy.intercept("POST", "https://dog-grooming-api.herokuapp.com/users").as(
      "addUser"
    );
    cy.get("form").within(() => {
      //cy.get('div.row').type("something@email.com");
      cy.get("input.form-control").eq(0).type("doggyswrong@gmail.com");
      cy.get("input.form-control").eq(1).type("asdfasdaf");

      cy.get("button.btn.btn-primary").eq(0).click();
    });

    //cy.wait("@addUser");
  });

  it("THEN the user receives an error message", () => {
    cy.get("i").eq(0).should("contain", "Not authorized");
  });
});
