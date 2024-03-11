const express = require('express');
const router = require('./router');

const app = new express();

app.use('/api', router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
