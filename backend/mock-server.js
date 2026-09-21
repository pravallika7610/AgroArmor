const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:8080",
    credentials: true
}));

// Mock user data
const users = [
    { id: 1, name: "deepthi", email: "deepthi.nettam@gmail.com", password: "DEMO_PASSWORD" }
];

// Mock todos data
let todos = [
    { id: 1, title: "Check chicken health", description: "Inspect all chickens for signs of disease", completed: false, isImportant: true, createdAt: new Date() },
    { id: 2, title: "Clean water containers", description: "Sanitize all water containers", completed: false, isImportant: false, createdAt: new Date() }
];

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Mock server is running' });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        res.json({ 
            success: true, 
            user: { id: user.id, name: user.name, email: user.email },
            token: 'mock-jwt-token'
        });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    const newUser = { id: users.length + 1, name, email, password };
    users.push(newUser);
    
    res.json({ 
        success: true, 
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
        token: 'mock-jwt-token'
    });
});

// Todo routes
app.get('/api/todos', (req, res) => {
    res.json(todos);
});

app.post('/api/todos', (req, res) => {
    const { title, description, isImportant } = req.body;
    const newTodo = {
        id: todos.length + 1,
        title,
        description,
        completed: false,
        isImportant: isImportant || false,
        createdAt: new Date()
    };
    todos.push(newTodo);
    res.json(newTodo);
});

app.put('/api/todos/:id/toggle', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        res.json(todo);
    } else {
        res.status(404).json({ error: 'Todo not found' });
    }
});

app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    todos = todos.filter(t => t.id !== id);
    res.json({ success: true });
});

// Notifications
app.get('/api/notifications', (req, res) => {
    res.json([
        { _id: 1, title: "Health Check Reminder", message: "Time to check your livestock health" },
        { _id: 2, title: "Vaccination Due", message: "Chicken vaccination is due this week" }
    ]);
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Mock server running on port ${PORT}`);
    console.log(`📱 Frontend client: http://localhost:8080`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
