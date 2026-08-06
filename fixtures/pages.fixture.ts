import { test as base, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import * as constants from '../testData/constant';
import logger from '../utils/LoggerUtils';


type PagesFixtures = {
    pom: PageManager;
    authenticatedPage: PageManager;
    authenticatedPageWithErrorUser : PageManager;
};

export const test = base.extend<PagesFixtures>({
   // Basic pageManager without Auth
    pom: async ({ page }, use) => {
        const pageManager = new PageManager(page);
        await use(pageManager);
    },

    authenticatedPage: async({page},use) =>{
        await page.goto(constants.stg_url);
        const pageManager = new PageManager(page);
        const loginPageObj = await pageManager.loginPage();
        await loginPageObj.loginToPortal(constants.username, constants.password);
        await use(pageManager);
    },

   /* authenticatedPageWithErrorUser: async({page},use) =>{
        await page.goto(constants.stg_url);
        const pageManager = new PageManager(page);
        const loginPageObj = await pageManager.loginPage();
        await loginPageObj.loginToPortal("error_user", constants.password);
        await use(pageManager);
    }
    */
});

export {expect};