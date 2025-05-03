import React from "react";
import { useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios'
import { backendURL } from '../App';
import { useEffect } from "react";


const Edit = () => {
  const { id } = useParams();
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [noOfStocks, setNoOfStocks] = useState('');
  const [category, setCategory] = useState('Men');
  const [subCategory, setSubCategory] = useState('Formal');
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [sizeStocks, setSizeStocks] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("noOfStocks", noOfStocks);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizeStocks));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      console.log('formData: ', formData);

      const response = await axios.post(backendURL + "/api/product/add-product", formData, { withCredentials: true })
      console.log(response.data);

      if(response.data.success){
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice('');
        setSizeStocks([]);

      } else{
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }

  }

  const fetchSingleProduct = async () => {
    try {
      const response = await axios.post(
        backendURL + '/api/product/get-single-product',
        { productId: id },
        { withCredentials: true }
      );
  
      const product = response.data.product;
  
      if (product) {
        setName(product.name || '');
        setDescription(product.description || '');
        setPrice(product.price || '');
        setCategory(product.category || 'Men');
        setSubCategory(product.subCategory || 'Formal');
        setBestseller(product.bestseller || false);
        setSizeStocks(product.sizes || []);
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  useEffect(() => {
    fetchSingleProduct();
  }, [id]);
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      

      <div className="w-full">
        <p className="mb-3 lato-regular">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          name=""
          id=""
          placeholder="Enter here..."
          className="w-full max-w-[500px] px-3 py-1 rounded-sm lato-regular"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-3 lato-regular">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          name=""
          id=""
          placeholder="Enter here..."
          className="w-full max-w-[500px] px-3 py-1 rounded-sm lato-regular resize-none"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2 lato-regular">Product Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-1 rounded-sm lato-regular"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className="mb-2 lato-regular">Sub Category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-1 rounded-sm lato-regular"
          >
            <option value="Formal">Formal</option>
            <option value="Casual">Casual</option>
            <option value="Heels">Heels</option>
            <option value="Flats">Flats</option>
            <option value="Sports">Sports</option>
            <option value="Boots">Boots</option>
          </select>
        </div>

        <div>
          <p className="mb-2 lato-regular">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            type="number"
            className="w-full px-3 py-0.5 rounded-sm sm:w-[120px] lato-regular"
            name=""
            id=""
            placeholder="100"
          />
        </div>
        {/* <div>
          <p className='mb-2 lato-regular'>Number Of Stocks</p>
          <input onChange={(e) => setNoOfStocks(e.target.value)} value={noOfStocks} type="number" className='w-full px-3 py-0.5 rounded-sm sm:w-[120px] lato-regular' name="" id="" placeholder='10'/>
        </div> */}
      </div>

      {/* <div>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-4 lato-regular'>

        <div onClick={() => setSizes(prev => prev.includes("4") ? prev.filter(item => item !== "4" ) : [...prev, "4"])}>
            <p className={`${sizes.includes("4") ? "bg-blue-500 text-white" : "bg-neutral-500 text-white"} px-3 py-1 cursor-pointer rounded-sm`}>4</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("5") ? prev.filter(item => item !== "5" ) : [...prev, "5"])}>

            <p className={`${sizes.includes("5") ? "bg-blue-500 text-white" : "bg-neutral-500 text-white"} px-3 py-1 cursor-pointer rounded-sm`}>5</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("6") ? prev.filter(item => item !== "6" ) : [...prev, "6"])}>
            <p className={`${sizes.includes("6") ? "bg-blue-500 text-white" : "bg-neutral-500 text-white"} px-3 py-1 cursor-pointer rounded-sm`}>6</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("7") ? prev.filter(item => item !== "7" ) : [...prev, "7"])}>
            <p className={`${sizes.includes("7") ? "bg-blue-500 text-white" : "bg-neutral-500 text-white"} px-3 py-1 cursor-pointer rounded-sm`}>7</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("8") ? prev.filter(item => item !== "8" ) : [...prev, "8"])}>
            <p className={`${sizes.includes("8") ? "bg-blue-500 text-white" : "bg-neutral-500 text-white"} px-3 py-1 cursor-pointer rounded-sm`}>8</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("9") ? prev.filter(item => item !== "9" ) : [...prev, "9"])}>
            <p className={`${sizes.includes("9") ? "bg-blue-500 text-white" : "bg-neutral-500 text-white"} px-3 py-1 cursor-pointer rounded-sm`}>9</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("10") ? prev.filter(item => item !== "10" ) : [...prev, "10"])}>
            <p className={`${sizes.includes("10") ? "bg-blue-500 text-white" : "bg-neutral-500 text-white"} px-3 py-1 cursor-pointer rounded-sm`}>10</p>
          </div>

        </div>
      </div> */}

      <div>
        <p className="mb-2 lato-regular">Product Sizes & Stocks</p>
        <div className="flex flex-col gap-3">
          {["4", "5", "6", "7", "8", "9", "10"].map((size) => {
            const existing = sizeStocks.find((s) => s.size === size);
            return (
              <div key={size} className="flex items-center lato-regular gap-4">
                <div
                  onClick={() => {
                    if (existing) {
                      setSizeStocks((prev) =>
                        prev.filter((s) => s.size !== size)
                      );
                    } else {
                      setSizeStocks((prev) => [...prev, { size, stock: 1 }]);
                    }
                  }}
                  className={`px-3 py-1 rounded-sm cursor-pointer lato-regular text-white ${
                    existing ? "bg-blue-500" : "bg-neutral-500"
                  }`}
                >
                  {size}
                </div>
                {existing && (
                  <input
                    type="number"
                    min={1}
                    value={existing.stock}
                    onChange={(e) => {
                      const newStock = Number(e.target.value);
                      setSizeStocks((prev) =>
                        prev.map((s) =>
                          s.size === size ? { ...s, stock: newStock } : s
                        )
                      );
                    }}
                    placeholder="Stock"
                    className="w-20 px-2 py-1 rounded-sm border lato-regular"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          name=""
          id="bestseller"
        />
        <label className="cursor-pointer lato-regular" htmlFor="bestseller">
          Add To Bestseller
        </label>
      </div>

      <button
        type="submit"
        className="w-32 py-2 rounded-sm mt-3 lato-regular bg-blue-500 text-white cursor-pointer hover:bg-blue-600 transition-colors duration-300"
      >
        ADD ITEM
      </button>
    </form>
  );
};

export default Edit;
