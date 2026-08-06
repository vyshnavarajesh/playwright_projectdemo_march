import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./basePage";
import { PRODUCTS, ALL_PRODUCTS, Product } from "../testData/products";
import logger from "../utils/LoggerUtils";

export class ProductListPage extends BasePage {

    readonly inventoryContainer: Locator;
    readonly inventoryList: Locator;
    readonly inventoryItems: Locator;
    readonly sortContainer: Locator;
    readonly inventoryName : Locator;

    constructor(page: Page) {
        super(page);
        this.inventoryContainer = this.page.locator('.inventory_container');
        this.inventoryList = this.page.locator('[data-test="inventory-list"]');
        this.inventoryItems = this.page.locator('[data-test="inventory-item"]');
        this.sortContainer = this.page.locator('select.product_sort_container');
        this.inventoryName = this.page.locator('inventory_item_name');
    }


    async getProductsPageTitle(): Promise<string | null> {
        try {
            const inventoryVisible = await this.inventoryList.isVisible({ timeout: 2000 }).catch(() => false);

            if (inventoryVisible) {
                await this.inventoryList.waitFor({ state: 'visible', timeout: 5000 });
                await this.pageTitle.waitFor({ state: 'visible', timeout: 5000 });
                const title = await this.pageTitle.textContent({ timeout: 2000 });
                return title?.trim() || null;
            }
            const cartVisible = await this.page.locator('.cart_list').isVisible({ timeout: 2000 }).catch(() => false);
            if (cartVisible) {
                const title = await this.pageTitle.textContent({ timeout: 2000 });
                return title?.trim() || null;
            }
            const title = await this.pageTitle.textContent({ timeout: 2000 }).catch(() => null);
            return title?.trim() || null;

        } catch (error) {
            logger.warn(`Failed to get page title: ${error}`);
            return null;
        }
    }

    async getProductsPageName(): Promise<string | null> {
        return await this.getProductsPageTitle();
    }

    async verifyInventoryPageLoaded() {
        await this.pageTitle.waitFor({ state: 'visible' });
        await expect(this.pageTitle).toContainText('Products');
        await this.inventoryList.waitFor({ state: 'visible' });
        logger.info('Inventory page fully loaded');
    }

    async getAllProducts(): Promise<Product[]> {
        await this.inventoryItems.first().waitFor({ state: 'visible' });
        const count = await this.inventoryItems.count();
        logger.info(`Found ${count} products on inventory page`);
        return ALL_PRODUCTS.slice(0, count);
    }

    async getProductByName(productName: string): Promise<Product | undefined> {
        const product = ALL_PRODUCTS.find(p =>
            p.name.toLowerCase() === productName.toLowerCase()
        );
        if (!product) {
            logger.warn(`Product not found: ${productName}`);
        }
        return product;
    }


    async getAllProductNames(): Promise<string[]> {
        const names = await this.page.locator('[data-test="inventory-item-name"]').allTextContents();
        return names.map(name => name.trim());
    }


    getProductItemByName(productName: string): Locator {
        return this.page.locator('.inventory_item').filter({
            has: this.page.locator('.inventory_item_name').filter({ hasText: productName })
        });
    }


    getProductImage(index: number): Locator {
        return this.page.locator('.inventory_item img').nth(index);
    }

    async getAllInventoryItems(): Promise<Locator[]> {
        return await this.page.locator('.inventory_item').all();
    }


    async addProductToCart(productName: string) {
        try {
            const product = await this.getProductByName(productName);
            if (!product) {
                throw new Error(`Product not found: ${productName}`);
            }

            logger.info(`Looking for add-to-cart button with data-test: ${product.dataTestId}`);
            const addButton = this.page.locator(`button[data-test="${product.dataTestId}"]`);

            await addButton.click({ timeout: 10000 });
            logger.info(`Clicked add-to-cart button for: ${productName}`);

            await this.page.waitForTimeout(1000);

            logger.info(`Added "${productName}" to cart`);
        } catch (error) {
            logger.error(`Failed to add product to cart: ${error}`);
            throw error;
        }
    }


    async removeProductFromCart(productName: string) {
        try {
            const product = await this.getProductByName(productName);
            if (!product) {
                throw new Error(`Product not found: ${productName}`);
            }

            // Remove button has different data-test ID pattern
            const removeTestId = product.dataTestId.replace('add-to-cart-', 'remove-');
            const removeButton = this.page.locator(`button[data-test="${removeTestId}"]`);

            await removeButton.click({ timeout: 10000 });
            logger.info(`Removed "${productName}" from cart`);
        } catch (error) {
            logger.error(`Failed to remove product from cart: ${error}`);
            throw error;
        }
    }

    async removeSingleProductFromCart(productName: string) {
        return await this.removeProductFromCart(productName);
    }

    async proceedToCart() {
        await this.goToCart();
        logger.info('Proceeded to cart from inventory');
    }

    async clickOnCart() {
        return await this.goToCart();
    }

    async getInventoryCartCount(): Promise<number | null> {
        const count = await this.getCartCount();
        logger.info(`Current cart count: ${count}`);
        return count;
    }

    async verifyCartCount(expectedCount: number) {
        const actualCount = await this.getCartCount();
        expect(actualCount).toBe(expectedCount);
        logger.info(`Cart count verified: ${actualCount} items`);
    }

    //Sort functions
    async sortProducts(sortOption: string) {
        try {
            await this.sortContainer.selectOption(sortOption);
            logger.info(`Sorted products by: ${sortOption}`);
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            logger.error(`Failed to sort products: ${error}`);
            throw error;
        }
    }

    async sortByNameAZ() {
        await this.sortProducts('az');
    }

    async sortByNameZA() {
        await this.sortProducts('za');
    }

    async sortByPriceLowHigh() {
        await this.sortProducts('lohi');
    }

    async sortByPriceHighLow() {
        await this.sortProducts('hilo');
    }


    async verifyProductDisplayed(productName: string) {
        const product = await this.getProductByName(productName);
        if (!product) {
            throw new Error(`Product not found in data: ${productName}`);
        }

        const productRow = this.inventoryItems.filter({
            has: this.page.locator('[data-test="inventory-item-name"]').filter({ hasText: productName })
        });

        await expect(productRow).toBeVisible();
        logger.info(`Product verified as displayed: ${productName}`);
    }


    async verifyAllProductsDisplayed() {
        const products = await this.getAllProducts();
        for (const product of products) {
            await this.verifyProductDisplayed(product.name);
        }
        logger.info(`All ${products.length} products verified as displayed`);
    }

    getInventoryItemContainer(): Locator {
        return this.page.locator('.inventory_item_container');
    }
    getInventoryContainerElement(): Locator {
        return this.inventoryContainer;
    }

    async getProductName(productName: string): Promise<string> {
        const item = this.getProductItemByName(productName);
        const name = await item.locator('.inventory_item_name').textContent();
        return name?.trim() || '';
    }


    async getProductPrice(productName: string): Promise<string> {
        const item = this.getProductItemByName(productName);
        const price = await item.locator('.inventory_item_price').textContent();
        return price?.trim() || '';
    }


    async getProductDescription(productName: string): Promise<string> {
        const item = this.getProductItemByName(productName);
        const description = await item.locator('.inventory_item_desc').textContent();
        return description?.trim() || '';
    }

    async getProductDetails(productName: string): Promise<{ name: string, price: string, description: string }> {
        return {
            name: await this.getProductName(productName),
            price: await this.getProductPrice(productName),
            description: await this.getProductDescription(productName)
        };
    }
}
/* Test Cases */
// Sorting products
// Adding products to cart
// removing products from cart
// Add multiple products to cart
// Validate content in the cart
// Based on the user list validate the content
// reset App & refresh
// product details verification