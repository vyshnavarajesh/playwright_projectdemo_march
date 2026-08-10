import { test } from '../fixtures/pages.fixture'
import { expect } from '@playwright/test'
import logger from '../utils/LoggerUtils'
import * as constants from '../testData/constant'
import { ProductListPage } from '../page-objects/productListPage'
import { PRODUCTS } from '../testData/products'


test.describe('Checkout Page validation ', () => {
    // Declare shared page object variables at the describe scope
    let prodListPageObj: any;
    let cartListPageObj: any;
    let checkOutPageObj: any;

    test.beforeEach(async ({ page, authenticatedPage: pom }) => {

        //Initialize the page objects once for every test
        prodListPageObj = await pom.listPage();
        cartListPageObj = await pom.cartPage();
        checkOutPageObj = await pom.checkOutPage();

        await prodListPageObj.addProductToCart(PRODUCTS.BACKPACK.name);
        await prodListPageObj.addProductToCart(PRODUCTS.BIKE_LIGHT.name);
        await prodListPageObj.clickOnCart();
        await cartListPageObj.proceedToCheckout();

        const fields = checkOutPageObj.getFormFields();
            for(const field of fields){
                await expect(field).toBeVisible();
            }
            await checkOutPageObj.fillCheckoutFormWithDefaultData();
            await checkOutPageObj.continueToCheckout();
            await expect(page).toHaveURL(/checkout-step-two/);
    })


    test('Verify checkout step two overview @sanity', async ({ page }, testInfo) => {

        await test.step('Verify cart items count in step two', async () => {

                await expect(checkOutPageObj.pageTitle).toContainText('Checkout: Overview');
                await expect(checkOutPageObj.cartItems).toHaveCount(2);

        });

        await test.step('Verify order summary section in step two', async () => {
            const cartItems = await checkOutPageObj.getCartItems();

            const firstItem = cartItems[0];
            await expect(firstItem.locator('.inventory_item_name')).toBeVisible();
            await expect(firstItem.locator('.inventory_item_desc')).toBeVisible();
            await expect(firstItem.locator('.inventory_item_price')).toBeVisible();
        });

        await test.step('Verify sauce Labs Backpack details in step two', async () => {
            const backPackItem = await checkOutPageObj.getCartItemByName(PRODUCTS.BACKPACK.name);

            await expect(backPackItem.locator('.inventory_item_name')).toContainText('Sauce Labs Backpack');
            await expect(backPackItem.locator('.inventory_item_price')).toContainText('$29.99');

        });

        await test.step('Verify sauce Labs BikeLight details in step two', async () => {
            const bikeLightItem = await checkOutPageObj.getCartItemByName(PRODUCTS.BIKE_LIGHT.name);

            await expect(bikeLightItem.locator('.inventory_item_name')).toContainText('Sauce Labs Bike Light');
            await expect(bikeLightItem.locator('.inventory_item_price')).toContainText('$9.99');
        });


        await test.step('Verify SHIPPING INFO in step two', async () => {
           const shippingMethod = await checkOutPageObj.getShippingInfo();
           expect(shippingMethod).toContain('Free Pony Express Delivery');
        });

        await test.step('Verify Payment INFO in step two', async () => {
            const shippingMethod = await checkOutPageObj.getPaymentInfo();
            expect(shippingMethod).toContain('SauceCard #31337');
         });

         //This is hardcode price validation not recommended
         await test.step('Verify Price Calculation', async () => {
           await expect(checkOutPageObj.itemTotalLabel).toContainText('$39.98');
           await expect(checkOutPageObj.taxLabel).toContainText('$3.20');
           await expect(checkOutPageObj.totalLabel).toContainText('$43.18');
         });

         //dynamic data validation
         await test.step('Verify tax Calculation is correct', async () => {
               const itemTotalText = await checkOutPageObj.getItemTotal();
               const itemTotal = parseFloat(itemTotalText?.replace('$','')|| '0');

               const taxText = await checkOutPageObj.getTaxAmount();
               const tax = parseFloat(taxText?.replace('$','')|| '0');

               const expectedTax = itemTotal * 0.08;
               expect(Math.round(tax * 100)).toEqual(Math.round(expectedTax*100));

          });

          await test.step('Complete purchase', async () => {
            await checkOutPageObj.clickFinish();
            await expect(checkOutPageObj.thankYouMessage).toBeVisible();
            await page.screenshot({ path: `./snapshots/` + Date.now() + `- ${testInfo.title}.png` })
          });

          logger.info("complete purchase verification passed")


    });


})
