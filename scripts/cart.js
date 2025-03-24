// cart.js - Cart functionality with dark mode compatibility

document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const removeBtns = document.querySelectorAll('.remove-btn');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    // Handle quantity buttons
    quantityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
            
            if (this.textContent === '+') {
                value++;
            } else if (this.textContent === '-' && value > 1) {
                value--;
            }
            
            input.value = value;
            updateCartTotals();
        });
    });
    
    // Handle quantity input changes
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            let value = parseInt(this.value);
            
            // Ensure value is a number and at least 1
            if (isNaN(value) || value < 1) {
                this.value = 1;
            }
            
            updateCartTotals();
        });
    });
    
    // Handle remove buttons
    removeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            row.remove();
            updateCartTotals();
            checkEmptyCart();
        });
    });
    
    // Handle checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            alert('Thank you for your order!');
            // Clear cart and redirect to home page
            clearCart();
            // window.location.href = 'index.html';
        });
    }
    
    // Function to update cart totals
    function updateCartTotals() {
        const cartItems = document.querySelectorAll('#cart-items tr');
        let subtotal = 0;
        
        cartItems.forEach(item => {
            const price = parseFloat(item.querySelector('td:nth-child(2)').textContent.replace(' ', 'Birr'));
            const quantity = parseInt(item.querySelector('.quantity-input').value);
            const total = price * quantity;
            
            // Update row total
            item.querySelector('td:nth-child(4)').textContent = total.toFixed(2) +  ' Birr';
            
            subtotal += total;
        });
        
        // Update summary
        const tax = subtotal * 0.1;
        const delivery = 5;
        const total = subtotal + tax + delivery;
        
        const summaryRows = document.querySelectorAll('.summary-row');
        if (summaryRows.length >= 4) {
            summaryRows[0].querySelector('span:last-child').textContent = + subtotal.toFixed(2) + ' Birr';
            summaryRows[1].querySelector('span:last-child').textContent =  + tax.toFixed(2) + ' Birr';
            summaryRows[2].querySelector('span:last-child').textContent = + delivery.toFixed(2) + ' Birr';
            summaryRows[3].querySelector('span:last-child').textContent = + total.toFixed(2) + ' Birr';
        }
    }
    
    // Function to check if cart is empty
    function checkEmptyCart() {
        const cartItems = document.querySelectorAll('#cart-items tr');
        const cartTable = document.querySelector('.cart-table');
        const emptyCart = document.querySelector('.empty-cart');
        const cartSummary = document.querySelector('.cart-summary');
        
        if (cartItems.length === 0) {
            if (cartTable) cartTable.style.display = 'none';
            if (emptyCart) emptyCart.style.display = 'block';
            if (cartSummary) cartSummary.style.display = 'none';
        } else {
            if (cartTable) cartTable.style.display = 'table';
            if (emptyCart) emptyCart.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'block';
        }
    }
    
    // Function to clear cart
    function clearCart() {
        const cartItems = document.querySelector('#cart-items');
        if (cartItems) {
            cartItems.innerHTML = '';
            checkEmptyCart();
        }
    }
    
    // Initialize cart
    updateCartTotals();
    checkEmptyCart();
});


document.addEventListener('DOMContentLoaded', function() {
    // Load cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTable = document.querySelector('.cart-table');
    const cartSummary = document.querySelector('.cart-summary');
    const emptyCartMessage = document.querySelector('.empty-cart');
    
    // Check if cart is empty
    if (cart.length === 0) {
        cartTable.style.display = 'none';
        cartSummary.style.display = 'none';
        emptyCartMessage.style.display = 'block';
    } else {
        // Clear any example items
        cartItemsContainer.innerHTML = '';
        
        // Add each item to the cart
        cart.forEach((item, index) => {
            const row = document.createElement('tr');
            row.dataset.index = index;
            
            const itemPrice = parseFloat(item.price.replace(' ', 'Birr'));
            const itemTotal = itemPrice * item.quantity;
            
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image me-3">
                        <span>${item.name}</span>
                    </div>
                </td>
                <td>${item.price}</td>
                <td>
                    <div class="quantity-control">
                        <button class="quantity-btn decrease">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}">
                        <button class="quantity-btn increase">+</button>
                    </div>
                </td>
                <td>${itemTotal.toFixed(2)} Birr</td>
                <td><button class="remove-btn">Remove</button></td>
            `;
            
            cartItemsContainer.appendChild(row);
        });
        
        // Update cart totals
        updateCartTotals();
    }
    
    // Add event listeners for quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const index = parseInt(row.dataset.index);
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
            
            if (this.classList.contains('increase')) {
                value++;
            } else if (this.classList.contains('decrease') && value > 1) {
                value--;
            }
            
            input.value = value;
            
            // Update cart in localStorage
            cart[index].quantity = value;
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update row total
            const itemPrice = parseFloat(cart[index].price.replace(' ', 'Birr'));
            const itemTotal = itemPrice * value;
            row.querySelector('td:nth-child(4)').textContent = `${itemTotal.toFixed(2)} Birr`;
            
            updateCartTotals();
        });
    });
    
    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const index = parseInt(row.dataset.index);
            
            // Remove item from cart array
            cart.splice(index, 1);
            
            // Update localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Remove row from table
            row.remove();
            
            // Update indices for remaining rows
            document.querySelectorAll('#cart-items tr').forEach((row, i) => {
                row.dataset.index = i;
            });
            
            updateCartTotals();
            
            // Show empty cart message if cart is empty
            if (cart.length === 0) {
                cartTable.style.display = 'none';
                cartSummary.style.display = 'none';
                emptyCartMessage.style.display = 'block';
            }
        });
    });
    
    // Function to update cart totals
    function updateCartTotals() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Calculate subtotal
        const subtotal = cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace(' ', 'Birr'));
            return total + (price * item.quantity);
        }, 0);
        
        // Calculate tax (10%)
        const tax = subtotal * 0.1;
        
        // Delivery fee
        const delivery = 5.00;
        
        // Calculate total
        const total = subtotal + tax + delivery;
        
        // Update summary display
        const summaryRows = document.querySelectorAll('.summary-row');
        summaryRows[0].querySelector('span:last-child').textContent = `${subtotal.toFixed(2)} Birr`;
        summaryRows[1].querySelector('span:last-child').textContent = `${tax.toFixed(2)} Birr`;
        summaryRows[2].querySelector('span:last-child').textContent = `${delivery.toFixed(2)} Birr`;
        summaryRows[3].querySelector('span:last-child').textContent = `${total.toFixed(2)} Birr`;
    }
    

