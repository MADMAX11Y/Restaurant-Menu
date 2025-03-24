document.addEventListener('DOMContentLoaded', function () {
    const orderTotalElement = document.getElementById('order-total');
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    const cancelPaymentBtn = document.getElementById('cancel-payment-btn');
    const paymentStatus = document.getElementById('payment-status');

    // Fetch cart total from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    orderTotalElement.textContent = `Total: ${totalAmount.toFixed(2)} Birr`;

    // Confirm Payment Button
    confirmPaymentBtn.addEventListener('click', function () {
        const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
        const fullName = document.getElementById('full-name').value.trim();
        const phoneNumber = document.getElementById('phone-number').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!selectedPayment) {
            alert("Please select a payment method.");
            return;
        }
        if (!fullName || !phoneNumber || !email) {
            alert("Please fill out all billing details.");
            return;
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // Simulated Payment Processing
        confirmPaymentBtn.disabled = true;
        confirmPaymentBtn.textContent = "Processing...";
        
        setTimeout(() => {
            paymentStatus.style.display = "block";
            paymentStatus.textContent = `Payment Successful via ${selectedPayment.value}! Thank you, ${fullName}.`;

            // Clear cart after payment
            localStorage.removeItem('cart');
            confirmPaymentBtn.disabled = false;
            confirmPaymentBtn.textContent = "Confirm Payment";

            setTimeout(() => {
                window.location.href = "index.html"; // Redirect to home page after success
            }, 3000);
        }, 2000);
    });

    // Cancel Payment Button
    cancelPaymentBtn.addEventListener('click', function () {
        window.location.href = "cart.html"; // Redirect back to cart page
    });
});
