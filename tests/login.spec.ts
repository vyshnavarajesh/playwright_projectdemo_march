import{test} from '../fixtures/pages.fixture'
import { expect } from '@playwright/test'
import logger  from '../utils/LoggerUtils'
import * as constants from '../testData/constant'
import { INVALID_CREDENTIALS, USERS } from '../testData/users'

test.describe('login and authentication test for standard type', () =>{

    test.beforeEach(async ({page}) => {
        await page.goto(constants.stg_url);
    })

    //Positive flow - standard username & password
    test('successful login with Standard user', async({page,pom}) =>{

        await test.step('verify login page is displayed', async() =>{
                const loginPageObj = await pom.loginPage();
                await loginPageObj.verifyLoginPageDisplayed();
        });

        await test.step('verify login with standard credentials', async() =>{
            const loginPageObj = await pom.loginPage();
            await loginPageObj.loginToPortal(constants.username,constants.password)
        });

        logger.info('Standard user login successful')
    })

    test('login failure with invalid user', async({page,pom}) =>{

        await test.step('login with invalid credentials', async() =>{
            const loginPageObj = await pom.loginPage();
           //await loginPageObj.loginToPortal('invalid_user',constants.password)
                await loginPageObj.usernameInput.fill('invaliduser');
                await loginPageObj.passwordInput.fill(constants.password);
                await loginPageObj.loginButton.click();
            
        });

        await test.step('verify error message for invalid credentials', async() =>{
            await expect(page).toHaveURL(constants.stg_url);
            const loginPageObj = await pom.loginPage();
            await loginPageObj.verifyErrorMessageDisplayed('Epic sadface: Username and password do not match any user in this service')
        });

        logger.info('Invalid username error validation')
    })

    test('login failure with invalid password', async({page,pom}) =>{

        await test.step('login with invalid credentials', async() =>{
            const loginPageObj = await pom.loginPage();
           //await loginPageObj.loginToPortal('invalid_user',constants.password)
                await loginPageObj.usernameInput.fill(constants.username);
                await loginPageObj.passwordInput.fill(INVALID_CREDENTIALS.EMPTY_PASSWORD.password);
                await loginPageObj.loginButton.click();
            
        });

        await test.step('verify error message for invalid credentials', async() =>{
            await expect(page).toHaveURL(constants.stg_url);
            const loginPageObj = await pom.loginPage();
            await loginPageObj.verifyErrorMessageDisplayed(INVALID_CREDENTIALS.EMPTY_PASSWORD.expectedError);
        });

        logger.info('Invalid password error validation')
    })
   
    test('login with performance glitch user', async({page,pom}) =>{

        await test.step('login with performance glitch username & password credentials', async() =>{
            const loginPageObj = await pom.loginPage();
            await loginPageObj.loginToPortal(USERS.PERFORMANCE_GLITCH.username,constants.password)
        });

        await test.step('login with performance glitch username & password credentials', async() =>{
           const productListPage = await pom.listPage();
           await expect(productListPage.pageTitle).toContainText('Products');
           await expect(productListPage.cartIcon).toBeVisible();

        });
        logger.info('Invalid password error validation');
    })


})