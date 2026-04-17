import { useEffect, useRef } from 'react'

/**
 * useChatScroll
 * Automatically scrolls a container to the bottom whenever
 * the dependency value changes (e.g., new message added).
 *
 * @param {any} dep - Reactive dependency that triggers the scroll
 * @returns {React.RefObject} - Ref to attach to the scroll container
 */
export function useChatScroll(dep) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [dep])

  return ref
}
