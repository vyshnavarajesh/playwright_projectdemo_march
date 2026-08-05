export class EnvironmentConfig {
  
    private static readonly ENVIRONMENT_URLS = {
        staging: 'https://www.saucedemo.com/', 
        production: 'https://www.saucedemo.com/'
    };

    private static currentEnvironment: 'staging' | 'production' = 'production';

    static getCurrentEnvironment(): 'staging' | 'production' {
     
        const envVar = process.env.TEST_ENVIRONMENT?.toLowerCase();
        if (envVar === 'staging' || envVar === 'stage') {
            return 'staging';
        }
        if (envVar === 'production' || envVar === 'prod') {
            return 'production';
        }
        return this.currentEnvironment;
    }

    static setEnvironment(env: 'staging' | 'production'): void {
        this.currentEnvironment = env;
    }

    static getApplicationUrl(): string {
        const env = this.getCurrentEnvironment();
        return this.ENVIRONMENT_URLS[env];
    }


    static getUrlForEnvironment(env: 'staging' | 'production'): string {
        return this.ENVIRONMENT_URLS[env];
    }


    static isStaging(): boolean {
        return this.getCurrentEnvironment() === 'staging';
    }

    static isProduction(): boolean {
        return this.getCurrentEnvironment() === 'production';
    }

    static getAvailableEnvironments(): Array<'staging' | 'production'> {
        return Object.keys(this.ENVIRONMENT_URLS) as Array<'staging' | 'production'>;
    }

    static getEnvironmentInfo(): { environment: string; url: string } {
        const env = this.getCurrentEnvironment();
        return {
            environment: env.toUpperCase(),
            url: this.getApplicationUrl()
        };
    }
}