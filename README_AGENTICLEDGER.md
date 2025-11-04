# GoogleSheetsMCP - AgenticLedger Integration Guide

## 🚀 Quick Start

This MCP server provides comprehensive Google Sheets integration for the AgenticLedger platform with 26 production-ready tools.

### Prerequisites
- Node.js 18+ installed
- Google Cloud Project with Sheets API enabled
- Service account credentials

### Installation

1. **Navigate to the server directory:**
```bash
cd "C:\Users\oreph\Documents\AgenticLedger\Custom MCP SERVERS\GoogleSheetsMCP"
```

2. **Install dependencies (if not already done):**
```bash
npm install
```

3. **Build the server (if not already built):**
```bash
npm run build
```

4. **Set up Google Cloud credentials:**
   - Follow `GOOGLE_CLOUD_SETUP.md` for detailed instructions
   - Place `service-account-key.json` in this directory
   - Create `.env` file with configuration

5. **Test the integration:**
```bash
npm run test:integration
```

---

## 📁 File Structure

```
GoogleSheetsMCP/
├── dist/                          # Compiled JavaScript (ready to run)
│   └── index.js                   # Main server file
├── src/                           # TypeScript source code
│   ├── index.ts                   # Server entry point
│   ├── tools/                     # Individual tool implementations
│   ├── types/                     # Type definitions
│   └── utils/                     # Helper functions
├── GOOGLE_CLOUD_SETUP.md          # Authentication setup guide
├── PLATFORM_INTEGRATION_REPORT.md # Complete tool documentation with real API tests
├── ABILITIES_LIMITATIONS.md       # AI agent guide for smart workarounds
├── README_AGENTICLEDGER.md        # This file
├── test-integration.ts            # Integration test suite
├── .env.example                   # Example environment variables
├── service-account-key.example.json  # Example credentials format
└── package.json                   # Dependencies and scripts
```

---

## 🔧 Configuration

### Environment Variables

Create `.env` file:
```bash
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account-key.json
TEST_SPREADSHEET_ID=your-test-spreadsheet-id  # For testing
```

### AgenticLedger MCP Config

Add to your AgenticLedger MCP configuration:

```json
{
  "mcpServers": {
    "google-sheets": {
      "command": "node",
      "args": [
        "C:/Users/oreph/Documents/AgenticLedger/Custom MCP SERVERS/GoogleSheetsMCP/dist/index.js"
      ],
      "env": {
        "GOOGLE_PROJECT_ID": "your-project-id",
        "GOOGLE_APPLICATION_CREDENTIALS": "C:/path/to/service-account-key.json"
      }
    }
  }
}
```

**Important:** Use absolute paths for both the server and credentials file.

---

## 🛠️ Available Tools (26 Total)

### Reading Data (4 tools)
- `sheets_check_access` - Verify spreadsheet access
- `sheets_get_values` - Read range
- `sheets_batch_get_values` - Read multiple ranges
- `sheets_get_metadata` - Get spreadsheet metadata

### Writing Data (5 tools)
- `sheets_update_values` - Update range
- `sheets_batch_update_values` - Update multiple ranges
- `sheets_append_values` - Append rows
- `sheets_clear_values` - Clear range
- `sheets_insert_rows` - Insert rows at position

### Sheet Management (6 tools)
- `sheets_insert_sheet` - Create new sheet
- `sheets_delete_sheet` - Delete sheet
- `sheets_duplicate_sheet` - Duplicate sheet
- `sheets_copy_to` - Copy to another spreadsheet
- `sheets_update_sheet_properties` - Update properties
- `sheets_batch_delete_sheets` - Delete multiple sheets

### Formatting (6 tools)
- `sheets_format_cells` - Apply cell formatting
- `sheets_batch_format_cells` - Format multiple ranges
- `sheets_update_borders` - Add/modify borders
- `sheets_merge_cells` - Merge cells
- `sheets_unmerge_cells` - Unmerge cells
- `sheets_add_conditional_formatting` - Add conditional rules

### Charts (3 tools)
- `sheets_create_chart` - Create chart
- `sheets_update_chart` - Update chart
- `sheets_delete_chart` - Delete chart

### Additional (2 tools)
- `sheets_insert_link` - Insert hyperlink
- `sheets_insert_date` - Insert formatted date/time

---

## 📊 Example Usage

### Example 1: Read Data
```typescript
const result = await sheets_get_values({
  spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  range: "Sheet1!A1:C10"
});

console.log(result.data.values);
// [
//   ["Name", "Age", "Email"],
//   ["John", "30", "john@example.com"],
//   ...
// ]
```

### Example 2: Write Data
```typescript
await sheets_update_values({
  spreadsheetId: "1BxiMVs0XRA...",
  range: "Sheet1!A1",
  values: [
    ["Name", "Age", "Email"],
    ["Alice", "25", "alice@example.com"]
  ],
  valueInputOption: "USER_ENTERED"
});
```

### Example 3: Format Cells
```typescript
await sheets_format_cells({
  spreadsheetId: "1BxiMVs0XRA...",
  range: "Sheet1!A1:C1",
  backgroundColor: "#4285F4",  // Blue
  foregroundColor: "#FFFFFF",  // White text
  bold: true,
  fontSize: 12
});
```

### Example 4: Create Chart
```typescript
await sheets_create_chart({
  spreadsheetId: "1BxiMVs0XRA...",
  sheetId: 0,
  chartType: "COLUMN",
  sourceRange: "Sheet1!A1:B10",
  position: { anchorCell: "E1" },
  title: "Sales Data"
});
```

---

## ✅ Integration Testing

### Run Tests
```bash
npm run test:integration
```

### Test Requirements
1. `.env` file configured
2. `TEST_SPREADSHEET_ID` set
3. Service account has editor access to test spreadsheet
4. Google Sheets API enabled in Cloud Console

### Expected Results
- ✅ All 26 tests should pass
- ⏱️ Total duration: ~12-15 seconds
- 📄 Results saved to `test-results.json`

---

## 📚 Documentation

### For Developers
- **PLATFORM_INTEGRATION_REPORT.md**: Complete tool documentation with real API test results, parameters, responses, and error handling

### For AI Agents
- **ABILITIES_LIMITATIONS.md**: Smart workarounds for limitations, best practices, common patterns, and optimization strategies

### For Setup
- **GOOGLE_CLOUD_SETUP.md**: Step-by-step authentication configuration

---

## 🔐 Security Best Practices

1. **Never commit credentials:**
   - `service-account-key.json`
   - `.env` file
   - Token files

2. **Use environment variables:**
   - Never hardcode credentials in code
   - Use absolute paths in configuration

3. **Limit service account permissions:**
   - Only share spreadsheets that need access
   - Use viewer role when possible
   - Rotate keys every 90 days

4. **Monitor API usage:**
   - Check Google Cloud Console regularly
   - Set up quota alerts
   - Watch for unusual activity

---

## 🚨 Troubleshooting

### "Authentication failed"
**Solution:**
- Verify `GOOGLE_PROJECT_ID` is correct
- Check `GOOGLE_APPLICATION_CREDENTIALS` path is absolute
- Ensure Sheets API is enabled in Cloud Console

### "Permission denied"
**Solution:**
- Share spreadsheet with service account email
- Grant "Editor" permissions
- Service account email is in `client_email` field of JSON key

### "Spreadsheet not found"
**Solution:**
- Verify spreadsheet ID from URL
- Format: `https://docs.google.com/spreadsheets/d/[ID]/edit`
- Ensure service account has access

### Tests failing
**Solution:**
```bash
# Check environment
node -v  # Should be 18+

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build

# Re-run tests with verbose output
npm run test:integration
```

---

## 🎯 Performance Tips

### 1. Use Batch Operations
```typescript
// ❌ Slow: 3 API calls
await sheets_get_values({ range: "A:A" });
await sheets_get_values({ range: "B:B" });
await sheets_get_values({ range: "C:C" });

// ✅ Fast: 1 API call (50-70% faster)
await sheets_batch_get_values({
  ranges: ["A:A", "B:B", "C:C"]
});
```

### 2. Specify Exact Ranges
```typescript
// ❌ Inefficient: Reads entire column
range: "A:A"

// ✅ Efficient: Reads only needed rows
range: "A1:A100"
```

### 3. Cache Metadata
```typescript
// Get metadata once, reuse for multiple operations
const metadata = await sheets_get_metadata({ spreadsheetId });
const sheets = metadata.data.sheets;

// Use sheet IDs for subsequent operations
```

---

## 📈 API Quotas

**Google Sheets API Limits:**
- Read requests: 100 per 100 seconds per user
- Write requests: 100 per 100 seconds per user
- Per-minute quota: 60,000 requests

**Tips to Stay Within Limits:**
- Use batch operations
- Cache frequently accessed data
- Implement exponential backoff on errors

---

## 🆘 Getting Help

1. **Check documentation:**
   - `PLATFORM_INTEGRATION_REPORT.md` - Tool reference
   - `ABILITIES_LIMITATIONS.md` - AI agent guide
   - `GOOGLE_CLOUD_SETUP.md` - Authentication help

2. **Run diagnostics:**
```bash
# Test authentication
node dist/index.js

# Test API access
npm run test:integration

# Check Google Cloud Console
# APIs & Services > Dashboard > Google Sheets API
```

3. **Common resources:**
   - Google Sheets API Docs: https://developers.google.com/sheets/api
   - MCP Protocol: https://modelcontextprotocol.io
   - AgenticLedger Platform: [Internal docs]

---

## 📝 Version Info

- **Version:** 1.5.2
- **Technology:** TypeScript 5.3+, Node.js 18+
- **Authentication:** Service Account (OAuth 2.0)
- **API:** Google Sheets API v4
- **Status:** ✅ Production Ready

---

## 🎉 Success Checklist

Before deploying to AgenticLedger:

- [  ] Google Cloud Project created
- [  ] Sheets API enabled
- [  ] Service account created
- [  ] JSON key downloaded and placed
- [  ] `.env` file configured
- [  ] `npm install` completed
- [  ] `npm run build` successful
- [  ] `npm run test:integration` passes
- [  ] MCP config added to AgenticLedger
- [  ] Test spreadsheet shared with service account
- [  ] Basic operations tested

---

## 🚀 Next Steps

1. Complete the success checklist above
2. Review `PLATFORM_INTEGRATION_REPORT.md` for tool details
3. Configure AgenticLedger MCP settings
4. Start building agents!

---

**Created:** 2025-11-03
**Platform:** AgenticLedger
**License:** MIT
