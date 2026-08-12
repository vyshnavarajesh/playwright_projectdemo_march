import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";
import logger from "../utils/LoggerUtils";

export class CartPage extends BasePage {

    readonly page: Page
    readonly cartPageName: Locator
    readonly cartCheckoutButton: Locator
    readonly continueShoppingButton: Locator
    readonly cartItems : Locator
    readonly cartItem : Locator


    constructor(page: Page) {
        super(page);
        this.page = page;
        this.cartPageName = page.locator('.title');
        this.cartCheckoutButton = page.getByTestId('checkout');
        this.continueShoppingButton = page.getByTestId('continue-shopping');
        this.cartItems = page.locator('.cart_item');
        this.cartItem = this.cartItems;

    }

    async getcartPageName(): Promise<string | null> {
        return await this.cartPageName.textContent();
    }

    async proceedToCheckout() {
        await this.cartCheckoutButton.click();
        await this.page.waitForURL(/checkout-step-one/);
    }

    async proceedToContinueShopping() {
        await this.continueShoppingButton.click();
        await this.page.waitForURL(/inventory/);
    }

    /*
    async getCartItemCount(): Promise<number> {
       const count = await this.cartItems.count();
       return count;
    }
    */


    //Validates products in cart & returns boolean
    async isProductInCart(productName: string): Promise<boolean> {
        try {
            // finding cart item by Name 
            const cartItem = this.cartItems.filter({
                has: this.page.getByTestId('inventory-item-name').filter({ hasText: productName })
            });

            const isVisible = await cartItem.first().isVisible();
            return isVisible;
        }
        catch {
            return false;
        }
    }

    //Validates products in the cart & returns string or null
    async itemsInCartPage(productName: string): Promise<string | null> {
        try {
            // finding cart item by Name 
            const cartItem = this.cartItems.filter({
                has: this.page.getByTestId('inventory-item-name').filter({ hasText: productName })
            });

            const isVisible = await cartItem.first().isVisible();
            if(isVisible){
                const itemName = await cartItem.locator('.inventory_item_name').textContent();
                logger.info(`Found ${itemName} item in the cart`);
                return itemName?.trim() || null;
            }
            return null;
        }
        catch(error) {
            logger.info(`Item not found in the cart page : ${productName}`);
            return null;
        }
    }

    async getproductPriceInCart(productName : string): Promise<number | null> {
       try{
            const cartItem = this.cartItems.filter({
                has: this.page.getByTestId('inventory-item-name').filter({ hasText: productName })
            });

            const priceText = await this.cartItem.locator('.inventory_item_price').textContent();
           
            if(priceText){
                return parseFloat(priceText.replace('$',''));
            }
            return null;
       }catch(error){
        return null;
       }
     }
 
     async removeProductFromCart(productName : string) {
        try{
             const cartItem = this.cartItems.filter({
                 has: this.page.getByTestId('inventory-item-name').filter({ hasText: productName })
             });
 
             const removeButton = cartItem.locator('button:has-text("Remove")');
             await removeButton.click();

             await this.page.waitForTimeout(500);
        }catch(error){
        throw error;
        }
      }


      async verifyProductsInCart(productNames: string[]) {
       for(const productName of productNames){
            const isInCart = await this.isProductInCart(productName);
            expect(isInCart).toBe(true);
       }
    }

    getCartProductItemByName(productName: string): Locator {
        return this.page.locator('.cart_item').filter({
            has: this.page.locator('.inventory_item_name').filter({ hasText: productName })
        });
    }

    async getCartProductName(productName: string): Promise<string> {
        const item = this.getCartProductItemByName(productName);
        const name = await item.locator('.inventory_item_name').textContent();
        return name?.trim() || '';
    }


    async getCartProductPrice(productName: string): Promise<string> {
        const item = this.getCartProductItemByName(productName);
        const price = await item.locator('.inventory_item_price').textContent();
        return price?.trim() || '';
    }


    async getCartProductDescription(productName: string): Promise<string> {
        const item = this.getCartProductItemByName(productName);
        const description = await item.locator('.inventory_item_desc').textContent();
        return description?.trim() || '';
    }


    async getcartProductDetails(productName: string): Promise<{ name: string, price: string, description: string }> {
        return {
            name: await this.getCartProductName(productName),
            price: await this.getCartProductPrice(productName),
            description: await this.getCartProductDescription(productName)
        };
    }

  


/* Test cases */
// Quantity of all the products added in the cart
// product price in the cart
// remove the prodcut from cart
// reset app from cart - removing items from cart
// price of products vs total
// verify all the products in the cart


}