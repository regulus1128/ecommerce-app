import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';


export const ShopContext = createContext();

export const ShopContextProvider = (props) => {

    const currency = '₹';
    const deliveryFee = 20;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {

        if(!size){
            toast.error("Please select a size!");
            return;
        }

        let cardData = structuredClone(cartItems);

        if(cardData[itemId]){
            if(cardData[itemId][size]){
                cardData[itemId][size] += 1;
                toast.success('Item added to cart successfully!');
            }
            else{
                cardData[itemId][size] = 1;
                toast.success('Item added to cart successfully!');
            }
        }
        else{
            cardData[itemId] = {};
            cardData[itemId][size] = 1; 
            toast.success('Item added to cart successfully!');
        }
        setCartItems(cardData);

        if(token){
            try {
                const response = await axios.post(backendUrl + '/api/cart/add-to-cart', {
                    productId: itemId,
                    size: size
                }, { withCredentials: true });
                // console.log(response);
            } catch (error) {
                console.log(error);
                toast.error(error.response.data.message);
            }
        }

    }

    const getCartCount = () => {

        let totalCount = 0;
        for(const items in cartItems){
            for(const item in cartItems[items]){
                try {
                    if(cartItems[items][item] > 0){
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if(token){
            try {
                const response = await axios.post(backendUrl + '/api/cart/update-cart', {
                    userId: token,
                    productId: itemId,
                    size: size,
                    quantity: quantity
                }, { withCredentials: true });

                // console.log(response);
            } catch (error) {
                console.log(error);
                // toast.error(error.response.data.message);
            }
        }
    }

    const getCartAmount = () => {

        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product) => product._id === items);
            for(const item in cartItems[items]){
                try {
                    if(cartItems[items][item] > 0){
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list-product-public', { 
                withCredentials: true
            });
            // console.log('product response: ', response);
            if(response.data.success){
                setProducts(response.data.products);
            } else{
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const getUserCart = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get-cart', {}, { withCredentials: true });
            if(response.data.success){
                setCartItems(response.data.cartData);
            } else{
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(backendUrl + "/api/user/check-auth", { withCredentials: true });
                // console.log('Response in check auth', response);
                if (response.data.authenticated) {
                    setToken(response.data.userId);
                    getUserCart(response.data.userId);
                } else {
                    setToken("");
                }
            } catch (error) {
                console.log(error);
                setToken("");
            }
        };
    
        checkAuth();
    }, [backendUrl]);

    useEffect(() => {
        const savedToken = Cookies.get('userToken');
        if(savedToken){
            setToken(savedToken);
        }
        // console.log('userToken: ', savedToken);
    }, [])

    
    const value = {
        products,
        currency,
        deliveryFee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        token,
        setToken,
        getUserCart
    }



    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
