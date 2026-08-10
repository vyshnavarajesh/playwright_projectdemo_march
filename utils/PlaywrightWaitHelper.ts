import { Page, Locator } from '@playwright/test';
import logger from './LoggerUtils';

export class WaitStrategies {
    /**
     * @param locator - Playwright locator
     * @param timeout - Maximum wait time in ms (default: 10000)
     * @param description - Description for logging (default: 'Element')
     */
    static async waitForElementVisible(
        locator: Locator,
        timeout: number = 10000,
        description: string = 'Element'
    ): Promise<void> {
        try {
            await locator.waitFor({ state: 'visible', timeout });
            logger.info(` ${description} is visible`);
        } catch (error) {
            logger.error(`${description} did not become visible within ${timeout}ms`);
            throw new Error(`Timeout waiting for ${description} to be visible: ${error}`);
        }
    }

    /**
     * Wait for an element to be present in the DOM (regardless of visibility).
     * Useful when you need to interact with an element that may be off-screen or hidden.
     * @param locator - Playwright locator
     * @param timeout - Maximum wait time in ms (default: 10000)
     * @param description - Description for logging
     */
    static async waitForElementAttached(
        locator: Locator,
        timeout: number = 10000,
        description: string = 'Element'
    ): Promise<void> {
        try {
            await locator.waitFor({ state: 'attached', timeout });
            logger.info(`${description} is attached to DOM`);
        } catch (error) {
            logger.error(`${description} did not become attached within ${timeout}ms`);
            throw new Error(`Timeout waiting for ${description} to be attached: ${error}`);
        }
    }

    /**
     * Wait for an element to become hidden (or detached from DOM).
     * @param locator - Playwright locator
     * @param timeout - Maximum wait time in ms (default: 10000)
     * @param description - Description for logging
     */
    static async waitForElementHidden(
        locator: Locator,
        timeout: number = 10000,
        description: string = 'Element'
    ): Promise<void> {
        try {
            await locator.waitFor({ state: 'hidden', timeout });
            logger.info(` ${description} is hidden`);
        } catch (error) {
            logger.error(`${description} did not become hidden within ${timeout}ms`);
            throw new Error(`Timeout waiting for ${description} to be hidden: ${error}`);
        }
    }

    /**
     * Wait for an element to be clickable – visible, enabled, and not disabled.
     * Uses a single `waitFor` with a reasonable timeout – simpler and more reliable.
     * @param locator - Playwright locator
     * @param timeout - Maximum wait time in ms (default: 10000)
     * @param description - Description for logging
     */
    static async waitForElementClickable(
        locator: Locator,
        timeout: number = 10000,
        description: string = 'Element'
    ): Promise<void> {
        try {
            // Playwright's built-in "visible" state already implies enabled.
            // For extra safety, we explicitly check isEnabled after visibility.
            await locator.waitFor({ state: 'visible', timeout });
            const isEnabled = await locator.isEnabled();
            if (!isEnabled) {
                throw new Error('Element is visible but disabled');
            }
            logger.info(` ${description} is clickable`);
        } catch (error) {
            logger.error(`${description} did not become clickable within ${timeout}ms`);
            throw new Error(`Timeout waiting for ${description} to be clickable: ${error}`);
        }
    }

    /**
     * Wait for an element to become stable – i.e. no further attribute/style changes.
     * This is useful for UI animations that could interfere with interactions.
     * @param locator - Playwright locator
     * @param timeout - Maximum wait time in ms (default: 5000)
     * @param checkInterval - How often to check for stability in ms (default: 500)
     * @param description - Description for logging
     */
    static async waitForElementStable(
        locator: Locator,
        timeout: number = 5000,
        checkInterval: number = 500,
        description: string = 'Element'
    ): Promise<void> {
        const startTime = Date.now();
        let lastBoundingBox = await locator.boundingBox().catch(() => null);

        while (Date.now() - startTime < timeout) {
            const currentBox = await locator.boundingBox().catch(() => null);
            if (!currentBox || !lastBoundingBox) {
                // If element disappears, it's not stable – wait and retry
                await new Promise(resolve => setTimeout(resolve, checkInterval));
                lastBoundingBox = await locator.boundingBox().catch(() => null);
                continue;
            }
            // Compare coordinates – if unchanged for one interval, assume stable
            if (
                Math.abs(currentBox.x - lastBoundingBox.x) < 0.5 &&
                Math.abs(currentBox.y - lastBoundingBox.y) < 0.5 &&
                Math.abs(currentBox.width - lastBoundingBox.width) < 0.5 &&
                Math.abs(currentBox.height - lastBoundingBox.height) < 0.5
            ) {
                logger.info(` ${description} is stable`);
                return;
            }
            lastBoundingBox = currentBox;
            await new Promise(resolve => setTimeout(resolve, checkInterval));
        }
        logger.warn(`⚠ ${description} did not become stable within ${timeout}ms – proceeding anyway`);
        // Not throwing to avoid flakiness; caller may handle.
    }

    /**
     * Perform a click with intelligent waiting.
     * Waits for element to be clickable, then clicks.
     * @param locator - Playwright locator
     * @param description - Description for logging
     * @param timeout - Maximum wait time in ms (default: 10000)
     */
    static async clickElement(
        locator: Locator,
        description: string = 'Element',
        timeout: number = 10000
    ): Promise<void> {
        try {
            // Fast path: try a direct click with short timeout
            await locator.click({ timeout: Math.min(timeout, 2000) });
            logger.info(` Clicked on ${description}`);
            return;
        } catch {
            // Fallback: wait for clickability then click again
            await this.waitForElementClickable(locator, timeout, description);
            await locator.click();
            logger.info(` Clicked on ${description} (after wait)`);
        }
    }

    /**
     * Fill an input field with intelligent waiting.
     * Waits for field to be clickable, then fills.
     * @param locator - Playwright locator
     * @param value - Value to fill
     * @param description - Description for logging
     * @param timeout - Maximum wait time in ms (default: 10000)
     */
    static async fillField(
        locator: Locator,
        value: string,
        description: string = 'Field',
        timeout: number = 10000
    ): Promise<void> {
        await this.waitForElementClickable(locator, timeout, description);
        await locator.fill(value);
        logger.info(` Filled ${description} with value: ${value}`);
    }

    /**
     * Wait for a specific URL pattern (navigation).
     * @param page - Playwright page
     * @param urlPattern - RegExp or string pattern
     * @param timeout - Maximum wait time in ms (default: 10000)
     */
    static async waitForURL(
        page: Page,
        urlPattern: string | RegExp,
        timeout: number = 10000
    ): Promise<void> {
        try {
            await page.waitForURL(urlPattern, { timeout });
            logger.info(` Navigated to URL matching: ${urlPattern}`);
        } catch (error) {
            logger.error(`Did not navigate to URL: ${urlPattern}`);
            throw error;
        }
    }

    /**
     * Wait for page navigation to complete (DOM content loaded).
     * @param page - Playwright page
     * @param timeout - Maximum wait time in ms (default: 30000)
     */
    static async waitForNavigation(
        page: Page,
        timeout: number = 30000
    ): Promise<void> {
        try {
            await page.waitForLoadState('domcontentloaded', { timeout });
            logger.info(' Page navigation completed (DOM loaded)');
        } catch (error) {
            logger.error(`Page navigation did not complete within ${timeout}ms`);
            throw error;
        }
    }

    /**
     * Wait for network to be idle (all pending requests finished).
     * @param page - Playwright page
     * @param timeout - Maximum wait time in ms (default: 10000)
     * @param ignoreFailure - If true, log warning instead of throwing (default: false)
     */
    static async waitForNetworkIdle(
        page: Page,
        timeout: number = 10000,
        ignoreFailure: boolean = false
    ): Promise<void> {
        try {
            await page.waitForLoadState('networkidle', { timeout });
            logger.info(' Network is idle');
        } catch (error) {
            if (ignoreFailure) {
                logger.warn(`⚠ Network did not become idle within ${timeout}ms – continuing`);
            } else {
                logger.error(`Network did not become idle within ${timeout}ms`);
                throw error;
            }
        }
    }

    /**
     * Poll a condition until it returns true or timeout.
     * @param condition - Async function returning boolean
     * @param timeout - Maximum wait time in ms (default: 10000)
     * @param pollInterval - How often to check in ms (default: 500)
     * @param description - Description for logging
     */
    static async waitForCondition(
        condition: () => Promise<boolean>,
        timeout: number = 10000,
        pollInterval: number = 500,
        description: string = 'Condition'
    ): Promise<void> {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            try {
                if (await condition()) {
                    logger.info(` ${description} satisfied`);
                    return;
                }
            } catch {
                // ignore errors and retry
            }
            await new Promise(resolve => setTimeout(resolve, pollInterval));
        }
        throw new Error(`Timeout waiting for ${description} (${timeout}ms)`);
    }

    /**
     * Wait for any element matching a selector to appear.
     * @param page - Playwright page
     * @param selector - CSS/XPath selector
     * @param timeout - Maximum wait time in ms (default: 10000)
     * @param description - Description for logging
     */
    static async waitForDynamicContent(
        page: Page,
        selector: string,
        timeout: number = 10000,
        description: string = 'Dynamic content'
    ): Promise<void> {
        const locator = page.locator(selector);
        await this.waitForElementVisible(locator, timeout, description);
    }
}