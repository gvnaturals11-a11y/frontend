import ProductsPage from '@/modules/products/pages/ProductsPage'
import { ProductsLayout } from '@/modules/products/layouts/ProductsLayout'

export default function Products() {
  return (
    <ProductsLayout>
      <ProductsPage />
    </ProductsLayout>
  )
}

