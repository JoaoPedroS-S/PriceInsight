import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

// Types
interface Product {
    id: string;
    name: string;
    brand: string;
    category: string;
    unit: string;
    description?: string;
    imageUrl?: string;
    createdAt: number;
}

interface Market {
    id: string;
    name: string;
    location: string;
    region: string;
    deliveryAvailable: boolean;
}

interface PriceHistory {
    id: string;
    oldPrice: number;
    newPrice: number;
    date: number;
}

interface PriceRecord {
    id: string;
    productId: string;
    marketId: string;
    price: number;
    isPromotion: boolean;
    promotionDetails?: string;
    date: number;
    history: PriceHistory[];
}

const DATA_FILE = path.join(process.cwd(), "data.json");

// Initial state if file doesn't exist
const initialState = {
    products: [],
    markets: [],
    prices: []
};

function loadData() {
    if (fs.existsSync(DATA_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
        } catch (e) {
            console.error("Error loading data", e);
            return initialState;
        }
    }
    return initialState;
}

function saveData(data: any) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let db = loadData();

async function startServer() {
    const app = express();
    const PORT = 3000;

    app.use(express.json());

    // API Routes
    
    // Products
    app.get("/api/products", (req, res) => {
        res.json(db.products);
    });

    app.post("/api/products", (req, res) => {
        const product = { ...req.body, id: Math.random().toString(36).substring(2, 9), createdAt: Date.now() };
        db.products.push(product);
        saveData(db);
        res.status(201).json(product);
    });

    app.put("/api/products/:id", (req, res) => {
        const { id } = req.params;
        db.products = db.products.map((p: any) => p.id === id ? { ...p, ...req.body } : p);
        saveData(db);
        res.json(db.products.find((p: any) => p.id === id));
    });

    app.delete("/api/products/:id", (req, res) => {
        const { id } = req.params;
        db.products = db.products.filter((p: any) => p.id !== id);
        db.prices = db.prices.filter((p: any) => p.productId !== id);
        saveData(db);
        res.status(204).send();
    });

    // Markets
    app.get("/api/markets", (req, res) => {
        res.json(db.markets);
    });

    app.post("/api/markets", (req, res) => {
        const market = { ...req.body, id: Math.random().toString(36).substring(2, 9) };
        db.markets.push(market);
        saveData(db);
        res.status(201).json(market);
    });

    app.put("/api/markets/:id", (req, res) => {
        const { id } = req.params;
        db.markets = db.markets.map((m: any) => m.id === id ? { ...m, ...req.body } : m);
        saveData(db);
        res.json(db.markets.find((m: any) => m.id === id));
    });

    app.delete("/api/markets/:id", (req, res) => {
        const { id } = req.params;
        db.markets = db.markets.filter((m: any) => m.id !== id);
        db.prices = db.prices.filter((p: any) => p.marketId !== id);
        saveData(db);
        res.status(204).send();
    });

    // Prices
    app.get("/api/prices", (req, res) => {
        // Safe check for DB structure
        if (!db) db = loadData();
        res.json(db.prices || []);
    });

    app.get("/api/prices/product/:productId", (req, res) => {
        const { productId } = req.params;
        console.log(`[API Validation] Request received to fetch prices for productId: "${productId}"`);
        
        if (!productId) {
            console.warn(`[API Validation] Missing productId in request params`);
            return res.status(400).json({ error: "O ID do produto (productId) é obrigatório." });
        }

        // Reload data to ensure synchronization
        try {
            db = loadData();
        } catch (e) {
            console.error(`[API Validation] Failed to reload database file:`, e);
        }

        const allPrices = db.prices || [];
        const prices = allPrices.filter((p: any) => p && String(p.productId) === String(productId));
        
        console.log(`[API Validation] Successfully found ${prices.length} price records for product "${productId}".`);
        res.setHeader('X-API-Validated', 'true');
        res.json(prices);
    });

    app.post("/api/prices", (req, res) => {
        const price = { 
            ...req.body, 
            id: Math.random().toString(36).substring(2, 9), 
            date: Date.now(),
            history: []
        };
        db.prices.push(price);
        saveData(db);
        res.status(201).json(price);
    });

    app.patch("/api/prices/:id", (req, res) => {
        const { id } = req.params;
        const oldRecordIndex = db.prices.findIndex((p: any) => p.id === id);
        
        if (oldRecordIndex === -1) {
            return res.status(404).json({ error: "Price record not found" });
        }

        const oldRecord = db.prices[oldRecordIndex];
        const newPrice = req.body.price;
        
        // If price is being updated and it's different from current price, record history
        if (newPrice !== undefined && newPrice !== oldRecord.price) {
            const historyEntry: PriceHistory = {
                id: Math.random().toString(36).substring(2, 9),
                oldPrice: oldRecord.price,
                newPrice: newPrice,
                date: Date.now()
            };
            
            // Initialize history if it doesn't exist (for older records)
            if (!oldRecord.history) oldRecord.history = [];
            oldRecord.history.push(historyEntry);
        }

        db.prices[oldRecordIndex] = { ...oldRecord, ...req.body, date: Date.now() };
        saveData(db);
        res.json(db.prices[oldRecordIndex]);
    });

    app.delete("/api/prices/:id", (req, res) => {
        const { id } = req.params;
        db.prices = db.prices.filter((p: any) => p.id !== id);
        saveData(db);
        res.status(204).send();
    });

    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: "spa",
        });
        app.use(vite.middlewares);
    } else {
        const distPath = path.join(process.cwd(), "dist");
        app.use(express.static(distPath));
        app.get("*", (req, res) => {
            res.sendFile(path.join(distPath, "index.html"));
        });
    }

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();
