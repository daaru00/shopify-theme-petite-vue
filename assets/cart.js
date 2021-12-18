import { reactive } from 'https://unpkg.com/petite-vue?module'

const cart = reactive({
  items: [],
  loading: false,
  item_count: 0,
  total_price: 0,
})

const useCart = (cartSerialized) => {
  Object.assign(cart, JSON.parse(cartSerialized || '{}'))

  const emitEvent = (event, data = {}) => {
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
  }

  const refreshItems = async () => {
    cart.loading = true
    let res = await fetch('/cart.js', {
      method: 'GET'
    })

    res = await res.json()
    Object.assign(cart, res)

    cart.loading = false
  }

  const addVariantToCart = async (id, quantity = 1) => {
    cart.loading = true
    await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [{
          id,
          quantity
        }]
      })
    })

    await refreshItems()

    emitEvent('cartchanged', {
      type: 'add',
      id,
      quantity
    })
  }

  const updateVariantCartQuantity = async (id, quantity) => {
    const updates = {}
    updates[id] = quantity
    
    cart.loading = true
    await fetch('/cart/update.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        updates
      })
    })

    await refreshItems()

    emitEvent('cartchanged', {
      type: 'updated',
      id,
      quantity
    })
  }

  const removeVariantFromCart = async (id) => {
    const updates = {}
    updates[id] = 0
    
    cart.loading = true
    await fetch('/cart/update.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        updates
      })
    })

    await refreshItems()

    emitEvent('cartchanged', {
      type: 'removed',
      id
    })
  }

  return {
    cart,
    refreshItems,
    addVariantToCart,
    updateVariantCartQuantity,
    removeVariantFromCart
  }
}

export { useCart };
