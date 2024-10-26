import { reactive } from 'https://unpkg.com/petite-vue?module'

const store = reactive({
  product: {},
  variant: {}
})

const useProduct = (productSerialized = '{}', variantId) => {
  Object.assign(store.product, JSON.parse(productSerialized.replace(/[\n]/g, '\\n')))
  
  const getVariant = (id) => {
    return store.product.variants.find(variant => `${variant.id}` === `${id}`)
  }
  
  if (variantId) {
    store.variant = getVariant(variantId)
  }

  const updateVariantQueryParam = (variantId) => {
    const url = `${location.protocol}//${location.host}${location.pathname}`;
    window.history.replaceState({ }, '', `${url}?variant=${variantId}`);
  }

  if (variantId) {
    updateVariantQueryParam(variantId)
  }

  const getProduct = async () => {
    const res = await fetch('/cart.js', {
      method: 'GET'
    })

    return reactive(await res.json())
  }

  const formatPrice = (price) => {
    return '€' + (price/100).toFixed(2).replace('.', ',')
  }

  return {
    get product() {
      return store.product
    },
    get variant() {
      return store.variant
    },
    updateVariantQueryParam,
    getProduct,
    getVariant,
    formatPrice
  }
}

export { useProduct };
