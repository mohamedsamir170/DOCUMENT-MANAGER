import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';
import { Upload, FolderIcon, TagIcon, LockIcon, X, Trash2, Plus, File, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
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

  // Update selected document when documents change
  useEffect(() => {
    if (selectedDocument) {
      const updatedDoc = documents.find(doc => doc.id === selectedDocument.id);
      if (updatedDoc) {
        setSelectedDocument(updatedDoc);
      }
    }
  }, [documents]);

  const handleUploadClick = () => {
    setActiveTab('upload');
  };

  const handleNewFolderClick = () => {
    setActiveTab('folders');
  };

  const handleDeleteDocument = (documentId) => {
    const updatedDocuments = documents.filter(doc => doc.id !== documentId);
    handleDocumentsChange(updatedDocuments);
    setSelectedDocument(null);
  };
  
  // Custom document setter to also update selected document
  const handleDocumentsChange = (newDocuments) => {
    // Ensure newDocuments is an array
    if (!Array.isArray(newDocuments)) {
      // If it's a function, call it with the current documents
      if (typeof newDocuments === 'function') {
        const updatedDocs = newDocuments(documents);
        setDocuments(updatedDocs);
        
        // Update selected document if needed
        if (selectedDocument) {
          const updatedSelectedDoc = updatedDocs.find(
            doc => doc.id === selectedDocument.id
          );
          if (updatedSelectedDoc) {
            setSelectedDocument(updatedSelectedDoc);
          }
        }
      } else {
        // Just use setDocuments directly if we received invalid data
        setDocuments(prev => prev);
      }
      return;
    }
    
    // Normal case - newDocuments is already an array
    setDocuments(newDocuments);
    
    // If a document is selected, update the selected document reference
    if (selectedDocument) {
      const updatedSelectedDoc = newDocuments.find(
        doc => doc.id === selectedDocument.id
      );
      if (updatedSelectedDoc) {
        setSelectedDocument(updatedSelectedDoc);
      }
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Document Manager</h1>
      </header>
      
      <div className="main-container">
        <aside className="sidebar">
          <h2>Navigation</h2>
          <ul>
            <li>
              <button 
                onClick={() => setActiveTab('upload')}
                className={activeTab === 'upload' ? 'active' : ''}
              >
                <Upload size={18} />
                Upload Documents
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('folders')}
                className={activeTab === 'folders' ? 'active' : ''}
              >
                <FolderIcon size={18} />
                Folder Management
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('tags')}
                className={activeTab === 'tags' ? 'active' : ''}
              >
                <TagIcon size={18} />
                Tagging
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('access')}
                className={activeTab === 'access' ? 'active' : ''}
              >
                <LockIcon size={18} />
                Access Control
              </button>
            </li>
          </ul>
        </aside>
        
        <main className="main-content">
          <div className="breadcrumb">
            <div className="breadcrumb-path">
              <button 
                onClick={() => setCurrentFolder('root')}
                className="breadcrumb-item"
              >
                Root
              </button>
              
              {currentFolder !== 'root' && (
                <>
                  <span className="breadcrumb-separator">/</span>
                  {parentFolder && parentFolder.id !== 'root' && (
                    <>
                      <button 
                        onClick={() => setCurrentFolder(parentFolder.id)}
                        className="breadcrumb-item"
                      >
                        {parentFolder.name}
                      </button>
                      <span className="breadcrumb-separator">/</span>
                    </>
                  )}
                  <span className="breadcrumb-item">
                    {folders.find(f => f.id === currentFolder)?.name}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Current Folder Contents</h2>
            </div>
            
            <div className="document-grid">
              {subFolders.map(folder => (
                <div 
                  key={folder.id}
                  onClick={() => setCurrentFolder(folder.id)}
                  className="document-card"
                >
                  <div className="document-card-header">
                    <div className="document-icon folder">
                      <FolderIcon size={24} />
                    </div>
                    <h3 className="document-title">{folder.name}</h3>
                  </div>
                  <div className="document-meta">
                    <div className="document-date">
                      Created {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {currentDocuments.map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => setSelectedDocument(doc)}
                  className={`document-card ${selectedDocument?.id === doc.id ? 'selected' : ''}`}
                >
                  <div className="document-card-header">
                    <div className="document-icon file">
                      <File size={24} />
                    </div>
                    <h3 className="document-title">{doc.title}</h3>
                  </div>
                  <div className="document-meta">
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="document-tags">
                        {doc.tags.map(tag => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="document-date">
                      Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {subFolders.length === 0 && currentDocuments.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FolderIcon size={64} />
                </div>
                <h3 className="empty-state-title">This folder is empty</h3>
                <p className="empty-state-description">
                  Upload files or create new folders to get started
                </p>
              </div>
            )}
          </div>
          
          {activeTab === 'upload' && <FileUploadComponent 
            documents={documents}
            setDocuments={handleDocumentsChange}
            currentFolder={currentFolder}
          />}
          
          {activeTab === 'folders' && <FolderManagement 
            folders={folders}
            setFolders={setFolders}
            currentFolder={currentFolder}
          />}
          
          {activeTab === 'tags' && <TaggingComponent 
            documents={documents}
            setDocuments={handleDocumentsChange}
            selectedDocument={selectedDocument}
          />}
          
          {activeTab === 'access' && <AccessControlComponent 
            documents={documents}
            setDocuments={handleDocumentsChange}
            selectedDocument={selectedDocument}
          />}
        </main>
        
        {selectedDocument && (
          <aside className="sidebar">
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
                  <div className="document-tags">
                    {selectedDocument.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
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
                    selectedDocument.access === 'public' ? 'bg-success' : 
                    selectedDocument.access === 'restricted' ? 'bg-warning' : 'bg-error'
                  }`}></span>
                  <span className="capitalize">{selectedDocument.access || 'Private'}</span>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button 
                  className="action-button text-error"
                  onClick={() => handleDeleteDocument(selectedDocument.id)}
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete Document
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
  
  const validFileTypes = ['application/pdf', 'application/msword', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
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
    
    // Simulate upload process
    setTimeout(() => {
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
      
      // Reset the file input element
      document.getElementById('file-upload').value = '';
    }, 1500);
  };
  
  return (
    <div className="fade-in">
      <h2 className="text-xl font-bold mb-6">Upload Document</h2>
      
      <form onSubmit={handleSubmit} className="max-w-xl">
        <div className="form-group">
          <label className="form-label">Select File</label>
          <div className="file-upload">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="file-upload-icon">
                <Upload size={32} />
              </div>
              <div className="file-upload-text">
                {file ? file.name : 'Click to select a file'}
              </div>
              <div className="file-upload-hint">
                Supported formats: PDF, Word, Excel (Max 10MB)
              </div>
            </label>
          </div>
          
          {validationStatus && (
            <div className={`form-hint ${validationStatus.success ? 'text-success' : 'text-error'}`}>
              {validationStatus.message}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={metadata.title}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Document title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description (optional)</label>
          <textarea
            id="description"
            name="description"
            value={metadata.description}
            onChange={handleInputChange}
            className="form-input form-textarea"
            placeholder="Add a description for your document"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="tags" className="form-label">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={metadata.tags}
            onChange={handleInputChange}
            className="form-input"
            placeholder="e.g. report, finance, Q1"
          />
          <div className="form-hint">Separate tags with commas</div>
        </div>
        
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!file || !validationStatus?.success || uploading}
            className="button button-primary"
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload Document
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setFile(null);
              setMetadata({
                title: '',
                description: '',
                tags: ''
              });
              setValidationStatus(null);
            }}
            className="button button-secondary"
          >
            <X size={16} />
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

// Folder Management Component
function FolderManagement({ folders, setFolders, currentFolder }) {
  const [newFolderName, setNewFolderName] = useState('');
  const [localFolders, setLocalFolders] = useState(folders);
  
  // Update local folders when props change
  useEffect(() => {
    setLocalFolders(folders);
  }, [folders]);
  
  const handleAddFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName.trim(),
      parentId: currentFolder
    };
    
    const updatedFolders = [...localFolders, newFolder];
    setLocalFolders(updatedFolders);
    setFolders(updatedFolders);
    setNewFolderName('');
  };
  
  const handleDeleteFolder = (folderId) => {
    const updatedFolders = localFolders.filter(folder => folder.id !== folderId);
    setLocalFolders(updatedFolders);
    setFolders(updatedFolders);
  };
  
  const subFolders = localFolders.filter(folder => folder.parentId === currentFolder);
  
  return (
    <div className="fade-in">
      <h2 className="text-xl font-bold mb-6">Folder Management</h2>
      
      <div className="form-group">
        <label className="form-label">Create New Folder</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="form-input"
            placeholder="Enter folder name"
          />
          <button
            onClick={handleAddFolder}
            disabled={!newFolderName.trim()}
            className="button button-primary"
          >
            <Plus size={16} />
            Add Folder
          </button>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Subfolders in Current Directory</h3>
        {subFolders.length > 0 ? (
          <ul className="space-y-2">
            {subFolders.map(folder => (
              <li key={folder.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                <div className="flex items-center gap-2">
                  <FolderIcon size={18} className="text-warning" />
                  <span>{folder.name}</span>
                </div>
                <button
                  onClick={() => handleDeleteFolder(folder.id)}
                  className="text-error hover:text-error-dark"
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
  const [localDocument, setLocalDocument] = useState(selectedDocument);
  
  // Update local document when selected document changes
  useEffect(() => {
    setLocalDocument(selectedDocument);
  }, [selectedDocument]);
  
  const handleAddTag = () => {
    if (!localDocument || !tag.trim()) return;
    
    // Add tag to selected document
    const updatedTags = [...(localDocument.tags || [])];
    if (!updatedTags.includes(tag.trim())) {
      updatedTags.push(tag.trim());
    }
    
    // Update both local state and global state
    const updatedDoc = {
      ...localDocument,
      tags: updatedTags
    };
    
    setLocalDocument(updatedDoc);
    
    // Create a new array of documents with the updated document
    const updatedDocuments = documents.map(doc => {
      if (doc.id === localDocument.id) {
        return updatedDoc;
      }
      return doc;
    });
    
    // Pass the new array to setDocuments
    setDocuments(updatedDocuments);
    
    setTag('');
  };
  
  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = (localDocument.tags || []).filter(tag => tag !== tagToRemove);
    
    // Update both local state and global state
    const updatedDoc = {
      ...localDocument,
      tags: updatedTags
    };
    
    setLocalDocument(updatedDoc);
    
    // Create a new array of documents with the updated document
    const updatedDocuments = documents.map(doc => {
      if (doc.id === localDocument.id) {
        return updatedDoc;
      }
      return doc;
    });
    
    // Pass the new array to setDocuments
    setDocuments(updatedDocuments);
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Document Tagging</h2>
      
      {localDocument ? (
        <div>
          <div className="mb-6">
            <h3 className="font-medium mb-2">
              Add Tags to: <span className="font-bold">{localDocument.title}</span>
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
            {localDocument.tags && localDocument.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {localDocument.tags.map(tag => (
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
  const [localDocument, setLocalDocument] = useState(selectedDocument);
  
  // Update local document when selected document changes
  useEffect(() => {
    setLocalDocument(selectedDocument);
  }, [selectedDocument]);
  
  const handleAddPermission = () => {
    if (!localDocument || !selectedUser) return;
    
    const updatedPermissions = [...(localDocument.permissions || [])];
    const existingPermIndex = updatedPermissions.findIndex(p => p.userId === selectedUser);
    
    if (existingPermIndex >= 0) {
      updatedPermissions[existingPermIndex].level = selectedPermission;
    } else {
      updatedPermissions.push({
        userId: selectedUser,
        level: selectedPermission
      });
    }
    
    // Update both local state and global state
    const updatedDoc = {
      ...localDocument,
      permissions: updatedPermissions
    };
    
    setLocalDocument(updatedDoc);
    
    // Create a new array of documents with the updated document
    const updatedDocuments = documents.map(doc => {
      if (doc.id === localDocument.id) {
        return updatedDoc;
      }
      return doc;
    });
    
    // Pass the new array to setDocuments
    setDocuments(updatedDocuments);
    
    // Reset selection
    setSelectedUser('');
    setSelectedPermission('view');
  };
  
  const handleRemovePermission = (userId) => {
    const updatedPermissions = (localDocument.permissions || []).filter(p => p.userId !== userId);
    
    // Update both local state and global state
    const updatedDoc = {
      ...localDocument,
      permissions: updatedPermissions
    };
    
    setLocalDocument(updatedDoc);
    
    // Create a new array of documents with the updated document
    const updatedDocuments = documents.map(doc => {
      if (doc.id === localDocument.id) {
        return updatedDoc;
      }
      return doc;
    });
    
    // Pass the new array to setDocuments
    setDocuments(updatedDocuments);
  };
  
  const handleAccessChange = (access) => {
    // Update both local state and global state
    const updatedDoc = {
      ...localDocument,
      access: access
    };
    
    setLocalDocument(updatedDoc);
    
    // Create a new array of documents with the updated document
    const updatedDocuments = documents.map(doc => {
      if (doc.id === localDocument.id) {
        return updatedDoc;
      }
      return doc;
    });
    
    // Pass the new array to setDocuments
    setDocuments(updatedDocuments);
  };
  
  return (
    <div className="fade-in">
      <h2 className="text-xl font-bold mb-6">Access Control</h2>
      
      {localDocument ? (
        <div>
          <div className="form-group">
            <label className="form-label">Document Privacy</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleAccessChange('private')}
                className={`button ${localDocument.access === 'private' ? 'button-primary' : 'button-secondary'}`}
              >
                Private
              </button>
              <button
                onClick={() => handleAccessChange('restricted')}
                className={`button ${localDocument.access === 'restricted' ? 'button-primary' : 'button-secondary'}`}
              >
                Restricted
              </button>
              <button
                onClick={() => handleAccessChange('public')}
                className={`button ${localDocument.access === 'public' ? 'button-primary' : 'button-secondary'}`}
              >
                Public
              </button>
            </div>
          </div>
          
          <div className="form-group mt-6">
            <label className="form-label">Assign User Permissions</label>
            <div className="flex gap-2">
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="form-input form-select"
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
              <select
                value={selectedPermission}
                onChange={(e) => setSelectedPermission(e.target.value)}
                className="form-input form-select"
              >
                <option value="view">View</option>
                <option value="edit">Edit</option>
                <option value="download">Download</option>
              </select>
              <button
                onClick={handleAddPermission}
                disabled={!selectedUser}
                className="button button-primary"
              >
                Assign
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Current Permissions</h3>
            {localDocument.permissions && localDocument.permissions.length > 0 ? (
              <ul className="space-y-2">
                {localDocument.permissions.map(permission => {
                  const user = users.find(u => u.id === permission.userId);
                  return user ? (
                    <li key={permission.userId} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                      <div>
                        <span className="font-medium">{user.name}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({permission.level === 'view' ? 'Can view' : 
                            permission.level === 'edit' ? 'Can edit' : 'Can download'})
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemovePermission(permission.userId)}
                        className="text-error hover:text-error-dark"
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