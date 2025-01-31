import {h, Component, Fragment} from 'preact';

import Close from './icons/Close';

import cart from '../utils/cart';
import wishlist from '../utils/wishlist';

export default class Panel extends Component {
    /**
     * Remove an item from the wishlist
     *
     * @param id
     * @return {Promise<void>}
     */
    async removeWishlist(id) {
        await wishlist.remove(id);
        this.props.updateWishlist();
    }

    /**
     * Update an item from the cart
     *
     * @param product
     * @param type
     * @return {Promise<void>}
     */
    async updateCart(product, type) {
        if(type === "add") {
            await cart.update(product.id, {
                ...product.cart,
                quantity: product.cart.quantity + 1
            });
            this.props.updateCart();
        }

        if(type === "remove") {
            await cart.update(product.id, {
                ...product.cart,
                quantity: product.cart.quantity - 1
            });
            this.props.updateCart();
        }
    }

    /**
     * Remove an item from the cart
     *
     * @param id
     * @return {Promise<void>}
     */
    async removeCart(id) {
        await cart.remove(id);
        this.props.updateCart();
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {type, products, close} = this.props;
        let total = 0;

        if(type === "cart") {
            for (let item = 0; item < products.length; item++) {
                const product = products[item];
                total += (product.price.value * product.cart.quantity);
            }
        }

        return (
            <>
                <div className="fixed top-0 left-0 z-20 w-full h-full bg-black bg-opacity-50" onClick={close}/>
                <div className="z-20 w-[320px] flex flex-col bg-gray-900 h-full overflow-auto fixed right-0 top-0 text-gray-100">
                    <div className="sticky top-0 left-0 right-0 z-20 px-2 pt-2 bg-gray-900">
                        <button className="flex items-center justify-center w-12 h-12 text-white cursor-pointer rounded-xl hover:bg-white hover:bg-opacity-5" onClick={close}>
                            <Close/>
                        </button>
                    </div>
                    <div>
                        <div>
                            <h1 className="px-4 mt-4 text-2xl font-black">My {type}</h1>
                            <div className="grid py-4 gap-y-8">
                                {products.map((product) => (
                                    <div key={product.uid} className="grid grid-flow-row gap-y-2">
                                        <div className="grid grid-cols-[64px,auto,64px] px-4 gap-x-2">
                                            <a href={`/product/${product.slug}`} onClick={close}>
                                                <img src={product.image} className="object-cover w-16 h-16 bg-gray-900"/>
                                            </a>
                                            <h1 className="py-2 text-sm font-semibold">
                                                <a href={`/product/${product.slug}`} onClick={close}>
                                                    {product.name}<br/>
                                                    <span className="italic font-normal">
                                                        {type === "cart" && product.cart.item.map((item) => {
                                                            return `${item.option}: ${item.label}`;
                                                        }).join(', ')}
                                                    </span>
                                                </a>
                                            </h1>
                                            <h2 className="inline-block py-2 text-xs text-right">
                                                <div>€{product.price.value.toFixed(2)}</div>
                                                {type === "cart" &&
                                                    <div className="font-semibold">x{product.cart.quantity}</div>
                                                }
                                            </h2>
                                        </div>
                                        <div className="grid grid-cols-[auto,48px,48px] px-4 gap-x-2">
                                            {type === "wishlist" &&
                                                <button className="inline-block py-2 text-xs font-semibold text-center uppercase bg-gray-800 rounded-md hover:bg-gray-700" onClick={() => this.removeWishlist(product.id)}>
                                                    Remove
                                                </button>
                                            }
                                            {type === "cart" &&
                                                <>
                                                    <button className="inline-block py-2 text-xs font-semibold text-center uppercase bg-gray-800 rounded-md hover:bg-gray-700" onClick={() => this.removeCart(product.id)}>
                                                        Remove
                                                    </button>
                                                    <button className="inline-block py-2 text-xs font-semibold text-center uppercase bg-gray-800 rounded-md hover:bg-gray-700" onClick={() => this.updateCart(product, "add")}>
                                                        +
                                                    </button>
                                                    <button className="inline-block py-2 text-xs font-semibold text-center uppercase bg-gray-800 rounded-md hover:bg-gray-700 disabled:bg-gray-900 disabled:text-white disabled:cursor-not-allowed disabled:hover:bg-gray-900" onClick={() => this.updateCart(product, "remove")} disabled={product.cart.quantity === 1}>
                                                        -
                                                    </button>
                                                </>
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {type === "cart" &&
                            <div className="sticky bottom-0 left-0 right-0 w-full px-6 py-6 text-sm bg-gray-900 border-t border-gray-700 sm:px-6">
                                <ul className="pb-2">
                                    <li className="flex justify-between py-1">
                                        <span>Subtotal</span>
                                        <span>€{total.toFixed(2)}</span>
                                    </li>
                                    <li className="flex justify-between py-1">
                                        <span>Taxes</span>
                                        <span>Calculated at checkout</span>
                                    </li>
                                    <li className="flex justify-between py-1">
                                        <span>Shipping</span>
                                        <span className="font-bold tracking-wide">FREE</span>
                                    </li>
                                </ul>
                                <div className="flex justify-between py-3 mb-2 font-bold border-t border-gray-700">
                                    <span>Total</span>
                                    <span>€{total.toFixed(2)}</span>
                                </div>
                                <div>
                                    <button className="inline-block py-2 text-xs font-semibold text-center uppercase bg-gray-800 rounded-md hover:bg-gray-700 cursor-not-allowed w-full">
                                        Checkout
                                    </button>
                                </div>
                                <div/>
                            </div>
                        }
                    </div>
                </div>
            </>
        );
    }
}
