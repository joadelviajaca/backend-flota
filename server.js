const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = 'super_secret_fleet_key_2024';

// ==========================================
// 💾 BASE DE DATOS EN MEMORIA (Se resetea al reiniciar)
// ==========================================
let spaceships = [
    { id: 1, registrationCode: 'SYS-001', name: 'Vanguardia', class: 'Crucero', status: 'OPERATIONAL', commissionDate: '2026-01-15', lastMaintenanceDate: '2026-03-01' },
    { id: 2, registrationCode: 'SYS-042', name: 'Nebula', class: 'Exploración', status: 'MAINTENANCE', commissionDate: '2026-01-20', lastMaintenanceDate: '2026-02-15' }
];

let crewMembers = [
    { id: 1, name: 'Comandante Shepard', rank: 'Captain', spaceshipId: 1 },
    { id: 2, name: 'Oficial Ripley', rank: 'Lieutenant', spaceshipId: 1 },
    { id: 3, name: 'Ingeniero Clarke', rank: 'Engineer', spaceshipId: 2 }
];

// ==========================================
// 🛡️ MIDDLEWARE DE AUTENTICACIÓN
// ==========================================
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token no proporcionado o inválido' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token expirado o corrupto' });
    }
};

// ==========================================
// 🔑 ENDPOINTS DE AUTENTICACIÓN
// ==========================================

// 1. Login (Devuelve el objeto directamente)
app.post('/auth/login', (req, res) => {
    const { codeName, password } = req.body;

    if (codeName === 'Admin' && password === '123456') {
        const token = jwt.sign({ id: 99, role: 'ADMIRAL', codeName }, SECRET_KEY, { expiresIn: '2h' });
        res.status(200).json({
            token: token,
            id: 99,
            role: 'ADMIRAL',
            codeName: 'Admin'
        });
    } else {
        res.status(401).json({ message: 'Credenciales incorrectas' });
    }
});

// 2. Verificar Token (Perfil Activo) - Pide el Token en el Header
app.get('/auth/active-profile', authenticate, (req, res) => {
    // Respuesta directa con los datos del usuario logueado
    res.status(200).json({
        id: req.user.id,
        codeName: req.user.codeName,
        role: req.user.role,
        fleetClearance: 'LEVEL_10'
    });
});

// ==========================================
// ⏱️ ENDPOINT DE VALIDACIÓN ASÍNCRONA
// ==========================================

// Verifica si un código de matrícula de nave ya está en uso. 
app.get('/spaceships/check-registration', (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: 'Código requerido' });

    const exists = spaceships.some(ship => ship.registrationCode.toLowerCase() === code.toLowerCase());

    // Devuelve directamente el objeto con el booleano
    res.status(200).json({
        isAvailable: !exists
    });
});

// ==========================================
// 🚀 CRUD 1: NAVES ESPACIALES (SPACESHIPS)
// ==========================================

app.get('/spaceships', authenticate, (req, res) => {
    res.status(200).json(spaceships); // Array directo
});

app.get('/spaceships/:id', authenticate, (req, res) => {
    const ship = spaceships.find(s => s.id === parseInt(req.params.id));
    if (ship) res.status(200).json(ship); // Objeto directo
    else res.status(404).json({ message: 'Nave no encontrada' });
});

app.post('/spaceships', authenticate, (req, res) => {
    const newShip = { id: Date.now(), ...req.body };
    spaceships.push(newShip);
    res.status(201).json(newShip);
});

app.put('/spaceships/:id', authenticate, (req, res) => {
    const index = spaceships.findIndex(s => s.id === parseInt(req.params.id));
    if (index !== -1) {
        spaceships[index] = { ...spaceships[index], ...req.body };
        res.status(200).json(spaceships[index]);
    } else {
        res.status(404).json({ message: 'Nave no encontrada' });
    }
});

app.delete('/spaceships/:id', authenticate, (req, res) => {
    spaceships = spaceships.filter(s => s.id !== parseInt(req.params.id));
    res.status(204).send(); // Sin contenido en la respuesta
});

// ==========================================
// 👨‍🚀 CRUD 2: TRIPULACIÓN (CREW)
// ==========================================

app.get('/crew', authenticate, (req, res) => {
    res.status(200).json(crewMembers); // Array directo
});

app.get('/crew/:id', authenticate, (req, res) => {
    const member = crewMembers.find(c => c.id === parseInt(req.params.id));
    if (member) res.status(200).json(member);
    else res.status(404).json({ message: 'Tripulante no encontrado' });
});

app.post('/crew', authenticate, (req, res) => {
    const newMember = { id: Date.now(), ...req.body };
    crewMembers.push(newMember);
    res.status(201).json(newMember);
});

app.put('/crew/:id', authenticate, (req, res) => {
    const index = crewMembers.findIndex(c => c.id === parseInt(req.params.id));
    if (index !== -1) {
        crewMembers[index] = { ...crewMembers[index], ...req.body };
        res.status(200).json(crewMembers[index]);
    } else {
        res.status(404).json({ message: 'Tripulante no encontrado' });
    }
});

app.delete('/crew/:id', authenticate, (req, res) => {
    crewMembers = crewMembers.filter(c => c.id !== parseInt(req.params.id));
    res.status(204).send();
});

// ==========================================
// 🚀 INICIO DEL SERVIDOR
// ==========================================
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`🚀 API Flota Espacial operativa en http://localhost:${PORT}`);
    console.log(`🔑 Credenciales de prueba: codeName: "Admin" / password: "123456"`);
});