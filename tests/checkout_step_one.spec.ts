import { test } from '../fixtures/pages.fixture'
import { expect } from '@playwright/test'
import logger from '../utils/LoggerUtils'
import * as constants from '../testData/constant'
import { ProductListPage } from '../page-objects/productListPage'
import { PRODUCTS } from '../testData/products'


test.describe('Checkout Page validation ', () => {

    let prodListPageObj: any;
    let cartListPageObj: any;
    let checkOutPageObj: any;

    test.beforeEach(async ({ page, authenticatedPage: pom }) => {
        prodListPageObj = await pom.listPage();
        cartListPageObj = await pom.cartPage();
        checkOutPageObj = await pom.checkOutPage();

        await prodListPageObj.addProductToCart(PRODUCTS.BACKPACK.name);
        await prodListPageObj.addProductToCart(PRODUCTS.BIKE_LIGHT.name);

        // alternative approach
        /*
            const productsToAdd = [PRODUCTS.BACKPACK.name, PRODUCTS.BIKE_LIGHT.name, PRODUCTS.BOLT_SHIRT.name];
         
                     for (const productName of productsToAdd) {
                         await prodListPageObj.addProductToCart(productName);
                         logger.info(`Added ${productName} from product listing`)
             }
         */
    })


    test('Initiate checkout from cart page & fill only lastName & postalCode for error vaidation', async ({ page }, testInfo) => {
        // Navigate to CartPage
        await test.step('Navigate to cart & checkout', async () => {

            await prodListPageObj.clickOnCart();
            const cartPageName = await cartListPageObj.getProductsPageName();
            await expect(cartPageName).toBe('Your Cart');
            // Proceed to Checkout Page
            await cartListPageObj.proceedToCheckout();
            await expect(page).toHaveURL(/checkout-step-one/);

        });

        await test.step('verify all the elements checkout step one form is displayed ', async () => {
            await expect(checkOutPageObj.firstName).toBeVisible();
            await expect(checkOutPageObj.lastName).toBeVisible();
            await expect(checkOutPageObj.postalCode).toBeVisible();
        });

        await test.step('fill lastName & postal code, keep firstName empty ', async () => {

            await checkOutPageObj.enterLastNameInCheckout(constants.checkout_lastName);
            await checkOutPageObj.enterPostalCodeInCheckout(constants.checkout_postalCode);
            await checkOutPageObj.continueToCheckout();

            const errorMessage = await checkOutPageObj.getErrorText();
            expect(errorMessage).toBe(constants.checkout_firstName_errorMessage);
            await page.screenshot({ path: `./snapshots/` + Date.now() + `- ${testInfo.title}.png` })

        });
    });

    test('Initiate checkout from cart page & fill only firstName & lastName for error validation', async ({ page }, testInfo) => {

        // Navigate to CartPage
        await test.step('Navigate to cart & checkout', async () => {

            await prodListPageObj.clickOnCart();
            const cartPageName = await cartListPageObj.getProductsPageName();
            await expect(cartPageName).toBe('Your Cart');
            // Proceed to Checkout Page
            await cartListPageObj.proceedToCheckout();
            await expect(page).toHaveURL(/checkout-step-one/);

        });

        await test.step('verify all the elements checkout step one form is displayed', async () => {
            // Verify all the elements checkout step one form is displayed in test case one is repleaced with one function
            await expect(await checkOutPageObj.checkOutElementsAreVisible()).toBe(true);
        });

        await test.step('fill lastName & firstName code, keep postcode empty for error validation', async () => {

            await checkOutPageObj.enterFirstNameInCheckout(constants.checkout_firstName);
            await checkOutPageObj.enterLastNameInCheckout(constants.checkout_lastName);
            await checkOutPageObj.continueToCheckout();

            const errorMessage = await checkOutPageObj.getErrorText();
            expect(errorMessage).toBe(constants.checkout_PostalCode_errorMessage);
            await page.screenshot({ path: `./snapshots/` + Date.now() + `- ${testInfo.title}.png` })

        });
    });

    test.only('Initiate checkout from cart page & fill only firstName & postalCode', async ({ page}, testInfo) => {

        await test.step('Navigate to cart & checkout', async () => {

            await prodListPageObj.clickOnCart();
            const cartPageName = await cartListPageObj.getProductsPageName();
            await expect(cartPageName).toBe('Your Cart');
            // Proceed to Checkout Page
            await cartListPageObj.proceedToCheckout();
            await expect(page).toHaveURL(/checkout-step-one/);

        });

        await test.step('verify all the elements checkout step one form is displayed', async () => {
            // Verify all the elements checkout step one form is displayed in test case one is repleaced with one function
            await expect(await checkOutPageObj.checkOutElementsAreVisible()).toBe(true);
        });

        await test.step('fill firstName & postal code, keep lastName empty for error validation', async () => {
            await checkOutPageObj.enterFirstNameInCheckout(constants.checkout_firstName);
            await checkOutPageObj.enterPostalCodeInCheckout(constants.checkout_postalCode);
            await checkOutPageObj.continueToCheckout();

            const errorMessage = await checkOutPageObj.getErrorText();
            expect(errorMessage).toBe(constants.checkout_lastName_errorMessage);
            await page.screenshot({ path: `./snapshots/` + Date.now() + `- ${testInfo.title}.png` })

        });
    });


    test.only('Initiate checkout from cart page & fill all fields with empty data', async ({ page}, testInfo) => {

        await test.step('Navigate to cart & checkout', async () => {

            await prodListPageObj.clickOnCart();
            const cartPageName = await cartListPageObj.getProductsPageName();
            await expect(cartPageName).toBe('Your Cart');
            // Proceed to Checkout Page
            await cartListPageObj.proceedToCheckout();
            await expect(page).toHaveURL(/checkout-step-one/);

        });

        await test.step('verify all the elements checkout step one form is displayed', async () => {
            // Verify all the elements checkout step one form is displayed in test case one is repleaced with one function
            await expect(await checkOutPageObj.checkOutElementsAreVisible()).toBe(true);
        });

        await test.step('fill firstName & postal code, keep lastName empty for error validation', async () => {
            await checkOutPageObj.enterFirstNameInCheckout('');
            await checkOutPageObj.enterLastNameInCheckout('');
            await checkOutPageObj.enterPostalCodeInCheckout('');
            await checkOutPageObj.continueToCheckout();

            const errorMessage = await checkOutPageObj.getErrorText();
            expect(errorMessage).toBe(constants.checkout_firstName_errorMessage);
            await page.screenshot({ path: `./snapshots/` + Date.now() + `- ${testInfo.title}.png` })

        });
    });


})
