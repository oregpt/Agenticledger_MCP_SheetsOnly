# Abilities & Limitations - GoogleSheetsMCP
## Smart Alternatives for AI Agents

**Purpose:** This document helps AI agents understand what the GoogleSheetsMCP server CAN and CANNOT do, providing intelligent workarounds for limitations.

---

## ✅ Core Abilities

### 1. Data Operations
**What You CAN Do:**
- ✅ Read any range (A1 notation)
- ✅ Read multiple ranges in one request (batch get)
- ✅ Write to any range
- ✅ Write to multiple ranges atomically (batch update)
- ✅ Append rows to tables
- ✅ Insert rows at specific positions
- ✅ Clear cell contents (preserves formatting)
- ✅ Handle sparse data (empty cells)
- ✅ Process formulas with `valueInputOption: USER_ENTERED`
- ✅ Get raw values with `valueInputOption: RAW`

**Smart Tips:**
- Use `sheets_batch_get_values` for reading 2+ ranges (50-70% faster)
- Use `sheets_batch_update_values` for writing 2+ ranges (55% faster)
- Specify exact ranges (e.g., `A1:C100`) instead of entire columns (`A:C`) for better performance

---

### 2. Formatting
**What You CAN Do:**
- ✅ Background colors (any RGB color via hex)
- ✅ Text colors (foreground color)
- ✅ Font styles (bold, italic, underline, strikethrough)
- ✅ Font size and family
- ✅ Cell alignment (horizontal and vertical)
- ✅ Number formatting (currency, percent, date, time, custom patterns)
- ✅ Borders (all sides, styles, colors, widths)
- ✅ Cell merging (MERGE_ALL, MERGE_COLUMNS, MERGE_ROWS)
- ✅ Conditional formatting (based on values, formulas)
- ✅ Batch formatting (multiple ranges, different styles)

**Smart Tips:**
- Colors use hex format: `"#FF0000"` for red, `"#00FF00"` for green
- Use `sheets_batch_format_cells` to format multiple ranges efficiently
- Number format patterns: `"$#,##0.00"` for currency, `"0.00%"` for percentage

---

### 3. Sheet Management
**What You CAN Do:**
- ✅ Create new sheets
- ✅ Delete sheets (except last remaining sheet)
- ✅ Duplicate sheets within same spreadsheet
- ✅ Copy sheets to different spreadsheet
- ✅ Rename sheets
- ✅ Change tab colors
- ✅ Hide/show sheets
- ✅ Reorder sheets
- ✅ Freeze rows and columns
- ✅ Batch delete multiple sheets

**Smart Tips:**
- Get sheet IDs with `sheets_get_metadata` before operations
- Cannot delete the last sheet in a spreadsheet - create a new one first
- Tab colors use RGB values (0-1 range): `{red: 1, green: 0, blue: 0}` for red

---

### 4. Charts
**What You CAN Do:**
- ✅ Create charts (LINE, BAR, COLUMN, PIE, SCATTER, AREA, COMBO)
- ✅ Update existing charts
- ✅ Delete charts
- ✅ Position charts by anchor cell
- ✅ Set chart title and subtitle

**Smart Tips:**
- Get chart IDs from `sheets_get_metadata` for updates/deletes
- Source range must include headers for proper chart labels
- Position charts in empty areas to avoid overlapping data

---

## ❌ Limitations & Smart Workarounds

### 1. Cannot: Read Entire Spreadsheet At Once

**Limitation:** No single tool to read all data from all sheets

**Smart Workaround:**
```typescript
// Step 1: Get metadata to list all sheets
const metadata = await sheets_get_metadata({ spreadsheetId });

// Step 2: Build ranges for all sheets
const ranges = metadata.data.sheets.map(sheet =>
  `${sheet.title}!A:ZZ`  // Adjust column range as needed
);

// Step 3: Batch read all ranges
const allData = await sheets_batch_get_values({
  spreadsheetId,
  ranges
});

// Now you have all data from all sheets!
```

**Why This Works:** Batch operations are efficient and respect API limits

---

### 2. Cannot: Search for Text Across Entire Spreadsheet

**Limitation:** No built-in search tool

**Smart Workaround:**
```typescript
// Step 1: Read all data (see workaround #1)
const { data } = await sheets_batch_get_values({ spreadsheetId, ranges });

// Step 2: Search locally
function findText(valueRanges, searchTerm) {
  const results = [];
  valueRanges.forEach(rangeData => {
    const sheetName = rangeData.range.split('!')[0];
    rangeData.values?.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell?.toString().includes(searchTerm)) {
          results.push({
            sheet: sheetName,
            row: rowIndex + 1,
            column: colIndex + 1,
            value: cell
          });
        }
      });
    });
  });
  return results;
}

const found = findText(allData.data.valueRanges, "search term");
```

**Why This Works:** Read once, search locally (fast and efficient)

**Alternative:** Use Google Sheets UI "Find and replace" for one-time searches

---

### 3. Cannot: Get Cell Comments

**Limitation:** Google Sheets API v4 doesn't provide comments (use Drive API)

**Smart Workaround:**
```typescript
// Comments require Drive API, not Sheets API
// This MCP server focuses on Sheets API
// For comments:
// 1. Use Google Drive MCP server
// 2. Or manually access comments in Sheets UI
// 3. Or note that this server doesn't handle comments
```

**Why This Limitation:** Different API, different authentication flow

**Agent Advice:** When user asks about comments, explain this limitation and suggest manual access

---

### 4. Cannot: Auto-Detect Data Range

**Limitation:** Must specify exact ranges (A1 notation)

**Smart Workaround:**
```typescript
// Method 1: Read generously, filter empty rows
const { data } = await sheets_get_values({
  spreadsheetId,
  range: 'Sheet1!A1:Z1000'  // Read more than needed
});

// Filter out empty rows
const nonEmptyRows = data.values.filter(row =>
  row.some(cell => cell !== null && cell !== '')
);

// Now you have actual data range

// Method 2: Use sheet metadata for row/column counts
const metadata = await sheets_get_metadata({ spreadsheetId });
const sheet = metadata.data.sheets.find(s => s.title === 'Sheet1');
const maxRows = sheet.gridProperties.rowCount;
const maxCols = sheet.gridProperties.columnCount;

// Read the full grid, then trim
```

**Why This Works:** Read-then-filter is fast and reliable

**Agent Tip:** Ask user for approximate data size or read generously

---

### 5. Cannot: Directly Copy Data Between Different Spreadsheets

**Limitation:** No single "copy data" tool between spreadsheets

**Smart Workaround:**
```typescript
// Step 1: Read from source
const sourceData = await sheets_get_values({
  spreadsheetId: sourceId,
  range: 'Sheet1!A1:C100'
});

// Step 2: Write to destination
await sheets_update_values({
  spreadsheetId: destId,
  range: 'Sheet1!A1',  // Will auto-expand to C100
  values: sourceData.data.values
});

// Optional Step 3: Copy formatting too
// Read source formatting via metadata/API, apply to destination
```

**Why This Works:** Read + Write = Copy (with full control)

**Bonus:** You can transform data during the copy:
```typescript
// Transform during copy
const transformedData = sourceData.data.values.map(row =>
  row.map(cell => cell.toUpperCase())  // Example: uppercase all
);

await sheets_update_values({
  spreadsheetId: destId,
  values: transformedData
});
```

---

### 6. Cannot: Execute Complex Formulas on Server Side

**Limitation:** Formulas execute in Google Sheets, not in MCP server

**Smart Workaround:**
```typescript
// Option 1: Write formula, let Sheets calculate
await sheets_update_values({
  spreadsheetId,
  range: 'A1',
  values: [['=SUM(B1:B10)']],
  valueInputOption: 'USER_ENTERED'  // Required for formulas
});

// Option 2: Read calculated results
const result = await sheets_get_values({
  spreadsheetId,
  range: 'A1',
  valueRenderOption: 'FORMATTED_VALUE'  // Gets calculated value
});

// Option 3: Calculate locally if formula is simple
const values = await sheets_get_values({ range: 'B1:B10' });
const sum = values.data.values.flat().reduce((a, b) => a + Number(b), 0);
```

**Why This Works:**
- Formulas leverage Sheets' powerful calculation engine
- Reading results is fast
- Local calculation gives you control

**Agent Tip:** For complex calculations, write formula and read result

---

### 7. Cannot: Batch Operations Across Different Spreadsheets

**Limitation:** Batch tools work within single spreadsheet only

**Smart Workaround:**
```typescript
// Process each spreadsheet sequentially
const spreadsheetIds = ['id1', 'id2', 'id3'];

for (const id of spreadsheetIds) {
  await sheets_update_values({
    spreadsheetId: id,
    range: 'Sheet1!A1',
    values: [['Updated']]
  });
}

// Or use Promise.all for parallel execution
await Promise.all(
  spreadsheetIds.map(id =>
    sheets_update_values({
      spreadsheetId: id,
      range: 'Sheet1!A1',
      values: [['Updated']]
    })
  )
);
```

**Why This Works:** Sequential is reliable, parallel is faster (if quota allows)

**Agent Tip:** Parallel execution may hit rate limits - monitor responses

---

### 8. Cannot: Access Protected Ranges

**Limitation:** Service account must have explicit access

**Smart Workaround:**
```typescript
// No programmatic workaround - this is a permissions issue

// Agent Response to User:
// "I don't have access to protected ranges in this spreadsheet.
//  Please either:
//  1. Share the spreadsheet with the service account email
//  2. Remove protection from the range
//  3. Grant editor permissions to the service account"

// Get service account email from credentials
const serviceEmail = "your-service@project.iam.gserviceaccount.com";
```

**Why This Limitation:** Security feature - protects sensitive data

**Agent Tip:** Check access with `sheets_check_access` before attempting operations

---

### 9. Cannot: Directly Export to PDF/Excel

**Limitation:** Export features not in Sheets API (use Drive API)

**Smart Workaround:**
```typescript
// For PDF export, use Google Drive API (different MCP server)
// Or instruct user:

// "To export as PDF:
//  1. Open spreadsheet in browser
//  2. File > Download > PDF Document
//  3. Or use Drive API integration"

// For Excel export:
// "To export as Excel:
//  1. File > Download > Microsoft Excel (.xlsx)
//  2. Or use Drive API to export"
```

**Alternative:** Read all data and generate local Excel/PDF using libraries

---

### 10. Cannot: Undo Operations

**Limitation:** No built-in undo mechanism

**Smart Workaround:**
```typescript
// Before making destructive changes, back up data
const backup = await sheets_get_values({
  spreadsheetId,
  range: 'Sheet1!A1:Z1000'
});

// Store backup
// Make changes
await sheets_update_values({ ... });

// If user wants to undo:
await sheets_update_values({
  spreadsheetId,
  range: 'Sheet1!A1',
  values: backup.data.values
});
```

**Why This Works:** Backup-before-modify is safe and reversible

**Agent Best Practice:**
- Always back up before bulk deletions
- Inform user: "I'll back up current data before making changes"
- Keep backups for a short duration (5-10 minutes)

---

## 🎯 Smart Agent Strategies

### Strategy 1: Batch Everything Possible
```typescript
// ❌ Slow (3 API calls)
await sheets_get_values({ range: 'A:A' });
await sheets_get_values({ range: 'B:B' });
await sheets_get_values({ range: 'C:C' });

// ✅ Fast (1 API call)
await sheets_batch_get_values({
  ranges: ['A:A', 'B:B', 'C:C']
});
```

### Strategy 2: Read Metadata First
```typescript
// Always start with metadata for complex operations
const metadata = await sheets_get_metadata({ spreadsheetId });

// Now you know:
// - All sheet names and IDs
// - Sheet dimensions
// - Available charts
// - Spreadsheet properties

// Use this info to plan subsequent operations
```

### Strategy 3: Validate Before Execution
```typescript
// Check access before attempting operations
const access = await sheets_check_access({ spreadsheetId });

if (!access.success) {
  // Inform user about access issue
  return "Cannot access spreadsheet. Please check sharing settings.";
}

// Proceed with operations
```

### Strategy 4: Progressive Enhancement
```typescript
// Start simple, add complexity as needed

// Phase 1: Basic update
await sheets_update_values({ range, values });

// Phase 2: Add formatting if needed
await sheets_format_cells({ range, backgroundColor: '#FFFF00' });

// Phase 3: Add conditional formatting if requested
await sheets_add_conditional_formatting({ range, condition });
```

### Strategy 5: Graceful Degradation
```typescript
// If batch operation fails, fall back to sequential
try {
  await sheets_batch_update_values({ data: multipleRanges });
} catch (error) {
  // Fallback: Update one by one
  for (const range of multipleRanges) {
    await sheets_update_values({
      range: range.range,
      values: range.values
    });
  }
}
```

---

## 📊 Performance Optimization

### API Call Minimization
```typescript
// ❌ Inefficient: 4 API calls
const meta = await sheets_get_metadata({ spreadsheetId });
const data1 = await sheets_get_values({ range: 'A:A' });
const data2 = await sheets_get_values({ range: 'B:B' });
await sheets_update_values({ range: 'C:C', values });

// ✅ Efficient: 2 API calls
const [meta, batchData] = await Promise.all([
  sheets_get_metadata({ spreadsheetId }),
  sheets_batch_get_values({ ranges: ['A:A', 'B:B'] })
]);
await sheets_update_values({ range: 'C:C', values });
```

### Quota Management
```typescript
// Monitor API usage
let apiCallCount = 0;
const MAX_CALLS_PER_MINUTE = 60;

async function rateLimitedCall(fn) {
  if (apiCallCount >= MAX_CALLS_PER_MINUTE) {
    await sleep(60000); // Wait 1 minute
    apiCallCount = 0;
  }
  apiCallCount++;
  return await fn();
}

// Use it
await rateLimitedCall(() =>
  sheets_get_values({ spreadsheetId, range })
);
```

### Data Caching
```typescript
// Cache frequently accessed data
const cache = new Map();

async function getCachedValues(range) {
  if (cache.has(range)) {
    return cache.get(range);
  }

  const data = await sheets_get_values({ spreadsheetId, range });
  cache.set(range, data);

  // Expire cache after 5 minutes
  setTimeout(() => cache.delete(range), 5 * 60 * 1000);

  return data;
}
```

---

## 🤖 AI Agent Communication Patterns

### When User Request is Unclear
```typescript
// ❌ Bad: Guess and execute
await sheets_update_values({ range: 'A:A', values });

// ✅ Good: Ask for clarification
"I can update column A, but I need to know:
 1. Which sheet? (I see you have 3 sheets: Sales, Inventory, Summary)
 2. Which rows? (Row 1-10? All rows?)
 3. What values should I write?"
```

### When Operation Will Be Destructive
```typescript
// ✅ Always warn before destructive operations
"⚠️ This will delete sheet 'Old Data'.
 This action cannot be undone through the API.
 Do you want me to proceed?"

// Wait for confirmation, then execute
```

### When Limitation is Encountered
```typescript
// ✅ Explain limitation + offer alternative
"I cannot search across all sheets directly, but I can:
 1. Read all data from all sheets (takes ~2 seconds)
 2. Search through it locally
 3. Show you all matches

 Would you like me to do that?"
```

### When Suggesting Better Approach
```typescript
// ✅ Proactively suggest optimization
"I can do that with 10 separate API calls, but it would be much faster
 to use a batch operation (1 API call instead of 10).

 Would you like me to use the batch approach?"
```

---

## 🔍 Common User Requests & Best Solutions

### Request: "Update cell A1 in all sheets"
**Solution:**
```typescript
const metadata = await sheets_get_metadata({ spreadsheetId });
const updates = metadata.data.sheets.map(sheet => ({
  range: `${sheet.title}!A1`,
  values: [['Updated Value']]
}));

await sheets_batch_update_values({
  spreadsheetId,
  data: updates
});
```

### Request: "Find all cells containing 'TODO'"
**Solution:** See Workaround #2 (search across spreadsheet)

### Request: "Make all headers bold and blue"
**Solution:**
```typescript
await sheets_format_cells({
  spreadsheetId,
  range: 'A1:Z1',  // Assuming row 1 is headers
  bold: true,
  foregroundColor: '#0000FF'
});
```

### Request: "Copy data from Sheet1 to Sheet2"
**Solution:**
```typescript
const data = await sheets_get_values({
  spreadsheetId,
  range: 'Sheet1!A:Z'
});

await sheets_update_values({
  spreadsheetId,
  range: 'Sheet2!A1',
  values: data.data.values
});
```

### Request: "Delete all empty rows"
**Solution:**
```typescript
// Read all data
const { data } = await sheets_get_values({ range: 'A:Z' });

// Filter non-empty rows
const nonEmptyRows = data.values.filter(row =>
  row.some(cell => cell !== '')
);

// Clear everything
await sheets_clear_values({ range: 'A:Z' });

// Write back only non-empty rows
await sheets_update_values({
  range: 'A1',
  values: nonEmptyRows
});
```

---

## 📚 Summary for AI Agents

### Always Remember:
1. **Batch is Better**: Use batch operations whenever possible
2. **Metadata First**: Get sheet structure before complex operations
3. **Check Access**: Verify permissions with `sheets_check_access`
4. **Exact Ranges**: Specify precise ranges for better performance
5. **Backup Before Destroy**: Save data before destructive operations
6. **Formulas in Sheets**: Let Google Sheets handle formula calculations
7. **Read-Filter-Write**: Pattern for data transformations
8. **Clear Communication**: Explain limitations and alternatives to users
9. **Progressive Enhancement**: Start simple, add features as needed
10. **Graceful Degradation**: Have fallback strategies

### Quick Reference:
- **Fast Operations**: Read, check access, get metadata
- **Medium Operations**: Single cell updates, formatting
- **Slow Operations**: Large data writes, chart creation
- **Avoid**: Sequential operations when batch is available

### Error Handling:
- **403**: Service account needs access - tell user to share spreadsheet
- **404**: Spreadsheet/sheet not found - verify IDs
- **429**: Rate limit - implement exponential backoff
- **400**: Invalid range/parameters - validate input

---

**This document is designed to make AI agents smarter when working with GoogleSheetsMCP.**

**Version:** 1.5.2
**Last Updated:** 2025-11-03
