
import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./basePage";
import logger from "../utils/LoggerUtils";

export class LoginPage extends BasePage {

    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly errorCloseButton: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.getByTestId('username');
        this.passwordInput = page.getByTestId('password');
        this.loginButton = page.locator('#login-button');
        this.errorMessage = page.locator('h3[data-test="error"]');
        this.errorCloseButton = page.locator('button[data-test="error-button"]');
    }

    async loginToPortal(username: string, password: string) {
        try {
            await this.usernameInput.fill(username);
            logger.info(`Entered username: ${username}`);

            await this.passwordInput.fill(password);
            logger.info('Entered password');

            await this.loginButton.click();
            logger.info('Clicked login button');

            await this.page.waitForURL(/inventory\.html/);
            await this.page.waitForLoadState('domcontentloaded');
            logger.info('Successfully logged in and page loaded');
        } catch (error) {
            logger.error(`Login failed: ${error}`);
            throw error;
        }
    }

    async getErrorMessage(timeout = 5000): Promise<string | null> {
        try {
            await this.errorMessage.waitFor({ state: 'visible', timeout });
            const errorText = await this.errorMessage.textContent();
            logger.info(`Error message: ${errorText}`);
            return errorText;
        } catch {
            logger.info('No error message found');
            return null;
        }
    }

    async verifyErrorMessageDisplayed(expectedMessage: string) {
        await this.errorMessage.waitFor({ state: 'visible' });
        const errorText = await this.errorMessage.textContent();
        expect(errorText).toContain(expectedMessage);
        logger.info(`Error message verified: ${expectedMessage}`);
    }

    async clearLoginForm() {
        await this.usernameInput.clear();
        await this.passwordInput.clear();
        logger.info('Cleared login form');
    }

    async verifyLoginPageDisplayed() {
        await expect(this.usernameInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.loginButton).toBeVisible();
        logger.info('Login page is displayed');
    }

    async closeErrorMessage() {
        await this.errorCloseButton.click();
        logger.info('Clicked error close button');
    }
}