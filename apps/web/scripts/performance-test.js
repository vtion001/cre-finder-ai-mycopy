const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Performance test configuration
const config = {
  target: 'http://localhost:3001',
  phases: [
    { duration: 60, arrivalRate: 5, name: 'Warm up' },
    { duration: 120, arrivalRate: 10, name: 'Sustained load' },
    { duration: 60, arrivalRate: 20, name: 'Peak load' },
    { duration: 60, arrivalRate: 5, name: 'Cool down' }
  ],
  scenarios: [
    {
      name: 'Campaign Creation Flow',
      weight: 30,
      flow: [
        { get: { url: '/en/dashboard/campaigns' } },
        { think: 2 },
        { post: { 
          url: '/api/campaigns', 
          json: {
            name: 'Performance Test Campaign',
            description: 'Test campaign for performance validation',
            channels: {
              sms: {
                enabled: true,
                message: 'Performance test SMS',
                from: '+1234567890'
              }
            }
          }
        }},
        { think: 1 }
      ]
    },
    {
      name: 'Integration Configuration',
      weight: 25,
      flow: [
        { get: { url: '/en/account/integrations' } },
        { think: 2 },
        { get: { url: '/api/integrations/vapi' } },
        { think: 1 }
      ]
    },
    {
      name: 'Property Records View',
      weight: 25,
      flow: [
        { get: { url: '/en/dashboard/records' } },
        { think: 2 },
        { get: { url: '/en/dashboard/records?asset_type=residential' } },
        { think: 1 }
      ]
    },
    {
      name: 'Search Functionality',
      weight: 20,
      flow: [
        { get: { url: '/en/dashboard/search' } },
        { think: 1 },
        { get: { url: '/en/dashboard/search?q=residential&location=phoenix' } },
        { think: 2 }
      ]
    }
  ]
}

// Create Artillery test file
const artilleryTestPath = path.join(__dirname, 'artillery-test.yml')
const yamlContent = `config:
  target: "${config.target}"
  phases: ${JSON.stringify(config.phases, null, 2)}
  scenarios: ${JSON.stringify(config.scenarios, null, 2)}
`

fs.writeFileSync(artilleryTestPath, yamlContent)

console.log('🚀 Starting Performance Testing...')
console.log(`Target: ${config.target}`)
console.log('Test phases:', config.phases.map(p => `${p.name}: ${p.arrivalRate} req/s for ${p.duration}s`).join(', '))

try {
  // Run Artillery test
  const result = execSync(`npx artillery run ${artilleryTestPath} --output performance-report.json`, {
    stdio: 'inherit',
    cwd: process.cwd()
  })
  
  console.log('✅ Performance test completed successfully')
  console.log('📊 Report saved to performance-report.json')
  
  // Generate summary
  if (fs.existsSync('performance-report.json')) {
    const report = JSON.parse(fs.readFileSync('performance-report.json', 'utf8'))
    const summary = report.aggregate
    
    console.log('\n📈 Performance Summary:')
    console.log(`Total Requests: ${summary.counts.total}`)
    console.log(`Successful Requests: ${summary.counts.ok}`)
    console.log(`Failed Requests: ${summary.counts.error}`)
    console.log(`Average Response Time: ${summary.latency.median}ms`)
    console.log(`95th Percentile: ${summary.latency.p95}ms`)
    console.log(`99th Percentile: ${summary.latency.p99}ms`)
    console.log(`Requests per Second: ${summary.rps.mean}`)
  }
  
} catch (error) {
  console.error('❌ Performance test failed:', error.message)
  process.exit(1)
} finally {
  // Cleanup
  if (fs.existsSync(artilleryTestPath)) {
    fs.unlinkSync(artilleryTestPath)
  }
}
