import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { createSheetsClient } from '../utils/platform-oauth.js';
import { handleError } from '../utils/error-handler.js';
import { validateDuplicateSheetInput } from '../utils/validators.js';
import { formatSheetOperationResponse } from '../utils/formatters.js';

export const duplicateSheetTool: Tool = {
  name: 'sheets_duplicate_sheet',
  description: 'Duplicate a sheet within a Google Sheets spreadsheet',
  inputSchema: {
    type: 'object',
    properties: {
      accessToken: {
        type: 'string',
        description: 'OAuth access token from platform (provided by AgenticLedger platform from capability_tokens.token1 field)',
      },
      spreadsheetId: {
        type: 'string',
        description: 'The ID of the spreadsheet (found in the URL after /d/)',
      },
      sheetId: {
        type: 'number',
        description: 'The ID of the sheet to duplicate (use sheets_get_metadata to find sheet IDs)',
      },
      insertSheetIndex: {
        type: 'number',
        description: 'The index where the new sheet should be inserted (0-based)',
      },
      newSheetName: {
        type: 'string',
        description: 'The name for the duplicated sheet',
      },
    },
    required: ['accessToken', 'spreadsheetId', 'sheetId'],
  },
};

export async function handleDuplicateSheet(input: any) {
  try {
    const validatedInput = validateDuplicateSheetInput(input);
    const sheets = createSheetsClient(input.accessToken);

    const response = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: validatedInput.spreadsheetId,
      requestBody: {
        requests: [
          {
            duplicateSheet: {
              sourceSheetId: validatedInput.sheetId,
              insertSheetIndex: validatedInput.insertSheetIndex,
              newSheetName: validatedInput.newSheetName,
            },
          },
        ],
      },
    });

    const duplicatedSheet = response.data.replies?.[0]?.duplicateSheet
      ? response.data.replies[0].duplicateSheet.properties
      : undefined;
    return formatSheetOperationResponse('Sheet duplicated', {
      newSheetId: duplicatedSheet ? duplicatedSheet.sheetId : undefined,
      title: duplicatedSheet ? duplicatedSheet.title : undefined,
      index: duplicatedSheet ? duplicatedSheet.index : undefined,
    });
  } catch (error) {
    return handleError(error);
  }
}
