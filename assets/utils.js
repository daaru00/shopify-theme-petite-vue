const eventBus = new Comment('event-bus');

const useEvents = () => {
  const events = {
    'CART_CHANGED': 'cartchanged',
    'VARIANT_CHANGED': 'variantchanged',
    'SEARCH_RESULT_CHANGED': 'searchresultschanged',
  }

  const emitEvent = (event, data = {}) => {
    eventBus.dispatchEvent(new CustomEvent(event, { detail: data }))
  }

  const listenEvent = (event, callback) => {
    eventBus.addEventListener(event, ({ detail }) => {
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

const useDebounce = (delayMs = 500) => {
  let timeout = null;

  const debounce = (callback) => {
    console.log('debounce..');
    
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      callback();
    }, delayMs || 500);
  }

  return {
    debounce
  }
}


export { useEvents, useSerializer, useDebounce }
