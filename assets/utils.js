const useEvents = () => {
  const events = {
    'CART_CHANGED': 'cartchanged',
    'VARIANT_CHANGED': 'variantchanged',
    'SEARCH_RESULT_CHANGED': 'searchresultschanged',
  }

  const emitEvent = (event, data = {}) => {
    window.dispatchEvent(new CustomEvent(event, { detail: data }))
  }

  const listenEvent = (event, callback) => {
    window.addEventListener(event, ({ detail }) => {
      callback(detail)
    })
  }

  return {
    events,
    emitEvent,
    listenEvent
  }
}

const useSerializer = () => {
  const parse = (serialized) => {
    return JSON.parse(serialized.replace(/[\n]/g, '\\n'))
  }

  return {
    parse
  }
}

export { useEvents, useSerializer }
