import { useState } from 'react'
import axios from 'axios'

interface Analysis {
  overallScore: number
  summary: string
  strengths: string[]
  improvements: string[]
  missingKeywords: string[]
  atsScore: number
  suggestions: string[]
}

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setAnalysis(null)
      setError(null)
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a PDF resume first!')
      return
    }

    const formData = new FormData()
    formData.append('resume', file)

    try {
      setLoading(true)
      setError(null)
      const response = await axios.post(
        'http://localhost:5000/api/analyze',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )
      setAnalysis(response.data.analysis)
    } catch (err) {
      setError('Failed to analyze resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🤖 AI Resume Analyzer</h1>
        <p style={styles.subtitle}>
          Upload your resume and get instant AI-powered feedback
        </p>
      </div>

      {/* Upload Section */}
      <div style={styles.uploadBox}>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={styles.fileInput}
          id="resume-upload"
        />
        <label htmlFor="resume-upload" style={styles.uploadLabel}>
          {file ? `📄 ${file.name}` : '📁 Click to upload PDF resume'}
        </label>

        <button
          onClick={handleAnalyze}
          disabled={loading || !file}
          style={{
            ...styles.button,
            opacity: loading || !file ? 0.6 : 1
          }}
        >
          {loading ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </div>

      {/* Results Section */}
      {analysis && (
        <div style={styles.results}>

          {/* Scores */}
          <div style={styles.scoresRow}>
            <div style={styles.scoreCard}>
              <h2 style={styles.scoreNumber}>{analysis.overallScore}/100</h2>
              <p style={styles.scoreLabel}>Overall Score</p>
            </div>
            <div style={styles.scoreCard}>
              <h2 style={styles.scoreNumber}>{analysis.atsScore}/100</h2>
              <p style={styles.scoreLabel}>ATS Score</p>
            </div>
          </div>

          {/* Summary */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📋 Summary</h3>
            <p style={styles.cardText}>{analysis.summary}</p>
          </div>

          {/* Strengths */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>✅ Strengths</h3>
            {analysis.strengths.map((s, i) => (
              <p key={i} style={styles.listItem}>• {s}</p>
            ))}
          </div>

          {/* Improvements */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>⚠️ Areas to Improve</h3>
            {analysis.improvements.map((s, i) => (
              <p key={i} style={styles.listItem}>• {s}</p>
            ))}
          </div>

          {/* Missing Keywords */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🔑 Missing Keywords</h3>
            <div style={styles.tagsRow}>
              {analysis.missingKeywords.map((k, i) => (
                <span key={i} style={styles.tag}>{k}</span>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>💡 Suggestions</h3>
            {analysis.suggestions.map((s, i) => (
              <p key={i} style={styles.listItem}>• {s}</p>
            ))}
          </div>

        </div>
      )}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#f1f5f9',
    fontFamily: 'Inter, sans-serif',
    padding: '2rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#38bdf8',
    margin: 0,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '1rem',
    marginTop: '0.5rem',
  },
  uploadBox: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '600px',
    margin: '0 auto 2rem',
    textAlign: 'center',
    border: '1px solid #334155',
  },
  fileInput: {
    display: 'none',
  },
  uploadLabel: {
    display: 'block',
    padding: '1rem',
    border: '2px dashed #38bdf8',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '1rem',
    color: '#38bdf8',
    fontSize: '1rem',
  },
  button: {
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
  },
  error: {
    color: '#f87171',
    marginTop: '1rem',
  },
  results: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  scoresRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
  },
  scoreCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    border: '1px solid #334155',
  },
  scoreNumber: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#38bdf8',
    margin: 0,
  },
  scoreLabel: {
    color: '#94a3b8',
    margin: '0.5rem 0 0',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1rem',
    border: '1px solid #334155',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    color: '#f1f5f9',
  },
  cardText: {
    color: '#94a3b8',
    lineHeight: 1.6,
  },
  listItem: {
    color: '#94a3b8',
    marginBottom: '0.5rem',
    lineHeight: 1.6,
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  tag: {
    backgroundColor: '#0f172a',
    border: '1px solid #38bdf8',
    color: '#38bdf8',
    padding: '0.25rem 0.75rem',
    borderRadius: '99px',
    fontSize: '0.85rem',
  },
}

export default App