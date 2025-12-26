const { Pool } = require('pg');

// PostgreSQL подключение
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function resetUidSequence() {
    console.log('🔄 Сброс счетчика UID...');
    
    try {
        // Сбрасываем счетчик UID
        await pool.query('ALTER SEQUENCE users_uid_seq RESTART WITH 1');
        
        console.log('✅ Счетчик UID сброшен на 1');
        console.log('✅ Следующий пользователь получит UID = 1');
        
    } catch (err) {
        console.error('❌ Ошибка при сбросе счетчика UID:', err);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

// Запуск
resetUidSequence();
