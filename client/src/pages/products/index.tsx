import Footer from "../../components/general/Footer"
import Navbar from "../../components/general/Navbar"
import Pagination from "../../components/general/Pagination"
import ProductCard from "../../components/general/ProductCard"
import HeadInfo from "../../utils/HeadInfo"

const Products = () => {
    return (
        <>
            <HeadInfo title='Browse Products' />
            <Navbar />
            <div className='py-10 md:px-12 px-6'>
                {/* header */}
                <div>
                    <h1 className='text-center text-3xl font-medium'>Browse Products</h1>
                    <p className='text-center text-gray-500 mt-5 text-sm leading-loose'>Check this latest drop on this week! Our new arrivals are built to withstand your activities while keeping you looking your best!</p>
                </div>
                {/* filter */}
                <div className='mt-12'>
                    <div className='flex items-center justify-center gap-3 flex-wrap'>
                        <div className='rounded-full px-5 py-2 bg-black text-white transition cursor-pointer'>
                            <p className='text-sm'>Jackets</p>
                        </div>
                        <div className='rounded-full px-5 py-2 bg-gray-100 hover:bg-black text-gray-500 hover:text-white transition cursor-pointer'>
                            <p className='text-sm'>T-Shirts</p>
                        </div>
                        <div className='rounded-full px-5 py-2 bg-gray-100 hover:bg-black text-gray-500 hover:text-white transition cursor-pointer'>
                            <p className='text-sm'>Bottoms</p>
                        </div>
                        <div className='rounded-full px-5 py-2 bg-gray-100 hover:bg-black text-gray-500 hover:text-white transition cursor-pointer'>
                            <p className='text-sm'>Footwear</p>
                        </div>
                        <div className='rounded-full px-5 py-2 bg-gray-100 hover:bg-black text-gray-500 hover:text-white transition cursor-pointer'>
                            <p className='text-sm'>Knitwear</p>
                        </div>
                        <div className='rounded-full px-5 py-2 bg-gray-100 hover:bg-black text-gray-500 hover:text-white transition cursor-pointer'>
                            <p className='text-sm'>Crop Top</p>
                        </div>
                    </div>
                    <p className='text-sm text-gray-500 text-center mt-6'>(128 Products Available)</p>
                </div>
                {/* product list */}
                <div className='mt-12'>
                    <div className='grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8'>
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                    </div>
                    <div className='mt-16 flex justify-center'>
                        <Pagination />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Products