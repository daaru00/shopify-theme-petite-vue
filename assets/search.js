import { reactive } from 'https://unpkg.com/petite-vue?module'

const search = reactive({
  query: null,
  results: {
    collections:[],
    pages:[],
    products:[],
    queries:[]
  },
  loading: false
})

const useSearch = () => {
  const emitEvent = (event, data = {}) => {
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
  }

  const suggest = async () => {
    search.loading = true

    let res = await fetch(`/search/suggest.json?q=${search.query}`, {
      method: 'GET'
    })

    const { resources: { results } } = await res.json()
    Object.assign(search.results, results)
    emitEvent('searchresultschanged', results)

    search.loading = false
  }

  return {
    search,
    suggest
  }
}

export { useSearch }
