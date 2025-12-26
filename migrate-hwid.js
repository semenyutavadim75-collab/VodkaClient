const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('❌ Ошибка подключения к БД:', err);
        process.exit(1);
    }
    console.log('✅ Подключено к базе данных');
});

// Добавляем колонки HWID
db.serialize(() => {
    console.log('🔄 Добавление колонок HWID...');
    
    db.run(`ALTER TABLE users ADD COLUMN hwid TEXT DEFAULT NULL`, (err) => {
        if (err) {
            if (err.message.includes('duplicate column')) {
                console.log('⚠️  Колонка hwid уже существует');
            } else {
                console.error('❌ Ошибка добавления hwid:', err.message);
            }
        } else {
            console.log('✅ Колонка hwid добавлена');
        }
    });
    
    db.run(`ALTER TABLE users ADD COLUMN hwid_set_at DATETIME DEFAULT NULL`, (err) => {
        if (err) {
            if (err.message.includes('duplicate column')) {
                console.log('⚠️  Колонка hwid_set_at уже существует');
            } else {
                console.error('❌ Ошибка добавления hwid_set_at:', err.message);
            }
        } else {
            console.log('✅ Колонка hwid_set_at добавлена');
        }
        
        // Закрываем соединение после всех операций
        db.close((err) => {
            if (err) {
                console.error('❌ Ошибка закрытия БД:', err);
            } else {
                console.log('✅ Миграция завершена!');
            }
        });
    });
});
