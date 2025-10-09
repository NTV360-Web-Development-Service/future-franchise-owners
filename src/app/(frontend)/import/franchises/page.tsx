'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  XCircle, 
  Upload, 
  Download, 
  FileText, 
  Database,
  ArrowLeft,
  Info,
  AlertTriangle,
  Zap,
  FolderOpen
} from 'lucide-react'

interface ImportResult {
  success: boolean
  created: number
  errors: Array<{
    row: number
    businessName: string
    error: string
  }>
}

export default function ImportFranchisesPage() {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    setProgress(0)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      // Read CSRF token from cookie (double-submit pattern)
      const csrfToken = typeof document !== 'undefined'
        ? document.cookie.split('; ').find(row => row.startsWith('csrf-token='))?.split('=')[1]
        : undefined

      const response = await fetch('/api/franchises/import', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: csrfToken ? { 'x-csrf-token': csrfToken } : undefined,
      })

      clearInterval(progressInterval)
      setProgress(100)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Import failed')
      }

      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        created: 0,
        errors: [{
          row: 0,
          businessName: 'System Error',
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        }]
      })
    } finally {
      setImporting(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const downloadTemplate = () => {
    // Download the actual CSV file from the public folder
    const a = document.createElement('a')
    a.href = '/sample/franchise-import-sample.csv'
    a.download = 'franchise-import-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-slate-900/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Database className="h-6 w-6 text-blue-600" />
                  Import Franchises
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Import multiple franchises from a CSV file
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => window.location.href = '/admin/collections/pages?limit=10'}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FolderOpen className="h-4 w-4" />
                View Collections
              </Button>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Import Tool
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Instructions & Upload */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Start Card */}
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Zap className="h-5 w-5" />
                  Quick Start Guide
                </CardTitle>
                <CardDescription className="text-blue-700 dark:text-blue-300">
                  Get started with bulk franchise imports in 3 simple steps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                      1
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Download Template</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Get the CSV template with sample data</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                      2
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Fill Your Data</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Add your franchise information</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                      3
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Upload & Import</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Upload your file and start importing</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <Button onClick={downloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Download CSV Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upload Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-green-600" />
                  Upload CSV File
                </CardTitle>
                <CardDescription>
                  Select your CSV file containing franchise data to begin the import process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="csv-file" className="text-base font-medium">CSV File</Label>
                  <div className="relative">
                    <Input
                      id="csv-file"
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      disabled={importing}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
                    />
                  </div>
                  {file && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800 dark:text-green-200">
                        <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  )}
                </div>

                {importing && (
                  <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span className="text-blue-800 dark:text-blue-200">Processing franchises...</span>
                      <span className="text-blue-600 dark:text-blue-400">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <Button
                  onClick={handleImport}
                  disabled={!file || importing}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-medium"
                  size="lg"
                >
                  {importing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Importing Franchises...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Import Franchises
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Card */}
            {result && (
              <Card className={`shadow-lg border-l-4 ${result.success ? 'border-l-green-500 bg-green-50 dark:bg-green-950' : 'border-l-red-500 bg-red-50 dark:bg-red-950'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    Import Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-white dark:bg-slate-800 border border-green-200 dark:border-green-700 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">{result.created}</div>
                      <div className="text-sm text-green-700 dark:text-green-300 font-medium">Franchises Created</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-red-200 dark:border-red-700 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-red-600 mb-1">{result.errors.length}</div>
                      <div className="text-sm text-red-700 dark:text-red-300 font-medium">Errors</div>
                    </div>
                  </div>

                  {result.errors.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-red-800 dark:text-red-200 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Import Errors:
                      </h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {result.errors.map((error, index) => (
                          <Alert key={index} variant="destructive" className="text-sm">
                            <AlertDescription>
                              <strong>Row {error.row}</strong> ({error.businessName}): {error.error}
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.success && result.created > 0 && (
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        🎉 Successfully imported {result.created} franchise{result.created !== 1 ? 's' : ''}!
                        You can now view them in the franchise listings.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Field Reference */}
          <div className="space-y-6">
            <Card className="shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  CSV Field Reference
                </CardTitle>
                <CardDescription>
                  Required and optional fields for your CSV file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Required Fields
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded border-l-2 border-red-500">
                      <code className="font-mono text-red-600 dark:text-red-400">businessName</code>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Name of the franchise</p>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded border-l-2 border-red-500">
                      <code className="font-mono text-red-600 dark:text-red-400">description</code>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Franchise description</p>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded border-l-2 border-red-500">
                      <code className="font-mono text-red-600 dark:text-red-400">category</code>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Must be: Fitness, Food and Beverage, Retail, Services, Education, Healthcare, Automotive, Real Estate, Technology, or Other</p>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded border-l-2 border-red-500">
                      <code className="font-mono text-red-600 dark:text-red-400">minInvestment</code>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Minimum investment (number)</p>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded border-l-2 border-red-500">
                      <code className="font-mono text-red-600 dark:text-red-400">maxInvestment</code>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Maximum investment (number)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Optional Fields
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded border-l-2 border-blue-500">
                      <code className="font-mono text-blue-600 dark:text-blue-400">tags</code>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Semicolon-separated tags</p>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded border-l-2 border-blue-500">
                      <code className="font-mono text-blue-600 dark:text-blue-400">agentEmail</code>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Email of assigned agent</p>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded border-l-2 border-blue-500">
                      <code className="font-mono text-blue-600 dark:text-blue-400">isFeatured</code>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">true/false</p>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded border-l-2 border-blue-500">
                      <code className="font-mono text-blue-600 dark:text-blue-400">isSponsored</code>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">true/false</p>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded border-l-2 border-blue-500">
                      <code className="font-mono text-blue-600 dark:text-blue-400">isTopPick</code>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">true/false</p>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded border-l-2 border-blue-500">
                      <code className="font-mono text-blue-600 dark:text-blue-400">status</code>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">draft/published/archived (default: draft)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}