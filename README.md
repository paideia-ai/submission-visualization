# Problem-Solving Session Data Visualization Dashboard

A SvelteKit application for visualizing problem-solving session data from JSON files.

## Features

- **Session Overview**: Display session statistics and completion status
- **Interactive Timeline**: Chronological view of submissions and chat events
- **Problem Details**: Expandable cards showing submissions, chats, and feedback
- **Chat Visualization**: Full conversation display for both AXIIA and custom chats
- **Accuracy Analytics**: Per-snapshot accuracy breakdown for thinking-traps problem
- **JSON Import**: Upload custom JSON files with schema validation and detailed error feedback
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS and Skeleton UI

## Deployment

The app is deployed on Fly.io at: https://visualization-app.fly.dev/

## Development

```bash
npm install
npm run dev
```

## Data Schema

The app uses validated schemas defined in:
- TypeScript: `src/lib/schemas.ts` (Zod)
- Python: `../pydantic_schema_corrected.py` (Pydantic)

## TODO - Future Features

### 1. Problem Set ID Recording
- Record and display the current problem set ID prominently Done: `6bae9d40-1f1f-40b6-a16b-3fd9e6f3337c`
- Track which problem set is being visualized
- Allow filtering/grouping by problem set ID

### 2. Multi-Problem Set Support
- When a JSON with a different problem set ID is imported:
  - Detect the new problem set ID
  - Only render problems that are supported/recognized
  - Show a warning for unsupported problems
  - Allow comparison between different problem sets

### 3. Export System Integration
- Connect with the existing exporting system
- Allow exporting visualized data in various formats
- Support round-trip import/export workflows
- Maintain data integrity during export/import cycles

### 4. Additional Enhancements
- Problem set version tracking
- Historical comparisons across sessions
- Performance metrics by problem set
- Batch import for multiple JSON files

## Repository Setup Reminder

**TODO**: 
1. ~~Rename the folder from `visualization-app` to a more descriptive name (e.g., `problem-session-visualizer`, `axiia-session-dashboard`, etc.)~~ ✓ Done: `submission_visualization`
2. ~~Create a dedicated GitHub repository for this project~~ ✓ Done: https://github.com/paideia-ai/submission-visualization
3. ~~Move the project out of the `tempScript` directory~~ ✓ Done
4. **Set up CI/CD with GitHub Actions for Fly.io deployment**:
   - Create `.github/workflows/deploy.yml` for automatic deployment on push to main
   - Add Fly.io API token as GitHub secret (`FLY_API_TOKEN`)
   - Configure staging and production environments
   - Add automated testing before deployment