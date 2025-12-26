const { Pool } = require('pg');

// PostgreSQL подключение
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function resetDatabase() {
    console.log('⚠️  ВНИМАНИЕ! Сейчас будет выполнен ПОЛНЫЙ СБРОС базы данных!');
    console.log('⚠️  Все пользователи, ключи и подписки будут УДАЛЕНЫ!');
    console.log('');
    
    try {
        // Удаляем все данные из таблиц
        console.log('🗑️  Удаление всех пользователей...');
        await pool.query('DELETE FROM users');
        
        console.log('🗑️  Удаление всех ключей...');
        await pool.query('DELETE FROM keys');
        
        // Сбрасываем счетчики автоинкремента (SERIAL)
        console.log('🔄 Сброс счетчиков ID...');
        await pool.query('ALTER SEQUENCE users_uid_seq RESTART WITH 1');
        await pool.query('ALTER SEQUENCE keys_id_seq RESTART WITH 1');
        
        console.log('');
        console.log('✅ База данных полностью очищена!');
        console.log('✅ Следующий пользователь получит UID = 1');
        console.log('✅ Следующий ключ получит ID = 1');
        
    } catch (err) {
        console.error('❌ Ошибка при сбросе базы данных:', err);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

// Запуск
resetDatabase();
