/**
 * GoogleSheetsMCP Simple Integration Test
 * Tests platform OAuth token injection through direct tool simulation
 * STEP 2 of Two-Step Testing Process
 */

// Platform OAuth token (from environment variable)
// Set this before running: export GOOGLE_OAUTH_TOKEN="your_token_here"
const ACCESS_TOKEN = process.env.GOOGLE_OAUTH_TOKEN || '';

if (!ACCESS_TOKEN) {
  console.error('❌ ERROR: GOOGLE_OAUTH_TOKEN environment variable not set');
  console.error('Usage: GOOGLE_OAUTH_TOKEN="your_token" npx tsx test-mcp-simple.ts');
  process.exit(1);
}

// Test spreadsheet ID (created in STEP 1)
const TEST_SPREADSHEET_ID = "1EpZA-oQLSOOxa1FYF5i8MzS2SrkYMq3GLZ52JaJSumQ";

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Platform OAuth Integration Pattern (from platform-oauth.ts)
function createSheetsClient(accessToken: string) {
  const auth = new OAuth2Client();
  auth.setCredentials({ access_token: accessToken });
  return google.sheets({ version: 'v4', auth });
}

async function runTests() {
  console.log('=================================');
  console.log('GoogleSheetsMCP Integration Test');
  console.log('=================================\n');
  console.log('Testing platform OAuth token injection pattern...\n');

  let testsPassed = 0;
  let testsFailed = 0;

  try {
    // Test 1: Get Spreadsheet Metadata (simulating sheets_get_metadata tool)
    console.log('📊 Test 1: Get Spreadsheet Metadata');
    try {
      const sheets = createSheetsClient(ACCESS_TOKEN);
      const response = await sheets.spreadsheets.get({
        spreadsheetId: TEST_SPREADSHEET_ID,
        fields: 'spreadsheetId,properties(title),sheets(properties(title,sheetId))'
      });

      console.log(`✅ PASSED: Retrieved metadata for "${response.data.properties?.title}"`);
      console.log(`   Spreadsheet ID: ${response.data.spreadsheetId}`);
      console.log(`   Sheets: ${response.data.sheets?.map(s => s.properties?.title).join(', ')}`);
      testsPassed++;
    } catch (error: any) {
      console.log(`❌ FAILED: ${error.message}`);
      testsFailed++;
    }
    console.log('');

    // Test 2: Get Values (simulating sheets_get_values tool)
    console.log('📋 Test 2: Get Cell Values');
    try {
      const sheets = createSheetsClient(ACCESS_TOKEN);
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: TEST_SPREADSHEET_ID,
        range: 'Sheet1!A1:C3',
      });

      const rowCount = response.data.values?.length || 0;
      const colCount = response.data.values?.[0]?.length || 0;

      console.log(`✅ PASSED: Retrieved ${rowCount} rows × ${colCount} columns`);
      if (response.data.values && response.data.values.length > 0) {
        console.log(`   Data preview:`);
        response.data.values.slice(0, 2).forEach((row, idx) => {
          console.log(`   Row ${idx + 1}: [${row.join(', ')}]`);
        });
      }
      testsPassed++;
    } catch (error: any) {
      console.log(`❌ FAILED: ${error.message}`);
      testsFailed++;
    }
    console.log('');

    // Test 3: Update Values (simulating sheets_update_values tool)
    console.log('✍️  Test 3: Update Cell Values');
    try {
      const sheets = createSheetsClient(ACCESS_TOKEN);
      const timestamp = new Date().toISOString();
      const testData = [
        ['Test Name', 'Test Email', 'Test Status'],
        ['MCP User 1', 'mcp1@test.com', 'Active'],
        ['MCP User 2', 'mcp2@test.com', 'Active'],
        ['Updated', timestamp, '✅']
      ];

      const response = await sheets.spreadsheets.values.update({
        spreadsheetId: TEST_SPREADSHEET_ID,
        range: 'Sheet1!A1:C4',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: testData
        }
      });

      console.log(`✅ PASSED: Updated ${response.data.updatedCells} cells`);
      console.log(`   Range: ${response.data.updatedRange}`);
      console.log(`   Rows: ${response.data.updatedRows}, Columns: ${response.data.updatedColumns}`);
      testsPassed++;
    } catch (error: any) {
      console.log(`❌ FAILED: ${error.message}`);
      testsFailed++;
    }
    console.log('');

    // Test 4: Append Values (simulating sheets_append_values tool)
    console.log('➕ Test 4: Append New Values');
    try {
      const sheets = createSheetsClient(ACCESS_TOKEN);
      const newRows = [
        ['Appended User 1', 'append1@test.com', 'Pending'],
        ['Appended User 2', 'append2@test.com', 'Active']
      ];

      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: TEST_SPREADSHEET_ID,
        range: 'Sheet1!A:C',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: newRows
        }
      });

      console.log(`✅ PASSED: Appended ${newRows.length} rows`);
      console.log(`   Updated range: ${response.data.updates?.updatedRange}`);
      console.log(`   Updated cells: ${response.data.updates?.updatedCells}`);
      testsPassed++;
    } catch (error: any) {
      console.log(`❌ FAILED: ${error.message}`);
      testsFailed++;
    }
    console.log('');

    // Test 5: Batch Get Values (simulating sheets_batch_get_values tool)
    console.log('📦 Test 5: Batch Get Values (Multiple Ranges)');
    try {
      const sheets = createSheetsClient(ACCESS_TOKEN);
      const response = await sheets.spreadsheets.values.batchGet({
        spreadsheetId: TEST_SPREADSHEET_ID,
        ranges: ['Sheet1!A1:A3', 'Sheet1!B1:B3', 'Sheet1!C1:C3']
      });

      const rangeCount = response.data.valueRanges?.length || 0;
      let totalValues = 0;
      response.data.valueRanges?.forEach(range => {
        totalValues += range.values?.reduce((sum, row) => sum + row.length, 0) || 0;
      });

      console.log(`✅ PASSED: Retrieved ${rangeCount} ranges with ${totalValues} total values`);
      response.data.valueRanges?.forEach((range, idx) => {
        console.log(`   Range ${idx + 1}: ${range.range} (${range.values?.length || 0} rows)`);
      });
      testsPassed++;
    } catch (error: any) {
      console.log(`❌ FAILED: ${error.message}`);
      testsFailed++;
    }
    console.log('');

    // Test 6: Create New Spreadsheet (simulating sheets_create_spreadsheet tool)
    console.log('📝 Test 6: Create New Spreadsheet');
    try {
      const sheets = createSheetsClient(ACCESS_TOKEN);
      const timestamp = new Date().toISOString();
      const title = `MCP Test Sheet - ${timestamp}`;

      const response = await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: title
          }
        }
      });

      console.log(`✅ PASSED: Created spreadsheet "${response.data.properties?.title}"`);
      console.log(`   Spreadsheet ID: ${response.data.spreadsheetId}`);
      console.log(`   URL: ${response.data.spreadsheetUrl}`);
      testsPassed++;

      // Clean up: Delete the test spreadsheet
      try {
        const drive = google.drive({ version: 'v3', auth: new OAuth2Client() });
        const auth = new OAuth2Client();
        auth.setCredentials({ access_token: ACCESS_TOKEN });
        const driveClient = google.drive({ version: 'v3', auth });
        await driveClient.files.delete({ fileId: response.data.spreadsheetId! });
        console.log(`   ♻️  Cleaned up: Deleted test spreadsheet`);
      } catch (cleanupError) {
        console.log(`   ⚠️  Cleanup warning: Could not delete test spreadsheet`);
      }
    } catch (error: any) {
      console.log(`❌ FAILED: ${error.message}`);
      testsFailed++;
    }
    console.log('');

    // Test 7: Clear Values (simulating sheets_clear_values tool)
    console.log('🧹 Test 7: Clear Cell Values');
    try {
      const sheets = createSheetsClient(ACCESS_TOKEN);
      const response = await sheets.spreadsheets.values.clear({
        spreadsheetId: TEST_SPREADSHEET_ID,
        range: 'Sheet1!A5:C10',
      });

      console.log(`✅ PASSED: Cleared values in range ${response.data.clearedRange}`);
      testsPassed++;
    } catch (error: any) {
      console.log(`❌ FAILED: ${error.message}`);
      testsFailed++;
    }
    console.log('');

    // Summary
    console.log('=================================');
    console.log('Test Summary');
    console.log('=================================');
    console.log(`✅ Tests Passed: ${testsPassed}`);
    console.log(`❌ Tests Failed: ${testsFailed}`);
    console.log(`📊 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
    console.log('=================================\n');

    if (testsFailed === 0) {
      console.log('🎉 All tests passed! GoogleSheetsMCP is ready for platform integration.\n');
      process.exit(0);
    } else {
      console.log('⚠️  Some tests failed. Review errors above.\n');
      process.exit(1);
    }

  } catch (error: any) {
    console.error('💥 Critical error during testing:', error);
    process.exit(1);
  }
}

// Run tests
runTests().catch(console.error);
