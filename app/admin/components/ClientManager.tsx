'use client';
import React, { useState, useEffect } from 'react';
import { UserIcon, DocumentIcon, EyeIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface ClientFile {
  filename: string;
  lastModified: string;
  size: number;
  preview: string;
}

interface ClientFilesResponse {
  success: boolean;
  clients: ClientFile[];
  total: number;
  error?: string;
}

export default function ClientManager() {
  const [clientFiles, setClientFiles] = useState<ClientFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [showContent, setShowContent] = useState(false);

  const fetchClientFiles = async () => {
    try {
      const response = await fetch('/api/admin/client-data');
      const result: ClientFilesResponse = await response.json();
      
      if (result.success) {
        setClientFiles(result.clients);
        setError(null);
      } else {
        setError(result.error || 'Erreur lors de la récupération des fichiers');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Error fetching client files:', err);
    } finally {
      setLoading(false);
    }
  };

  const viewFileContent = async (filename: string) => {
    try {
      const response = await fetch(`/api/admin/client-files/${filename}`);
      if (response.ok) {
        const content = await response.text();
        setFileContent(content);
        setSelectedFile(filename);
        setShowContent(true);
      } else {
        setError('Impossible de lire le fichier');
      }
    } catch (err) {
      setError('Erreur lors de la lecture du fichier');
    }
  };

  const downloadFile = async (filename: string) => {
    try {
      const response = await fetch(`/api/admin/client-files/${filename}`);
      if (response.ok) {
        const content = await response.text();
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      setError('Erreur lors du téléchargement');
    }
  };

  const deleteFile = async (filename: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le fichier ${filename} ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/client-files/${filename}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setClientFiles(prev => prev.filter(file => file.filename !== filename));
        if (selectedFile === filename) {
          setShowContent(false);
          setSelectedFile(null);
          setFileContent('');
        }
      } else {
        setError('Erreur lors de la suppression');
      }
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getClientEmail = (filename: string): string => {
    const emailMatch = filename.match(/([^_]+@[^_]+\.[^_]+)/);
    return emailMatch ? emailMatch[1].replace(/_/g, '.') : filename.replace(/\.txt$/, '').replace(/_/g, ' ');
  };

  useEffect(() => {
    fetchClientFiles();
    const interval = setInterval(fetchClientFiles, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Chargement des fichiers client...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestionnaire de Clients</h2>
          <p className="text-sm text-gray-600">
            {clientFiles.length} fichier{clientFiles.length > 1 ? 's' : ''} client{clientFiles.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <button
          onClick={fetchClientFiles}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Actualiser
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Files list */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Fichiers Clients</h3>
          </div>
          
          {clientFiles.length === 0 ? (
            <div className="text-center py-12">
              <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun fichier client</h3>
              <p className="mt-1 text-sm text-gray-500">Les données des clients apparaîtront ici automatiquement.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {clientFiles.map((file) => (
                <div key={file.filename} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <UserIcon className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {getClientEmail(file.filename)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} • Modifié le {new Date(file.lastModified).toLocaleString('fr-FR')}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {file.preview}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewFileContent(file.filename)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Voir le contenu"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => downloadFile(file.filename)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Télécharger"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteFile(file.filename)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* File content viewer */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedFile ? `Contenu : ${getClientEmail(selectedFile)}` : 'Aperçu du fichier'}
            </h3>
          </div>
          
          <div className="p-6">
            {showContent && fileContent ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fichier : {selectedFile}</span>
                  <button
                    onClick={() => {
                      setShowContent(false);
                      setSelectedFile(null);
                      setFileContent('');
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Fermer
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
                    {fileContent}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun fichier sélectionné</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Cliquez sur l'icône œil pour voir le contenu d'un fichier client.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}