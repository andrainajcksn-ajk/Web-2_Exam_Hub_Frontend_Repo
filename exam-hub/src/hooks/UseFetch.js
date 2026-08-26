import { useEffect, useState, useCallback } from 'react'

export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchFn()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  
  }, deps)

  useEffect(() => {
    reload()
  }, deps)

  return { data, loading, error, reload, setData }
}