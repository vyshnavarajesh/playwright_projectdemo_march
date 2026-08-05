import { Page } from "@playwright/test";
import { LoginPage } from "./loginPage";
import { ProductListPage } from "./productListPage";
import { CheckoutPage } from "./checkoutPage";
import { CartPage } from "./cartPage";


export class PageManager {

    private readonly page: Page
    private readonly signInPage: LoginPage
    private readonly productListPage: ProductListPage
    private readonly cartInfoPage: CartPage
    private readonly cartCheckOutPage: CheckoutPage

    constructor(page: Page) {
        this.page = page
        this.signInPage = new LoginPage(this.page)
        this.productListPage = new ProductListPage(this.page)
        this.cartInfoPage = new CartPage(this.page)
        this.cartCheckOutPage = new CheckoutPage(this.page)
    }


    loginPage() {
        return this.signInPage
    }

    listPage() {
        return this.productListPage
    }

    cartPage() {
        return this.cartInfoPage
    }

    checkOutPage() {
        return this.cartCheckOutPage
    }
}