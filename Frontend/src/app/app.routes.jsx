import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import MyListings from "../features/products/pages/MyListings";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import ProductDetail from "../features/products/pages/ProductDetail";
import SellerProductDetails from "../features/products/pages/SellerProductDetails";
import Cart from "../features/cart/pages/Cart";
import AppLayout from "./AppLayout";
import OrderSuccess from "../features/cart/pages/OrderSuccess";
import Wishlist from "../features/products/pages/Wishlist";
import Profile from "../features/auth/pages/Profile";
import Orders from "../features/cart/pages/Orders";
import OrderDetail from "../features/cart/pages/OrderDetail";
import Addresses from "../features/auth/pages/Addresses";
import HelpSupport from "../features/auth/pages/HelpSupport";

import SellerOrders from "../features/products/pages/SellerOrders";
import SellerEarnings from "../features/products/pages/SellerEarnings";
import SellerProfile from "../features/auth/pages/SellerProfile";
import SellerSettings from "../features/auth/pages/SellerSettings";
import SellerHelpSupport from "../features/auth/pages/SellerHelpSupport";

export const routes = createBrowserRouter([

    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/product/:productId",
                element: <ProductDetail />
            },
            {
                path: "/profile",
                element: <Protected> <Profile /></Protected>
            },
            {
                path: "/orders",
                element: <Protected> <Orders /></Protected>
            },
            {
                path: "/orders/:orderId",
                element: <Protected> <OrderDetail /></Protected>
            },
            {
                path: "/wishlist",
                element: <Protected> <Wishlist /></Protected>
            },
            {
                path: "/addresses",
                element: <Protected> <Addresses /></Protected>
            },
            {
                path: "/help",
                element: <Protected> <HelpSupport /></Protected>
            },
            {
                path: "/cart",
                element: <Protected> <Cart /></Protected>
            },
            {
                path: "/order-success",
                element: <OrderSuccess />
            },
            {
                path: "/seller",
                children: [
                    {
                        path: "/seller/create-product",

                        element: <Protected role="seller" >
                            <CreateProduct />
                        </Protected>
                    },
                    {
                        path: "/seller/dashboard",
                        element: <Protected role="seller" >
                            <Dashboard />
                        </Protected>
                    },
                    {
                        path: "/seller/listings",
                        element: <Protected role="seller" >
                            <MyListings />
                        </Protected>
                    },
                    {
                        path: "/seller/product/:productId",
                        element: <Protected role="seller" >
                            <SellerProductDetails />
                        </Protected>
                    },
                    {
                        path: "/seller/orders",
                        element: <Protected role="seller" >
                            <SellerOrders />
                        </Protected>
                    },
                    {
                        path: "/seller/earnings",
                        element: <Protected role="seller" >
                            <SellerEarnings />
                        </Protected>
                    },
                    {
                        path: "/seller/profile",
                        element: <Protected role="seller" >
                            <SellerProfile />
                        </Protected>
                    },
                    {
                        path: "/seller/settings",
                        element: <Protected role="seller" >
                            <SellerSettings />
                        </Protected>
                    },
                    {
                        path: "/seller/help",
                        element: <Protected role="seller" >
                            <SellerHelpSupport />
                        </Protected>
                    }
                ]
            }
        ]
    }
])