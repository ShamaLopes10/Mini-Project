const bcrypt = require('bcrypt');
bcrypt.hash('password123', 10).then(console.log);
