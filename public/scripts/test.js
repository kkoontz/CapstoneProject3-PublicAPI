/**
 * Test script for Crypto Ticker Dashboard API
 * This script tests the API endpoints and logs the results
 */

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🧪 Running API tests...');
  
  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'test-results';
  document.body.appendChild(resultsContainer);
  
  // Test symbols endpoint
  try {
    console.log('Testing /api/symbols endpoint...');
    const symbolsResponse = await fetch('/api/symbols');
    const symbolsData = await symbolsResponse.json();
    
    if (symbolsResponse.ok) {
      console.log('✅ Symbols endpoint test passed!');
      console.log(`Found ${Object.keys(symbolsData).length} symbols`);
      logTestResult('Symbols Endpoint', true, `Found ${Object.keys(symbolsData).length} symbols`);
    } else {
      console.error('❌ Symbols endpoint test failed!');
      logTestResult('Symbols Endpoint', false, symbolsData.message || 'Unknown error');
    }
  } catch (error) {
    console.error('❌ Symbols endpoint test error:', error);
    logTestResult('Symbols Endpoint', false, error.message);
  }
  
  // Test ticker endpoint with a valid symbol
  try {
    const testSymbol = 'BTC-USD';
    console.log(`Testing /api/ticker/${testSymbol} endpoint...`);
    const tickerResponse = await fetch(`/api/ticker/${testSymbol}`);
    const tickerData = await tickerResponse.json();
    
    if (tickerResponse.ok) {
      console.log('✅ Ticker endpoint test passed!');
      console.log('Ticker data:', tickerData);
      logTestResult(`Ticker Endpoint (${testSymbol})`, true, `Price: $${tickerData.price_24h}`);
    } else {
      console.error('❌ Ticker endpoint test failed!');
      logTestResult(`Ticker Endpoint (${testSymbol})`, false, tickerData.message || 'Unknown error');
    }
  } catch (error) {
    console.error('❌ Ticker endpoint test error:', error);
    logTestResult('Ticker Endpoint (BTC-USD)', false, error.message);
  }
  
  // Test ticker endpoint with an invalid symbol
  try {
    const invalidSymbol = 'INVALID-SYMBOL';
    console.log(`Testing /api/ticker/${invalidSymbol} endpoint with invalid symbol...`);
    const invalidResponse = await fetch(`/api/ticker/${invalidSymbol}`);
    const invalidData = await invalidResponse.json();
    
    if (!invalidResponse.ok && invalidResponse.status === 404) {
      console.log('✅ Invalid ticker test passed! (Expected 404)');
      logTestResult(`Invalid Ticker Test (${invalidSymbol})`, true, 'Correctly returned 404');
    } else {
      console.error('❌ Invalid ticker test failed! Expected 404 but got:', invalidResponse.status);
      logTestResult(`Invalid Ticker Test (${invalidSymbol})`, false, `Expected 404, got ${invalidResponse.status}`);
    }
  } catch (error) {
    console.error('❌ Invalid ticker test error:', error);
    logTestResult('Invalid Ticker Test', false, error.message);
  }
  
  /**
   * Log test result to the page
   * @param {string} testName - Name of the test
   * @param {boolean} passed - Whether the test passed
   * @param {string} message - Additional message
   */
  function logTestResult(testName, passed, message) {
    const resultElement = document.createElement('div');
    resultElement.className = `test-result ${passed ? 'test-passed' : 'test-failed'}`;
    
    resultElement.innerHTML = `
      <h3>${passed ? '✅' : '❌'} ${testName}</h3>
      <p>${message}</p>
    `;
    
    resultsContainer.appendChild(resultElement);
  }
}); 