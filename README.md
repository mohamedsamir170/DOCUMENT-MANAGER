# Document Manager

A modern React application for managing, organizing, and controlling access to your documents.

## Features

- **Document Upload**: Upload and store PDF, Word, and Excel files with metadata
- **Folder Management**: Create, rename, and organize documents in hierarchical folders
- **Document Tagging**: Add custom tags to documents for better search and organization
- **Access Control**: Set document visibility (private, restricted, public) and manage user permissions

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/mohamedsamir170/DOCUMENT-MANAGER.git
cd erp-task
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Document Upload

1. Select "Upload Documents" from the sidebar
2. Drag and drop a file or click to browse
3. Fill in document metadata (title, description, tags)
4. Click "Upload Document" button

### Folder Management

1. Select "Folder Management" from the sidebar
2. Create new folders using the "Add Folder" button
3. Navigate through folders by clicking on them
4. Edit or delete folders using the action buttons

### Tagging

1. Select a document from the file explorer
2. Select "Tagging" from the sidebar
3. Add, edit, or remove tags for the selected document

### Access Control

1. Select a document from the file explorer
2. Select "Access Control" from the sidebar
3. Set document privacy level (private, restricted, public)
4. Assign specific permissions to users

## File Structure

```
src/
├── index.js       # Main application and component definitions
├── index.css      # Styles for the application
├── App.js         # Root component
└── ...
```

## Technologies Used

- React.js
- Modern JavaScript (ES6+)
- CSS3 for styling

