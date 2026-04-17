import { useEffect, useRef } from 'react'

/**
 * useAutoResize
 * Automatically resizes a textarea element to fit its content.
 *
 * @param {string} value - The current textarea value
 * @param {number} maxRows - Maximum rows before scrolling kicks in
 * @returns {React.RefObject} - Ref to attach to the textarea element
 */
export function useAutoResize(value, maxRows = 6) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Reset height to auto to correctly compute scrollHeight
    el.style.height = 'auto'

    const lineHeight = parseInt(getComputedStyle(el).lineHeight, 10) || 22
    const maxHeight = lineHeight * maxRows + 32 // 32px for padding

    el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px'
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }, [value, maxRows])

  return ref
}
