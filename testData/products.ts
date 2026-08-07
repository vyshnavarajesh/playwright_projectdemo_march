export interface Product {
    id: string;
    name: string;
    price: string;
    priceValue: number;     
    description: string;
    image: string;
    dataTestId: string;    
}

//Below testData will work for static sites
export const PRODUCTS = {
    BACKPACK: {
        id: '4',
        name: 'Sauce Labs Backpack',
        price: '$29.99',
        priceValue: 29.99,
        description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds unites peak form and function.',
        image: 'sauce-labs-backpack-1200x1500.jpg',
        dataTestId: 'add-to-cart-sauce-labs-backpack'
    } as Product,

    BIKE_LIGHT: {
        id: '0',
        name: 'Sauce Labs Bike Light',
        price: '$9.99',
        priceValue: 9.99,
        description: 'A red light isn\'t the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.',
        image: 'sauce-labs-bike-light-9v.jpg',
        dataTestId: 'add-to-cart-sauce-labs-bike-light'
    } as Product,

    BOLT_SHIRT: {
        id: '1',
        name: 'Sauce Labs Bolt T-Shirt',
        price: '$15.99',
        priceValue: 15.99,
        description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt',
        image: 'sauce-lab-bolt-shirt-1500x1500.jpg',
        dataTestId: 'add-to-cart-sauce-labs-bolt-t-shirt'
    } as Product,

    FLEECE_JACKET: {
        id: '5',
        name: 'Sauce Labs Fleece Jacket',
        price: '$49.99',
        priceValue: 49.99,
        description: 'It\'s not every day that you come across a midweight quarter-zip fleece jacket offered at such a steep discount, in all its classic serbian coziness. Prepare to turn some heads.',
        image: 'sauce-labs-fleece-jacket-1500x1500.jpg',
        dataTestId: 'add-to-cart-sauce-labs-fleece-jacket'
    } as Product,

    ONESIE: {
        id: '2',
        name: 'Sauce Labs Onesie',
        price: '$7.99',
        priceValue: 7.99,
        description: 'Rib snap infant onesie',
        image: 'red-sauce-labs-onesie-1500x1500.jpg',
        dataTestId: 'add-to-cart-sauce-labs-onesie'
    } as Product,

    RED_SHIRT: {
        id: '3',
        name: 'Test.allTheThings() T-Shirt (Red)',
        price: '$15.99',
        priceValue: 15.99,
        description: 'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to mastering all of the solutions Sauce Labs has to offer.',
        image: 'red-tatt-1500x1500.jpg',
        dataTestId: 'add-to-cart-test.allthethings()-t-shirt-(red)'
    } as Product,
} as const;


export const ALL_PRODUCTS = Object.values(PRODUCTS);

// Products sorted by price (low to high)
export const PRODUCTS_BY_PRICE_LOW_HIGH = [
    PRODUCTS.ONESIE,
    PRODUCTS.BIKE_LIGHT,
    PRODUCTS.BOLT_SHIRT,
    PRODUCTS.RED_SHIRT,
    PRODUCTS.BACKPACK,
    PRODUCTS.FLEECE_JACKET,
];

// Products sorted by price (high to low)
export const PRODUCTS_BY_PRICE_HIGH_LOW = [...PRODUCTS_BY_PRICE_LOW_HIGH].reverse();

// Products sorted by name (A to Z)
export const PRODUCTS_BY_NAME_AZ = [
    PRODUCTS.BACKPACK,
    PRODUCTS.BIKE_LIGHT,
    PRODUCTS.BOLT_SHIRT,
    PRODUCTS.FLEECE_JACKET,
    PRODUCTS.ONESIE,
    PRODUCTS.RED_SHIRT,
];

// Products sorted by name (Z to A)
export const PRODUCTS_BY_NAME_ZA = [...PRODUCTS_BY_NAME_AZ].reverse();

export const PRODUCT_NAMES = ALL_PRODUCTS.map(p => p.name);