describe('Simulate Registration for ADM-2027-011', () => {
  it('attempts to create student account and reports exact behavior', () => {
    // Catch uncaught exceptions so Cypress does not bail early
    cy.on('uncaught:exception', (err, runnable) => {
      console.log('Uncaught exception detected in test:', err.message);
      return false;
    });

    cy.visit('http://localhost:5174/login?tab=register');
    
    // Check if registration page loads
    cy.get('body').should('be.visible');

    // Fill in student registration fields
    cy.get('input[placeholder="John"]').type('Victor', { force: true });
    cy.get('input[placeholder="Doe"]').type('Kipchumba', { force: true });
    cy.get('input[type="tel"]').type('+254 721 444 333', { force: true });
    
    // School Code
    cy.get('input[placeholder="BFA-2025"]').clear({ force: true }).type('BFA-2027', { force: true });

    // School Name & Join Date
    cy.get('input[placeholder="e.g. Alliance High School"]').type('Bright Futures Academy', { force: true });
    cy.get('input[type="date"]').type('2024-01-10', { force: true });

    // Fill in Student Admission & Class
    cy.get('input[placeholder="e.g. ADM-2027-001"]').type('ADM-2027-011', { force: true });
    cy.get('input[placeholder="e.g. Grade 5 Blue"]').type('Grade 5 Blue', { force: true });

    // Email & Password
    cy.get('input[type="email"]').type('victor.kipchumba@shule.ke', { force: true });
    cy.get('input[placeholder="••••••••"]').first().type('Password123!', { force: true });
    cy.get('input[placeholder="••••••••"]').last().type('Password123!', { force: true });

    // Submit Registration
    cy.contains('button', 'Initialize Parent / Student').click({ force: true });

    // Wait and verify if error toast or success occurs
    cy.wait(3000);
    cy.screenshot('registration-attempt-adm-011');
  });
});
