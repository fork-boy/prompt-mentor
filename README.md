# Chrome Backend - Prompt Analyzer & Improver

A Node.js/Express backend service that analyzes and improves AI prompts using OpenAI's API.

## Features

- **Prompt Analysis**: Score and analyze prompt quality based on clarity, specificity, context, and structure
- **Prompt Improvement**: Get suggestions to enhance your prompts
- **AI-Powered Insights**: Leverage OpenAI API for intelligent feedback
- **RESTful API**: Easy-to-use endpoints for integration

## Project Structure

```
src/
├── index.ts                 # App bootstrap
├── server.ts               # Express config
├── routes/
│   └── prompt.route.ts     # Prompt routes
├── controllers/
│   └── prompt.controller.ts # Prompt controller
├── services/
│   ├── analyzer.service.ts # Prompt analysis logic
│   ├── improver.service.ts # Prompt improvement logic
│   └── openai.service.ts   # OpenAI API integration
├── utils/
│   ├── promptRules.ts      # Prompt improvement rules
│   └── score.ts            # Scoring utilities
└── config/
    └── env.ts              # Environment configuration
```

## Installation

1. Clone the repository and navigate to the project:

```bash
cd chrome-be
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file from the example:

```bash
cp .env.example .env
```

4. Add your OpenAI API key to the `.env` file:

```
OPENAI_API_KEY=your_api_key_here
```

## Usage

### Development Mode

Run the server in development mode with hot reload:

```bash
npm run dev
```

### Build

Build the TypeScript code to JavaScript:

```bash
npm run build
```

### Production Mode

Start the built application:

```bash
npm start
```

## API Endpoints

### Single Endpoint: Improve Prompt with Analysis

**Endpoint**: `POST /api/prompt/improve`

**Description**: Analyzes a prompt and provides intelligent improvements based on the analysis.

**Request Body**:

```json
{
  "prompt": "Your prompt text here"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "analysis": {
      "originalPrompt": "Your prompt text here",
      "score": 75,
      "feedback": "Prompt is well-structured!",
      "analysis": {
        "clarity": "Clarity: High - Uses clear questions.",
        "specificity": "Specificity: High - Includes specific terms.",
        "context": "Context: Medium - Could include more context.",
        "structure": "Structure: High - Well-organized."
      },
      "aiInsights": "Your prompt is clear and specific, but could benefit from more detailed context about the expected output format."
    },
    "improvement": {
      "originalPrompt": "Your prompt text here",
      "improvedPrompt": "Enhanced version of your prompt with better structure, clarity, and specificity based on the analysis",
      "suggestions": [
        "Replace vague terms with more specific language",
        "Add more context and background information to your prompt"
      ],
      "aiSuggestions": "Consider adding specific examples and defining the scope of what should be included in the response."
    }
  }
}
```

**How it works**:

1. The prompt is analyzed for quality metrics (clarity, specificity, context, structure)
2. A system prompt is dynamically built based on the analysis results
3. The original prompt is improved using the analysis-based system prompt
4. Both analysis and improvement results are returned together

### Health Check

**Endpoint**: `GET /api/prompt/health`

**Response**:

```json
{
  "status": "healthy"
}
```

## Environment Variables

Create a `.env` file with the following variables:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `LOG_LEVEL`: Logging level (default: info)

## Technologies

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **TypeScript**: Language for type-safe code
- **OpenAI API**: AI-powered insights
- **dotenv**: Environment variables management

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad request (invalid prompt)
- `500`: Server error

Error responses include:

```json
{
  "success": false,
  "error": "Error description"
}
```

## Development

### Prerequisites

- Node.js (v16+)
- npm or yarn
- OpenAI API key

### Running Tests

```bash
npm test
```

### Code Quality

The project uses TypeScript with strict mode enabled for type safety and code quality.

## License

ISC

## Support

For issues or questions, please refer to the project documentation or create an issue in the repository.
