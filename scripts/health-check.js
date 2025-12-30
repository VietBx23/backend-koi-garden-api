import fetch from 'node-fetch';

const HEALTH_CHECK_URL = process.env.HEALTH_CHECK_URL || 'http://localhost:3000/health';

const checkHealth = async () => {
  try {
    console.log(`🔍 Checking health at: ${HEALTH_CHECK_URL}`);
    
    const response = await fetch(HEALTH_CHECK_URL);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Health check passed');
      console.log('📊 Status:', data.status);
      console.log('🕐 Timestamp:', data.timestamp);
      console.log('🌍 Environment:', data.environment);
      process.exit(0);
    } else {
      console.error('❌ Health check failed');
      console.error('📊 Status:', response.status);
      console.error('📝 Response:', data);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Health check error:', error.message);
    process.exit(1);
  }
};

checkHealth();