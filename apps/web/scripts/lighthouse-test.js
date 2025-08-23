const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const fs = require('fs')
const path = require('path')

async function runLighthouse(url, options = {}) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })
  
  try {
    const runnerResult = await lighthouse(url, {
      port: chrome.port,
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'desktop',
      ...options
    })
    
    return runnerResult.lhr
  } finally {
    await chrome.kill()
  }
}

async function runPerformanceAudit() {
  const baseUrl = 'http://localhost:3001'
  const pages = [
    '/en/dashboard/campaigns',
    '/en/dashboard/records',
    '/en/account/integrations',
    '/en/dashboard/search'
  ]
  
  console.log('🔍 Starting Lighthouse Performance Audit...')
  console.log(`Base URL: ${baseUrl}`)
  
  const results = {}
  
  for (const page of pages) {
    const fullUrl = `${baseUrl}${page}`
    console.log(`\n📊 Testing: ${page}`)
    
    try {
      const lhr = await runLighthouse(fullUrl)
      
      results[page] = {
        performance: Math.round(lhr.categories.performance.score * 100),
        accessibility: Math.round(lhr.categories.accessibility.score * 100),
        bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
        seo: Math.round(lhr.categories.seo.score * 100),
        firstContentfulPaint: lhr.audits['first-contentful-paint'].numericValue,
        largestContentfulPaint: lhr.audits['largest-contentful-paint'].numericValue,
        cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].numericValue,
        totalBlockingTime: lhr.audits['total-blocking-time'].numericValue,
        speedIndex: lhr.audits['speed-index'].numericValue
      }
      
      console.log(`✅ Performance: ${results[page].performance}/100`)
      console.log(`✅ Accessibility: ${results[page].accessibility}/100`)
      console.log(`✅ Best Practices: ${results[page].bestPractices}/100`)
      console.log(`✅ SEO: ${results[page].seo}/100`)
      
    } catch (error) {
      console.error(`❌ Failed to test ${page}:`, error.message)
      results[page] = { error: error.message }
    }
  }
  
  // Generate report
  const reportPath = path.join(__dirname, 'lighthouse-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2))
  
  console.log('\n📊 Lighthouse Audit Complete!')
  console.log(`📄 Report saved to: ${reportPath}`)
  
  // Summary
  const avgPerformance = Object.values(results)
    .filter(r => !r.error)
    .reduce((sum, r) => sum + r.performance, 0) / Object.values(results).filter(r => !r.error).length
  
  console.log(`\n🎯 Average Performance Score: ${Math.round(avgPerformance)}/100`)
  
  return results
}

// Run if called directly
if (require.main === module) {
  runPerformanceAudit().catch(console.error)
}

module.exports = { runPerformanceAudit, runLighthouse }
