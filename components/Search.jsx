'use client'
import { React, useState } from 'react'
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
    const [selectedCategory, setSelectedCategory] = useState([])
    const [selectedCondition, setSelectedCondition] = useState([])
    const [selectedCarName, setSelectedCarName] = useState([])

    const HandleOnSelectCategory = (category) => {
        setSelectedCategory(category)
    }
    const HandleOnSelectCondition = (condition) => {
        setSelectedCondition(condition.toLowerCase())
    }
    const HandleOnSelectCarName = (name) => {
        setSelectedCarName(name)
    }

    return (
        <div className='p-4 mt-20 rounded-full flex flex-row gap-4 items-center w-full max-w-3xl mx-auto bg-gradient-to-br from-cyan-500 via-cyan-400 to-cyan-300 shadow-lg relative'>
            {/* Condition Select */}
            <div className='flex-1'>
                <Select onValueChange={(value) => HandleOnSelectCondition(value)}>
                    <SelectTrigger className="outline-none border-none w-full shadow-none bg-transparent text-white placeholder:text-white">
                        <SelectValue placeholder="Condition" className='outline-none border-none' />
                    </SelectTrigger>
                    <SelectContent className="w-[var(--radix-select-trigger-width)] max-h-60 overflow-y-auto bg-white rounded-lg shadow-lg">
                        {data.Condition.map((maker, index) => (
                            <SelectItem value={maker.name} key={index} className="hover:bg-gray-100 cursor-pointer">
                                {maker.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Separator */}
            <Separator orientation='vertical' className='h-6 bg-white/50' />

            {/* Cars Select */}
            <div className='flex-1'>
                <Select onValueChange={(value) => HandleOnSelectCarName(value)}>
                    <SelectTrigger className="outline-none border-none w-full shadow-none bg-transparent text-white placeholder:text-white">
                        <SelectValue placeholder="Cars" />
                    </SelectTrigger>
                    <SelectContent className="w-[var(--radix-select-trigger-width)] max-h-60 overflow-y-auto bg-white rounded-lg shadow-lg">
                        {data.Cars.map((maker, index) => (
                            <SelectItem value={maker.name} key={index} className="hover:bg-gray-100 cursor-pointer">
                                {maker.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Separator */}
            <Separator orientation='vertical' className='h-6 bg-white/50' />

            {/* Category Select */}
            <div className='flex-1'>
                <Select onValueChange={(value) => HandleOnSelectCategory(value)}>
                    <SelectTrigger className="outline-none border-none w-full shadow-none bg-transparent text-white placeholder:text-white">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="w-[var(--radix-select-trigger-width)] max-h-60 overflow-y-auto bg-white rounded-lg shadow-lg">
                        {data.Category.map((maker, index) => (
                            <SelectItem value={maker.type} key={index} className="hover:bg-gray-100 cursor-pointer">
                                {maker.type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Search Icon */}
            <div className='flex-none'>
                <Link href={'/search?mode=search&name=' + selectedCarName + '&category=' + selectedCategory + '&condition=' + selectedCondition}>
                    <CiSearch className='text-4xl text-white bg-transparent rounded-full p-1 hover:scale-105 transition-all cursor-pointer' />
                </Link>
            </div>
        </div>
    )
}

export default Search