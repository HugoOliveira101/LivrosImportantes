const LOCAL_BOOKS_URL = '/data/books.json'
const ARCHIVE_SEARCH_URL = 'https://archive.org/advancedsearch.php'
const ARCHIVE_METADATA_URL = 'https://archive.org/metadata'
const DOSTOIEVSKY_QUERY =
  'creator:(Dostoevsky OR Dostoyevsky OR Dostoiévski OR Dostoevski) AND language:(por OR pt)'
const ARCHIVE_BOOKS_LIMIT = 10

async function fetchLocalBooks() {
  const response = await fetch(LOCAL_BOOKS_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch local books: ${response.statusText}`)
  }
  return response.json()
}

const formatField = (field, defaultValue) => 
  Array.isArray(field) ? field.join(', ') : field || defaultValue

async function fetchArchiveSearchResults() {
  const params = new URLSearchParams({
    q: `${DOSTOIEVSKY_QUERY} AND format:"Text PDF"`,
    fl: 'identifier,title,creator,description',
    rows: String(ARCHIVE_BOOKS_LIMIT),
    page: '1',
    output: 'json',
  })

  const response = await fetch(`${ARCHIVE_SEARCH_URL}?${params.toString()}`)
  if (!response.ok) throw new Error(`Search failed: ${response.statusText}`)
  
  const json = await response.json()
  return json.response?.docs || []
}

async function processArchiveBook(doc, index) {
  if (!doc?.identifier) return null

  try {
    const response = await fetch(`${ARCHIVE_METADATA_URL}/${encodeURIComponent(doc.identifier)}`)
    if (!response.ok) return null

    const metadata = await response.json()
    const pdfFile = (metadata.files || []).find(
      (f) => f.name?.toLowerCase().endsWith('.pdf') || f.format?.toLowerCase().includes('pdf')
    )

    if (!pdfFile?.name) return null 

    return {
      id: `book-archive-${index + 1}`,
      title: doc.title || 'Dostoiévski: tradução em português',
      author: formatField(doc.creator, 'Fiódor Dostoiévski'),
      category: 'Literatura',
      description: formatField(doc.description, 'Tradução em português disponível no archive.org.'),
      pdf_url: `https://archive.org/download/${encodeURIComponent(doc.identifier)}/${encodeURIComponent(pdfFile.name)}`,
      source: 'archive.org',
    }
  } catch (error) {
    console.warn('Metadata fetch failed for', doc.identifier, error)
    return null
  }
}

export async function fetchBooks() {
  const localBooks = await fetchLocalBooks()
  let archiveBooks = []

  try {
    const docs = await fetchArchiveSearchResults()
    
    const processedBooks = await Promise.all(
      docs.map((doc, index) => processArchiveBook(doc, index))
    )

    archiveBooks = processedBooks.filter(Boolean)
    
  } catch (error) {
    console.warn('Unable to load archive.org books:', error)
  }

  return [...localBooks, ...archiveBooks]
}
