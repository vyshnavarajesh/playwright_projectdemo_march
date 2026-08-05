import { test as base, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import * as constants from '../testData/constant';
import logger from '../utils/LoggerUtils';


type PagesFixtures = {
    pom: PageManager;
    authenticatedPage: PageManager;
};

export const test = base.extend<PagesFixtures>({
   // Basic pageManager without Auth
    pom: async ({ page }, use) => {
        const pageManager = new PageManager(page);
        await use(pageManager);
    },
});

//export { expect };