# Crypto Ticker Dashboard

A modern web application that displays real-time cryptocurrency ticker information using the Blockchain.com API.

![Crypto Ticker Dashboard](https://via.placeholder.com/800x400?text=Crypto+Ticker+Dashboard)

## Features

- 🚀 Real-time cryptocurrency ticker information
- 📊 Clean and modern UI with responsive design
- 💰 Support for multiple cryptocurrency pairs
- 📱 Mobile-friendly interface
- 🔄 Caching system for improved performance
- 🎨 Beautiful visualizations of price data

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript, EJS templates, Bootstrap 5
- **API**: Blockchain.com Exchange API
- **Other**: Axios for HTTP requests, Chalk for colorful console output

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/crypto-ticker-dashboard.git
   cd crypto-ticker-dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:

   ```
   PORT=3000
   API_URL=https://api.blockchain.com/v3/exchange
   API_KEY=your_api_key_here
   ```

   > Note: You can get an API key by signing up at [Blockchain.com](https://exchange.blockchain.com/api).

4. Start the application:

   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Development Mode

To run the application in development mode with automatic reloading:

```bash
npm run dev
```

## API Endpoints

The application provides the following API endpoints:

- `GET /api/symbols` - Get all available cryptocurrency symbols
- `GET /api/ticker/:symbol` - Get ticker information for a specific symbol (e.g., BTC-USD)

## Project Structure

```
crypto-ticker-dashboard/
├── public/               # Static assets
│   ├── scripts/          # Client-side JavaScript
│   └── styles/           # CSS files
├── views/                # EJS templates
│   ├── partials/         # Reusable template parts
│   └── index.ejs         # Main page template
├── .env                  # Environment variables
├── .gitignore            # Git ignore file
├── index.js              # Main application file
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgements

- [Blockchain.com API](https://exchange.blockchain.com/api) for providing cryptocurrency data
- [Bootstrap](https://getbootstrap.com/) for the responsive design framework
- [Express.js](https://expressjs.com/) for the web application framework
