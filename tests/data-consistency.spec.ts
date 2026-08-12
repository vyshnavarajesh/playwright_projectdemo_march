import { test } from '../fixtures/pages.fixture'
import { expect } from '@playwright/test'
import logger from '../utils/LoggerUtils'
import * as constants from '../testData/constant'
import { ProductListPage } from '../page-objects/productListPage'
import { PRODUCTS } from '../testData/products'


test.describe('Product info consistency - Inventory to cart & checkout ', () => {
    // Declare shared page object variables at the describe scope
    let prodListPageObj: any;
    let cartListPageObj: any;
    let checkOutPageObj: any;


    test('Initiate checkout from cart page & fill only lastName & postalCode for error vaidation @regression', async ({ page, authenticatedPage:pom }, testInfo) => {
       
        await test.step('capture sauce Labs Backpack from inventory', async () => {

            prodListPageObj = await pom.listPage();
            cartListPageObj = await pom.cartPage();
            checkOutPageObj = await pom.checkOutPage();

            const inventoryProductDetails = await prodListPageObj.getProductDetails(PRODUCTS.BACKPACK.name);
            logger.info(`Inventory details of the product ${JSON.stringify(inventoryProductDetails)}`);

            (test as any).inventoryProductDetails = inventoryProductDetails;
        });

        await test.step('Add sauce Labs Backpack to the cart & verify product details in cart Page', async () => {
            await prodListPageObj.addProductToCart(PRODUCTS.BACKPACK.name);
            await prodListPageObj.clickOnCart();
            const cartProductDetails = await cartListPageObj.getcartProductDetails(PRODUCTS.BACKPACK.name)
            logger.info(`cart Product details of the product ${JSON.stringify(cartProductDetails)}`);

            const inventoryProductDetails = (test as any).inventoryProductDetails;

            expect(cartProductDetails.name).toBe(inventoryProductDetails.name);
            expect(cartProductDetails.price).toBe(inventoryProductDetails.price);
            expect(cartProductDetails.description).toBe(inventoryProductDetails.description);

            //Proceed to Checkout Page
            await cartListPageObj.proceedToCheckout();
            await expect(page).toHaveURL(/checkout-step-one/);
        });

        await test.step('verify product details in checkout overview Page', async () => {

            const fields = checkOutPageObj.getFormFields();
            for(const field of fields){
                await expect(field).toBeVisible();
            }
            await checkOutPageObj.fillCheckoutFormWithDefaultData();
            await checkOutPageObj.continueToCheckout();
            await expect(page).toHaveURL(/checkout-step-two/);

            const overviewProductDetails = await checkOutPageObj.getcartProductDetails(PRODUCTS.BACKPACK.name)
            logger.info(`checkout Product details of the product ${JSON.stringify(overviewProductDetails)}`);

            const inventoryProductDetails = (test as any).inventoryProductDetails;

            expect(overviewProductDetails.name).toBe(inventoryProductDetails.name);
            expect(overviewProductDetails.price).toBe(inventoryProductDetails.price);
            expect(overviewProductDetails.description).toBe(inventoryProductDetails.description);

            

            
        });
    
    });

})
