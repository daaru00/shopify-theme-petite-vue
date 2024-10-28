import { reactive } from 'https://unpkg.com/petite-vue?module'
import { useEvents, useSerializer } from './utils.js'

const product = reactive({
  id: null,
  variants: [],
  related: [],
  complementary: []
})

const variant = reactive({
  id: null
})

const useProduct = (productSerialized = '{}', variantId) => {
  const { emitEvent, events } = useEvents()
  const { parse } = useSerializer()

  Object.assign(product, parse(productSerialized))

  const getVariant = (id) => {
    return product.variants.find(variant => `${variant.id}` === `${id}`)
  }

  const updateVariantQueryParam = (variantId) => {
    const url = `${location.protocol}//${location.host}${location.pathname}`;
    window.history.replaceState({ }, '', `${url}?variant=${variantId}`);
  }

  const selectVariant = (variantId) => {
    Object.assign(variant, getVariant(variantId))
    updateVariantQueryParam(variantId)
    emitEvent(events.VARIANT_CHANGED, { id: variantId })
  }
  
  if (variantId) {
    selectVariant(variantId)
  }

  const formatPrice = (price) => {
    return '€' + (price/100).toFixed(2).replace('.', ',')
  }

  const getRecommendedProducts = async (intent = 'related') => {
    const res = await fetch(`/recommendations/products.json?product_id=${product.id}&intent=${intent}`, {
      method: 'GET'
    })

    const { products } = await res.json()
    product[intent] = products 
  }

  return {
    product,
    variant,
    selectVariant,
    getVariant,
    formatPrice,
    getRecommendedProducts
  }
}

export { useProduct };
