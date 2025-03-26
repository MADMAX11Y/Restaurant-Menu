document.addEventListener('DOMContentLoaded', function () {
    const menuList = document.getElementById('menu-list');
    const orderList = document.getElementById('order-list');
    const feedbackList = document.getElementById('feedback-list');
    const addItemButton = document.getElementById('add-item');
    
    function loadMenu() {
        const menuItems = JSON.parse(localStorage.getItem('menu')) || [];
        menuList.innerHTML = '';
        menuItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - ${item.price} Birr`;
            li.innerHTML += ` <button onclick="deleteMenuItem(${index})">Delete</button>`;
            menuList.appendChild(li);
        });
    }

    function loadOrders() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orderList.innerHTML = '';
        orders.forEach(order => {
            const li = document.createElement('li');
            li.textContent = `${order.name} - Quantity: ${order.quantity}`;
            orderList.appendChild(li);
        });
    }

    function loadFeedback() {
        const feedbacks = JSON.parse(localStorage.getItem('feedback')) || [];
        feedbackList.innerHTML = '';
        feedbacks.forEach(feedback => {
            const li = document.createElement('li');
            li.textContent = feedback;
            feedbackList.appendChild(li);
        });
    }

    addItemButton.addEventListener('click', function () {
        const itemName = prompt('Enter item name:');
        const itemPrice = prompt('Enter item price:');
        if (itemName && itemPrice) {
            const menuItems = JSON.parse(localStorage.getItem('menu')) || [];
            menuItems.push({ name: itemName, price: itemPrice });
            localStorage.setItem('menu', JSON.stringify(menuItems));
            loadMenu();
        }
    });

    window.deleteMenuItem = function (index) {
        const menuItems = JSON.parse(localStorage.getItem('menu')) || [];
        menuItems.splice(index, 1);
        localStorage.setItem('menu', JSON.stringify(menuItems));
        loadMenu();
    };

    loadMenu();
    loadOrders();
    loadFeedback();
});