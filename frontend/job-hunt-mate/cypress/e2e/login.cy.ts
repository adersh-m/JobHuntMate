// cypress/e2e/login.cy.ts
// Cypress E2E tests for the login page covering basic and edge cases
/// <reference types="cypress" />

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should load with correct UI elements', () => {
    cy.get('form').should('exist');
    cy.get('input[formcontrolname="usernameOrEmail"]').should('exist');
    cy.get('input[formcontrolname="password"]').should('exist');
    cy.contains('Sign In').should('exist');
  });

  it('should have password masked by default and allow toggling visibility', () => {
    cy.get('input[formcontrolname="password"]').should('have.attr', 'type', 'password');
    cy.get('.toggle-password').click();
    cy.get('input[formcontrolname="password"]').should('have.attr', 'type', 'text');
    cy.get('.toggle-password').click();
    cy.get('input[formcontrolname="password"]').should('have.attr', 'type', 'password');
  });

  it('should submit form on Enter key', () => {
    cy.get('input[formcontrolname="usernameOrEmail"]').type('user@example.com');
    cy.get('input[formcontrolname="password"]').type('password123{enter}');
    // Should trigger login request
  });

  it('should disable submit button when form is invalid', () => {
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('input[formcontrolname="usernameOrEmail"]').type('user@example.com');
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('input[formcontrolname="password"]').type('password123');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should show required field errors for empty fields', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Username or Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });


  it('should show "invalid email or password" for incorrect credentials', () => {
    cy.get('input[formcontrolname="usernameOrEmail"]').type('user1@test.com');
    cy.get('input[formcontrolname="password"]').type('wrongpassword');
    cy.intercept('POST', '**/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' }
    });
    cy.get('button[type="submit"]').click();
    cy.contains(/invalid (email|credentials|password)/i).should('be.visible');
  });

  it('should show lockout/inactive error for locked or inactive user', () => {
    cy.get('input[formcontrolname="usernameOrEmail"]').type('locked@example.com');
    cy.get('input[formcontrolname="password"]').type('password123');
    cy.intercept('POST', '**/login', {
      statusCode: 423,
      body: { message: 'Account locked or suspended' }
    });
    cy.get('button[type="submit"]').click();
    cy.contains(/locked|inactive|suspended/i).should('be.visible');
  });

  it('should show "user not found" for non-existent user', () => {
    cy.get('input[formcontrolname="usernameOrEmail"]').type('nouser@example.com');
    cy.get('input[formcontrolname="password"]').type('password123');
    cy.intercept('POST', '**/login', {
      statusCode: 404,
      body: { message: 'User not found' }
    });
    cy.get('button[type="submit"]').click();
    cy.contains(/user not found/i).should('be.visible');
  });

  it('should show success message or store token on valid login and redirect', () => {
    cy.get('input[formcontrolname="usernameOrEmail"]').type('user@test.com');
    cy.get('input[formcontrolname="password"]').type('Password@123');
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        token: 'valid.jwt.token',
        refreshToken: 'refresh.token',
        user: { id: '1', name: 'User 1', email: 'user1@test.com' }
      }
    });
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.window().then(win => {
      expect(win.localStorage.getItem('auth_token')).to.eq('valid.jwt.token');
    });
  });

  it('should show token in response or success notification on valid login', () => {
    cy.get('input[formcontrolname="usernameOrEmail"]').type('user1@test.com');
    cy.get('input[formcontrolname="password"]').type('Password@123');
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        token: 'valid.jwt.token',
        refreshToken: 'refresh.token',
        user: { id: '1', name: 'User 1', email: 'user1@test.com' }
      }
    });
    cy.get('button[type="submit"]').click();
    cy.contains(/success|welcome|token/i).should('exist');
  });

  it('should clear error messages after correction or blur', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Username or Email is required').should('be.visible');
    cy.get('input[formcontrolname="usernameOrEmail"]').type('user@example.com').blur();
    cy.contains('Username or Email is required').should('not.exist');
  });

  it('should redirect to login if accessing protected route without auth', () => {
    cy.clearLocalStorage('auth_token');
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });

  it('should be responsive on mobile viewports', () => {
    cy.viewport('iphone-6');
    cy.get('form').should('be.visible');
    cy.get('input[formcontrolname="usernameOrEmail"]').should('be.visible');
    cy.get('input[formcontrolname="password"]').should('be.visible');
  });
});
