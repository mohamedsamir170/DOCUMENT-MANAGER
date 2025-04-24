import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState } from 'react';
import { Upload, FolderIcon, TagIcon, LockIcon, X, Trash2, Plus, File, CheckCircle, AlertCircle } from 'lucide-react';
import App from './App';
import './index.css';

// Main Document Manager Application
export default function DocumentManager() {
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([
    { id: 'root', name: 'Root', parentId: null }
  ]);
  const [currentFolder, setCurrentFolder] = useState('root');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');

  // Get documents in current folder
  const currentDocuments = documents.filter(doc => doc.folderId === currentFolder);
  
  // Get subfolders of current folder
  const subFolders = folders.filter(folder => folder.parentId === currentFolder);
  
  // Get parent folder if exists
  const parentFolder = folders.find(folder => folder.id === 
    folders.find(f => f.id === currentFolder)?.parentId);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Document Manager</h1>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar for navigation */}
        <aside className="w-64 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="font-bold mb-4">Navigation</h2>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setActiveTab('upload')}
                className={`flex items-center p-2 w-full rounded ${activeTab === 'upload' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
              >
                <Upload size={18} className="mr-2" />
                Upload Documents
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('folders')}
                className={`flex items-center p-2 w-full rounded ${activeTab === 'folders' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
              >
                <FolderIcon size={18} className="mr-2" />
                Folder Management
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('tags')}
                className={`flex items-center p-2 w-full rounded ${activeTab === 'tags' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
              >
                <TagIcon size={18} className="mr-2" />
                Tagging
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('access')}
                className={`flex items-center p-2 w-full rounded ${activeTab === 'access' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
              >
                <LockIcon size={18} className="mr-2" />
                Access Control
              </button>
            </li>
          </ul>
        </aside>
        
        {/* Main content area */}
        <main className="flex-1 p-6 overflow-y-auto bg-white">
          {/* Breadcrumb navigation */}
          <div className="flex items-center mb-4 text-sm">
            <button 
              onClick={() => setCurrentFolder('root')}
              className="text-blue-600 hover:underline"
            >
              Root
            </button>
            
            {currentFolder !== 'root' && (
              <>
                <span className="mx-2">/</span>
                {parentFolder && parentFolder.id !== 'root' && (
                  <>
                    <button 
                      onClick={() => setCurrentFolder(parentFolder.id)}
                      className="text-blue-600 hover:underline"
                    >
                      {parentFolder.name}
                    </button>
                    <span className="mx-2">/</span>
                  </>
                )}
                <span className="font-medium">
                  {folders.find(f => f.id === currentFolder)?.name}
                </span>
              </>
            )}
          </div>

          {/* Folder contents */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">Current Folder Contents</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Display subfolders */}
              {subFolders.map(folder => (
                <div 
                  key={folder.id}
                  onClick={() => setCurrentFolder(folder.id)}
                  className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50"
                >
                  <FolderIcon size={24} className="text-yellow-500 mr-3" />
                  <span className="truncate">{folder.name}</span>
                </div>
              ))}
              
              {/* Display documents */}
              {currentDocuments.map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => setSelectedDocument(doc)}
                  className={`flex flex-col p-4 border rounded cursor-pointer hover:bg-gray-50 ${selectedDocument?.id === doc.id ? 'bg-blue-50 border-blue-200' : ''}`}
                >
                  <div className="flex items-center mb-2">
                    <File size={24} className="text-blue-500 mr-3" />
                    <span className="truncate font-medium">{doc.title}</span>
                  </div>
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-200 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {subFolders.length === 0 && currentDocuments.length === 0 && (
              <div className="text-center p-8 text-gray-500">
                This folder is empty.
              </div>
            )}
          </div>
          
          {/* Active component based on selected tab */}
          {activeTab === 'upload' && <FileUploadComponent 
            documents={documents}
            setDocuments={setDocuments}
            currentFolder={currentFolder}
          />}
          
          {activeTab === 'folders' && <FolderManagement 
            folders={folders}
            setFolders={setFolders}
            currentFolder={currentFolder}
          />}
          
          {activeTab === 'tags' && <TaggingComponent 
            documents={documents}
            setDocuments={setDocuments}
            selectedDocument={selectedDocument}
          />}
          
          {activeTab === 'access' && <AccessControlComponent 
            documents={documents}
            setDocuments={setDocuments}
            selectedDocument={selectedDocument}
          />}
        </main>
        
        {/* Right sidebar for document details when selected */}
        {selectedDocument && (
          <aside className="w-80 bg-gray-100 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Document Details</h3>
              <button 
                onClick={() => setSelectedDocument(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Title</h4>
                <p>{selectedDocument.title}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Type</h4>
                <p>{selectedDocument.fileType}</p>
              </div>
              
              {selectedDocument.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="text-sm">{selectedDocument.description}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Tags</h4>
                {selectedDocument.tags && selectedDocument.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedDocument.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No tags</p>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Access</h4>
                <div className="flex items-center mt-1">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    selectedDocument.access === 'public' ? 'bg-green-500' : 
                    selectedDocument.access === 'restricted' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></span>
                  <span className="capitalize">{selectedDocument.access || 'Private'}</span>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button className="text-red-600 hover:text-red-800 flex items-center">
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

// File Upload Component
function FileUploadComponent({ documents, setDocuments, currentFolder }) {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    tags: ''
  });
  const [validationStatus, setValidationStatus] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Valid file types
  const validFileTypes = ['application/pdf', 'application/msword', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      // Validate file type and size
      const isValidType = validFileTypes.includes(selectedFile.type);
      const isValidSize = selectedFile.size <= maxSizeInBytes;
      
      if (!isValidType) {
        setValidationStatus({
          success: false,
          message: 'Invalid file type. Please upload PDF, Word, or Excel files.'
        });
      } else if (!isValidSize) {
        setValidationStatus({
          success: false,
          message: 'File is too large. Maximum size is 10MB.'
        });
      } else {
        setValidationStatus({
          success: true,
          message: 'File is valid and ready to upload.'
        });
        
        // Auto-populate title with filename
        setMetadata(prev => ({
          ...prev,
          title: selectedFile.name.split('.')[0]
        }));
      }
    } else {
      setValidationStatus(null);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMetadata(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!file || !validationStatus?.success) return;
    
    setUploading(true);
    
    // Simulate uploading process
    setTimeout(() => {
      // Create a new document entry
      const newDocument = {
        id: `doc-${Date.now()}`,
        title: metadata.title || file.name,
        description: metadata.description,
        fileType: file.type,
        size: file.size,
        tags: metadata.tags ? metadata.tags.split(',').map(tag => tag.trim()) : [],
        folderId: currentFolder,
        access: 'private',
        uploadDate: new Date().toISOString()
      };
      
      setDocuments(prev => [...prev, newDocument]);
      
      // Reset form
      setFile(null);
      setMetadata({
        title: '',
        description: '',
        tags: ''
      });
      setValidationStatus(null);
      setUploading(false);
    }, 1500);
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Upload Document</h2>
      
      <form onSubmit={handleSubmit} className="max-w-xl">
        <div className="mb-6">
          <label className="block mb-2 font-medium">Select File</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <Upload size={32} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  {file ? file.name : 'Click to select a file'}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Supported formats: PDF, Word, Excel (Max 10MB)
                </span>
              </div>
            </label>
          </div>
          
          {validationStatus && (
            <div className={`mt-2 text-sm flex items-center ${validationStatus.success ? 'text-green-600' : 'text-red-600'}`}>
              {validationStatus.success ? (
                <CheckCircle size={16} className="mr-1" />
              ) : (
                <AlertCircle size={16} className="mr-1" />
              )}
              {validationStatus.message}
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={metadata.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Document title"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-1 font-medium">Description (optional)</label>
          <textarea
            name="description"
            value={metadata.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="Add a description for your document"
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label className="block mb-1 font-medium">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={metadata.tags}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="e.g. report, finance, Q1"
          />
        </div>
        
        <button
          type="submit"
          disabled={!file || !validationStatus?.success || uploading}
          className={`px-4 py-2 rounded text-white ${
            !file || !validationStatus?.success || uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>
    </div>
  );
}

// Folder Management Component
function FolderManagement({ folders, setFolders, currentFolder }) {
  const [newFolderName, setNewFolderName] = useState('');
  
  const handleAddFolder = () => {
    if (!newFolderName.trim()) return;
    
    // Create new folder
    const newFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName.trim(),
      parentId: currentFolder
    };
    
    setFolders(prev => [...prev, newFolder]);
    setNewFolderName('');
  };
  
  const handleDeleteFolder = (folderId) => {
    // Find and delete the folder
    setFolders(prev => prev.filter(folder => folder.id !== folderId));
  };
  
  // Get subfolders of current folder
  const subFolders = folders.filter(folder => folder.parentId === currentFolder);
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Folder Management</h2>
      
      <div className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="flex-1 p-2 border rounded-l"
            placeholder="New folder name"
          />
          <button
            onClick={handleAddFolder}
            disabled={!newFolderName.trim()}
            className={`px-4 py-2 rounded-r flex items-center ${
              !newFolderName.trim() ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Plus size={18} className="mr-1" />
            Add Folder
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-3">Subfolders in Current Directory</h3>
        {subFolders.length > 0 ? (
          <ul className="space-y-2">
            {subFolders.map(folder => (
              <li key={folder.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center">
                  <FolderIcon size={18} className="text-yellow-500 mr-2" />
                  <span>{folder.name}</span>
                </div>
                <button
                  onClick={() => handleDeleteFolder(folder.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No subfolders in this directory.</p>
        )}
      </div>
    </div>
  );
}

// Tagging Component
function TaggingComponent({ documents, setDocuments, selectedDocument }) {
  const [tag, setTag] = useState('');
  
  const handleAddTag = () => {
    if (!selectedDocument || !tag.trim()) return;
    
    // Add tag to selected document
    setDocuments(prev => prev.map(doc => {
      if (doc.id === selectedDocument.id) {
        const updatedTags = [...(doc.tags || [])];
        if (!updatedTags.includes(tag.trim())) {
          updatedTags.push(tag.trim());
        }
        return {
          ...doc,
          tags: updatedTags
        };
      }
      return doc;
    }));
    
    setTag('');
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === selectedDocument.id) {
        return {
          ...doc,
          tags: (doc.tags || []).filter(tag => tag !== tagToRemove)
        };
      }
      return doc;
    }));
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Document Tagging</h2>
      
      {selectedDocument ? (
        <div>
          <div className="mb-6">
            <h3 className="font-medium mb-2">
              Add Tags to: <span className="font-bold">{selectedDocument.title}</span>
            </h3>
            
            <div className="flex">
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="flex-1 p-2 border rounded-l"
                placeholder="New tag"
              />
              <button
                onClick={handleAddTag}
                disabled={!tag.trim()}
                className={`px-4 py-2 rounded-r flex items-center ${
                  !tag.trim() ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Plus size={18} className="mr-1" />
                Add Tag
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Current Tags</h3>
            {selectedDocument.tags && selectedDocument.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedDocument.tags.map(tag => (
                  <div key={tag} className="flex items-center bg-gray-200 px-3 py-1 rounded">
                    <span className="mr-2">{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tags for this document.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center p-8 text-gray-500">
          Please select a document to manage its tags.
        </div>
      )}
    </div>
  );
}

// Access Control Component
function AccessControlComponent({ documents, setDocuments, selectedDocument }) {
  const [users] = useState([
    { id: 'user1', name: 'John Doe' },
    { id: 'user2', name: 'Jane Smith' },
    { id: 'user3', name: 'Mike Johnson' }
  ]);
  
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPermission, setSelectedPermission] = useState('view');
  
  const handleAddPermission = () => {
    if (!selectedDocument || !selectedUser) return;
    
    // Add permission to selected document
    setDocuments(prev => prev.map(doc => {
      if (doc.id === selectedDocument.id) {
        const updatedPermissions = [...(doc.permissions || [])];
        const existingPermIndex = updatedPermissions.findIndex(p => p.userId === selectedUser);
        
        if (existingPermIndex >= 0) {
          updatedPermissions[existingPermIndex].level = selectedPermission;
        } else {
          updatedPermissions.push({
            userId: selectedUser,
            level: selectedPermission
          });
        }
        
        return {
          ...doc,
          permissions: updatedPermissions
        };
      }
      return doc;
    }));
  };
  
  const handleRemovePermission = (userId) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === selectedDocument.id) {
        return {
          ...doc,
          permissions: (doc.permissions || []).filter(p => p.userId !== userId)
        };
      }
      return doc;
    }));
  };
  
  const handleAccessChange = (access) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === selectedDocument.id) {
        return {
          ...doc,
          access
        };
      }
      return doc;
    }));
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Access Control</h2>
      
      {selectedDocument ? (
        <div>
          <div className="mb-6">
            <h3 className="font-medium mb-3">Document Privacy</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => handleAccessChange('private')}
                className={`px-4 py-2 rounded border ${
                  selectedDocument.access === 'private' ? 
                  'bg-red-100 border-red-300 text-red-800' : 
                  'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Private
              </button>
              <button
                onClick={() => handleAccessChange('restricted')}
                className={`px-4 py-2 rounded border ${
                  selectedDocument.access === 'restricted' ? 
                  'bg-yellow-100 border-yellow-300 text-yellow-800' : 
                  'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Restricted
              </button>
              <button
                onClick={() => handleAccessChange('public')}
                className={`px-4 py-2 rounded border ${
                  selectedDocument.access === 'public' ? 
                  'bg-green-100 border-green-300 text-green-800' : 
                  'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Public
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-3">Assign User Permissions</h3>
            <div className="flex">
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="flex-1 p-2 border rounded-l"
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
              <select
                value={selectedPermission}
                onChange={(e) => setSelectedPermission(e.target.value)}
                className="p-2 border-t border-b"
              >
                <option value="view">View</option>
                <option value="edit">Edit</option>
                <option value="download">Download</option>
              </select>
              <button
                onClick={handleAddPermission}
                disabled={!selectedUser}
                className={`px-4 py-2 rounded-r ${
                  !selectedUser ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Assign
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Current Permissions</h3>
            {selectedDocument.permissions && selectedDocument.permissions.length > 0 ? (
              <ul className="space-y-2">
                {selectedDocument.permissions.map(permission => {
                  const user = users.find(u => u.id === permission.userId);
                  return user ? (
                    <li key={permission.userId} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <span className="font-medium">{user.name}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({permission.level === 'view' ? 'Can view' : 
                            permission.level === 'edit' ? 'Can edit' : 'Can download'})
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemovePermission(permission.userId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </li>
                  ) : null;
                })}
              </ul>
            ) : (
              <p className="text-gray-500">No user permissions assigned.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center p-8 text-gray-500">
          Please select a document to manage access permissions.
        </div>
      )}
    </div>
  );
}

// Add React DOM rendering code
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);