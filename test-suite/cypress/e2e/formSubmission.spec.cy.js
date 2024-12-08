describe('Form Submission Test', () => {
  let testInputs;

  // Load the test data from the fixtures file before running the tests
  before(() => {
    cy.fixture('formInputs').then((data) => {
      testInputs = data;
    });
  });

  after(() => {
    // Capture a screenshot only if all tests in this suite have passed
    if (Cypress.mocha.getRunner().stats.failures === 0) {
      cy.screenshot('final-success-screenshot', {
        capture: 'runner', // Capture the entire test runner
        overwrite: true, // Overwrite any previous screenshots with the same name
      });
    }
  });

  it('should test multiple inputs, submit, and verify the result', () => {
    // Visit the frontend application
    cy.visit('/'); // Assumes the base URL is set correctly in your Cypress config

    // Intercept the API call to /process and wait for it
    cy.intercept('POST', '/process', (req) => {
      req.continue((res) => {
        console.log('Response:', res);
      });
    }).as('postProcess');

    // Iterate over each test input
    testInputs.forEach((inputData, index) => {
      // Type the JSON data into the input field, with special character sequences disabled
      cy.get('[id="input"]').clear().type(JSON.stringify(inputData), { parseSpecialCharSequences: false });

      // Click the submit button
      cy.get('button[type="submit"]').click();

      // Wait for the API call to complete and assert the response
      cy.wait('@postProcess').then((interception) => {
        // Assert the response status code if needed
        expect(interception.response.statusCode).to.eq(200);

        // Get the result from the API response
        const responseData = interception.response.body;

        // Assert that the response value is displayed in the output textarea
        cy.get('#output').should('have.value', JSON.stringify(responseData.result));

        // Optionally, add custom verification logic for each input's expected result
        console.log(`Test ${index + 1}: Input processed and result verified`);
      });
    });
  });
});
