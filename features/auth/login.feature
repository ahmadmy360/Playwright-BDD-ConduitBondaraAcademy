@login
Feature: Login
  Sebagai user Conduit, saya ingin login supaya bisa mengakses fitur untuk member.

  Background:
    Given I open the sign in page

  @smoke
  Scenario: As a user, I can login with valid email and password
    When I login with my registered account
    Then the login should be successful
    And I should be logged in

  Scenario: As a user, I cant login with wrong password
    When I login with my registered email and password "passwordSalah123"
    Then the login should be rejected
    And I should see error message "email or password is invalid"
    And I should stay on the "login" page

  Scenario: As a user, I cant login when server error
    Given the login API returns server error
    When I login with my registered account
    Then the API should respond with status 500
    And I should stay on the "login" page
    And I should not be logged in
