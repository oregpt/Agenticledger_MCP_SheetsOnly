/**
 * Platform OAuth Integration for GoogleSheetsMCP
 * Creates authenticated Google Sheets API clients using platform-provided OAuth tokens
 */

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

/**
 * Creates a Google Sheets API client with the provided access token (per-request)
 * @param accessToken - OAuth access token from platform (capability_tokens.token1)
 * @returns Authenticated Google Sheets API client
 */
export function createSheetsClient(accessToken: string) {
  const auth = new OAuth2Client();
  auth.setCredentials({ access_token: accessToken });

  return google.sheets({ version: 'v4', auth });
}

/**
 * Helper to add accessToken to all tool schemas
 * This should be the first parameter in every tool
 */
export const AccessTokenParam = {
  accessToken: {
    type: 'string' as const,
    description: 'OAuth access token from platform (provided by AgenticLedger platform from capability_tokens.token1 field)'
  }
};
