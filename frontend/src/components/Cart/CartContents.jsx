import React from 'react'
import Sunflower from "/productImg/Sunflower.jpeg";
import CherryClip from "/productImg/CherryClip.jpeg";
import { Delete, Trash } from 'lucide-react';

const CartContents = () => {
    const cartProducts = [
        {
            productId: 1,
            name: "Crochet Flower",
            type: "Sunflower",
            color: "Yellow+Brown",
            quantity: 1,
            price: 80,
            image: Sunflower
        },
        {
            productId: 2,
            name: "Crochet HairClip",
            type: "CherryClip",
            color: "Red+Green",
            quantity: 1,
            price: 50,
            image: CherryClip
        }
    ]
    return (
        <div>
            {
                cartProducts.map((product, index) => {
                    return (
                        <div
                            key={product.productId}
                            className="flex items-start justify-between py-4 border-b">

                            <div className="flex items-start">
                                <img 
                                src={product.image} 
                                alt={product.name} 
                                className='h-40 w-32 object-cover mr-4 rounded' />
                            
                            <div className="flex flex-col">
                                <h3 className="font-medium">{product.name}</h3>
                                <p className="text-sm text-gray-500">
                                    Type: {product.type} | Color: {product.color}
                                </p>
                                <div className="flex items-center mt-2">
                                    <button className='border rounded px-2 py-1 text-xl font-medium'>
                                       - 
                                    </button>
                                    <span className='mx-4'>{product.quantity}</span>
                                    <button className='border rounded px-2 py-1 text-xl font-medium'>
                                        +      
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p>₹ {product.price.toLocaleString()}</p>
                            <button>
                                <Trash className='h-6 w-6 mt-2 text-red-600'/>
                            </button>
                        </div>
                    </div>
                    )
                })
            }
        </div>
    )
}

export default CartContents