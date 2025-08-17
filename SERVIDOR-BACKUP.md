# 🚀 Servidor de Backup para Catálogo de Animes

Este é um servidor Node.js simples para fazer backup dos seus dados de anime na nuvem.

## 📋 Pré-requisitos

- **Node.js** instalado (versão 14 ou superior)
- **npm** ou **yarn** para gerenciar dependências

## 🛠️ Instalação e Configuração

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Chave da API
Edite o arquivo `server.js` e altere esta linha:
```javascript
const API_KEY = process.env.API_KEY || 'sua-chave-secreta-aqui';
```

**Exemplo de chave segura:**
```javascript
const API_KEY = process.env.API_KEY || 'minha-chave-super-secreta-123456';
```

### 3. Iniciar o Servidor
```bash
npm start
```

**Para desenvolvimento (com auto-reload):**
```bash
npm run dev
```

## 🌐 Configuração no Sistema

### No seu catálogo de animes:
1. Clique em **"Backup na Nuvem"**
2. Configure:
   - **URL do Servidor**: `http://localhost:3000`
   - **Chave da API**: `minha-chave-super-secreta-123456` (ou a que você definiu)
   - **ID do Bin**: Deixe vazio

## 📁 Estrutura dos Backups

O servidor cria automaticamente:
```
backups/
├── metadata.json          # Lista de todos os backups
├── 1234567890.json       # Backup individual
├── 1234567891.json       # Outro backup
└── ...
```

## 🔒 Segurança

- **Chave da API obrigatória** para todas as operações
- **CORS habilitado** para acesso local
- **Validação de dados** antes de salvar

## 📡 Endpoints da API

### POST `/b` - Criar novo backup
- **Headers**: `X-Master-Key: sua-chave`
- **Body**: Dados do catálogo em JSON

### PUT `/b/:id` - Atualizar backup existente
- **Headers**: `X-Master-Key: sua-chave`
- **Body**: Dados atualizados em JSON

### GET `/b/:id` - Buscar backup específico
- **Headers**: `X-Master-Key: sua-chave`
- **Response**: Dados do backup

### GET `/b` - Listar todos os backups
- **Headers**: `X-Master-Key: sua-chave`
- **Response**: Lista de metadados

### DELETE `/b/:id` - Deletar backup
- **Headers**: `X-Master-Key: sua-chave`

## 🌍 Deploy na Internet

### Opção A: Heroku (Gratuito)
1. Crie conta no [Heroku](https://heroku.com)
2. Instale o Heroku CLI
3. Execute:
```bash
heroku create seu-app-nome
git add .
git commit -m "Servidor de backup"
git push heroku main
```

### Opção B: Vercel (Gratuito)
1. Crie conta no [Vercel](https://vercel.com)
2. Conecte seu repositório GitHub
3. Deploy automático

### Opção C: Railway (Gratuito)
1. Crie conta no [Railway](https://railway.app)
2. Conecte seu repositório
3. Deploy automático

## 🔧 Variáveis de Ambiente

### Para produção, use:
```bash
export API_KEY="sua-chave-super-secreta"
export PORT=3000
```

### Para Heroku:
```bash
heroku config:set API_KEY="sua-chave-super-secreta"
```

## 📱 Testando a API

### Com cURL:
```bash
# Testar conexão
curl -H "X-Master-Key: sua-chave" http://localhost:3000/b

# Criar backup
curl -X POST -H "X-Master-Key: sua-chave" \
  -H "Content-Type: application/json" \
  -d '{"teste": "dados"}' \
  http://localhost:3000/b
```

### Com Postman:
1. **URL**: `http://localhost:3000/b`
2. **Headers**: `X-Master-Key: sua-chave`
3. **Method**: POST/PUT/GET/DELETE

## 🚨 Solução de Problemas

### Erro: "Chave da API inválida"
- Verifique se a chave está correta no sistema
- Confirme se o header `X-Master-Key` está sendo enviado

### Erro: "CORS"
- O servidor já tem CORS habilitado
- Verifique se a URL está correta

### Erro: "Porta já em uso"
- Mude a porta no `server.js`
- Ou mate o processo usando a porta 3000

## 📊 Monitoramento

O servidor mostra logs no console:
- ✅ Backups criados
- ✅ Backups atualizados
- ✅ Erros de validação
- ✅ Status de conexão

## 🔄 Backup Automático

Para fazer backup automático, você pode:
1. **Agendar** com cron (Linux/Mac)
2. **Usar** o Windows Task Scheduler
3. **Configurar** webhook para sincronização

## 💡 Dicas de Segurança

1. **Use chaves longas** e complexas
2. **Não compartilhe** sua chave da API
3. **Monitore** os logs do servidor
4. **Faça backup** dos próprios backups
5. **Use HTTPS** em produção

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs do console
2. Confirme se todas as dependências estão instaladas
3. Teste a API com cURL ou Postman
4. Verifique se a porta não está sendo usada por outro serviço

---

**🎯 Agora você tem um servidor de backup completo e funcional!**
