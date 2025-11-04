# Google Cloud Setup for GoogleSheetsMCP

## Overview
This MCP server requires Google Cloud Project credentials with Google Sheets API enabled. This guide will walk you through setting up authentication for the AgenticLedger platform.

## Prerequisites
- Google Account
- Access to Google Cloud Console
- Permission to create/modify Google Cloud Projects

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Select a project" → "New Project"
3. Name: `AgenticLedger-Sheets-MCP`
4. Click "CREATE"

## Step 2: Enable Required APIs

1. Navigate to "APIs & Services" → "Library"
2. Search and enable the following APIs:
   - **Google Sheets API** (Required)
   - **Google Drive API** (Recommended for file management)

## Step 3: Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "CREATE CREDENTIALS" → "Service Account"
3. Fill in details:
   - **Name**: `agenticledger-sheets-service`
   - **Description**: `Service account for AgenticLedger Google Sheets MCP Server`
4. Click "CREATE AND CONTINUE"
5. Grant Role: **Editor** (or more restrictive if needed)
6. Click "CONTINUE" → "DONE"

## Step 4: Generate JSON Key

1. Click on the created service account
2. Go to "KEYS" tab
3. Click "ADD KEY" → "Create new key"
4. Select **JSON** format
5. Click "CREATE"
6. Save the downloaded file as `service-account-key.json` in the MCP server directory

**Security Warning**: This JSON file contains sensitive credentials. Never commit to version control or share publicly!

## Step 5: Share Google Sheets with Service Account

For each Google Sheet you want to access:

1. Open the Google Sheet
2. Click "Share"
3. Add the service account email (found in the JSON file: `client_email` field)
   - Example: `agenticledger-sheets-service@project-id.iam.gserviceaccount.com`
4. Grant **Editor** permissions
5. Uncheck "Notify people"
6. Click "Share"

## Environment Variables

The server requires these environment variables:

```bash
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account-key.json
```

Or use JSON string format:

```bash
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...",...}'
```

## Verification

Test authentication by running:

```bash
node dist/index.js
```

The server should start without authentication errors.

## Troubleshooting

### "Authentication failed"
- Verify JSON key path is absolute and correct
- Check `GOOGLE_PROJECT_ID` matches your project
- Ensure Sheets API is enabled

### "Permission denied"
- Share spreadsheet with service account email
- Service account needs "Editor" role
- Check email in JSON file (`client_email` field)

### "Spreadsheet not found"
- Verify spreadsheet ID from URL
- Format: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`

## Alternative: JSON String Authentication

Instead of using a file path, provide credentials as JSON string:

```json
{
  "mcpServers": {
    "mcp-gsheets": {
      "command": "node",
      "args": ["/absolute/path/to/dist/index.js"],
      "env": {
        "GOOGLE_PROJECT_ID": "your-project-id",
        "GOOGLE_SERVICE_ACCOUNT_KEY": "{\"type\":\"service_account\",\"project_id\":\"your-project\",\"private_key_id\":\"...\",\"private_key\":\"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n\",\"client_email\":\"...@....iam.gserviceaccount.com\",\"client_id\":\"...\",\"auth_uri\":\"https://accounts.google.com/o/oauth2/auth\",\"token_uri\":\"https://oauth2.googleapis.com/token\",\"auth_provider_x509_cert_url\":\"https://www.googleapis.com/oauth2/v1/certs\",\"client_x509_cert_url\":\"...\"}"
      }
    }
  }
}
```

**Note**: When using `GOOGLE_SERVICE_ACCOUNT_KEY`:
- Entire JSON must be on a single line
- All quotes must be escaped with backslashes
- Newlines in private key must be `\\n`
- If JSON includes `project_id`, you can omit `GOOGLE_PROJECT_ID`

## Security Best Practices

1. **Never commit credentials**: Add to `.gitignore`
2. **Use environment variables**: Never hardcode credentials
3. **Rotate keys regularly**: Generate new keys periodically
4. **Principle of least privilege**: Grant minimum necessary permissions
5. **Monitor usage**: Check Cloud Console for unexpected API calls
6. **Use separate service accounts**: One per environment (dev/staging/prod)

## Rate Limits

Google Sheets API has the following quotas:
- **Read requests**: 100 per 100 seconds per user
- **Write requests**: 100 per 100 seconds per user
- **Per-minute quota**: 60,000 requests

The MCP server respects these limits. For high-volume operations, implement exponential backoff.

## Cost Considerations

- Google Sheets API is **FREE** for most use cases
- Cloud Project is free (no compute resources used)
- Service Account credentials are free

Monitor usage in Cloud Console to ensure you stay within free tier limits.
