const app = require('./src/app');
require('dotenv').config();
const {PORT} = require('./src/config/config');

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

