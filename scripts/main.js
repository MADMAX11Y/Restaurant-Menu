document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart in localStorage if it doesn't exist
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    // Add event listeners to all "Add to cart" buttons
    const addToCartButtons = document.querySelectorAll('button');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get product information from the parent container
            const productContainer = this.closest('div').parentElement;
            const productName = productContainer.querySelector('h2').textContent;
            const productPrice = productContainer.querySelector('h3').textContent.replace('Price ', '');
            const productImage = productContainer.querySelector('img').src;
            const imageName = productImage.split('/').pop();
            
            // Create a product object
            const product = {
                name: productName,
                price: productPrice,
                image: 'images/' + imageName,
                quantity: 1
            };
            
            // Add to cart (localStorage)
            addToCart(product);
            
            // Show confirmation message
            showNotification(`${productName} added to cart!`);
        });
    });
    
    // Function to add product to cart
    function addToCart(product) {
        // Get current cart
        const cart = JSON.parse(localStorage.getItem('cart'));
        
        // Check if product already exists in cart
        const existingProductIndex = cart.findIndex(item => item.name === product.name);
        
        if (existingProductIndex !== -1) {
            // Increment quantity if product already exists
            cart[existingProductIndex].quantity += 1;
        } else {
            // Add new product to cart
            cart.push(product);
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count display if it exists
        updateCartCount();
    }
    
    // Function to update cart count display
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // You can add a cart count element to your HTML and update it here
        // For example: document.getElementById('cart-count').textContent = totalItems;
    }
    
    // Function to show notification when item is added to cart
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        
        // Add notification to the page
        document.body.appendChild(notification);
        
        // Add styles to the notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease-in-out';
        
        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
});

// Add this to scripts/main.js
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.header nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // Close menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.header nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 480) {
                nav.classList.remove('active');
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = nav.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    });
});
