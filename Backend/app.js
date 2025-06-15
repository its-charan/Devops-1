require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectDB();

const db = client.db("todoapp");
const todosCollection = db.collection("todos");

// Routes
// Get all todos
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await todosCollection.find({}).toArray();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new todo
app.post('/api/todos', async (req, res) => {
    try {
        const todo = {
            text: req.body.text,
            completed: false,
            createdAt: new Date()
        };
        const result = await todosCollection.insertOne(todo);
        res.status(201).json({ ...todo, _id: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update todo
app.put('/api/todos/:id', async (req, res) => {
    try {
        const result = await todosCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { completed: req.body.completed } }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json({ message: "Todo updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete todo
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const result = await todosCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json({ message: "Todo deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 