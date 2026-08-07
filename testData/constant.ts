
import { EnvironmentConfig } from '../utils/EnvironmentConfig';

export const stg_url = EnvironmentConfig.getApplicationUrl();

export const username = "standard_user";
export const password = "secret_sauce";


export const PRODUCT_NAMES = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
  'Test.allTheThings() T-Shirt (Red)'
];


export const ztoAPRODUCT_NAMES = [
  'Test.allTheThings() T-Shirt (Red)',
  'Sauce Labs Onesie',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Bike Light',
  'Sauce Labs Backpack',
];

export const sigleProductToAdd = 'Sauce Labs Backpack';

export const checkout_firstName = "testUserOne";
export const checkout_lastName = "testUserLastName"
export const checkout_postalCode = "123456"

export const checkout_firstName_errorMessage = 'Error: First Name is required';
export const checkout_lastName_errorMessage = "Error: Last Name is required";
export const checkout_PostalCode_errorMessage = 'Error: Postal Code is required';