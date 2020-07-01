class ProductsController {
    async getProducts() {
        try {
            let response = await fetch('products.json');
            let data = await response.json();
            let products = data.items;
            products = products.map(product => {
                const {title, price} = product.fields;
                const {id} = product.sys;
                const img = product.fields.image.fields.file.url;
                return {title, price, id, img};
            });
            return products;
        } catch(error) {
            console.log(error);
        }
    }
}

class UI {
    displayProducts(products, productsDOM) {
        let productsHtml = '';
        products.forEach(product => {
            productsHtml += `
            <article class="product">
                <div class="img-container">
                    <img src="${product.img}" class="product-img"/>
                    <button class="bag-btn" data-id="${product.id}">
                        <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                        add to bag
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </article>`
        });
        productsDOM.innerHTML = productsHtml;
    }
}

class Storage {

}

document.addEventListener('DOMContentLoaded', () => {
    const productsDOM = document.querySelector('.products-center');
    const cartBtn = document.querySelector('.cart-btn');
    const closeCartBtn = document.querySelector('.close-cart');
    const clearCartBtn = document.querySelector('.clear-cart');
    const cartDOM = document.querySelector('.cart');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartContent = document.querySelector('.cart-content');
    let cart = [];
    const ui = new UI();
    const productsController = new ProductsController();
    productsController.getProducts()
    .then(products => ui.displayProducts(products, productsDOM));
    
});