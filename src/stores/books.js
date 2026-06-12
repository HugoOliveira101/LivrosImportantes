import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import { fetchBooks } from '../api/booksApi'

const STORAGE_KEY = 'livros-interactions'

function loadStoredInteractions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

function saveStoredInteractions(value) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

export const useBooksStore = defineStore('books', () => {
  const books = ref([])
  const status = ref('idle')
  const error = ref(null)
  const query = ref('')
  const category = ref('All')
  const page = ref(1)
  const pageSize = ref(6)
  const interactions = ref(loadStoredInteractions())

  const filteredBooks = computed(() => {
    let list = books.value

    if (query.value.trim()) {
      const q = query.value.toLowerCase()
      list = list.filter(
        (book) =>
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.description.toLowerCase().includes(q),
      )
    }

    if (category.value !== 'All') {
      list = list.filter((book) => book.category === category.value)
    }

    return list
  })

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredBooks.value.length / pageSize.value)),
  )

  const pagedBooks = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return filteredBooks.value.slice(start, start + pageSize.value)
  })

  const categories = computed(() => [
    'All',
    ...Array.from(new Set(books.value.map((book) => book.category))).sort(),
  ])

  const currentBook = (bookId) => books.value.find((book) => book.id === bookId)

  const interactionFor = (bookId) => {
    return interactions.value[bookId] || { likes: 0, likedBy: [], comments: [] }
  }

  function setQuery(value) {
    query.value = value
    page.value = 1
  }

  function setCategory(value) {
    category.value = value
    page.value = 1
  }

  function setPage(value) {
    page.value = value
  }

  async function loadBooks() {
    if (status.value === 'loading') {
      return
    }

    status.value = 'loading'
    error.value = null

    try {
      books.value = await fetchBooks()
      status.value = 'success'
    } catch (caught) {
      status.value = 'error'
      error.value = caught?.message || 'Unable to load books.'
    }
  }

  function saveInteractions() {
    saveStoredInteractions(interactions.value)
  }

  function toggleLike(bookId, userId) {
    if (!userId) {
      return
    }

    const existing = interactionFor(bookId)
    const likedBy = [...existing.likedBy]
    const index = likedBy.indexOf(userId)

    if (index === -1) {
      likedBy.push(userId)
    } else {
      likedBy.splice(index, 1)
    }

    interactions.value = {
      ...interactions.value,
      [bookId]: {
        ...existing,
        likedBy,
        likes: likedBy.length,
      },
    }

    saveInteractions()
  }

  function addComment(bookId, comment) {
    if (!comment || !comment.author) {
      return
    }

    const existing = interactionFor(bookId)
    const comments = [
      ...existing.comments,
      {
        id: `${bookId}-${Date.now()}`,
        ...comment,
        createdAt: new Date().toISOString(),
      },
    ]

    interactions.value = {
      ...interactions.value,
      [bookId]: {
        ...existing,
        comments,
      },
    }

    saveInteractions()
  }

  return {
    books,
    status,
    error,
    query,
    category,
    page,
    pageSize,
    pagedBooks,
    totalPages,
    categories,
    currentBook,
    interactionFor,
    loadBooks,
    setQuery,
    setCategory,
    setPage,
    toggleLike,
    addComment,
  }
})
