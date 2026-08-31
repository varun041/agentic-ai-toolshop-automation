@aa-1
Feature: AA-1 — User Authentication & Account Management
  As a customer of Toolshop
  I want to register, log in, log out, and manage my profile
  So that I can securely access and use my account

  Background:
    Given the test environment is configured

  # ============================================================
  # AA-10 — Register a new customer account
  # ============================================================

  @aa-10 @smoke @aa-1-tc-01-01
  Scenario: AA-1-TC-01-01 — Successful registration with valid data
    Given the user is not logged in
    And the user is on the "/auth/register" page
    When the user fills in the registration form with:
      | First name    | QA                              |
      | Last name     | Tester                          |
      | Date of Birth | 1990-01-01                       |
      | Country       | United States of America (the)  |
      | Postal code   | 10001                            |
      | House number  | 42                               |
      | Street        | Sporer Views                     |
      | City          | Gianniburgh                      |
      | State         | New Hampshire                    |
      | Phone         | 5551234567                       |
      | Email         | {{dynamic:email}}                |
      | Password      | Str0ng!Pass9                     |
    And the user clicks the "Register" button
    Then the user is redirected to the "/auth/login" page
    And no error banner is shown

  @aa-10 @smoke @cross-layer @aa-1-tc-01-02
  Scenario: AA-1-TC-01-02 — Registration confirmed at the API layer — no auto-login token issued
    Given the user is not logged in
    And the user is on the "/auth/register" page with network capture enabled
    When the user submits the registration form with a valid new persona
    Then "POST /users/register" returns status 201
    And the app navigates to the "/auth/login" page
    And "GET /users/me" returns status 401

  @aa-10 @regression @negative @cross-layer @aa-1-tc-01-03
  Scenario: AA-1-TC-01-03 — Duplicate email registration is rejected
    Given an account already exists for email "{{dynamic:email}}"
    When the user submits the registration form again using the same email address
    Then "POST /users/register" returns status 409
    And the page displays "A customer with this email address already exists."

  @aa-10 @regression @negative @aa-1-tc-01-04
  Scenario Outline: AA-1-TC-01-04 — Required field left blank is rejected — <field>
    Given the user is not logged in
    And the user is on the "/auth/register" page
    When the user leaves the "<field>" field empty
    And the user clicks the "Register" button
    Then a field-level alert "<message>" is shown below the "<field>" field
    And "POST /users/register" is not called

    Examples:
      | field         | message                    |
      | First name    | First name is required     |
      | Last name     | Last name is required      |
      | Date of Birth | Date of Birth is required  |
      | Country       | Country is required        |
      | Postal code   | Postcode is required       |
      | House number  | House number is required   |
      | Street        | Street is required         |
      | City          | City is required           |
      | State         | State is required          |
      | Phone         | Phone is required.         |
      | Password      | Password is required       |

  @aa-10 @regression @negative @aa-1-tc-01-05
  Scenario: AA-1-TC-01-05 — Malformed email format is rejected
    Given the user is not logged in
    And the user is on the "/auth/register" page
    When the user enters "notanemail" in the Email address field
    And the user clicks the "Register" button
    Then a field-level alert "Email format is invalid" is shown below the "Email address" field
    And the form does not submit

  @aa-10 @regression @negative @aa-1-tc-01-06
  Scenario Outline: AA-1-TC-01-06 — Password not meeting composition rules is rejected — <rule>
    Given the user is not logged in
    And the user is on the "/auth/register" page with all other fields valid
    When the user enters "<password>" as the password
    Then the "<rule>" checklist item remains unmet
    And the form does not submit

    Examples:
      | password       | rule                                                    |
      | Abc123!        | Be at least 8 characters long                           |
      | alllowercase1! | Contain both uppercase and lowercase letters            |
      | ALLUPPERCASE1! | Contain both uppercase and lowercase letters            |
      | NoNumberAa!    | Include at least one number                             |
      | NoSpecial1Aa   | Have at least one special symbol (e.g., @, #, $, etc.)  |

  @aa-10 @regression @negative @api @aa-1-tc-01-07
  Scenario: AA-1-TC-01-07 — Password appearing in a known data-breach list is rejected
    Given the user is not logged in
    And the user is on the "/auth/register" page with all other fields valid
    When the user enters "Password123!" as the password
    And the user clicks the "Register" button
    Then "POST /users/register" returns status 422
    And the page displays "The given password has appeared in a data leak. Please choose a different password."

  # ============================================================
  # AA-11 — Login with valid credentials
  # ============================================================

  @aa-11 @smoke @aa-1-tc-02-01
  Scenario: AA-1-TC-02-01 — Valid credentials log in and redirect to account page
    Given a registered account exists
    And the user is on the "/auth/login" page
    When the user logs in with the registered email and password
    Then the user is redirected to the "/account" page

  @aa-11 @smoke @cross-layer @aa-1-tc-02-02
  Scenario: AA-1-TC-02-02 — Login confirmed at the API layer
    Given a registered account exists
    And the user is on the "/auth/login" page with network capture enabled
    When the user submits valid login credentials
    Then "POST /users/login" returns status 200
    And "GET /users/me" returns status 200
    And the user is redirected to the "/account" page

  @aa-11 @regression @aa-1-tc-02-03
  Scenario: AA-1-TC-02-03 — Logged-in state reflected in header/nav
    Given a registered account exists
    And the user has just logged in successfully
    When the user inspects the top navigation
    Then the "Sign in" link is replaced by a dropdown menu showing the account holder's name
    And the dropdown contains "My account", "My favorites", "My profile", "My invoices", "My messages", and "Sign out"

  @aa-11 @smoke @aa-1-tc-02-04
  Scenario: AA-1-TC-02-04 — Session persists across a full page reload
    Given a registered account exists
    And the user is logged in and on the "/account" page
    When the user performs a hard page reload
    Then the user remains logged in
    And "GET /users/me" returns status 200 after the reload
    And the "/account" page still renders authenticated content

  @aa-11 @regression @negative @aa-1-tc-02-05
  Scenario: AA-1-TC-02-05 — Empty email/password blocked from submission
    Given the user is on the "/auth/login" page
    When the user leaves both Email address and Password blank
    And the user clicks the "Login" button
    Then a field-level alert "Email is required" is shown below the "Email address" field
    And a field-level alert "Password is required" is shown below the "Password" field
    And "POST /users/login" is not called

  # ============================================================
  # AA-12 — Login fails with invalid credentials
  # ============================================================

  @aa-12 @regression @negative @aa-1-tc-03-01
  Scenario: AA-1-TC-03-01 — Wrong password for existing email shows generic error
    Given an account already exists for a registered email
    And the user is on the "/auth/login" page
    When the user enters the correct email with an incorrect password
    And the user clicks the "Login" button
    Then "POST /users/login" returns status 401
    And the page displays "Invalid email or password"

  @aa-12 @regression @negative @aa-1-tc-03-02
  Scenario: AA-1-TC-03-02 — Non-existent email shows the identical generic error
    Given the user is on the "/auth/login" page
    When the user enters a non-existent email and any password
    And the user clicks the "Login" button
    Then "POST /users/login" returns status 401
    And the page displays "Invalid email or password"

  @aa-12 @regression @cross-layer @negative @aa-1-tc-03-03
  Scenario: AA-1-TC-03-03 — No session/token created on failed login
    Given a login attempt has just failed with an incorrect password
    When the test checks session state via "GET /users/me"
    Then "GET /users/me" returns status 401
    And the page displays "Invalid email or password"

  @aa-12 @regression @negative @aa-1-tc-03-04
  Scenario Outline: AA-1-TC-03-04 — Required field left empty on login is blocked — <field>
    Given the user is on the "/auth/login" page
    When the user leaves the "<field>" field blank
    And the user clicks the "Login" button
    Then a field-level alert "<message>" is shown below the "<field>" field
    And "POST /users/login" is not called

    Examples:
      | field    | message               |
      | Email    | Email is required     |
      | Password | Password is required  |

  @aa-12 @regression @negative @aa-1-tc-03-05
  Scenario: AA-1-TC-03-05 — Malformed email format on login is rejected
    Given the user is on the "/auth/login" page
    When the user enters "notanemail" in the Email address field
    And the user clicks the "Login" button
    Then a field-level alert "Email format is invalid" is shown below the "Email address" field
    And the form does not submit

  # ============================================================
  # AA-13 — Logout
  # ============================================================

  @aa-13 @smoke @aa-1-tc-04-01
  Scenario: AA-1-TC-04-01 — Logout clears session and header reverts to logged-out state
    Given a registered account exists
    And the user is logged in
    When the user opens the account dropdown
    And the user clicks "Sign out"
    Then the user is navigated to the "/auth/login" page
    And the header reverts to showing the "Sign in" link

  @aa-13 @regression @cross-layer @aa-1-tc-04-02
  Scenario: AA-1-TC-04-02 — Logout confirmed at the API layer
    Given a registered account exists
    And the user is logged in
    When the user logs out
    Then "GET /users/me" returns status 401
    And the header reverts to showing the "Sign in" link

  @aa-13 @regression @negative @aa-1-tc-04-03
  Scenario: AA-1-TC-04-03 — Unauthenticated access to /account after logout
    # NOTE: the redirect is real but asynchronous (~1-2s, tied to an async
    # session-check on load) — confirmed live 2026-08-12 by polling instead of
    # checking immediately. Earlier "no redirect" finding (Stages 1/3/4) was a
    # measurement artifact, not real behavior — see docs/epics/test_cases_AA-1.md
    # Drift #4. Do not assert on the URL immediately after navigation; rely on
    # toHaveURL's built-in auto-retry instead of a same-tick check.
    Given the user is logged out
    When the user navigates directly to "/account"
    Then the user is redirected to "/auth/login"

  @aa-13 @regression @api @known-bug @aa-1-tc-04-05
  Scenario: AA-1-TC-04-05 — GET /users/refresh reproducibility check post-logout
    # NOTE: reproduced 2/2 on 2026-08-11 (Stage 4 live verification) — Category C
    # candidate. File a Jira bug before this scenario first runs in CI; if not yet
    # filed, the Test Healer Agent will do so on first Stage 8 failure per Stage 9 rules.
    Given a registered account exists
    And the user is logged in
    When the user logs out
    And the test observes network traffic for 5 seconds after logout completes
    Then "GET /users/refresh" returns status 500

  # ============================================================
  # AA-14 — Update profile information
  # Scope: profile-fields form ([data-test="update-profile-submit"]) only.
  # Password-change and 2FA sections are explicitly out of scope for AA-1
  # (see docs/epics/test_plan_AA-1.md §1). Do not add coverage for those here.
  # ============================================================

  @aa-14 @regression @aa-1-tc-05-01
  Scenario: AA-1-TC-05-01 — Profile form pre-filled with current values
    Given a registered account exists
    And the user is logged in and navigates to the "/account/profile" page
    When the profile-fields form finishes loading
    Then First name, Last name, Email address, Phone, Street, Postal code, City, State, and Country are pre-filled with the values captured at registration

  @aa-14 @smoke @aa-1-tc-05-02
  Scenario: AA-1-TC-05-02 — Valid profile update is saved and reflected immediately
    Given a registered account exists
    And the user is logged in and navigates to the "/account/profile" page
    When the user changes the Phone field to "5559998888"
    And the user clicks the "Update Profile" button
    Then the page displays "Your profile is successfully updated!"
    And the new value is reflected immediately in the Phone field without a page reload

  @aa-14 @regression @negative @aa-1-tc-05-04
  Scenario: AA-1-TC-05-04 — Required field left blank on profile update is rejected
    Given a registered account exists
    And the user is logged in and navigates to the "/account/profile" page
    When the user clears the First name field
    And the user clicks the "Update Profile" button
    Then the page displays "Please correct the highlighted fields before saving."
    And the update is not saved

  @aa-14 @regression @negative @cross-layer @aa-1-tc-05-05
  Scenario: AA-1-TC-05-05 — Unauthenticated access to /account/profile
    # NOTE: same async-redirect confirmation as AA-1-TC-04-03 — see
    # docs/epics/test_cases_AA-1.md Drift #4.
    Given the user is logged out
    When the user navigates directly to "/account/profile"
    Then the user is redirected to "/auth/login"
    And "GET /users/me" returns status 401
