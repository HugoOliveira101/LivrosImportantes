export async function fetchBooks() {
  const response = await fetch('/data/books.json')
  if (!response.ok) {
    throw new Error(`Failed to fetch books: ${response.statusText}`)
  }
  return response.json()
}
