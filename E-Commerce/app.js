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

    addBtnsToCart(cart) {
        const btns = [...document.querySelectorAll('.bag-btn')];
        btns.forEach(btn => {
            let id = btn.dataset.id;
            let isInCart = cart.find(item => item.id === id);
            if (isInCart) {
                btn.innerText = 'In cart';
                btn.disabled = true;
            }
            btn.addEventListener('click', evt => {
                evt.target.innerText = 'In cart';
                evt.target.disabled = true;
                let productInCart = {...Storage.getProduct(id), amount: 1};
                cart.push(productInCart);
                Storage.saveCart(cart);
                this.setCartValues(cart);
            });
                        
        })
    }

    setCartTotal(cartTotal) {
        this.cartTotal = cartTotal;
    }

    setCartItems(cartItems) {
        this.cartItems = cartItems;
    }

    setCartValues(cart) {
        let totalPrices = 0;
        let totalItems = 0;
        cart.forEach(item => {
            totalPrices += item.price * item.amount;
            totalItems += item.amount;
        });
        this.cartTotal.innerText = parseFloat(totalPrices.toFixed(2));
        this.cartItems.innerText = totalItems;
    }
}

class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id) {
        const products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }

    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
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
    ui.setCartTotal(cartTotal);
    ui.setCartItems(cartItems);
    const productsController = new ProductsController();
    productsController.getProducts()
    .then(products => {
        ui.displayProducts(products, productsDOM);
        Storage.saveProducts(products);
    }).then(() => {
        ui.addBtnsToCart(cart);
    });
    
});