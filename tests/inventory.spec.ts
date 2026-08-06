import { test } from '../fixtures/pages.fixture'
import { expect } from '@playwright/test'
import logger from '../utils/LoggerUtils'
import * as constants from '../testData/constant'

test.beforeEach(async ({ page,authenticatedPage : pom }) => {
  // Here authenticated page fixture wull handle login automatically
  // we can simply use pom (page Manager) & page for building test cases 
})


test.describe('Inventory & product details validation', () => {

    test('view Product list on inventory page', async ({ page, authenticatedPage : pom }) => {

        await test.step('verify product list page with all 6 products', async () => {
            const prodListPageObj = await pom.listPage();
            await expect(prodListPageObj.pageTitle).toContainText('Products');

            for(const productInfo of constants.PRODUCT_NAMES){
                const productItem = prodListPageObj.getProductItemByName(productInfo);
                await expect(productItem).toBeVisible();
            }
        });

        await test.step('verify each product has required elements', async () => {
            const prodListPageObj = await pom.listPage();
            const productItems = await prodListPageObj.getAllInventoryItems();
            await expect(productItems.length).toBe(6);

            for(const item of productItems){
                await expect(item.locator('img')).toBeVisible();
                await expect(item.locator('.inventory_item_name')).toBeVisible();
                await expect(item.locator('.inventory_item_desc')).toBeVisible();
                await expect(item.locator('.inventory_item_price')).toBeVisible();
                await expect(item.locator('button:has-text("Add to cart")')).toBeVisible();
            }

        });

        logger.info('product list verification successful')
    });


    test('view Product info for one product in inventory page', async ({ page, authenticatedPage : pom }) => {

        await test.step('verify Sauce Labs Bike Light info', async () => {
            const prodListPageObj = await pom.listPage();
            await expect(prodListPageObj.pageTitle).toContainText('Products');
            const bikeInfo = prodListPageObj.getProductItemByName(constants.PRODUCT_NAMES[1]);
            await expect(bikeInfo.locator('.inventory_item_name')).toContainText('Sauce Labs Bike Light');
            await expect(bikeInfo.locator('.inventory_item_desc')).toContainText(`A red light isn't the desired state in testing`);
            await expect(bikeInfo.locator('.inventory_item_price')).toContainText('$9.99');
        });

        logger.info('product info verification successful')
    });

    test('sort product details By (A to Z)', async ({ page, authenticatedPage : pom }) => {

        await test.step('verify product are sorted alphabetically ', async () => {
            const prodListPageObj = await pom.listPage();
            const productNames = await prodListPageObj.inventoryName.allTextContents();

            const expectedProductOrder = constants.PRODUCT_NAMES;

            for(let i=0; i < productNames.length ; i++){
                expect(productNames[i]).toContain(expectedProductOrder[i]);
            }
           
        });
        logger.info('product sort A to Z  verification successful')
    });

    test('sort product details By (Z to A)', async ({ page, authenticatedPage : pom }) => {

        await test.step('verify product are sorted alphabetically ', async () => {
            const prodListPageObj = await pom.listPage();
            await prodListPageObj.sortByNameZA();

            //const productNames = await prodListPageObj.inventoryName.allTextContents();
            const productNames = await page.locator('.inventory_item_name').allTextContents();
            const expectedProductOrder = constants.ztoAPRODUCT_NAMES;

            for(let i=0; i < productNames.length ; i++){
                expect(productNames[i]).toEqual(expectedProductOrder[i]);
                logger.info(`${productNames[i]} => ${expectedProductOrder[i]}`);
            }
           
        });
        logger.info('product list sort Z to A successful')
    });

    test('sort product details By (High to Low)', async ({ page, authenticatedPage : pom }) => {

        await test.step('select High To Low Dropdown ', async () => {
            const prodListPageObj = await pom.listPage();
            await prodListPageObj.sortByPriceHighLow();
        })

        await test.step('verify product are sorted by high to low' , async() => {
            //const productNames = await prodListPageObj.inventoryName.allTextContents();
            const productItems = await page.locator('.inventory_item').all();
            const prices : number[] =[];

            for(const item of productItems){
                const priceText = await item.locator('.inventory_item_price').textContent();
                const price = parseFloat(priceText?.replace('$','') || '0');
                logger.info(`${price}`);
                prices.push(price);
            }

            for(let i=1; i < prices.length;i++){
                expect(prices[i]).toBeLessThanOrEqual(prices[i-1]);
            }

            expect(prices[0]).toBe(49.99);
            expect(prices[prices.length -1]).toBe(7.99);
           
        });

        logger.info('product list sort high to Low successful')
    });

    test.only('sort product details By (Low to High)', async ({ page, authenticatedPage : pom }) => {

        await test.step('select Low To High Dropdown ', async () => {
            const prodListPageObj = await pom.listPage();
            await prodListPageObj.sortByPriceLowHigh();
        })

        await test.step('verify product are sorted by high to low' , async() => {
            //const productNames = await prodListPageObj.inventoryName.allTextContents();
            const productItems = await page.locator('.inventory_item').all();
            const prices : number[] =[];

            for(const item of productItems){
                const priceText = await item.locator('.inventory_item_price').textContent();
                const price = parseFloat(priceText?.replace('$','') || '0');
                logger.info(`${price}`);
                prices.push(price);
            }

            for(let i=1; i < prices.length;i++){
                expect(prices[i]).toBeGreaterThanOrEqual(prices[i-1]);
            }

            expect(prices[0]).toBe(7.99);
            expect(prices[prices.length -1]).toBe(49.99);
           
        });

        logger.info('product list sort high to Low successful')
    });


})
