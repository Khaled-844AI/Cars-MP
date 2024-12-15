'use client'
import { React,useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Separator } from '@radix-ui/react-separator'
import { CiSearch } from "react-icons/ci";
import data from '@/data/data';
import Link from 'next/link';

  

function Search() {
    const [selectedCategory , setSelectedCategory] = useState([])
    const [selectedCondition , setSelectedCondition] = useState([])
    const [selectedCarName, setSelectedCarName] = useState([])


    const HandleOnSelectCategory = (category)=>{
        setSelectedCategory(category)
    }
    const HandleOnSelectCondition = (condition)=>{
        setSelectedCondition(condition.toLowerCase())
    }
    const HandleOnSelectCarName = (name)=>{
        setSelectedCarName(name)
    }

  return (

    <div className='p-1 md:p-4 bg-white rounded-md md:rounded-full flex-col md:flex md:flex-row
     gap-10 px-5 items-center w-[60%]'>
        <Select onValueChange={(value) =>HandleOnSelectCondition(value)}>
            <SelectTrigger className="outline-none md:border-none w-full shadow-none">
                <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent>
                {data.Condition.map((maker , index)=>(
                    <SelectItem value={maker.name} key={index}>{maker.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>

        <Separator orientation='vertical'/>

        <Select onValueChange={(value) =>HandleOnSelectCarName(value)}>
            <SelectTrigger className=" outline-none md:border-none w-full shadow-none">
                <SelectValue placeholder="Cars"/>
            </SelectTrigger>
            <SelectContent>
                {data.Cars.map((maker, index)=>(
                   <SelectItem value={maker.name} key={index}>{maker.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>

        <Separator orientation='vertical'/>

        <Select onValueChange={(value) =>HandleOnSelectCategory(value)}>
            <SelectTrigger className=" outline-none md:border-none w-full shadow-none">
                <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
            {data.Category.map((maker, index)=>(
                   <SelectItem value={maker.type} key={index}>{maker.type}</SelectItem>
                ))}
            </SelectContent>
        </Select>
        <div>
            <Link href={'/search?mode=search&name='+ selectedCarName+'&category='+selectedCategory+'&condition='+selectedCondition}>
                <CiSearch className='text-4xl bg-[#eae7e6] rounded-full p-1 hover:scale-105 transition-all
                cursor-pointer'/>
            </Link>
        </div>
    </div>
    


    
  )
}

export default Search