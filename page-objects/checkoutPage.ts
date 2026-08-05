import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class CheckoutPage extends BasePage{

    readonly page : Page
    readonly firstName : Locator
    readonly lastName : Locator
    readonly postalCode : Locator
    readonly continueCheckoutButton : Locator
    readonly cancelButton : Locator
    readonly errorMsg : Locator
    readonly cartCount : Locator
    readonly cartIcon : Locator
   

    constructor(page : Page){
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

    async enterFirstNameInCheckout(fname : string){
        await this.firstName.fill(fname)
    }
    async enterLastNameInCheckout(lname : string){
        await this.lastName.fill(lname)
    }

    async enterPostalCodeInCheckout(pinCode : string){
        await this.postalCode.fill(pinCode)
    }

    async continueToCheckout(){
        await this.continueCheckoutButton.click();
    }

    async proceedToCancelShopping(){
        await this.cancelButton.click();
    }

    async getCartCount():Promise<number | null>{
        try{
            if(await this.cartCount.isVisible()){
                const count = await this.cartCount.innerText();
                const cart_count = parseInt(count,10);
                return cart_count;
            }else{
                console.log('shopping cart is empty')
                return null;

            }
        }catch{
            return null;
        }
    }

}