document.addEventListener('DOMContentLoaded', () => {
  console.log('Ticker App initialized');
  
  // Elements
  const tickerForm = document.getElementById('tickerForm');
  const tickerInput = document.getElementById('tickerInput');
  const resultsContainer = document.getElementById('resultsContainer');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const popularTickerButtons = document.querySelectorAll('.popular-ticker-btn');
  
  // Event listeners
  if (tickerForm) {
    tickerForm.addEventListener('submit', handleTickerSubmit);
  }
  
  if (popularTickerButtons) {
    popularTickerButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (tickerInput) {
          tickerInput.value = button.dataset.symbol;
          tickerForm.dispatchEvent(new Event('submit'));
        }
      });
    });
  }
  
  // Handle form submission
  async function handleTickerSubmit(e) {
    e.preventDefault();
    
    const ticker = tickerInput.value.trim().toUpperCase();
    if (!ticker) return;
    
    try {
      showLoading();
      
      // Fetch ticker data
      const response = await fetch(`/api/ticker/${ticker}`);
      const data = await response.json();
      
      if (response.ok) {
        displayTickerData(data);
      } else {
        displayError(data.message || 'Failed to fetch ticker data');
      }
    } catch (error) {
      console.error('Error fetching ticker data:', error);
      displayError('An unexpected error occurred. Please try again.');
    } finally {
      hideLoading();
    }
  }
  
  // Display ticker data
  function displayTickerData(data) {
    if (!resultsContainer) return;
    
    // Format price with 2 decimal places
    const formattedPrice = parseFloat(data.price_24h).toFixed(2);
    
    // Calculate price change percentage
    const priceChange = data.price_24h - data.price_24h_ago;
    const priceChangePercent = (priceChange / data.price_24h_ago * 100).toFixed(2);
    const isPositive = priceChange >= 0;
    
    const html = `
      <div class="ticker-card">
        <div class="ticker-symbol">${data.symbol}</div>
        <div class="ticker-price">$${formattedPrice}</div>
        <div class="ticker-change ${isPositive ? 'positive-change' : 'negative-change'}">
          ${isPositive ? '+' : ''}${priceChangePercent}%
        </div>
        
        <div class="ticker-details">
          <div class="ticker-detail-item">
            <span class="ticker-detail-label">Volume 24h:</span>
            <span class="ticker-detail-value">$${formatNumber(data.volume_24h)}</span>
          </div>
          <div class="ticker-detail-item">
            <span class="ticker-detail-label">Last Trade:</span>
            <span class="ticker-detail-value">${formatDate(data.last_trade_time)}</span>
          </div>
          <div class="ticker-detail-item">
            <span class="ticker-detail-label">Symbol:</span>
            <span class="ticker-detail-value">${data.symbol}</span>
          </div>
        </div>
      </div>
    `;
    
    resultsContainer.innerHTML = html;
  }
  
  // Display error message
  function displayError(message) {
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = `
      <div class="error-message">
        <strong>Error:</strong> ${message}
      </div>
    `;
  }
  
  // Show loading spinner
  function showLoading() {
    if (loadingSpinner) {
      loadingSpinner.style.display = 'inline-block';
    }
    if (resultsContainer) {
      resultsContainer.innerHTML = '';
    }
  }
  
  // Hide loading spinner
  function hideLoading() {
    if (loadingSpinner) {
      loadingSpinner.style.display = 'none';
    }
  }
  
  // Helper function to format large numbers
  function formatNumber(num) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2
    }).format(num);
  }
  
  // Helper function to format date
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }
}); 