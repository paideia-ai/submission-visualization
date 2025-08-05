# Problem-Solving Session Visualization

A SvelteKit application for visualizing problem-solving session data with interactive dashboards and timeline views.

## Features

- **Session Overview**: View session status, total problems, submissions, and chat statistics
- **Interactive Timeline**: Chronological view of all events (submissions, chats, feedback)
- **Problem Details**: Expandable cards showing submission history and chat sessions for each problem
- **Chat Activity Visualization**: Stacked bar chart showing AXIIA vs Custom chat usage per problem
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Data Source

The application reads visualization data from `../visualization_data.json` relative to the app directory.

## Build

To build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```