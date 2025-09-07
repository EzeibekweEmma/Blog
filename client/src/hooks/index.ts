import { useEffect } from 'react'
import { lazyLoadImages } from '../utils'

export const useLazyImages = () => {
  useEffect(() => {
    lazyLoadImages()

    // Re-run when new content is loaded (for pagination, etc.)
    const handleContentChange = () => {
      setTimeout(() => lazyLoadImages(), 100)
    }

    // Listen for route changes or content updates
    window.addEventListener('popstate', handleContentChange)

    return () => {
      window.removeEventListener('popstate', handleContentChange)
    }
  }, [])
}
