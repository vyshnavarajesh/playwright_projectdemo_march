import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class ProductListPage extends BasePage {

    readonly page: Page
    readonly pageName: Locator
    readonly productNames: Locator
    readonly productPrice: Locator

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.pageName = page.locator('.title');
        this.productNames = page.locator('.inventory_item_name');
        this.productPrice = page.locator('.inventory_item_price')

    }

    async getProductsPageName(): Promise<string | null> {
        return await this.pageName.textContent();
    }

    async addProductToCart(itemName: string) {
        // Finds the product by item name in product list page
        const productName = this.page.locator('.inventory_item').filter({
            has: this.page.locator('.inventory_item_name').filter({ hasText: itemName })
        });

        // click to add to cart Button
        await productName.locator('.button').first().click();
    }


    async removeProductFromCart(itemName: string) {
        const productName = this.page.locator('.inventory_item').filter({
            has: this.page.locator('.inventory_item_name').filter({ hasText: itemName })
        });
        // click to remove Button
        await productName.locator('.button').first().click();
    }

}

/* Test Cases */
//Sorting products
// Adding products to cart
// removing products from cart
// Add multiple products to cart
// Validate content in the cart
// Based on the user list validate the content
// reset App & refresh
// product details verification