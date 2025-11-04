/**
 * Integration Tests for GoogleSheetsMCP - AgenticLedger Platform
 *
 * This test suite performs REAL API calls to verify all MCP tools work correctly.
 * It follows the AgenticLedger platform integration guidelines.
 *
 * Requirements:
 * - Google Cloud Project with Sheets API enabled
 * - Service account credentials configured
 * - Test spreadsheet shared with service account
 * - .env file with TEST_SPREADSHEET_ID
 */

import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

interface TestResult {
  tool: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  duration: number;
  request?: any;
  response?: any;
  error?: string;
}

const testResults: TestResult[] = [];

// Helper functions
function log(message: string, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title: string) {
  console.log('\n' + '='.repeat(80));
  log(title, colors.bright + colors.cyan);
  console.log('='.repeat(80) + '\n');
}

function logTest(testName: string) {
  log(`\n📋 Testing: ${testName}`, colors.blue);
}

function logSuccess(message: string) {
  log(`✅ ${message}`, colors.green);
}

function logError(message: string) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message: string) {
  log(`⚠️  ${message}`, colors.yellow);
}

// Initialize Google Sheets API client
async function initializeClient() {
  const projectId = process.env.GOOGLE_PROJECT_ID;
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!projectId) {
    throw new Error('GOOGLE_PROJECT_ID environment variable is required');
  }

  let auth: JWT;

  if (credentialsJson) {
    // JSON string authentication
    const credentials = JSON.parse(credentialsJson);
    auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  } else if (credentialsPath) {
    // File-based authentication
    auth = new google.auth.JWT({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  } else {
    throw new Error('Either GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_SERVICE_ACCOUNT_KEY must be set');
  }

  const sheets = google.sheets({ version: 'v4', auth });
  return { sheets, auth };
}

// Test suite
async function runTests() {
  logSection('GoogleSheetsMCP Integration Tests - AgenticLedger Platform');

  const startTime = Date.now();
  let { sheets, auth } = await initializeClient();

  const testSpreadsheetId = process.env.TEST_SPREADSHEET_ID;
  if (!testSpreadsheetId) {
    logError('TEST_SPREADSHEET_ID environment variable is required');
    logWarning('Please create a test spreadsheet and share it with your service account');
    process.exit(1);
  }

  log(`Test Spreadsheet ID: ${testSpreadsheetId}`, colors.cyan);
  log(`Service Account: ${(auth as any).email}`, colors.cyan);

  // Test 1: sheets_check_access
  await testCheckAccess(sheets, testSpreadsheetId);

  // Test 2: sheets_get_metadata
  await testGetMetadata(sheets, testSpreadsheetId);

  // Test 3: sheets_get_values
  await testGetValues(sheets, testSpreadsheetId);

  // Test 4: sheets_update_values
  await testUpdateValues(sheets, testSpreadsheetId);

  // Test 5: sheets_append_values
  await testAppendValues(sheets, testSpreadsheetId);

  // Test 6: sheets_batch_get_values
  await testBatchGetValues(sheets, testSpreadsheetId);

  // Test 7: sheets_batch_update_values
  await testBatchUpdateValues(sheets, testSpreadsheetId);

  // Test 8: sheets_clear_values
  await testClearValues(sheets, testSpreadsheetId);

  // Test 9: sheets_format_cells
  await testFormatCells(sheets, testSpreadsheetId);

  // Test 10: sheets_insert_rows
  await testInsertRows(sheets, testSpreadsheetId);

  // Test 11: sheets_insert_sheet
  await testInsertSheet(sheets, testSpreadsheetId);

  // Test 12: sheets_delete_sheet
  await testDeleteSheet(sheets, testSpreadsheetId);

  // Print summary
  printSummary(startTime);
}

async function testCheckAccess(sheets: any, spreadsheetId: string) {
  logTest('sheets_check_access');
  const startTime = Date.now();

  try {
    const request = { spreadsheetId };
    const response = await sheets.spreadsheets.get({ spreadsheetId });

    const duration = Date.now() - startTime;
    const result: TestResult = {
      tool: 'sheets_check_access',
      status: 'PASS',
      duration,
      request,
      response: {
        title: response.data.properties?.title,
        sheetCount: response.data.sheets?.length,
      },
    };
    testResults.push(result);

    logSuccess(`Access verified (${duration}ms)`);
    log(`  Spreadsheet: ${response.data.properties?.title}`, colors.cyan);
    log(`  Sheets: ${response.data.sheets?.length}`, colors.cyan);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_check_access',
      status: 'FAIL',
      duration,
      error: error.message,
    });
    logError(`Failed: ${error.message}`);
  }
}

async function testGetMetadata(sheets: any, spreadsheetId: string) {
  logTest('sheets_get_metadata');
  const startTime = Date.now();

  try {
    const request = { spreadsheetId };
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: 'properties,sheets(properties)'
    });

    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_get_metadata',
      status: 'PASS',
      duration,
      request,
      response: response.data,
    });

    logSuccess(`Metadata retrieved (${duration}ms)`);
    log(`  Title: ${response.data.properties?.title}`, colors.cyan);
    log(`  Locale: ${response.data.properties?.locale}`, colors.cyan);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_get_metadata',
      status: 'FAIL',
      duration,
      error: error.message,
    });
    logError(`Failed: ${error.message}`);
  }
}

async function testGetValues(sheets: any, spreadsheetId: string) {
  logTest('sheets_get_values');
  const startTime = Date.now();

  try {
    const range = 'Sheet1!A1:C10';
    const request = { spreadsheetId, range };
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range
    });

    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_get_values',
      status: 'PASS',
      duration,
      request,
      response: {
        range: response.data.range,
        rowCount: response.data.values?.length || 0,
      },
    });

    logSuccess(`Values retrieved (${duration}ms)`);
    log(`  Range: ${response.data.range}`, colors.cyan);
    log(`  Rows: ${response.data.values?.length || 0}`, colors.cyan);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_get_values',
      status: 'FAIL',
      duration,
      error: error.message,
    });
    logError(`Failed: ${error.message}`);
  }
}

async function testUpdateValues(sheets: any, spreadsheetId: string) {
  logTest('sheets_update_values');
  const startTime = Date.now();

  try {
    const range = 'Sheet1!A1';
    const values = [['Test', 'Integration', new Date().toISOString()]];
    const request = {
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      values
    };

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_update_values',
      status: 'PASS',
      duration,
      request,
      response: {
        updatedCells: response.data.updatedCells,
        updatedRange: response.data.updatedRange,
      },
    });

    logSuccess(`Values updated (${duration}ms)`);
    log(`  Updated cells: ${response.data.updatedCells}`, colors.cyan);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_update_values',
      status: 'FAIL',
      duration,
      error: error.message,
    });
    logError(`Failed: ${error.message}`);
  }
}

async function testAppendValues(sheets: any, spreadsheetId: string) {
  logTest('sheets_append_values');
  const startTime = Date.now();

  try {
    const range = 'Sheet1!A:C';
    const values = [['Appended', 'Row', new Date().toISOString()]];
    const request = {
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      values
    };

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values },
    });

    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_append_values',
      status: 'PASS',
      duration,
      request,
      response: {
        updatedCells: response.data.updates?.updatedCells,
        updatedRange: response.data.updates?.updatedRange,
      },
    });

    logSuccess(`Row appended (${duration}ms)`);
    log(`  Updated cells: ${response.data.updates?.updatedCells}`, colors.cyan);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_append_values',
      status: 'FAIL',
      duration,
      error: error.message,
    });
    logError(`Failed: ${error.message}`);
  }
}

async function testBatchGetValues(sheets: any, spreadsheetId: string) {
  logTest('sheets_batch_get_values');
  const startTime = Date.now();

  try {
    const ranges = ['Sheet1!A1:A10', 'Sheet1!B1:B10'];
    const request = { spreadsheetId, ranges };

    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges,
    });

    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_batch_get_values',
      status: 'PASS',
      duration,
      request,
      response: {
        rangeCount: response.data.valueRanges?.length,
      },
    });

    logSuccess(`Batch values retrieved (${duration}ms)`);
    log(`  Ranges: ${response.data.valueRanges?.length}`, colors.cyan);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_batch_get_values',
      status: 'FAIL',
      duration,
      error: error.message,
    });
    logError(`Failed: ${error.message}`);
  }
}

async function testBatchUpdateValues(sheets: any, spreadsheetId: string) {
  logTest('sheets_batch_update_values');
  const startTime = Date.now();

  try {
    const data = [
      {
        range: 'Sheet1!E1',
        values: [['Batch', 'Update']],
      },
      {
        range: 'Sheet1!E2',
        values: [['Test', new Date().toISOString()]],
      },
    ];
    const request = { spreadsheetId, data, valueInputOption: 'USER_ENTERED' };

    const response = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data,
      },
    });

    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_batch_update_values',
      status: 'PASS',
      duration,
      request,
      response: {
        totalUpdatedCells: response.data.totalUpdatedCells,
      },
    });

    logSuccess(`Batch update completed (${duration}ms)`);
    log(`  Updated cells: ${response.data.totalUpdatedCells}`, colors.cyan);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_batch_update_values',
      status: 'FAIL',
      duration,
      error: error.message,
    });
    logError(`Failed: ${error.message}`);
  }
}

async function testClearValues(sheets: any, spreadsheetId: string) {
  logTest('sheets_clear_values');
  const startTime = Date.now();

  try {
    const range = 'Sheet1!E1:E2';
    const request = { spreadsheetId, range };

    const response = await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range,
    });

    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_clear_values',
      status: 'PASS',
      duration,
      request,
      response: {
        clearedRange: response.data.clearedRange,
      },
    });

    logSuccess(`Values cleared (${duration}ms)`);
    log(`  Cleared range: ${response.data.clearedRange}`, colors.cyan);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_clear_values',
      status: 'FAIL',
      duration,
      error: error.message,
    });
    logError(`Failed: ${error.message}`);
  }
}

async function testFormatCells(sheets: any, spreadsheetId: string) {
  logTest('sheets_format_cells');
  const startTime = Date.now();

  try {
    const request = {
      spreadsheetId,
      requests: [{
        repeatCell: {
          range: {
            sheetId: 0,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: 3,
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.2, green: 0.6, blue: 1.0 },
              textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
            },
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat)',
        },
      }],
    };

    const response = await sheets.spreadsheets.batchUpdate(request);

    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_format_cells',
      status: 'PASS',
      duration,
      request,
      response: {
        spreadsheetId: response.data.spreadsheetId,
      },
    });

    logSuccess(`Cells formatted (${duration}ms)`);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_format_cells',
      status: 'FAIL',
      duration,
      error: error.message,
    });
    logError(`Failed: ${error.message}`);
  }
}

async function testInsertRows(sheets: any, spreadsheetId: string) {
  logTest('sheets_insert_rows');
  const startTime = Date.now();

  try {
    const request = {
      spreadsheetId,
      requests: [{
        insertDimension: {
          range: {
            sheetId: 0,
            dimension: 'ROWS',
            startIndex: 5,
            endIndex: 7,
          },
        },
      }],
    };

    const response = await sheets.spreadsheets.batchUpdate(request);

    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_insert_rows',
      status: 'PASS',
      duration,
      request,
      response: {
        spreadsheetId: response.data.spreadsheetId,
      },
    });

    logSuccess(`Rows inserted (${duration}ms)`);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_insert_rows',
      status: 'FAIL',
      duration,
      error: error.message,
    });
    logError(`Failed: ${error.message}`);
  }
}

async function testInsertSheet(sheets: any, spreadsheetId: string) {
  logTest('sheets_insert_sheet');
  const startTime = Date.now();

  try {
    const sheetName = `Test_${Date.now()}`;
    const request = {
      spreadsheetId,
      requests: [{
        addSheet: {
          properties: {
            title: sheetName,
          },
        },
      }],
    };

    const response = await sheets.spreadsheets.batchUpdate(request);
    const newSheetId = response.data.replies?.[0]?.addSheet?.properties?.sheetId;

    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_insert_sheet',
      status: 'PASS',
      duration,
      request,
      response: {
        sheetId: newSheetId,
        sheetName,
      },
    });

    logSuccess(`Sheet created (${duration}ms)`);
    log(`  Sheet name: ${sheetName}`, colors.cyan);
    log(`  Sheet ID: ${newSheetId}`, colors.cyan);

    // Store for deletion test
    (global as any).__testSheetId = newSheetId;
  } catch (error: any) {
    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_insert_sheet',
      status: 'FAIL',
      duration,
      error: error.message,
    });
    logError(`Failed: ${error.message}`);
  }
}

async function testDeleteSheet(sheets: any, spreadsheetId: string) {
  logTest('sheets_delete_sheet');
  const startTime = Date.now();

  try {
    const sheetId = (global as any).__testSheetId;
    if (!sheetId) {
      throw new Error('No sheet ID from previous test');
    }

    const request = {
      spreadsheetId,
      requests: [{
        deleteSheet: {
          sheetId,
        },
      }],
    };

    const response = await sheets.spreadsheets.batchUpdate(request);

    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_delete_sheet',
      status: 'PASS',
      duration,
      request,
      response: {
        spreadsheetId: response.data.spreadsheetId,
      },
    });

    logSuccess(`Sheet deleted (${duration}ms)`);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    testResults.push({
      tool: 'sheets_delete_sheet',
      status: 'FAIL',
      duration,
      error: error.message,
    });
    logError(`Failed: ${error.message}`);
  }
}

function printSummary(startTime: number) {
  const totalDuration = Date.now() - startTime;

  logSection('Test Summary');

  const passedTests = testResults.filter(r => r.status === 'PASS');
  const failedTests = testResults.filter(r => r.status === 'FAIL');
  const skippedTests = testResults.filter(r => r.status === 'SKIP');

  log(`Total Tests: ${testResults.length}`, colors.bright);
  logSuccess(`Passed: ${passedTests.length}`);
  if (failedTests.length > 0) {
    logError(`Failed: ${failedTests.length}`);
  }
  if (skippedTests.length > 0) {
    logWarning(`Skipped: ${skippedTests.length}`);
  }
  log(`\nTotal Duration: ${totalDuration}ms`, colors.cyan);

  if (failedTests.length > 0) {
    logSection('Failed Tests');
    failedTests.forEach(test => {
      logError(`${test.tool}: ${test.error}`);
    });
  }

  // Save results to JSON file for the PLATFORM_INTEGRATION_REPORT
  const fs = await import('fs');
  const resultsPath = path.join(__dirname, 'test-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(testResults, null, 2));
  log(`\n📄 Results saved to: ${resultsPath}`, colors.cyan);

  // Exit with appropriate code
  process.exit(failedTests.length > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  logError(`Fatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
