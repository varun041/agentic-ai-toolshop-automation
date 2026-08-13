import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

const TEST_DATA_DIR = path.resolve(__dirname, '..', '..', 'test-data');

const yamlCache = new Map<string, unknown>();

function loadYaml<T>(fileName: string): T {
  const cached = yamlCache.get(fileName);
  if (cached) return cached as T;
  const filePath = path.join(TEST_DATA_DIR, fileName);
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = yaml.load(raw) as T;
  yamlCache.set(fileName, parsed);
  return parsed;
}

/** Substitutes "{{dynamic:*}}" placeholders with a generated value. Only
 * personas.validCustomer.email uses one today (test-data/register.yaml) —
 * extend this if a future epic's YAML needs another dynamic field. */
function resolveDynamicPlaceholders(entry: RegisterPersona): RegisterPersona {
  const resolved: RegisterPersona = { ...entry };
  (Object.keys(resolved) as (keyof RegisterPersona)[]).forEach((key) => {
    if (resolved[key] === '{{dynamic:email}}') {
      resolved[key] = `test_${Date.now()}@qa.io`;
    }
  });
  return resolved;
}

export interface RegisterPersona {
  firstName: string;
  lastName: string;
  dob: string;
  country: string;
  postalCode: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  password: string;
}

interface RegisterYaml {
  personas: { validCustomer: RegisterPersona };
  boundary: Record<string, { password: string; unmetRule: string }>;
  negative: {
    malformedEmail: { email: string; expectedError: string };
    breachedPassword: { password: string; expectedStatus: number; expectedError: string };
    duplicateEmail: { expectedStatus: number; expectedError: string };
    requiredFields: Record<string, string>;
  };
}

interface LoginYaml {
  negative: {
    invalidCredentials: { expectedStatus: number; expectedError: string };
    requiredFields: { email: string; password: string };
    malformedEmail: { email: string; expectedError: string };
  };
  wrongCredentials: { password: string };
  placeholderCredentials: { email: string; password: string };
}

interface ProfileYaml {
  updates: { validPhoneChange: { phone: string } };
  success: { profileUpdated: { message: string } };
  negative: { requiredFieldBlank: { expectedError: string } };
}

export const TestDataFactory = {
  /** personas.validCustomer from test-data/register.yaml, with a fresh dynamic email. */
  registerPersona(overrides: Partial<RegisterPersona> = {}): RegisterPersona {
    const { personas } = loadYaml<RegisterYaml>('register.yaml');
    const resolved = resolveDynamicPlaceholders(personas.validCustomer);
    return { ...resolved, ...overrides };
  },

  /** A named boundary case (password composition rules) from register.yaml. */
  registerBoundaryCase(caseName: string): { password: string; unmetRule: string } {
    const { boundary } = loadYaml<RegisterYaml>('register.yaml');
    const entry = boundary[caseName];
    if (!entry) throw new Error(`No boundary case "${caseName}" in test-data/register.yaml`);
    return entry;
  },

  /** A named negative case (malformedEmail, breachedPassword, duplicateEmail) from register.yaml. */
  registerNegativeCase<K extends keyof RegisterYaml['negative']>(
    caseName: K
  ): RegisterYaml['negative'][K] {
    const { negative } = loadYaml<RegisterYaml>('register.yaml');
    return negative[caseName];
  },

  /** A named negative case from login.yaml. */
  loginNegativeCase<K extends keyof LoginYaml['negative']>(caseName: K): LoginYaml['negative'][K] {
    const { negative } = loadYaml<LoginYaml>('login.yaml');
    return negative[caseName];
  },

  /** A deliberately-wrong password (not tied to any specific account) from
   * login.yaml, for scenarios that need a login attempt to fail. */
  loginWrongCredentials(): LoginYaml['wrongCredentials'] {
    return loadYaml<LoginYaml>('login.yaml').wrongCredentials;
  },

  /** Placeholder email/password from login.yaml, used only to fill "the
   * other" field when a Scenario Outline blanks out one specific field. */
  loginPlaceholderCredentials(): LoginYaml['placeholderCredentials'] {
    return loadYaml<LoginYaml>('login.yaml').placeholderCredentials;
  },

  /** A profile update value or expected message from profile.yaml. */
  profileUpdate(): ProfileYaml {
    return loadYaml<ProfileYaml>('profile.yaml');
  },
};
