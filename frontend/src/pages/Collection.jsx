import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {

  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevance');

  // useEffect(() => {
  //   setFilterProducts(products);
  // }, [])

  const toggleCategory = (e) => {
    if(category.includes(e.target.value)) setCategory(prev => prev.filter(item => item !== e.target.value));

    else  setCategory(prev => [...prev, e.target.value]);
  }

  const toggleSubCategory = (e) => {
    if(subCategory.includes(e.target.value))  setSubCategory(prev => prev.filter(item => item !== e.target.value));

    else  setSubCategory(prev => [...prev, e.target.value]);
  }

  const applyFilter = () => {
    let productsCopy = products.slice();

    if(showSearch && search)  productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

    if(category.length > 0)  productsCopy = productsCopy.filter(item => category.includes(item.category));

    if(subCategory.length > 0)  productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));

    setFilterProducts(productsCopy);
  }

  const sortProduct = () => {

    let filteredCopy = filterProducts.slice();

    switch(sortType){
      case 'low-high':
        setFilterProducts(filteredCopy.sort((a, b) => (a.price - b.price)));
        break;
      
      case 'high-low':
        setFilterProducts(filteredCopy.sort((a, b) => (b.price - a.price)));
        break;
      
      default:
        applyFilter();
        break; 
    }
  }

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products])

  useEffect(() => {
    sortProduct();
  }, [sortType])


  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-11 border-t relative'>
  {/* Sidebar for filters - Drawer on mobile, static on desktop */}
  <div
    className={`
      fixed top-0 left-0 h-full w-64 bg-white z-50 p-4 transition-transform duration-300
      ${showFilter ? 'translate-x-0' : '-translate-x-full'}
      sm:static sm:translate-x-0 sm:block sm:w-60 sm:h-auto sm:bg-transparent sm:p-0
    `}
  >
    {/* Close button on mobile */}
    <div className='flex justify-between items-center sm:hidden mb-4'>
      <p className='text-xl font-semibold text-[#2E1E12]'>FILTERS</p>
      <button onClick={() => setShowFilter(false)} className='text-2xl mb-2'>&times;</button>
    </div>

    {/* Category Filter */}
    <div className='pl-2 sm:pl-6 py-4 mt-6'>
      <p className='mb-4 text-md font-medium text-[#2E1E12]'>CATEGORIES</p>
      <div className='flex flex-col gap-3 text-sm'>
        {['Men', 'Women', 'Kids'].map((cat) => (
          <p key={cat} className='flex gap-3'>
            <input
              type="checkbox"
              className='w-3'
              value={cat}
              onChange={(e) => {
                toggleCategory(e);
                if (window.innerWidth < 640) setShowFilter(false); // auto-close on small screen
              }}
            /> {cat}
          </p>
        ))}
      </div>
    </div>

    {/* Subcategory Filter */}
    <div className='pl-2 sm:pl-6 py-4 my-6'>
      <p className='mb-4 text-md font-medium text-[#2E1E12]'>TYPE</p>
      <div className='flex flex-col gap-3 text-sm'>
        {['Formal', 'Casual', 'Heels', 'Flats', 'Sports', 'Boots'].map((type) => (
          <p key={type} className='flex gap-3'>
            <input
              type="checkbox"
              className='w-3'
              value={type}
              onChange={(e) => {
                toggleSubCategory(e);
                if (window.innerWidth < 640) setShowFilter(false); // auto-close on small screen
              }}
            /> {type}
          </p>
        ))}
      </div>
    </div>
  </div>

  {/* Overlay for mobile drawer */}
  {showFilter && (
    <div
      className='fixed inset-0 bg-black opacity-40 z-40 sm:hidden'
      onClick={() => setShowFilter(false)}
    ></div>
  )}

  {/* Main content */}
  <div className='flex-1'>
    {/* Toggle button for filters (only on small screens) */}
    <div className='sm:hidden'>
      <p
        onClick={() => setShowFilter(true)}
        className='my-3 text-xl flex items-center cursor-pointer gap-3 text-[#2E1E12]'
      >
        FILTERS
        <img
          src={assets.dropdown_icon}
          className={`h-4 transform transition-transform duration-200 ${showFilter ? 'rotate-90' : ''}`}
          alt=""
        />
      </p>
    </div>

    {/* Header */}
    <div className='flex justify-between text-base sm:text-3xl mb-5'>
      <Title text1={'ALL'} text2={'COLLECTIONS'} />
      <select onChange={(e) => setSortType(e.target.value)} className='px-3 text-[18px] mb-4'>
        <option value="relevance">Sort by: Relevance</option>
        <option value="low-high">Sort by: Low to High</option>
        <option value="high-low">Sort by: High to Low</option>
      </select>
    </div>

    {/* Product Grid */}
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
      {filterProducts.map((item, index) => (
        <ProductItem
          key={index}
          name={item.name}
          id={item._id}
          price={item.price}
          image={item.image}
        />
      ))}
    </div>
  </div>
</div>


  )
}

export default Collection