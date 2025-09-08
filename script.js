// A simple function to select elements
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Base API URL
const BASE_URL = 'https://openapi.programming-hero.com/api';

// UI elements
const categoriesList = $('#categories-list');
const treesContainer = $('#trees-container');
const spinner = $('#spinner');
const cartItemsContainer = $('#cart-items');
const cartTotalElement = $('#cart-total');
const detailsModal = $('#details-modal');
const closeModalBtn = $('#close-modal-btn');
const modalContent = $('#modal-content');

// Global state variables
let allPlantsData = [];
let currentCart = [];

// Helper functions for UI
const showSpinner = () => spinner.classList.remove('hidden');
const hideSpinner = () => spinner.classList.add('hidden');

// 1. Load All Plants and Categories Dynamically
const loadAllData = async () => {
    showSpinner();
    try {
        const [categoriesRes, plantsRes] = await Promise.all([
            fetch(`${BASE_URL}/categories`),
            fetch(`${BASE_URL}/plants`)
        ]);

        const categoriesData = await categoriesRes.json();
        const plantsData = await plantsRes.json();
        
        allPlantsData = plantsData.plants;

        // Add 'All Tree' category
        const allTreeCategory = { id: 0, category_name: 'All Tree' };
        displayCategories([allTreeCategory, ...categoriesData.categories]);

    } catch (error) {
        console.error('Failed to fetch data:', error);
        categoriesList.innerHTML = '<p class="text-center text-gray-500">Failed to load categories.</p>';
        treesContainer.innerHTML = '<p class="text-center text-gray-500">Failed to load trees.</p>';
    } finally {
        hideSpinner();
    }
};

const displayCategories = (categories) => {
    categoriesList.innerHTML = '';
    categories.forEach(category => {
        const button = document.createElement('button');
        button.classList.add('category-btn', 'p-2', 'rounded-lg', 'text-left', 'hover:bg-green-100', 'transition', 'duration-200');
        button.textContent = category.category_name;
        button.dataset.id = category.id;
        
        button.addEventListener('click', () => {
            $$('.category-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            if (category.id === 0) {
                displayTrees(allPlantsData);
            } else {
                loadTreesByCategory(category.id);
            }
        });

        categoriesList.appendChild(button);
    });
    // Load the 'All Tree' category
    const firstCategoryBtn = categoriesList.querySelector('.category-btn');
    if (firstCategoryBtn) {
        firstCategoryBtn.classList.add('active');
        displayTrees(allPlantsData);
    }
};

// 2. Load Trees by Category
const loadTreesByCategory = async (categoryId) => {
    showSpinner();
    treesContainer.innerHTML = '';
    try {
        const res = await fetch(`${BASE_URL}/category/${categoryId}`);
        const data = await res.json();
        displayTrees(data.plants);
    } catch (error) {
        console.error('Failed to fetch trees:', error);
        treesContainer.innerHTML = '<p class="text-center text-gray-500">Failed to load trees. Please try again later.</p>';
    } finally {
        hideSpinner();
    }
};

// 3. Display Trees in Cards
const displayTrees = (trees) => {
    treesContainer.innerHTML = '';
    if (!trees || trees.length === 0) {
        treesContainer.innerHTML = '<p class="text-center text-gray-500">No trees found in this category.</p>';
        return;
    }
    trees.forEach(tree => {
        const card = document.createElement('div');
        card.classList.add('bg-white', 'rounded-lg', 'shadow-md', 'overflow-hidden', 'transform', 'hover:scale-105', 'transition', 'duration-300');
        card.innerHTML = `
            <div class="relative w-full h-48 overflow-hidden">
                <img src="${tree.image}" alt="${tree.name}" class="object-cover w-full h-full">
            </div>
            <div class="p-4">
                <h3 class="text-xl font-bold mb-2 cursor-pointer text-green-700 hover:underline" data-id="${tree.id}">${tree.name}</h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">${tree.description}</p>
                <div class="flex items-center justify-between">
                    <span class="bg-green-200 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">${tree.category}</span>
                    <span class="text-lg font-bold text-gray-900">৳${tree.price}</span>
                </div>
                <button class="add-to-cart-btn mt-4 w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300" data-id="${tree.id}">Add to Cart</button>
            </div>
        `;
        treesContainer.appendChild(card);
    });
};

// 4. Modal on Card Click
treesContainer.addEventListener('click', (event) => {
    const treeNameElement = event.target.closest('h3');
    if (treeNameElement && treeNameElement.dataset.id) {
        loadPlantDetails(treeNameElement.dataset.id);
    }
    const cartButton = event.target.closest('.add-to-cart-btn');
    if (cartButton && cartButton.dataset.id) {
        loadAndAddToCart(cartButton.dataset.id);
    }
});

const loadPlantDetails = async (plantId) => {
    try {
        const res = await fetch(`${BASE_URL}/plant/${plantId}`);
        const data = await res.json();
        displayModal(data.plants);
    } catch (error) {
        console.error('Failed to fetch plant details:', error);
    }
};

const displayModal = (plant) => {
    modalContent.innerHTML = `
        <img src="${plant.image}" alt="${plant.name}" class="w-full h-64 object-cover rounded-lg mb-4">
        <h3 class="text-2xl font-bold text-green-700 mb-2">${plant.name}</h3>
        <p class="text-gray-600 mb-4">${plant.description}</p>
        <div class="flex flex-wrap gap-2 text-sm font-medium text-gray-600 mb-4">
            <span><strong>Category:</strong> ${plant.category}</span>
            <span><strong>Price:</strong> ৳${plant.price}</span>
        </div>
    `;
    detailsModal.classList.remove('hidden');
    detailsModal.classList.add('flex');
};

closeModalBtn.addEventListener('click', () => {
    detailsModal.classList.remove('flex');
    detailsModal.classList.add('hidden');
});

// Challenges: Add to Cart, Total Calculation, Remove from Cart
const loadAndAddToCart = async (plantId) => {
    try {
        const plant = allPlantsData.find(p => p.id === parseInt(plantId));
        if (!plant) {
            console.error("Plant not found in local data.");
            return;
        }

        const isAlreadyInCart = currentCart.find(item => item.id === plant.id);
        if (isAlreadyInCart) {
            alert('This tree is already in your cart!');
            return;
        }

        currentCart.push(plant);
        updateCartUI();

    } catch (error) {
        console.error('Failed to add to cart:', error);
    }
};

const updateCartUI = () => {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    currentCart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('flex', 'justify-between', 'items-center', 'text-sm');
        cartItemElement.innerHTML = `
            <span class="font-medium">${item.name}</span>
            <div class="flex items-center gap-2">
                <span class="text-gray-600">৳${item.price}</span>
                <button class="remove-from-cart-btn text-red-500 hover:text-red-700" data-id="${item.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemElement);
        total += item.price;
    });

    cartTotalElement.textContent = `৳${total}`;

    $$('.remove-from-cart-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const plantId = event.currentTarget.dataset.id;
            removeFromCart(plantId);
        });
    });
};

const removeFromCart = (plantId) => {
    currentCart = currentCart.filter(item => item.id !== parseInt(plantId));
    updateCartUI();
};

document.addEventListener('DOMContentLoaded', loadAllData);