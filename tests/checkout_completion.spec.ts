import { test } from '../fixtures/pages.fixture'
import { expect } from '@playwright/test'
import logger from '../utils/LoggerUtils'
import * as constants from '../testData/constant'
import { ProductListPage } from '../page-objects/productListPage'
import { PRODUCTS } from '../testData/products'


test.describe('Order complete Page validation ', () => {
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


    test('Verify checkout step two, overview & cmpletion page @sanity', async ({ page }, testInfo) => {

        await test.step('Verify cart items count in step two', async () => {

                await expect(checkOutPageObj.pageTitle).toContainText('Checkout: Overview');
                await expect(checkOutPageObj.cartItems).toHaveCount(2);

        });

          await test.step('Complete purchase', async () => {
            await checkOutPageObj.clickFinish();
            await expect(checkOutPageObj.thankYouMessage).toBeVisible();
            //await page.screenshot({ path: `./snapshots/` + Date.now() + `- ${testInfo.title}.png` })
          });

          await test.step('Generate PDF Order', async () => {
                const pdfVisible = await checkOutPageObj.pdfBtn.isVisible().catch(() => false);

                if(pdfVisible){
                    const [download] = await Promise.all([
                            page.waitForEvent('download').catch(() => null),
                            await checkOutPageObj.pdfBtn.click()
                    ]);

                    if(download){
                        const fileName = download.suggestedFilename();
                        expect(fileName).toBeTruthy();
                        logger.info(`PDF Generated : ${fileName}`);
                    }
                }else{
                    logger.info("PDF button not visible on completion page")
                }
          });

          logger.info("complete purchase verification passed")

    });


    test.only('Complete checkout & verify cart reset @sanity', async ({ page }, testInfo) => {

        await test.step('Verify cart items count in step two', async () => {

                await expect(checkOutPageObj.pageTitle).toContainText('Checkout: Overview');
                await expect(checkOutPageObj.cartItems).toHaveCount(2);

        });
        
          await test.step('Complete purchase', async () => {
            await checkOutPageObj.clickFinish();
            await expect(checkOutPageObj.thankYouMessage).toBeVisible();
            //await page.screenshot({ path: `./snapshots/` + Date.now() + `- ${testInfo.title}.png` })
          });

          await test.step('Click Back Home button & verify cart', async () => {
            await checkOutPageObj.clickBackToProducts();
            const cartCount = await prodListPageObj.getCartCount();
            expect(cartCount).toBeNull();
          });

          logger.info("complete purchase verification passed")

    });



})
