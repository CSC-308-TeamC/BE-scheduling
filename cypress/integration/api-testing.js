/**
 * Feature: Backend (REST API) is listening
 * Scenario: Backend loads and runs successfully
 *    GIVEN I run the backend
 *    WHEN I visit the root endpoint
 *    THEN it does not smoke
 *    AND returns "Hello World!"
 *    AND the response code is 200
 */
describe("Backend (REST API) is listening", () => {
  context("Backend loads and runs successfully", () => {
    before(() => {
      //this is a beforeAll
      //if needed
      //see more here: https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Hooks
    });

    it("GIVEN I run the backend", () => {});

    it("WHEN I visit the root endpoint", () => {
      cy.request("https://dog-grooming-api.herokuapp.com/users").then(
        (response) => {
          //Using matchers from Chai: https://www.chaijs.com/guide/styles/#assert
          //All Cypress supported matchers here: https://docs.cypress.io/guides/references/assertions
          assert.isNotNull(response.body, "THEN it does not smoke");
          // assert.equal(
          //  response.body,
          //  {"userData":[{"_id":"62756a5e83a398b7749c48ce","email":"something@email.com","password":"$2a$08$wYXmS9I7XeRIAvFodYf15uZvTVWNDpD/qYKTH/MhbM4VFrNrl3pGC","administrator":false,"__v":0},{"_id":"627d5210cd5401e489551b2a","email":"test@gmail.com","password":"$2a$10$rncAYvw2lUiCBe58tlXjfuBBZ9yQXJVG7uYn6KSlCfgiyiQS.WVU2","administrator":false,"__v":0},{"_id":"627d530c72a4c31a0d16ac42","email":"tester@gmail.com","password":"$2a$10$NqcnTTgT6SDcCPWgl/gnqeNLPHxwbn9Z0sNmCa42sTfr1YE4Hj4x.","administrator":false,"__v":0},{"_id":"628536e5d9a4447f1b7235da","email":"doggy@gmail.com","password":"$2a$08$3X..JSir37u/TvVGGz7paOzaDjtAti2DefMs9eCgJPFB6zdV66HYi","administrator":false,"__v":0},{"_id":"6285376bd9a4447f1b7235e0","email":"doggys@gmail.com","password":"$2a$08$UnmkCxMkxk7wboRKrbyr5OcRAPHTRkEcPcwZ/8uNLd3ZFWqbqXjN2","administrator":false,"__v":0}]}
          // );
          // assert.equal(response.status, 200, "AND the response code is 200");

          //OR use another set of supported matchers from Chai, the Expect style:
          //https://www.chaijs.com/guide/styles/#expect
          expect(response.body).to.be.a("object");

          //arr = response.body
          //arr.ForEach((elem) => expect(response.body).to.property('{ Object (userData) }'))
          //expect(response.body).to.match('userData');
          expect(response.body).to.exist;
          expect(response.body).to.deep.equal({
            userData: [
              {
                _id: "62756a5e83a398b7749c48ce",
                email: "something@email.com",
                password:
                  "$2a$08$wYXmS9I7XeRIAvFodYf15uZvTVWNDpD/qYKTH/MhbM4VFrNrl3pGC",
                administrator: false,
                __v: 0,
              },
              {
                _id: "627d5210cd5401e489551b2a",
                email: "test@gmail.com",
                password:
                  "$2a$10$rncAYvw2lUiCBe58tlXjfuBBZ9yQXJVG7uYn6KSlCfgiyiQS.WVU2",
                administrator: false,
                __v: 0,
              },
              {
                _id: "627d530c72a4c31a0d16ac42",
                email: "tester@gmail.com",
                password:
                  "$2a$10$NqcnTTgT6SDcCPWgl/gnqeNLPHxwbn9Z0sNmCa42sTfr1YE4Hj4x.",
                administrator: false,
                __v: 0,
              },
              {
                _id: "628536e5d9a4447f1b7235da",
                email: "doggy@gmail.com",
                password:
                  "$2a$08$3X..JSir37u/TvVGGz7paOzaDjtAti2DefMs9eCgJPFB6zdV66HYi",
                administrator: false,
                __v: 0,
              },
              {
                _id: "6285376bd9a4447f1b7235e0",
                email: "doggys@gmail.com",
                password:
                  "$2a$08$UnmkCxMkxk7wboRKrbyr5OcRAPHTRkEcPcwZ/8uNLd3ZFWqbqXjN2",
                administrator: false,
                __v: 0,
              },
            ],
          });
          //expect(response.body).to.be.instanceOf;
          // assert.to.equal(
          //  response.body,
          //   "Object (userData)"
          // );

          // var arr = response.body;
          // arr.forEach(elem => expect(reponse.body).to.equal("Object (userData)"))

          expect(response.status).to.equal(200);
        }
      );
    });
  });
});

/**
 * Feature: API takes an obj and adds it to the DB
 *  As an API client I want to be able to send a user object to be added to
 *  the database.
 *
 * Scenario: Successfull post
 *    GIVEN My user object has valid fields (user and job)
 *    WHEN I attempt to post the user obj
 *    THEN I receive a successfull response (code 201)
 *    AND the response object contains the property _id
 *    AND the response object contains the same name and job I passed
 *
 * Scenario: Unsuccessfull post
 *    GIVEN My user object has an invalid field (job)
 *    WHEN I attempt to post the user obj
 *    THEN I receive a failure response (code 400)
 *    AND there's no response obj
 */

describe("API takes an obj and adds it to the DB", () => {
  context("Successful get", () => {
    before(() => {});

    let user = {};

    it("GIVEN My user object has valid fields (user and job)", () => {
      user = {
        email: undefined,
        password:
          "$2a$08$UnmkCxMkxk7wboRKrbyr5OcRAPHTRkEcPcwZ/8uNLd3ZFWqbqXjN2",
      };
    });

    it("WHEN I attempt to post the user obj", () => {
      cy.request(
        "GET",
        "https://dog-grooming-api.herokuapp.com/users",
        user
      ).then((response) => {
        //Using matchers from Chai: https://www.chaijs.com/guide/styles/#assert
        // All Cypress supported matchers here: https://docs.cypress.io/guides/references/assertions
        assert.equal(
          response.status,
          200,
          "THEN I receive a successful response (code 200)"
        );

        assert.equal(
          response.body.email,
          user.email,
          "AND the response object contains the same name and job I passed"
        );
        assert.equal(
          response.body.password,
          user.passwordd,
          "AND the response object contains the same name and job I passed"
        );
      });
    });
  });

  context("Unsuccessful post", () => {
    before(() => {});

    let user = {};

    it("GIVEN My user object has an invalid field (job)", () => {
      user = {
        name: "Arun",
        job: "G",
      };
    });

    it("WHEN I attempt to post the user obj", () => {
      cy.request({
        method: "POST",
        url: "https://dog-grooming-api.herokuapp.com/clients",
        body: user,
        failOnStatusCode: false,
      }).then((response) => {
        //Using matchers from Chai: https://www.chaijs.com/guide/styles/#assert
        //All Cypress supported matchers here: https://docs.cypress.io/guides/references/assertions
        assert.equal(response.status, 401, "No token");
      });
    });
  });
});
