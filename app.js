const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

let productsData = [];
let collectionsData = [];

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // To parse form data

// Helper function to ensure the URL has the correct format
const ensureUrlFormat = (url) => {
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }
    return url;
};

// Home route displaying the dashboard
app.get('/', (req, res) => {
    res.render('index');
});

// Route to handle form submission and fetch products and collections
app.post('/search', async (req, res) => {
    const { websiteUrl } = req.body;
    const formattedUrl = ensureUrlFormat(websiteUrl);

    try {
        const [productsResponse, collectionsResponse] = await Promise.all([
            axios.get(`${formattedUrl}/products.json`),
            axios.get(`${formattedUrl}/collections.json`)
        ]);

        productsData = productsResponse.data.products || [];
        collectionsData = collectionsResponse.data.collections || [];

        res.render('results', { products: productsData, collections: collectionsData });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.send('Error fetching data from the provided website');
    }
});

// Route to display products
app.get('/products', (req, res) => {
    res.render('products', { products: productsData });
});

// Route to display a single product by ID
app.get('/product/:id', (req, res) => {
    const product = productsData.find(p => p.id.toString() === req.params.id);
    if (product) {
        res.render('product', { product });
    } else {
        res.send('Product not found');
    }
});

// Route to display collections
app.get('/collections', (req, res) => {
    res.render('collections', { collections: collectionsData });
});

// Route to display a single collection by ID
app.get('/collection/:id', (req, res) => {
    const collection = collectionsData.find(c => c.id.toString() === req.params.id);
    if (collection) {
        res.render('collection', { collection });
    } else {
        res.send('Collection not found');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
