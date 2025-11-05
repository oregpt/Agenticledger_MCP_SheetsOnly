import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { createSheetsClient } from '../utils/platform-oauth.js';
import { handleError } from '../utils/error-handler.js';
import { validateDeleteChartInput } from '../utils/validators.js';
import { formatToolResponse } from '../utils/formatters.js';
import { ToolResponse } from '../types/tools.js';

export const deleteChartTool: Tool = {
  name: 'sheets_delete_chart',
  description: 'Delete a chart from a Google Sheets spreadsheet',
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
      chartId: {
        type: 'number',
        description: 'The ID of the chart to delete (use sheets_get_metadata to find chart IDs)',
      },
    },
    required: ['accessToken', 'spreadsheetId', 'chartId'],
  },
};

export async function handleDeleteChart(input: any): Promise<ToolResponse> {
  try {
    const validatedInput = validateDeleteChartInput(input);
    const sheets = createSheetsClient(input.accessToken);

    // Delete the chart
    const response = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: validatedInput.spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteEmbeddedObject: {
              objectId: validatedInput.chartId,
            },
          },
        ],
      },
    });

    return formatToolResponse(`Successfully deleted chart ${validatedInput.chartId}`, {
      spreadsheetId: response.data.spreadsheetId,
      deletedChartId: validatedInput.chartId,
      updatedReplies: response.data.replies || [],
    });
  } catch (error) {
    return handleError(error);
  }
}
