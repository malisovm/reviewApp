import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import * as path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const expressServer = express();
const PORT = process.env.PORT || 3001;
expressServer.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')));
expressServer.listen(PORT, () => {
    console.log(`The server is up at ${PORT}`);
});
expressServer.get('*', (res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'));
});
//# sourceMappingURL=server.js.map