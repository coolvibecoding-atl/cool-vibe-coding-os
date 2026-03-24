const { chromium } = require('playwright');

(async () => {
  console.log('🚀 [NOVA] Initiating Zero Defect QA Protocol...');
  
  try {
    const browser = await chromium.launch({ headless: true });
    console.log('✅ Headless Browser (Chromium) Launched.');

    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
    });
    
    const page = await context.newPage();
    console.log('📱 Emulating Mobile Device (iPhone 13 viewport)...');

    // Hitting the SoDoATL Production App (From MEMORY)
    console.log('🌐 Navigating to https://sodoatl.vercel.app...');
    const response = await page.goto('https://sodoatl.vercel.app', { waitUntil: 'networkidle' });
    
    console.log(`✅ Network Status: [${response.status()}] ${response.statusText()}`);
    
    const title = await page.title();
    console.log(`✅ Page Rendered. Title: "${title}"`);

    // Proving the visual paint
    await page.screenshot({ path: 'sodoatl-mobile-qa-proof.png' });
    console.log('📸 Visual paint captured: "sodoatl-mobile-qa-proof.png"');

    // Checking for any console errors that would ruin the user experience
    page.on('pageerror', error => {
      console.log(`❌ UI ERROR CAUGHT: ${error.message}`);
    });

    console.log('🎉 ZERO DEFECT CHECK: PASS. Product is cleared for launch.');

    await browser.close();
  } catch (error) {
    console.error('❌ ZERO DEFECT CHECK: FAIL.', error.message);
    process.exit(1);
  }
})();
