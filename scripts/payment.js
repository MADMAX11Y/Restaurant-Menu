document.addEventListener('DOMContentLoaded', function () {
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const fullNameInput = document.getElementById('full-name');
    const phoneNumberInput = document.getElementById('phone-number');
    const bankAccountInput = document.getElementById('bank-account');
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    const cancelPaymentBtn = document.getElementById('cancel-payment-btn');
    const paymentStatus = document.getElementById('payment-status');

    // Address fields
    const streetInput = document.getElementById('street');
    const cityInput = document.getElementById('city');
    const stateInput = document.getElementById('state');
    const zipCodeInput = document.getElementById('zip-code');

    const orderItemsContainer = document.getElementById('order-items');
    const orderTotalDisplay = document.getElementById('order-total');
    const screenshotInput = document.getElementById('screenshot');
    const screenshotPreview = document.getElementById('screenshot-preview');

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let orderTotal = 0;

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

    displayOrderItems();

    if (screenshotInput) {
        screenshotInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                screenshotPreview.style.display = 'block';
                reader.addEventListener('load', function () {
                    screenshotPreview.setAttribute('src', this.result);
                });
                reader.readAsDataURL(file);
            } else {
                screenshotPreview.style.display = 'none';
                screenshotPreview.setAttribute('src', '');
            }
        });
    }

    confirmPaymentBtn.addEventListener('click', function () {
        if (!validateForm()) return;

        const paymentData = {
            paymentMethod: document.querySelector('input[name="payment-method"]:checked').value,
            fullName: fullNameInput.value.trim(),
            phoneNumber: phoneNumberInput.value.trim(),
            bankAccount: bankAccountInput.value.trim(),
            screenshot: screenshotInput?.files[0]?.name || null,
            address: {
                street: streetInput.value.trim(),
                city: cityInput.value.trim(),
                state: stateInput.value.trim(),
                zipCode: zipCodeInput.value.trim()
            },
            orderItems: cart,
            orderTotal: orderTotal,
            date: new Date().toISOString()
        };

        processPayment(paymentData);
    });

    cancelPaymentBtn.addEventListener('click', function () {
        window.location.href = 'cart.html';
    });

    function validateForm() {
        paymentStatus.style.display = 'none';
        paymentStatus.className = '';

        const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
        if (!selectedMethod) {
            showStatus('Please select a payment method.', 'error');
            return false;
        }

        const method = selectedMethod.value;
        const account = bankAccountInput.value.trim();

        const bankValidation = {
            "Awash Bank": /^.{11}$/,
            "CBE": /^.{13}$/,
            "BOA": /^.{8,12}$/,
            "Dashen Bank": /^.{10}$/
        };

        if (!fullNameInput.value.trim()) {
            showStatus('Please enter your full name.', 'error');
            fullNameInput.focus();
            return false;
        }

        const phoneRegex = /^9\d{8}$/;
        if (!phoneRegex.test(phoneNumberInput.value.trim())) {
            showStatus('Please enter a valid Ethiopian phone number (9xxxxxxxxx).', 'error');
            phoneNumberInput.focus();
            return false;
        }

        if (!bankAccountInput.value.trim()) {
            showStatus('Please enter your bank account number.', 'error');
            bankAccountInput.focus();
            return false;
        }

        if (!bankValidation[method].test(account)) {
            showStatus(`Invalid account number length for ${method}.`, 'error');
            bankAccountInput.focus();
            return false;
        }

        // Address validation
        if (!streetInput.value.trim() || !cityInput.value.trim() || !stateInput.value.trim() || !zipCodeInput.value.trim()) {
            showStatus('Please fill in all address fields for delivery.', 'error');
            return false;
        }

        return true;
    }

    function processPayment(paymentData) {
        showStatus('Processing payment...', 'processing');

        setTimeout(() => {
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(paymentData);
            localStorage.setItem('orders', JSON.stringify(orders));
            localStorage.setItem('cart', JSON.stringify([]));

            showStatus('Payment successful! Thank you for your order.', 'success');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }, 2000);
    }

    function showStatus(message, type) {
        paymentStatus.textContent = message;
        paymentStatus.style.display = 'block';
        paymentStatus.className = type;
        paymentStatus.scrollIntoView({ behavior: 'smooth' });
    }
});
