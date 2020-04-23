CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT, 
    precio DECIMAL,
    tipo TEXT,
    calificacion INT
);

INSERT or IGNORE INTO games (id, nombre, precio, tipo, calificacion) VALUES (1, 'Age Of Empires II', 35.99, 'R.T.S.', 9);
INSERT or IGNORE INTO games (id, nombre, precio, tipo, calificacion) VALUES (2, 'Starcraft Remastered', 15.99, 'R.T.S.', 9);