import { test, expect } from '@playwright/test'

test.describe('Campaign Creation E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to campaigns page
    await page.goto('/en/dashboard/campaigns')
  })

  test('should create a new SMS campaign successfully', async ({ page }) => {
    // Click create campaign button
    await page.click('button:has-text("Create Campaign")')
    
    // Fill campaign details
    await page.fill('input[name="name"]', 'Test SMS Campaign')
    await page.fill('textarea[name="description"]', 'Test campaign for validation')
    
    // Select SMS channel
    await page.click('input[name="channels.sms"]')
    
    // Fill SMS configuration
    await page.fill('input[name="channels.sms.message"]', 'Hello! This is a test SMS campaign.')
    await page.fill('input[name="channels.sms.from"]', '+1234567890')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Verify success
    await expect(page.locator('text=Campaign created successfully')).toBeVisible()
  })

  test('should create a new voice campaign successfully', async ({ page }) => {
    // Click create campaign button
    await page.click('button:has-text("Create Campaign")')
    
    // Fill campaign details
    await page.fill('input[name="name"]', 'Test Voice Campaign')
    await page.fill('textarea[name="description"]', 'Test voice campaign for validation')
    
    // Select voice channel
    await page.click('input[name="channels.voice"]')
    
    // Fill voice configuration
    await page.fill('input[name="channels.voice.message"]', 'Hello! This is a test voice call.')
    await page.fill('input[name="channels.voice.from"]', '+1234567890')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Verify success
    await expect(page.locator('text=Campaign created successfully')).toBeVisible()
  })

  test('should create a new email campaign successfully', async ({ page }) => {
    // Click create campaign button
    await page.click('button:has-text("Create Campaign")')
    
    // Fill campaign details
    await page.fill('input[name="name"]', 'Test Email Campaign')
    await page.fill('textarea[name="description"]', 'Test email campaign for validation')
    
    // Select email channel
    await page.click('input[name="channels.email"]')
    
    // Fill email configuration
    await page.fill('input[name="channels.email.subject"]', 'Test Email Subject')
    await page.fill('input[name="channels.email.body"]', 'Hello! This is a test email campaign.')
    await page.fill('input[name="channels.email.from"]', 'test@example.com')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Verify success
    await expect(page.locator('text=Campaign created successfully')).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    // Click create campaign button
    await page.click('button:has-text("Create Campaign")')
    
    // Try to submit without filling required fields
    await page.click('button[type="submit"]')
    
    // Verify validation errors
    await expect(page.locator('text=Campaign name is required')).toBeVisible()
  })
})
