const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// Configuration
const TOKEN = "8290318622:AAFqN1q8WaTmwzqL6TAYwdVcPmzykRFHdjs";
const PORT = process.env.PORT || 5000;

// Initialisation du bot
const bot = new TelegramBot(TOKEN, { polling: true });

// Initialisation du serveur Express pour Render
const app = express();

// --- Commandes de base ---
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Salut ! Je suis ton bot avancé avec Apple of Fortune 🍏🍎");
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpText = `
📋 **Liste des commandes disponibles :**

/start - Démarrer le bot
/help - Afficher cette aide
/apple - Jouer à Apple of Fortune
/jouer - Lancer un tour de jeu
/stop - Arrêter de jouer

🎮 **Apple of Fortune :**
- Génère une grille 5x5 de pommes
- Calcule un multiplicateur aléatoire
- Parfait pour les jeux de hasard !
    `;
    bot.sendMessage(chatId, helpText);
});

// --- Apple of Fortune ---
bot.onText(/\/apple/, (msg) => {
    const chatId = msg.chat.id;
    
    // Générer la grille 5x5
    const grid = generateAppleGrid();
    const display = grid.map(row => row.join('')).join('\n');
    
    // Calculer le multiplicateur
    const multiplier = (Math.random() * 9 + 1).toFixed(2);
    
    const response = `
🎰 **Apple of Fortune** 🎰

Voici ta grille :
${display}

✨ **Multiplicateur : x${multiplier}**

Bonne chance ! 🍀
    `;
    
    bot.sendMessage(chatId, response);
});

// --- Commande Jouer ---
bot.onText(/\/jouer/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "🎮 Tu as lancé ton tour ! 🍏🍎\nTape /apple pour voir ta grille et ton multiplicateur !");
});

// --- Commande Stop ---
bot.onText(/\/stop/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "🛑 Le bot continue à tourner, mais tu peux arrêter de jouer.\nTape /apple si tu veux rejouer !");
});

// --- Réponses aux messages texte ---
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    
    // Ignorer les messages qui sont des commandes
    if (msg.text && msg.text.startsWith('/')) {
        return;
    }
    
    // Répondre aux messages texte normaux
    if (msg.text) {
        bot.sendMessage(chatId, "❓ Commande inconnue. Tape /help pour la liste des commandes disponibles.");
    }
});

// --- Fonction pour générer la grille de pommes ---
function generateAppleGrid() {
    const grid = [];
    const apples = ['🍏', '🍎', '🍎', '🍏']; // Plus de pommes rouges pour l'équilibre
    
    for (let i = 0; i < 5; i++) {
        const row = [];
        for (let j = 0; j < 5; j++) {
            // Choisir une pomme aléatoire
            const randomApple = apples[Math.floor(Math.random() * apples.length)];
            row.push(randomApple);
        }
        grid.push(row);
    }
    
    return grid;
}

// --- Gestion des erreurs ---
bot.on('polling_error', (error) => {
    console.log('Erreur de polling:', error);
});

bot.on('webhook_error', (error) => {
    console.log('Erreur webhook:', error);
});

// --- Serveur Express pour Render ---
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'Bot Telegram Apple of Fortune en ligne !',
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Bot démarré sur le port ${PORT}`);
    console.log(`📱 Bot Telegram: Apple of Fortune`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
    console.log('🛑 Arrêt du bot...');
    bot.stopPolling();
    process.exit();
});

process.on('SIGTERM', () => {
    console.log('🛑 Arrêt du bot...');
    bot.stopPolling();
    process.exit();
});