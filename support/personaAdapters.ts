import { RegisterFormFields } from './ToolshopUi';
import { RegisterPersona } from './factories/TestDataFactory';
import { RegisterRequest } from './types/AA-1.types';

/** Adapts a TestDataFactory RegisterPersona (camelCase, YAML-sourced) into the
 * Title-Case field labels ToolshopUi.fillRegistrationForm expects (matching
 * the labels used in features/aa-1/aa-1.feature's data tables). */
export function personaToFormFields(persona: RegisterPersona): Record<keyof RegisterFormFields, string> {
  return {
    'First name': persona.firstName,
    'Last name': persona.lastName,
    'Date of Birth': persona.dob,
    Country: persona.country,
    'Postal code': persona.postalCode,
    'House number': persona.houseNumber,
    Street: persona.street,
    City: persona.city,
    State: persona.state,
    Phone: persona.phone,
    Email: persona.email,
    Password: persona.password,
  };
}

/** UI <select> option text -> API's ISO country code. Only covers what AA-1's
 * test data actually uses (test-data/register.yaml's one persona country) —
 * extend if a future epic's data introduces another country. The ISO-code
 * assumption for the API body comes from the confirmed `country=US` query
 * param on the live `/postcode-lookup` call (Stage 4); the register POST
 * body's own country field was not independently byte-inspected. */
const COUNTRY_NAME_TO_ISO: Record<string, string> = {
  'United States of America (the)': 'US',
};

/** Adapts a RegisterPersona into the snake_case shape ToolshopApi.registerViaApi
 * expects (RegisterRequest — see support/types/AA-1.types.ts, ground-truthed
 * from live network capture, not the UI form's field shape). */
export function personaToApiPayload(persona: RegisterPersona): RegisterRequest {
  const isoCountry = COUNTRY_NAME_TO_ISO[persona.country];
  if (!isoCountry) {
    throw new Error(`No ISO code mapping for country "${persona.country}" — add one to COUNTRY_NAME_TO_ISO`);
  }
  return {
    first_name: persona.firstName,
    last_name: persona.lastName,
    dob: persona.dob,
    country: isoCountry,
    postcode: persona.postalCode,
    house_number: persona.houseNumber,
    street: persona.street,
    city: persona.city,
    state: persona.state,
    phone: persona.phone,
    email: persona.email,
    password: persona.password,
  };
}
