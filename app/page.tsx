"use client";

import Image from "next/image";
import { BiSearch } from "react-icons/bi";
import background from "../public/recipe_background.jpg";
import logo from "../public/logo.jpg";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { BeatLoader } from "react-spinners";

type Recipe = {
  title: string;
  ingredients: string[];
  servings: number;
  instructions: string;
};

export default function Home( className: string ) {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Recipe[]>([]);
  const [available, setAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const splitText = (text: string) => {
    return text.split('|');
  }

  const getData = async () => {
    if (query.trim() != '') {
      setIsLoading(true);
      const response = await axios({
        method: 'get',
        url: 'https://api.api-ninjas.com/v1/recipe?query=' + query,
        headers: {
          'X-Api-Key': 'DVkgK/7hn0nsPrXtUxBPHg==ucPLFc5xzwmf77li'
        },
      })
      .then(function (response) {
        console.log(response.data);
        setAvailable(true);
        setIsLoading(false);
        const formattedData = response.data.map((item: { title: string, ingredients: string, servings: string, instructions: string }) => {
          return {
            title: item.title,
            ingredients: splitText(item.ingredients),
            servings: item.servings,
            instructions: item.instructions
          };
        });
        setData(formattedData);
      })
      .catch(function (error) {
        toast.error('Error fetching data');
        console.log(error);
      })
    }
  }

  return (
    <main className={cn("flex flex-col justify-between items-center h-screen", className, {"h-full": isLoading || data.length === 0})}>
      <div className="relative w-full">
        <Image src={background} alt="Background" className="absolute -z-10 h-screen opacity-75" width={1920} height={1080} />
      </div>
      <Image className="pt-4 rounded-lg opacity-80" src={logo} alt="Logo" width={360} height={80} />
        <div className="md:w-1/2 xs:w-full w-96 h-full overflow-y-auto m-4 p-2 bg-slate-50 rounded-lg opacity-95">
          <div className="items-center justify-between p-4 bg-lime-200 rounded-lg">
            <div className="flex gap-x-3">
              <input
                className="w-full h-12 rounded-md px-2"
                placeholder="Search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                if (e.key === 'Enter') {
                  getData();
                }}}
              />
              <button className="bg-gray-100 hover:bg-gray-200 text-black font-bold py-2 px-4 rounded" onClick={getData}>
                <BiSearch className="text-xl" />
              </button>
            </div>
          </div>
          {isLoading &&
            <div className="flex justify-center items-center m-2">
              <BeatLoader color="#36d7b7" />
            </div>
          }
          {available && !isLoading && data.length === 0 && <p className="text-center m-1 text-2xl text-slate-600">No results found</p>}
          {!isLoading && data.length > 0 &&
          <div className="border bg-lime-200 rounded-lg mt-2 p-2 h-auto gap-y-2">
              <ScrollArea>
              {data.map((item, index) => (
                  <div className="border m-1 p-2" key={index}>
                    <div className="p-2 text-2xl font-semibold bg-slate-100">
                      {item.title}
                    </div>
                    <div className="p-2 bg-white">
                      <h2 className="text-xl font-semibold">Ingredients:</h2>
                      <ul>
                        {item.ingredients.map((ingredient, i) => (
                          <li key={i}>- {ingredient}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-2 bg-slate-100">
                      <h2 className="text-lg font-semibold inline">Servings: </h2>{item.servings}
                    </div>
                    <div className="p-2 bg-white">
                    <h2 className="text-lg font-semibold inline">Instructions: </h2>{item.instructions}
                    </div>
                  </div>
                ))}
              </ScrollArea>
          </div>}
        </div>
    </main>
  );
}
