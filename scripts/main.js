document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    const addToCartButtons = document.querySelectorAll('button');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productContainer = this.closest('div').parentElement;
            const productName = productContainer.querySelector('h2').textContent;
            const productPrice = productContainer.querySelector('h3').textContent.replace('Price ', '');
            const productImage = productContainer.querySelector('img').src;
            const imageName = productImage.split('/').pop();
            
            // Extract nutrition facts and alcohol content
            let nutritionFacts = null;
            let alcoholContent = null;
            
            // Check if the product has nutrition facts
            const detailsElement = productContainer.querySelector('details');
            if (detailsElement) {
                const summaryText = detailsElement.querySelector('summary').textContent;
                
                // Check if it's a food item with nutrition facts
                if (summaryText === 'Nutrition Facts') {
                    const nutritionDetails = detailsElement.querySelectorAll('p');
                    nutritionFacts = {
                        calories: extractNutritionValue(nutritionDetails[0].textContent, 'Calories'),
                        carbs: extractNutritionValue(nutritionDetails[1].textContent, 'Carbohydrates'),
                        protein: extractNutritionValue(nutritionDetails[2].textContent, 'Protein'),
                        fat: extractNutritionValue(nutritionDetails[3].textContent, 'Fat'),
                        cholesterol: extractNutritionValue(nutritionDetails[4].textContent, 'Cholesterol')
                    };
                }
                // Check if it's a drink with alcohol content
                else if (summaryText === 'Read more') {
                    const alcoholText = detailsElement.querySelector('p').textContent;
                    if (alcoholText.includes('Alcohol Content')) {
                        // Extract alcohol percentage (e.g., "6-11% ABV" -> 8.5)
                        const alcoholMatch = alcoholText.match(/(\d+)-(\d+)%/);
                        if (alcoholMatch) {
                            const minAlcohol = parseFloat(alcoholMatch[1]);
                            const maxAlcohol = parseFloat(alcoholMatch[2]);
                            alcoholContent = (minAlcohol + maxAlcohol) / 2; // Average value
                        }
                    }
                }
            }
            
            const product = {
                name: productName,
                price: productPrice,
                image: 'images/' + imageName,
                quantity: 1,
                nutritionFacts: nutritionFacts,
                alcoholContent: alcoholContent
            };

            addToCart(product);
            
            showNotification(`You ordered ${productName}!`);
        });
    });
    
    // Helper function to extract nutrition values
    function extractNutritionValue(text, nutrient) {
        const regex = new RegExp(`${nutrient}:\\s*([\\d.-]+)(?:-([\\d.]+))?\\s*([a-zA-Z]+)`);
        const match = text.match(regex);
        
        if (match) {
            if (match[2]) {
                // If there's a range (e.g., "350-450 kcal"), take the average
                const min = parseFloat(match[1]);
                const max = parseFloat(match[2]);
                return {
                    value: (min + max) / 2,
                    unit: match[3]
                };
            } else {
                // Single value
                return {
                    value: parseFloat(match[1]),
                    unit: match[3]
                };
            }
        }
        return null;
    }
    
    function addToCart(product) {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const existingProductIndex = cart.findIndex(item => item.name === product.name);
        
        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push(product);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        updateCartCount();
        console.log(cart);
    }
    
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    // Function to show notification when item is added to cart
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#5c3d2e';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease-in-out';
        
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 1000);
    }
});


// Dark mode toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme');
    
    // Check if a theme is stored in localStorage
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }
    
    // Function to switch theme
    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }
    
    // Event listener for theme switch
    toggleSwitch.addEventListener('change', switchTheme, false);
});

// Get menu items from admin panel
function getMenuItems() {
    return JSON.parse(localStorage.getItem('admin-menu')) || [];
}

// Add order (called when user clicks "Order")
function addOrder(item) {
    const orders = JSON.parse(localStorage.getItem('main-orders')) || [];
    orders.push({
        ...item,
        date: new Date().toISOString(),
        status: 'pending'
    });
    localStorage.setItem('main-orders', JSON.stringify(orders));
    showNotification(`Order placed for ${item.name}!`);
}

// Submit feedback (called when user submits feedback form)
function submitFeedback(feedback) {
    const feedbacks = JSON.parse(localStorage.getItem('main-feedback')) || [];
    feedbacks.push({
        ...feedback,
        date: new Date().toISOString()
    });
    localStorage.setItem('main-feedback', JSON.stringify(feedbacks));
}

// Listen for changes made in other tabs/windows
window.addEventListener('storage', (event) => {
    if (event.key === 'admin-menu') {
        // Menu was updated in admin panel
        console.log('Menu updated!', event.newValue);
        // Refresh menu display on main site
    }
    
    if (event.key === 'main-orders') {
        // New order was placed
        console.log('New order!', event.newValue);
        // Refresh orders list in admin panel
    }
});

// Initialize empty data stores if they don't exist
if (!localStorage.getItem('main-orders')) {
    localStorage.setItem('main-orders', JSON.stringify([]));
}

if (!localStorage.getItem('main-feedback')) {
    localStorage.setItem('main-feedback', JSON.stringify([]));
}

// Load menu from admin panel
const menuItems = getMenuItems();
// ... render menu items ...

// Menu toggle functionality for mobile
document.addEventListener('DOMContentLoaded', function() {
    // Existing code...

    // Add menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.header nav');
    
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Close menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.header nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 480) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 480 && 
            !nav.contains(event.target) && 
            !menuToggle.contains(event.target)) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });

    // Existing code...
});