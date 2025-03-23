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
            const price = parseFloat(item.querySelector('td:nth-child(2)').textContent.replace('$', ''));
            const quantity = parseInt(item.querySelector('.quantity-input').value);
            const total = price * quantity;
            
            // Update row total
            item.querySelector('td:nth-child(4)').textContent = '$' + total.toFixed(2);
            
            subtotal += total;
        });
        
        // Update summary
        const tax = subtotal * 0.1;
        const delivery = 5;
        const total = subtotal + tax + delivery;
        
        const summaryRows = document.querySelectorAll('.summary-row');
        if (summaryRows.length >= 4) {
            summaryRows[0].querySelector('span:last-child').textContent = '$' + subtotal.toFixed(2);
            summaryRows[1].querySelector('span:last-child').textContent = '$' + tax.toFixed(2);
            summaryRows[2].querySelector('span:last-child').textContent = '$' + delivery.toFixed(2);
            summaryRows[3].querySelector('span:last-child').textContent = '$' + total.toFixed(2);
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
