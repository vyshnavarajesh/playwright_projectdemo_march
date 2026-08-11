import { Locator, Page,expect } from "@playwright/test";
import { BasePage } from "./basePage";
import logger from "../utils/LoggerUtils";
import { CheckoutFormData,VALID_CHECKOUT_DATA } from "../testData/constant";
import {WaitStrategies} from "../utils/PlaywrightWaitHelper";

export class CheckoutPage extends BasePage {

    readonly page: Page
    readonly firstName: Locator
    readonly lastName: Locator
    readonly postalCode: Locator
    readonly continueCheckoutButton: Locator
    readonly cancelButton: Locator
    readonly errorMsg: Locator
    //readonly cartCount: Locator
    //readonly cartIcon: Locator
    readonly cartItems: Locator;
    readonly paymentInfoSection: Locator;
    readonly shippingInfoSection: Locator;
    readonly itemTotalLabel: Locator;
    readonly taxLabel: Locator;
    readonly totalLabel: Locator;
    readonly thankYouMessage: Locator;
    readonly finishButton: Locator;
    readonly pdfBtn : Locator;
    readonly backHomeButton : Locator;



    constructor(page: Page) {
        super(page);
        this.page = page;
        this.firstName = page.getByTestId('firstName');
        this.lastName = page.getByTestId('lastName'); // page.locator('.shopping_cart_badge')
        this.postalCode = page.getByTestId('postalCode');
        this.continueCheckoutButton = page.getByTestId('continue');
        this.cancelButton = page.getByTestId('cancel');
        this.errorMsg = page.getByTestId('error');
       // this.cartIcon = page.getByTestId('shopping-cart-link');
       // this.cartCount = page.getByTestId('shopping-cart-badge');

        this.cartItems = this.page.locator('.cart_item');
        this.paymentInfoSection = this.page.locator(':text("Payment Information")');
        this.shippingInfoSection = this.page.locator(':text("Shipping Information")');
        this.itemTotalLabel = this.page.locator(':text("Item total")');
        this.taxLabel = this.page.locator(':text("Tax")');
        this.totalLabel = this.page.locator('[data-test="total-label"]');
        this.thankYouMessage = this.page.locator('h2:has-text("Thank you")');
        this.finishButton = this.page.locator('[data-test="finish"]');
        this.pdfBtn = this.page.getByTestId('generate-pdf-order');
        //this.backHomeButton = this.page.locator('#back-to-products');

    }

    getBackToProductsButton(): Locator {
        return  this.page.locator('[data-test="back-to-products"]')
                        .or(this.page.locator('button[id="back-to-products"]'))
                        .or(this.page.locator('#back-to-products'))
    }

    async clickBackToProducts(){
            try{

                const CurrentUrl = this.page.url();
                if(!CurrentUrl.includes('checkout-complete')){
                    throw new Error(`Expected to be on completion, but URL is : ${CurrentUrl}`);
                }

                const backButton = this.getBackToProductsButton();

                await WaitStrategies.clickElement(backButton,'Back to Products button',10000);

                await WaitStrategies.waitForURL(this.page, /inventory.html/,10000);

            }catch(error){
                logger.error(`Failed to navigate back to products ${error}`);
                throw error;
            }
    }


    async getCheckoutPageTitle(): Promise<string | null> {
        return await this.pageTitle.textContent();
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

    getFormFields(): Locator[] {
        return [this.firstName, this.lastName, this.postalCode, this.cancelButton, this.continueCheckoutButton];
    }

    async verifyCheckoutStepOnePageDisplayed() {
        try {
            const title = await this.getCheckoutPageTitle();
            expect(title).toContain('Checkout: Your Information');
            logger.info('Checkout step one page verified');
        } catch (error) {
            logger.error(`Verification failed: ${error}`);
            throw error;
        }
    }

    async verifyCheckoutStepTwoPageDisplayed() {
        try {
            const title = await this.getCheckoutPageTitle();
            expect(title).toContain('Checkout: Overview');
            logger.info('Checkout step two page verified');
        } catch (error) {
            logger.error(`Verification failed: ${error}`);
            throw error;
        }
    }

    async verifyCheckoutCompletePageDisplayed() {
        try {
            const title = await this.getCheckoutPageTitle();
            expect(title).toContain('Checkout: Complete!');
            logger.info('Checkout complete page verified');
        } catch (error) {
            logger.error(`Verification failed: ${error}`);
            throw error;
        }
    }

    async fillCheckoutFormStepOne(formData: CheckoutFormData) {
        try {
            await this.enterFirstNameInCheckout(formData.firstName);
            await this.enterLastNameInCheckout(formData.lastName);
            await this.enterPostalCodeInCheckout(formData.postalCode);
            logger.info('Checkout form step one filled');
        } catch (error) {
            logger.error(`Failed to fill checkout form: ${error}`);
            throw error;
        }
    }

    async fillCheckoutFormWithDefaultData() {
        await this.fillCheckoutFormStepOne(VALID_CHECKOUT_DATA);
    }

    async clickContinueToStepTwo() {
        try {
            logger.info('Clicked continue button');

            // Wait for navigation or error
            try {
                await Promise.race([
                    this.page.waitForURL(/checkout-step-two/, { timeout: 5000 }),
                    this.errorMsg.waitFor({ state: 'visible', timeout: 3000 })
                ]);
                const url = this.page.url();
                if (url.includes('checkout-step-two')) {
                    logger.info('Navigated to checkout step two');
                } else {
                    logger.info('Form validation error occurred (expected in some tests)');
                }
            } catch (error) {
                const url = this.page.url();
                if (url.includes('checkout-step-one')) {
                    logger.info('Still on checkout step one – validation error expected');
                } else {
                    throw error;
                }
            }
        } catch (error) {
            logger.error(`Error clicking continue button: ${error}`);
            throw error;
        }
    }

    async clickCancel() {
        try {
            await this.cancelButton.click();
            logger.info('Clicked cancel button');
            await this.page.waitForURL(/cart.html/);
        } catch (error) {
            logger.error(`Failed to cancel checkout: ${error}`);
            throw error;
        }
    }

    async clickCancelFromStepTwo() {
        try {
            await this.cancelButton.click();
            logger.info('Clicked cancel button from checkout step two');
            await this.page.waitForURL(/inventory.html/);
        } catch (error) {
            logger.error(`Failed to cancel from step two: ${error}`);
            throw error;
        }
    }

    async clickFinish() {
        try {
            await this.finishButton.click();
            logger.info('Clicked finish button');
            await this.page.waitForURL(/checkout-complete/);
            logger.info('Order completed, navigated to confirmation page');
        } catch (error) {
            logger.error(`Failed to complete order: ${error}`);
            throw error;
        }
    }

    async clickFinishButton() {
        return await this.clickFinish();
    }

    async completeCheckoutStepOne(formData: CheckoutFormData = VALID_CHECKOUT_DATA) {
        try {
            await this.fillCheckoutFormStepOne(formData);
            await this.clickContinueToStepTwo();
        } catch (error) {
            logger.error(`Failed to complete checkout step one: ${error}`);
            throw error;
        }
    }

    async completeCheckoutStepTwo() {
        try {
            await this.clickFinish();
        } catch (error) {
            logger.error(`Failed to complete checkout step two: ${error}`);
            throw error;
        }
    }

    async completeCheckout() {
        return await this.clickContinueToStepTwo();
    }

    async getCartItems(): Promise<Locator[]>{
        return await this.cartItems.all();
    }

    async getCartItemByName(productName : string): Promise<Locator>{
        return  this.cartItems.filter({
            has : this.page.locator('.inventory_item_name').filter({hasText: productName})
        });
    }

    async getShippingInfo(): Promise<string| null>{
        try{

            const shippingType  = this.page.locator(':text("Free Pony Express Delivery")');
            return await shippingType.textContent();
        }catch(error){
            logger.warn(`Failed to get shipping info : ${error}`);
            return null;
        }
    }

    async getPaymentInfo(): Promise<string| null>{
        try{

            const paymentInfo  = this.page.locator(':text("SauceCard #31337")');
            return await paymentInfo.textContent();
        }catch(error){
            logger.warn(`Failed to get paymentInfo : ${error}`);
            return null;
        }
    }

    async getItemTotal(): Promise<string | null>
    {
        try{
       const itemTotalText =  await this.itemTotalLabel.textContent();
       return itemTotalText?.match(/\$\d+\.\d+/)?.[0] || null;
        }
        catch(error){
            logger.warn(`Failed to get item total : ${error}`);
            return null;
        }
    }

    async getTaxAmount(): Promise<string | null>
    {
        try{
       const taxText =  await this.taxLabel.textContent();
       return taxText?.match(/\$\d+\.\d+/)?.[0] || null;
        }
        catch(error){
            logger.warn(`Failed to get tax amount : ${error}`);
            return null;
        }
    }

    async getTotalPrice(): Promise<string | null>
    {
        try{
       const totalText =  await this.totalLabel.textContent();
       return totalText?.match(/\$\d+\.\d+/)?.[0] || null;
        }
        catch(error){
            logger.warn(`Failed to get total amount : ${error}`);
            return null;
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