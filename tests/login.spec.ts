import { test } from '../fixtures/pages.fixture'
import { expect } from '@playwright/test'
import logger from '../utils/LoggerUtils'
import * as constants from '../testData/constant'
import { INVALID_CREDENTIALS, USERS } from '../testData/users'


test.beforeEach(async ({ page }) => {
    await page.goto(constants.stg_url);
})


test.describe('login and authentication test for standard type', () => {

    //Positive flow - standard username & password
    test('successful login with Standard user', async ({ page, pom }) => {

        await test.step('verify login page is displayed', async () => {
            const loginPageObj = await pom.loginPage();
            await loginPageObj.verifyLoginPageDisplayed();
        });

        await test.step('verify login with standard credentials', async () => {
            const loginPageObj = await pom.loginPage();
            await loginPageObj.loginToPortal(constants.username, constants.password)
        });

        logger.info('Standard user login successful')
    })

    test('login failure with invalid user', async ({ page, pom }) => {

        await test.step('login with invalid credentials', async () => {
            const loginPageObj = await pom.loginPage();
            await loginPageObj.usernameInput.fill('invaliduser');
            await loginPageObj.passwordInput.fill(constants.password);
            await loginPageObj.loginButton.click();

        });

        await test.step('verify error message for invalid credentials', async () => {
            await expect(page).toHaveURL(constants.stg_url);
            const loginPageObj = await pom.loginPage();
            await loginPageObj.verifyErrorMessageDisplayed('Epic sadface: Username and password do not match any user in this service')
        });

        logger.info('Invalid username error validation')
    })

    test('login failure with invalid password', async ({ page, pom }) => {

        await test.step('login with invalid credentials', async () => {
            const loginPageObj = await pom.loginPage();
            //await loginPageObj.loginToPortal('invalid_user',constants.password)
            await loginPageObj.usernameInput.fill(constants.username);
            await loginPageObj.passwordInput.fill(INVALID_CREDENTIALS.EMPTY_PASSWORD.password);
            await loginPageObj.loginButton.click();
        });

        await test.step('verify error message for invalid credentials', async () => {
            await expect(page).toHaveURL(constants.stg_url);
            const loginPageObj = await pom.loginPage();
            await loginPageObj.verifyErrorMessageDisplayed(INVALID_CREDENTIALS.EMPTY_PASSWORD.expectedError);
        });

        logger.info('Invalid password error validation')
    })

    test('login with empty userName', async ({ page, pom }) => {

        await test.step('login with empty username & password credentials', async () => {
            const loginPageObj = await pom.loginPage();
            await loginPageObj.usernameInput.fill("");
            await loginPageObj.passwordInput.fill(constants.password);
            await loginPageObj.loginButton.click();

        });

        await test.step('verify error message for missing credentials', async () => {
            await expect(page).toHaveURL(constants.stg_url);
            const loginPageObj = await pom.loginPage();
            await loginPageObj.verifyErrorMessageDisplayed('Epic sadface: Username is required')
        });


        logger.info('empty username error validation');
    })

    test('login with empty password', async ({ page, pom }) => {

        await test.step('login with username & empty password credentials', async () => {
            const loginPageObj = await pom.loginPage();
            await loginPageObj.usernameInput.fill(constants.username);
            await loginPageObj.passwordInput.fill("");
            await loginPageObj.loginButton.click();

        });

        await test.step('verify error message for missing credentials', async () => {
            await expect(page).toHaveURL(constants.stg_url);
            const loginPageObj = await pom.loginPage();
            await loginPageObj.verifyErrorMessageDisplayed('Epic sadface: Password is required')
        });
        logger.info('empty password error validation');
    })

    test('login with empty userName,password', async ({ page, pom }) => {

        await test.step('login with empty username & password credentials', async () => {
            const loginPageObj = await pom.loginPage();
            await loginPageObj.usernameInput.fill("");
            await loginPageObj.passwordInput.fill("");
            await loginPageObj.loginButton.click();

        });

        await test.step('verify error message for missing credentials', async () => {
            await expect(page).toHaveURL(constants.stg_url);
            const loginPageObj = await pom.loginPage();
            await loginPageObj.verifyErrorMessageDisplayed('Epic sadface: Username is required')
        });
        logger.info('empty password error validation');
    })

})


test.describe('login and authentication test for non - standard type', () => {

    test('login with performance glitch user', async ({ page, pom }) => {

        await test.step('login with performance glitch username & password credentials', async () => {
            const loginPageObj = await pom.loginPage();
            await loginPageObj.loginToPortal(USERS.PERFORMANCE_GLITCH.username, constants.password)
        });

        await test.step('login with performance glitch username & password credentials', async () => {
            const productListPage = await pom.listPage();
            await expect(productListPage.pageTitle).toContainText('Products');
            await expect(productListPage.cartIcon).toBeVisible();

        });
        logger.info('Invalid password error validation');
    })

    test('Error User Login and Basic Functionality', async ({ page, pom }) => {
       
        await test.step('Login with error_user', async () => {
            const loginPageObj = await pom.loginPage();
            await loginPageObj.loginToPortal(USERS.ERROR.username, constants.password);
        });

        await test.step('Verify add to cart functionality works', async () => {
            const prodListPageObj = await pom.listPage();
            await prodListPageObj.addProductToCart('Sauce Labs Backpack');
            const cartCount = await prodListPageObj.getCartCount();
            expect(cartCount).toBe(1);
        });

        await test.step('Verify cart functionality', async () => {
            const prodListPageObj = await pom.listPage();
            await prodListPageObj.clickOnCart();

            const cartPageObj = await pom.cartPage();
            const cartCount = await cartPageObj.getCartCount();
            expect(cartCount).toBe(1);
        });

        logger.info("Error user test passed");
    });

});


test.describe('login & logut scenarios',() =>
{

    test('Menu - Logout Behavior', async ({ page, pom }) => {
        const loginPageObj = await pom.loginPage();
        await loginPageObj.loginToPortal(constants.username, constants.password);

        await test.step('Open sidebar menu', async () => {
            const prodListPageObj = await pom.listPage();
            await prodListPageObj.openMenu();
            await expect(page.locator('nav')).toBeVisible();
        });

        await test.step('Click logout link', async () => {
            const prodListPageObj = await pom.listPage();
            await prodListPageObj.logout();
        });

        await test.step('Verify logout and return to login page', async () => {
            await expect(page).toHaveURL(constants.stg_url);
            const newLoginPageObj = await pom.loginPage();
            await expect(newLoginPageObj.usernameInput).toBeVisible();
            await expect(newLoginPageObj.passwordInput).toBeVisible();
        });

        await test.step('Verify protected pages require login', async () => {
            await page.goto('https://www.saucedemo.com/inventory.html');
            await expect(page).toHaveURL(constants.stg_url);
        });

        logger.info("Menu - Logout test passed");
    });
})