document.addEventListener('DOMContentLoaded', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTable = document.querySelector('.cart-table');
    const cartSummary = document.querySelector('.cart-summary');
    const emptyCartMessage = document.querySelector('.empty-cart');
    
    if (cart.length === 0) {
        cartTable.style.display = 'none';
        cartSummary.style.display = 'none';
        emptyCartMessage.style.display = 'block';
    } else {
        cartItemsContainer.innerHTML = '';
        
        cart.forEach((item, index) => {
            const row = document.createElement('tr');
            row.dataset.index = index;
            
            const itemPrice = parseFloat(item.price.replace('$', ''));
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
                <td>$${itemTotal.toFixed(2)}</td>
                <td><button class="remove-btn">Remove</button></td>
            `;
            
            cartItemsContainer.appendChild(row);
        });
        
        updateCartTotals();
    }
    
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
            
            cart[index].quantity = value;
            localStorage.setItem('cart', JSON.stringify(cart));
            
            const itemPrice = parseFloat(cart[index].price.replace('$', ''));
            const itemTotal = itemPrice * value;
            row.querySelector('td:nth-child(4)').textContent = `$${itemTotal.toFixed(2)}`;
            
            updateCartTotals();
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const index = parseInt(row.dataset.index);
            
            cart.splice(index, 1);
            
            localStorage.setItem('cart', JSON.stringify(cart));
            
            row.remove();
            
            document.querySelectorAll('#cart-items tr').forEach((row, i) => {
                row.dataset.index = i;
            });
            
            updateCartTotals();
            
            if (cart.length === 0) {
                cartTable.style.display = 'none';
                cartSummary.style.display = 'none';
                emptyCartMessage.style.display = 'block';
            }
        });
    });
    
    function updateCartTotals() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const subtotal = cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return total + (price * item.quantity);
        }, 0);
        
        const tax = subtotal * 0.1;
        
        const delivery = 5.00;
        
        const total = subtotal + tax + delivery;
        
        const summaryRows = document.querySelectorAll('.summary-row');
        summaryRows[0].querySelector('span:last-child').textContent = `$${subtotal.toFixed(2)}`;
        summaryRows[1].querySelector('span:last-child').textContent = `$${tax.toFixed(2)}`;
        summaryRows[2].querySelector('span:last-child').textContent = `$${delivery.toFixed(2)}`;
        summaryRows[3].querySelector('span:last-child').textContent = `$${total.toFixed(2)}`;
    }
    
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        alert('Thank you for your order!');
        localStorage.setItem('cart', JSON.stringify([]));
        window.location.href = 'index.html';
    });
});
