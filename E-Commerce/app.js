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
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                        add to cart
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </article>`
        });
        productsDOM.innerHTML = productsHtml;
    }

    addBtnsToCart() {
        const btns = [...document.querySelectorAll('.bag-btn')];
        this.btnsDOM = btns;
        btns.forEach(btn => {
            let id = btn.dataset.id;
            let isInCart = this.cart.find(item => item.id === id);
            if (isInCart) {
                btn.innerText = 'In cart';
                btn.disabled = true;
            }
            btn.addEventListener('click', evt => {
                evt.target.innerText = 'In cart';
                evt.target.disabled = true;
                let productInCart = {...Storage.getProduct(id), amount: 1};
                this.cart.push(productInCart);
                Storage.saveCart(this.cart);
                this.setCartValues(this.cart);
                this.addCartItem(productInCart);
                this.showCart();
            });
                        
        })
    }

    getBtn(id) {
        return this.btnsDOM.find(btn => btn.dataset.id === id);
    }

    setCartTotal(cartTotal) {
        this.cartTotal = cartTotal;
    }

    setCartItems(cartItems) {
        this.cartItems = cartItems;
    }

    setCartContent(cartContent) {
        this.cartContent = cartContent;
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

    addCartItem(cartItem) {
        const ItemDiv = document.createElement('div');
        ItemDiv.classList.add('cart-item');
        ItemDiv.innerHTML = `<img src="${cartItem.img}">
        <div>
            <h4>${cartItem.title}</h4>
            <h5>${cartItem.price}</h5>
            <span class="remove-item" data-id=${cartItem.id}>remove</span>
        </div>
        <div>
            <i class="fa fa-chevron-up" aria-hidden="true" data-id=${cartItem.id}></i>
            <p class="item-amount">${cartItem.amount}</p>
            <i class="fa fa-chevron-down" aria-hidden="true" data-id=${cartItem.id}></i>
        </div>`
        this.cartContent.appendChild(ItemDiv);
    }

    setCartOverlay(cartOverlay) {
        this.cartOverlay = cartOverlay;
    }

    showCart() {
        this.cartOverlay.classList.add('transparentBcg');
        this.cartDOM.classList.add('showCart');
    }

    hideCart() {
        this.cartOverlay.classList.remove('transparentBcg');
        this.cartDOM.classList.remove('showCart');
    }

    removeItem(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.setCartValues(this.cart);
        Storage.saveCart(this.cart);
        let addToCartBtn = this.getBtn(id);
        addToCartBtn.disabled = false;
        addToCartBtn.innerHTML = `<i class="fa fa-shopping-cart" aria-hidden="true"></i>
        add to cart`;
        while (this.cartContent.children.length > 0) {
            this.cartContent.removeChild(this.cartContent.children[0]);
        } 
    }

    setCartDOM(cartDOM) {
        this.cartDOM = cartDOM;
    }

    setCart(cart) {
        this.cart = cart;
    }

    setCartBtn(cartBtn) {
        this.cartBtn = cartBtn;
    }

    setCloseCartBtn(closeCartBtn) {
        this.closeCartBtn = closeCartBtn;
    }

    setClearCartBtn(clearCartBtn) {
        this.clearCartBtn = clearCartBtn;
    }

    initCart() {
        this.cart = Storage.getCart();
        this.setCartValues(this.cart);
        this.cart.forEach(item => {
            this.addCartItem(item);
        });
        this.cartBtn.addEventListener('click', () => {
            this.showCart();
        });
        this.closeCartBtn.addEventListener('click', () => {
            this.hideCart();
        });
    }

    cartLogic() {
        this.clearCartBtn.addEventListener('click', () => {
            this.clearCart();
        });
        this.cartContent.addEventListener('click', evt => {
            if (evt.target.classList.contains('remove-item')) {
                let itemToRemove = evt.target;
                let id = itemToRemove.dataset.id;
                this.cartContent.removeChild(itemToRemove.parentElement.parentElement);
                this.removeItem(id);
            } else if (evt.target.classList.contains('fa-chevron-up')) {
                let id = evt.target.dataset.id;
                let currentItem = this.cart.find(item => item.id === id);
                currentItem.amount = currentItem.amount + 1;
                Storage.saveCart(this.cart);
                this.setCartValues(this.cart);
                evt.target.nextElementSibling.innerText = currentItem.amount;
            } else if (evt.target.classList.contains('fa-chevron-down')) {
                let id = evt.target.dataset.id;
                let currentItem = this.cart.find(item => item.id === id);
                currentItem.amount = currentItem.amount - 1;
                if (currentItem.amount > 0) {
                    Storage.saveCart(this.cart);
                    this.setCartValues(this.cart);
                    evt.target.previousElementSibling.innerText = currentItem.amount;
                } else if (currentItem.amount <= 0) {
                    this.cartContent.removeChild(evt.target.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        });
    }

    clearCart() {
        let itemIds = this.cart.map(item => item.id);
        itemIds.forEach(id => this.removeItem(id));
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

    static getCart() {
        let cart = localStorage.getItem("cart"); 
        return cart ? JSON.parse(cart) : [];
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
    ui.setCart(cart);
    ui.setCartTotal(cartTotal);
    ui.setCartItems(cartItems);
    ui.setCartContent(cartContent);
    ui.setCartOverlay(cartOverlay);
    ui.setCartDOM(cartDOM);
    ui.setCartBtn(cartBtn);
    ui.setCloseCartBtn(closeCartBtn);
    ui.setClearCartBtn(clearCartBtn);
    const productsController = new ProductsController();
    productsController.getProducts()
    .then(products => {
        ui.displayProducts(products, productsDOM);
        Storage.saveProducts(products);
    }).then(() => {
        ui.initCart();
        ui.addBtnsToCart(cart);
        ui.cartLogic();
    });
    
});