import { notFound } from "next/navigation";
import { db } from "../../_lib/prisma";
import ProductImage from "./_components/product-image";
import ProductDetails from "./_components/product-details";

interface ProductPageProps {
  params: {
    id: string;
  };
}

const ProductPage = async ({ params: { id } }: ProductPageProps) => {
  //Buscando os dados do restaurante pelo id do produto
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      restaurant: true,
    },
  });

  if (!product) {
    return notFound;
  }

  const juices = await db.product.findMany({
    where: {
      category: {
        name: "Sucos",
      },
      restaurant: {
        id: product?.restaurant.id,
      },
    },
    include: {
      restaurant: true,
    },
  });

  return (
    <div>
      {/** IMAGEM */}
      <ProductImage product={product} />

      {/** TITULO E PREÇO  */}
      <ProductDetails product={product} complementaryProduct={juices} />
    </div>
  );
};

export default ProductPage;
