document.addEventListener('DOMContentLoaded', function() {
    // Get references to elements
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const fullNameInput = document.getElementById('full-name');
    const phoneNumberInput = document.getElementById('phone-number');
    const bankAccountInput = document.getElementById('bank-account');
    const screenshotInput = document.getElementById('screenshot');
    const screenshotPreview = document.getElementById('screenshot-preview');
    const orderItemsContainer = document.getElementById('order-items');
    const orderTotalDisplay = document.getElementById('order-total');
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    const cancelPaymentBtn = document.getElementById('cancel-payment-btn');
    const paymentStatus = document.getElementById('payment-status');

    // Load cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let orderTotal = 0;

    // Display order items and calculate total
    function displayOrderItems() {
        orderItemsContainer.innerHTML = '';
        orderTotal = 0;

        if (cart.length === 0) {
            orderItemsContainer.innerHTML = '<p>No items in your order.</p>';
            return;
        }

        cart.forEach(item => {
            const itemPrice = parseFloat(item.price.replace(' Birr', ''));
            const itemTotal = itemPrice * item.quantity;
            orderTotal += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <div class="d-flex justify-content-between">
                    <span>${item.name} (${item.quantity}x)</span>
                    <span>${itemTotal.toFixed(2)} Birr</span>
                </div>
            `;
            orderItemsContainer.appendChild(itemElement);
        });

        // Calculate tax (10%) and delivery fee
        const tax = orderTotal * 0.1;
        const deliveryFee = 5.00;
        const grandTotal = orderTotal + tax + deliveryFee;

        orderTotalDisplay.innerHTML = `
            <div class="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>${orderTotal.toFixed(2)} Birr</span>
            </div>
            <div class="d-flex justify-content-between">
                <span>Tax (10%):</span>
                <span>${tax.toFixed(2)} Birr</span>
            </div>
            <div class="d-flex justify-content-between">
                <span>Delivery:</span>
                <span>${deliveryFee.toFixed(2)} Birr</span>
            </div>
            <div class="d-flex justify-content-between fw-bold mt-2">
                <span>Total:</span>
                <span>${grandTotal.toFixed(2)} Birr</span>
            </div>
        `;
    }

    // Initialize order display
    displayOrderItems();

    // Screenshot upload preview
    screenshotInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            screenshotPreview.style.display = 'block';
            reader.addEventListener('load', function() {
                screenshotPreview.setAttribute('src', this.result);
            });
            reader.readAsDataURL(file);
        } else {
            screenshotPreview.style.display = 'none';
            screenshotPreview.setAttribute('src', '');
        }
    });

    // Confirm payment button click
    confirmPaymentBtn.addEventListener('click', function() {
        // Validate form inputs
        if (!validateForm()) return;

        // Get form data
        const paymentData = {
            paymentMethod: document.querySelector('input[name="payment-method"]:checked').value,
            fullName: fullNameInput.value.trim(),
            phoneNumber: phoneNumberInput.value.trim(),
            bankAccount: bankAccountInput.value.trim(),
            screenshot: screenshotInput.files[0] ? screenshotInput.files[0].name : null,
            orderItems: cart,
            orderTotal: orderTotal,
            date: new Date().toISOString()
        };

        // Process payment (simulated)
        processPayment(paymentData);
    });

    // Form validation
    function validateForm() {
        // Reset status
        paymentStatus.style.display = 'none';
        paymentStatus.className = '';

        // Check payment method
        if (!document.querySelector('input[name="payment-method"]:checked')) {
            showStatus('Please select a payment method.', 'error');
            return false;
        }

        // Check name
        if (!fullNameInput.value.trim()) {
            showStatus('Please enter your full name.', 'error');
            fullNameInput.focus();
            return false;
        }

        // Check phone number (Ethiopian format: 9xxxxxxxxx)
        const phoneRegex = /^9\d{8}$/;
        if (!phoneRegex.test(phoneNumberInput.value.trim())) {
            showStatus('Please enter a valid Ethiopian phone number (9xxxxxxxxx).', 'error');
            phoneNumberInput.focus();
            return false;
        }

        // Check bank account
        if (!bankAccountInput.value.trim()) {
            showStatus('Please enter your bank account number.', 'error');
            bankAccountInput.focus();
            return false;
        }

        // Check screenshot
        if (!screenshotInput.files[0]) {
            showStatus('Please upload a payment screenshot.', 'error');
            return false;
        }

        return true;
    }

    // Process payment (simulated)
    function processPayment(paymentData) {
        showStatus('Processing payment...', 'processing');

        // Simulate API call
        setTimeout(() => {
            // Save order to localStorage
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(paymentData);
            localStorage.setItem('orders', JSON.stringify(orders));

            // Clear cart
            localStorage.setItem('cart', JSON.stringify([]));

            // Show success message
            showStatus('Payment successful! Thank you for your order.', 'success');

            // Redirect to thank you page after 3 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }, 2000);
    }

    // Show status message
    function showStatus(message, type) {
        paymentStatus.textContent = message;
        paymentStatus.style.display = 'block';
        paymentStatus.className = type;

        // Scroll to status message
        paymentStatus.scrollIntoView({ behavior: 'smooth' });
    }

    // Cancel payment button click
    cancelPaymentBtn.addEventListener('click', function() {
        window.location.href = 'cart.html';
    });
});