import { Page, expect } from "@playwright/test";
import logger from "../utils/LoggerUtils";
export class HelperBase {

    readonly page: Page
    constructor(page: Page) { this.page = page }
     
    async waitForNumberOfSeconds(timeInSeconds: number) {
        await this.page.waitForTimeout(timeInSeconds * 1000)
        logger.info(`Waiting for : ${timeInSeconds * 1000} milliseconds`)

    }
    //wait method for Network Idle  
    async waitForNetworkIdle() {
        await this.page.waitForLoadState('networkidle')
        logger.info(`Waiting for Network Idle State`)
   
    }
}
