const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5003;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const veterinarians = [
    { id: 1, name: 'Dr. Ramesh Kumar', specialty: 'Large Animal Veterinarian', phone: '+91-9876543210', email: 'ramesh.vet@example.com', distance: 2.3, animals: ['Cattle', 'Buffalo', 'Goat', 'Sheep'], lat: 12.9716, lng: 77.5946 },
    { id: 2, name: 'Dr. Priya Sharma', specialty: 'Poultry Specialist', phone: '+91-9876543211', email: 'priya.vet@example.com', distance: 3.1, animals: ['Poultry'], lat: 12.9816, lng: 77.6046 },
    { id: 3, name: 'Dr. Amit Patel', specialty: 'Cattle Specialist', phone: '+91-9876543212', email: 'amit.vet@example.com', distance: 4.5, animals: ['Cattle', 'Buffalo'], lat: 12.9616, lng: 77.5846 }
];

app.get('/api/veterinarians', (req, res) => {
    const { animal, radius } = req.query;
    let filtered = [...veterinarians];
    
    if (animal) {
        filtered = filtered.filter(v => v.animals.some(a => a.toLowerCase().includes(animal.toLowerCase())));
    }
    if (radius) {
        filtered = filtered.filter(v => v.distance <= parseFloat(radius));
    }
    
    res.json(filtered);
});

app.get('/api/veterinarians/:id', (req, res) => {
    const vet = veterinarians.find(v => v.id === parseInt(req.params.id));
    vet ? res.json(vet) : res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
    console.log(`🐄 Veterinary Backend running on http://localhost:${PORT}`);
    console.log(`📍 Open http://localhost:${PORT}/veterinary-gps-working.html`);
});
