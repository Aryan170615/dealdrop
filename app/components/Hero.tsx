"use client"
import { useSession } from "next-auth/react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import FirecrawlApp from '@mendable/firecrawl-js';
import { z } from "zod";
import { Bell, Rabbit, Shield, Trash2 } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
const app = new FirecrawlApp({
  apiKey: "fc-d75c420d2a104989ac97bb59c61469bf"
});

interface Product {
  productName: string
  currentPrice: string
  currencyCode: string
  productImageUrl: string
  url: string
}

const Hero = () => {
   const inputRef = useRef(null)
   const session = useSession();
   const [productList, setProductList] = useState<Product[] | []>([])
   const [isLoading, setIsLoading] = useState(false)

   async function doSomething(){
      if(!inputRef.current.value || inputRef.current.value.trim() === "") {
        toast.warning("Please fill in this field", {
            position: 'top-center',
            style: {
            '--normal-bg':
              'color-mix(in oklab, light-dark(var(--color-amber-600), var(--color-amber-400)) 10%, var(--background))',
            '--normal-text': 'light-dark(var(--color-amber-600), var(--color-amber-400))',
            '--normal-border': 'light-dark(var(--color-amber-600), var(--color-amber-400))'
          } as React.CSSProperties
        })
      }
      else if(session.status === "unauthenticated") {
        toast.warning("Please sign in first", {
            position: 'top-center',
            style: {
            '--normal-bg':
              'color-mix(in oklab, light-dark(var(--color-amber-600), var(--color-amber-400)) 10%, var(--background))',
            '--normal-text': 'light-dark(var(--color-amber-600), var(--color-amber-400))',
            '--normal-border': 'light-dark(var(--color-amber-600), var(--color-amber-400))'
          } as React.CSSProperties
        })
      }
      else if(session.status === "authenticated") {
        setIsLoading(true)
       const result : { json : Product} = await app.scrape(inputRef.current?.value, {
            formats: [{
              type: "json",
              schema: {
                type: "object",
                required: [],
                properties: {
                    productName: {
                        type: "string"
                      },
                    currentPrice: {
                        type: "string"
                    },
                    currencyCode: {
                        type: "string"
                    },
                    productImageUrl: {
                        type: "string"
                    },
                    url: {
                        type: "string"
                    }
                }
              }
            }],
          });
          console.log(result.json)
          setProductList([...productList, result.json])
          setIsLoading(false)
          toast.success("Product added successfully", {
            position: 'top-center',
            style: {
            '--normal-bg':
              'color-mix(in oklab, light-dark(var(--color-amber-600), var(--color-amber-400)) 10%, var(--background))',
            '--normal-text': 'light-dark(var(--color-amber-600), var(--color-amber-400))',
            '--normal-border': 'light-dark(var(--color-amber-600), var(--color-amber-400))'
          } as React.CSSProperties
        })
          
          return
      }
   }
   function removeProduct(productName:string){
      if(!productList.length) return
      setProductList(productList.filter((x)=> x.productName!== productName))
      toast.success("Product removed successfully", {
            position: 'top-center',
            style: {
            '--normal-bg':
              'color-mix(in oklab, light-dark(var(--color-amber-600), var(--color-amber-400)) 10%, var(--background))',
            '--normal-text': 'light-dark(var(--color-amber-600), var(--color-amber-400))',
            '--normal-border': 'light-dark(var(--color-amber-600), var(--color-amber-400))'
          } as React.CSSProperties
        })
   }

  return (
    <div className="flex flex-col items-center h-full pt-10 bg-linear-to-br from-orange-50 via-white to-orange-50">
      <div className="font-extrabold text-5xl">
        Never Miss a Price Drop
      </div>
      <div className="text-gray-700 text-2xl pt-6">
        Track prices from any e-commerce site. Get instant alerts when prices drop.
        <br />
        <span className="flex items-center justify-center">Save money effortlessly.</span>       
      </div>
      <div className="pt-8 flex gap-4 justify-center items-center">
        <input ref={inputRef} type="text" className="border border-gray-200 w-120 h-12 outline-0 rounded-xl px-2" placeholder="Paste Product Url (Amazon, Flipkart, etc" />
       {!isLoading && <button className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-white px-4 h-10 py-1 rounded-xl"
        onClick={doSomething}
        >Track Price</button>}
       {isLoading && <button className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-white px-4 h-10 py-1 rounded-xl"
        onClick={doSomething}
        >
          <div className="flex gap-1 justify-center items-center"><Spinner /> Adding...</div></button>}
      </div>
      <div>
        <div className="flex pt-16 gap-6">
        <div className="border w-80 rounded-xl border-gray-200 p-8">
            <div className="text-xl justify-center flex flex-col items-center gap-2 mb-4 font-bold">
                <Rabbit />
                Lightning Fast
            </div>
            <div>
                Deal Drop extracts prices in seconds, handling JavaScript and dynamic content.
            </div>
        </div>
        <div className="border w-80 rounded-xl  border-gray-200 p-8">
            <div className="text-xl font-bold justify-center flex flex-col items-center gap-2 mb-4">
               <Shield />
                Always Reliable
            </div>
            <div>
                Works across all major e-commerce sites with built-in anti-bot protection.
            </div>
        </div>
        <div className="border w-80 rounded-xl  border-gray-200 p-8">
            <div className="text-xl font-bold justify-center flex flex-col items-center gap-2 mb-4">
                <Bell />
                Smart Alerts
            </div>
            <div>
                Get notified instantly when prices drop below your target.
            </div>
        </div>
      </div>
      </div>
      {session.status === "unauthenticated" && <div className="pt-20">
        Made With ❤️ by Aryan Bhalla
      </div>}
      { session.status === "authenticated" && productList.length ===0 &&
        <div className="h-80 w-160 bg-white rounded-2xl border flex justify-center flex-col items-center gap-4 border-gray-200 p-30 mt-10">
            <p className="text-xl font-bold">No products yet</p>
            <p>Add your first product above to start tracking prices!</p>
        </div>
      }

     {session.status === "authenticated" && productList.length !== 0 && (
      <>
        <p className="text-xl font-bold mt-15">Your Tracked Products</p>
       <div className="flex gap-4 justify-between px-4 flex-wrap">
       
     {productList.map((product, idx) => (
      <div
        key={idx}
        className="w-100 mt-4 bg-white border rounded-xl p-8 border-gray-200"
      >
        <div className="flex gap-2">
          <div>
            <img
              src={product.productImageUrl}
              alt={product.productName}
              className="object-contain"
            />
          </div>
          <div>
            <p>{product.productName}</p>
            <p>{product.currentPrice}</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center pt-6">
          <a href={product.url} target="_blank" rel="noopener noreferrer">
            <button className="cursor-pointer">View Product</button>
          </a>

          <button
            className="cursor-pointer"
            onClick={() => removeProduct(product.productName)}
          >
            <Trash2 />
          </button>
        </div>
      </div>
    ))}
  </div>
  </>
)}

    </div>
  )
}

export default Hero
