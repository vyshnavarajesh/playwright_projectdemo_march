import { Locator, Page } from "@playwright/test";

export class BasePage {

    readonly page : Page
    readonly pageTitle : Locator
    readonly cartCount : Locator
    readonly cartIcon : Locator
    readonly hamburgerMenu : Locator
    readonly footer : Locator
    readonly closeMenuButton : Locator
    readonly allItemsLink : Locator
    readonly aboutLink : Locator
    readonly logoutLink : Locator
    readonly resetAppLink : Locator

    constructor(page : Page){
        //super(page);
        this.page = page;
        this.cartIcon = page.getByTestId('shopping-cart-link');
        this.cartCount = page.getByTestId('shopping-cart-badge');
        this.pageTitle = page.locator('.title');
        this.hamburgerMenu = page.locator('button#react-burger-menu-btn');
        this.footer = page.getByTestId('footer');
        this.closeMenuButton = page.locator('button#react-burger-cross-btn');
        this.allItemsLink = page.getByTestId('inventory-sidebar-link'); // a#inventory_sidebar_link
        this.aboutLink = page.getByTestId('about-sidebar-link'); //a#about_sidebar_link
        this.logoutLink = page.getByTestId('logout-sidebar-link');
        this.resetAppLink = page.getByTestId('reset-sidebar-link');

    }

    async openMenu(){
        await this.hamburgerMenu.click();
    }

    async closeMenu(){
       await this.closeMenuButton.click();
    }

    async clickAllItemsMenu(){
        await this.allItemsLink.click();
     }

     async clickAboutMenu(){
        await this.aboutLink.click();
     }

     async logout(){
        await this.logoutLink.click();
     }

     async resetAppState(){
        await this.resetAppLink.click();
     }
 
 

    async getProductsPageName(): Promise<string | null>{
        return await this.pageTitle.textContent();
    }

    async clickOnCart(){
        await this.cartIcon.click();
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

    async addProductToCart(itemName : string){
        // Finds the product by item name in product list page
        const productName = this.page.locator('.inventory_item').filter({
            has : this.page.locator('.inventory_item_name').filter({hasText : itemName})
        });

        // click to add to cart Button
        await productName.locator('.button').first().click();
    }


    async removeProductFromCart(itemName : string){
        const productName =  this.page.locator('.inventory_item').filter({
            has : this.page.locator('.inventory_item_name').filter({hasText : itemName})
        });
          // click to remove Button
          await productName.locator('.button').first().click();
    }

    async verifyCartEmpty(){
        try{
            await this.cartIcon.isVisible();
        }catch(error){
            throw error;
        }
    }

    async verifyFooterVisible(){
        try{
            await this.footer.waitFor({state : 'visible'});
        }catch(error){
            throw error;
        }
    }

    

}