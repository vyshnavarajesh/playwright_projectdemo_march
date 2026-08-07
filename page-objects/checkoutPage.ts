import { Locator, Page,expect } from "@playwright/test";
import { BasePage } from "./basePage";
import logger from "../utils/LoggerUtils";

export class CheckoutPage extends BasePage {

    readonly page: Page
    readonly firstName: Locator
    readonly lastName: Locator
    readonly postalCode: Locator
    readonly continueCheckoutButton: Locator
    readonly cancelButton: Locator
    readonly errorMsg: Locator
    readonly cartCount: Locator
    readonly cartIcon: Locator


    constructor(page: Page) {
        super(page);
        this.page = page;
        this.firstName = page.getByTestId('firstName');
        this.lastName = page.getByTestId('lastName'); // page.locator('.shopping_cart_badge')
        this.postalCode = page.getByTestId('postalCode');
        this.continueCheckoutButton = page.getByTestId('continue');
        this.cancelButton = page.getByTestId('cancel');
        this.errorMsg = page.getByTestId('error');
        this.cartIcon = page.getByTestId('shopping-cart-link');
        this.cartCount = page.getByTestId('shopping-cart-badge');

    }

    async enterFirstNameInCheckout(fname: string) {
        await this.firstName.fill(fname)
    }
    async enterLastNameInCheckout(lname: string) {
        await this.lastName.fill(lname)
    }

    async getErrorText(): Promise<string | null> {
        try {
            await this.errorMsg.waitFor({ state: 'visible', timeout: 3000 });
            return await this.errorMsg.textContent();
        }
        catch (error) {
            logger.info('No errorr message found')
            return null;
        }
    }

    async enterPostalCodeInCheckout(pinCode: string) {
        await this.postalCode.fill(pinCode)
    }

    async continueToCheckout() {
        await this.continueCheckoutButton.click();
    }

    async proceedToCancelShopping() {
        await this.cancelButton.click();
    }

    async getCartCount(): Promise<number | null> {
        try {
            if (await this.cartCount.isVisible()) {
                const count = await this.cartCount.innerText();
                const cart_count = parseInt(count, 10);
                return cart_count;
            } else {
                console.log('shopping cart is empty')
                return null;

            }
        } catch {
            return null;
        }
    }

    async checkOutElementsAreVisible(): Promise<boolean> {

        try {
            if (await this.firstName.isVisible() && await this.lastName.isVisible() && await this.postalCode.isVisible())
                return true;
            else
                return false;
        } catch {
            return false;
        }
    }

    /*
    async navigateToCheckoutAndVerify(prodListPageObj:any, cartListPageObj:any, page) {
            await prodListPageObj.clickOnCart();
            const cartPageName = await cartListPageObj.getProductsPageName();
            await expect(cartPageName).toBe('Your Cart');
            await cartListPageObj.proceedToCheckout();
            await expect(page).toHaveURL(/checkout-step-one/);
            await expect(await this.checkOutElementsAreVisible()).toBe(true);
    }
    */
}