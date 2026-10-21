const productsPerPage = 5;
const grid = document.getElementById('product-grid');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');
let products = [];
let currentPage = 1;

function totalPages() {
    return Math.ceil(products.length / productsPerPage);
}

function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';
    const img = document.createElement('img');
    img.src = product.imageUrl;
    img.alt = product.name;
    img.addEventListener('error', () => {
    img.src = product.imageUrl.replace('./images/', './public/images/');},
    {once: true},
    );
    const body = document.createElement('div');
    body.className = 'card-body';
    const category = document.createElement('span');
    category.className = 'category';
    category.textContent = product.category;
    const title = document.createElement('h3');
    title.textContent = product.name;

    const price = document.createElement('p');
    price.className = 'price';
    price.textContent = `$${product.price.toFixed(2)}`;

    const description = document.createElement('p');
    description.className = 'description';
    description.textContent = product.description;

    body.append(category, title, price, description);
    card.append(img, body);
    return card;
}
function renderPage() {
    const start = (currentPage - 1) * productsPerPage;
    const pageItems = products.slice(start, start + productsPerPage);

    grid.replaceChildren(...pageItems.map(createProductCard));

    pageInfo.textContent = `Page ${currentPage} of ${totalPages()}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages();
}

function goToPage(page) {
    if (page < 1 || page > totalPages()) return;
    currentPage = page;
    renderPage();
}

prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

async function init() {
    try {
    const response = await fetch('./src/data/products.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    products = await response.json();
    renderPage();
  } catch (error) {
    console.error('Could not load products:', error);
    grid.textContent = 'Sorry, products could not be loaded.';
    prevBtn.disabled = true;
    nextBtn.disabled = true;
  }
}

init();
