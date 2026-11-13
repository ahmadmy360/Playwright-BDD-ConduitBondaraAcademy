@register
Feature: Register
  Sebagai calon user, saya ingin mendaftar akun Conduit baru.

  Background:
    Given I open the sign up page

  @smoke
  Scenario: As a user, I can register with valid username, email and password
    When I register with a new valid account
    Then the registration should be successful
    And I should be logged in

  Scenario: As a user, I cant register with email that already registered
    When I register using an email that is already registered
    Then the registration should be rejected because the email is taken
    And I should see error message "email has already been taken"
    And I should stay on the "register" page
