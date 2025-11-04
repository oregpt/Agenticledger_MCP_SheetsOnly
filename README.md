# GoogleSheetsMCP - AgenticLedger Platform
## Google Sheets MCP Server

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Google Sheets API](https://img.shields.io/badge/Google%20Sheets-API%20v4-34A853?logo=google-sheets&logoColor=white)](https://developers.google.com/sheets/api)

**Production-ready MCP server providing comprehensive Google Sheets integration for the AgenticLedger AI Agent Platform.**

## 🚀 Features

- **26 Production-Ready Tools** - Complete CRUD operations, formatting, charts, sheet management
- **Service Account Authentication** - Persistent, shareable credentials
- **Batch Operations** - 50-70% faster than sequential operations
- **Advanced Formatting** - Colors, fonts, borders, conditional formatting, cell merging
- **Chart Creation** - LINE, BAR, COLUMN, PIE, SCATTER, AREA, COMBO charts
- **Type-Safe** - Full TypeScript with Zod schema validation
- **100% Documented** - Comprehensive guides for developers and AI agents

## 📦 Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/oregpt/Agenticledger_MCP_SheetsOnly.git
cd Agenticledger_MCP_SheetsOnly

# Install dependencies
npm install

# Build
npm run build
```

### Authentication Setup

1. **Create Google Cloud Project** (see [GOOGLE_CLOUD_SETUP.md](GOOGLE_CLOUD_SETUP.md))
2. **Enable Google Sheets API**
3. **Create Service Account** and download JSON key
4. **Configure environment:**

```bash
# Create .env file
cp .env.example .env

# Edit .env with your credentials
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
TEST_SPREADSHEET_ID=your-test-spreadsheet-id
```

5. **Share spreadsheets** with service account email (from JSON key)

### Run Tests

```bash
npm run test:integration
```

## 🛠️ Available Tools (26)

<details>
<summary><b>Reading Data (4 tools)</b></summary>

- `sheets_check_access` - Verify spreadsheet access
- `sheets_get_values` - Read cell values from range
- `sheets_batch_get_values` - Read multiple ranges at once
- `sheets_get_metadata` - Get spreadsheet metadata

</details>

<details>
<summary><b>Writing Data (5 tools)</b></summary>

- `sheets_update_values` - Update cell values
- `sheets_batch_update_values` - Update multiple ranges
- `sheets_append_values` - Append rows to table
- `sheets_clear_values` - Clear cell contents
- `sheets_insert_rows` - Insert rows at position

</details>

<details>
<summary><b>Sheet Management (6 tools)</b></summary>

- `sheets_insert_sheet` - Create new sheet
- `sheets_delete_sheet` - Delete sheet
- `sheets_duplicate_sheet` - Duplicate sheet
- `sheets_copy_to` - Copy sheet to another spreadsheet
- `sheets_update_sheet_properties` - Update sheet properties
- `sheets_batch_delete_sheets` - Delete multiple sheets

</details>

<details>
<summary><b>Formatting (6 tools)</b></summary>

- `sheets_format_cells` - Apply cell formatting
- `sheets_batch_format_cells` - Format multiple ranges
- `sheets_update_borders` - Add/modify borders
- `sheets_merge_cells` - Merge cells
- `sheets_unmerge_cells` - Unmerge cells
- `sheets_add_conditional_formatting` - Add conditional rules

</details>

<details>
<summary><b>Charts (3 tools)</b></summary>

- `sheets_create_chart` - Create chart
- `sheets_update_chart` - Update existing chart
- `sheets_delete_chart` - Delete chart

</details>

<details>
<summary><b>Additional (2 tools)</b></summary>

- `sheets_insert_link` - Insert hyperlink
- `sheets_insert_date` - Insert formatted date/time

</details>

## 📖 Documentation

### For Developers
- **[README_AGENTICLEDGER.md](README_AGENTICLEDGER.md)** - Complete integration guide
- **[PLATFORM_INTEGRATION_REPORT.md](PLATFORM_INTEGRATION_REPORT.md)** - Detailed tool documentation with real API tests
- **[GOOGLE_CLOUD_SETUP.md](GOOGLE_CLOUD_SETUP.md)** - Step-by-step authentication setup

### For AI Agents
- **[ABILITIES_LIMITATIONS.md](ABILITIES_LIMITATIONS.md)** - Smart workarounds, best practices, optimization strategies

### Example Files
- `.env.example` - Environment configuration template
- `service-account-key.example.json` - Credentials format example
- `test-integration.ts` - Integration test suite

## 💡 Example Usage

### Read Data
```typescript
const result = await sheets_get_values({
  spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  range: "Sheet1!A1:C10"
});
```

### Write Data
```typescript
await sheets_update_values({
  spreadsheetId: "1BxiMVs0XRA...",
  range: "Sheet1!A1",
  values: [
    ["Name", "Age", "Email"],
    ["Alice", "25", "alice@example.com"]
  ]
});
```

### Format Cells
```typescript
await sheets_format_cells({
  spreadsheetId: "1BxiMVs0XRA...",
  range: "Sheet1!A1:C1",
  backgroundColor: "#4285F4",
  foregroundColor: "#FFFFFF",
  bold: true
});
```

### Create Chart
```typescript
await sheets_create_chart({
  spreadsheetId: "1BxiMVs0XRA...",
  sheetId: 0,
  chartType: "COLUMN",
  sourceRange: "Sheet1!A1:B10",
  position: { anchorCell: "E1" }
});
```

## 🔐 Security

- **Never commit credentials** (`service-account-key.json`, `.env`)
- **Share spreadsheets explicitly** with service account email
- **Use environment variables** for sensitive data
- **Rotate keys regularly** (every 90 days recommended)
- **Monitor API usage** in Google Cloud Console

## 📊 Performance

- **Average Response Time:** 477ms per operation
- **Batch Operations:** 50-70% faster than sequential
- **API Quotas:** 100 requests per 100 seconds per user
- **Recommendation:** Use batch operations for 2+ ranges

## 🤝 Contributing

This is an AgenticLedger platform-customized version of [freema/mcp-gsheets](https://github.com/freema/mcp-gsheets).

**AgenticLedger Customizations:**
- Platform-specific documentation
- Integration test suite
- AI agent guides
- Example files and templates

## 📜 License

MIT License - See [LICENSE](LICENSE) file

## 🔗 Links

- **Repository:** https://github.com/oregpt/Agenticledger_MCP_SheetsOnly
- **Upstream Source:** https://github.com/freema/mcp-gsheets
- **AgenticLedger Platform:** [Platform Documentation]
- **Google Sheets API:** https://developers.google.com/sheets/api

## 📞 Support

1. **Check Documentation:**
   - [README_AGENTICLEDGER.md](README_AGENTICLEDGER.md) - Integration guide
   - [PLATFORM_INTEGRATION_REPORT.md](PLATFORM_INTEGRATION_REPORT.md) - Tool reference
   - [GOOGLE_CLOUD_SETUP.md](GOOGLE_CLOUD_SETUP.md) - Authentication help

2. **Run Diagnostics:**
   ```bash
   npm run test:integration
   ```

3. **Review Examples:**
   - See `test-integration.ts` for real API usage examples

---

**Status:** ✅ Production Ready
**Version:** 1.5.2
**Last Updated:** 2025-11-03
**Total Tools:** 26
**Platform:** AgenticLedger
