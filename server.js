const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Configuração de segurança
const API_KEY = process.env.API_KEY || 'sua-chave-secreta-aqui';

// Middleware de autenticação
const authenticateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-master-key'] || req.headers['authorization'];
    
    if (!apiKey || apiKey !== API_KEY) {
        return res.status(401).json({ error: 'Chave da API inválida' });
    }
    
    next();
};

// Rota para criar novo backup
app.post('/b', authenticateApiKey, async (req, res) => {
    try {
        const backupData = req.body;
        const backupId = Date.now().toString();
        
        // Salvar backup no arquivo
        const backupPath = path.join(__dirname, 'backups', `${backupId}.json`);
        await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2));
        
        // Salvar metadados
        const metadataPath = path.join(__dirname, 'backups', 'metadata.json');
        let metadata = [];
        try {
            const existingMetadata = await fs.readFile(metadataPath, 'utf8');
            metadata = JSON.parse(existingMetadata);
        } catch (error) {
            // Arquivo não existe, criar novo
        }
        
        metadata.push({
            id: backupId,
            createdAt: new Date().toISOString(),
            totalAnimes: backupData.totalAnimes || 0,
            version: backupData.version || '1.0'
        });
        
        await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
        
        res.json({
            id: backupId,
            metadata: {
                id: backupId,
                createdAt: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('Erro ao criar backup:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para atualizar backup existente
app.put('/b/:id', authenticateApiKey, async (req, res) => {
    try {
        const { id } = req.params;
        const backupData = req.body;
        
        const backupPath = path.join(__dirname, 'backups', `${id}.json`);
        await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2));
        
        res.json({
            id: id,
            metadata: {
                id: id,
                updatedAt: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('Erro ao atualizar backup:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para buscar backup
app.get('/b/:id', authenticateApiKey, async (req, res) => {
    try {
        const { id } = req.params;
        const backupPath = path.join(__dirname, 'backups', `${id}.json`);
        
        const backupContent = await fs.readFile(backupPath, 'utf8');
        const backupData = JSON.parse(backupContent);
        
        res.json({
            record: backupData,
            metadata: {
                id: id,
                createdAt: new Date().toISOString()
            }
        });
        
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.status(404).json({ error: 'Backup não encontrado' });
        } else {
            console.error('Erro ao buscar backup:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
    }
    }
});

// Rota para listar todos os backups
app.get('/b', authenticateApiKey, async (req, res) => {
    try {
        const metadataPath = path.join(__dirname, 'backups', 'metadata.json');
        
        try {
            const metadata = await fs.readFile(metadataPath, 'utf8');
            res.json(JSON.parse(metadata));
        } catch (error) {
            res.json([]);
        }
        
    } catch (error) {
        console.error('Erro ao listar backups:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para deletar backup
app.delete('/b/:id', authenticateApiKey, async (req, res) => {
    try {
        const { id } = req.params;
        const backupPath = path.join(__dirname, 'backups', `${id}.json`);
        
        await fs.unlink(backupPath);
        
        // Remover dos metadados
        const metadataPath = path.join(__dirname, 'backups', 'metadata.json');
        let metadata = [];
        try {
            const existingMetadata = await fs.readFile(metadataPath, 'utf8');
            metadata = JSON.parse(existingMetadata);
        } catch (error) {
            // Arquivo não existe
        }
        
        metadata = metadata.filter(item => item.id !== id);
        await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
        
        res.json({ message: 'Backup deletado com sucesso' });
        
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.status(404).json({ error: 'Backup não encontrado' });
        } else {
            console.error('Erro ao deletar backup:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
});

// Criar diretório de backups se não existir
async function createBackupsDirectory() {
    const backupsDir = path.join(__dirname, 'backups');
    try {
        await fs.access(backupsDir);
    } catch (error) {
        await fs.mkdir(backupsDir);
        console.log('Diretório de backups criado');
    }
}

// Inicializar servidor
async function startServer() {
    await createBackupsDirectory();
    
    app.listen(PORT, () => {
        console.log(`🚀 Servidor de backup rodando na porta ${PORT}`);
        console.log(`📁 Diretório de backups: ${path.join(__dirname, 'backups')}`);
        console.log(`🔑 Sua chave da API: ${API_KEY}`);
        console.log(`🌐 URL do servidor: http://localhost:${PORT}`);
        console.log('\n📋 Para usar no sistema:');
        console.log(`   URL: http://localhost:${PORT}`);
        console.log(`   Chave da API: ${API_KEY}`);
    });
}

startServer().catch(console.error);
