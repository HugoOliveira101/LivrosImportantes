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

export async function fetchBooks() {
  const localBooks = await fetchLocalBooks()
  const archiveBooks = []

  try {
    const params = new URLSearchParams({
      q: DOSTOIEVSKY_QUERY,
      fl: 'identifier,title,creator,description',
      rows: String(ARCHIVE_BOOKS_LIMIT),
      page: '1',
      output: 'json',
    })

    const searchResponse = await fetch(`${ARCHIVE_SEARCH_URL}?${params.toString()}`)
    if (!searchResponse.ok) {
      throw new Error(`Failed to fetch archive search results: ${searchResponse.statusText}`)
    }

    const searchJson = await searchResponse.json()
    const docs = (searchJson.response && searchJson.response.docs) || []

    for (let index = 0; index < docs.length; index += 1) {
      const doc = docs[index]
      if (!doc?.identifier) continue

      try {
        const metadataResponse = await fetch(
          `${ARCHIVE_METADATA_URL}/${encodeURIComponent(doc.identifier)}`,
        )
        if (!metadataResponse.ok) continue

        const metadata = await metadataResponse.json()
        const pdfFile = (metadata.files || []).find(
          (file) =>
            file.name?.toLowerCase().endsWith('.pdf') || file.format?.toLowerCase().includes('pdf'),
        )
        if (!pdfFile?.name) continue

        const author = Array.isArray(doc.creator)
          ? doc.creator.join(', ')
          : doc.creator || 'Fiódor Dostoiévski'

        const description = Array.isArray(doc.description)
          ? doc.description.join(' ')
          : doc.description || 'Tradução em português disponível no archive.org.'

        archiveBooks.push({
          id: `book-archive-${index + 1}`,
          title: doc.title || 'Dostoiévski: tradução em português',
          author,
          category: 'Literatura',
          description,
          pdf_url: `https://archive.org/download/${encodeURIComponent(doc.identifier)}/${encodeURIComponent(
            pdfFile.name,
          )}`,
          source: 'archive.org',
        })
      } catch (error) {
        console.warn('archive.org fetch failed for', doc.identifier, error)
      }
    }
  } catch (error) {
    console.warn('Unable to load archive.org books:', error)
  }

  return [...localBooks, ...archiveBooks]
}
