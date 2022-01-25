import dotenv from 'dotenv'
dotenv.config();

import App from './app'

const PORT: number = parseInt(process.env.PORT || "5000")
new App().Start(PORT)
