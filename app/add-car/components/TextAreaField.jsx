import React from 'react'
import { Textarea } from './../../../components/ui/textarea'


function TextAreaField({item ,handleFormChange, carInfo}) {
  return (
    <div>
        <Textarea onChange={(e)=>handleFormChange(item.name , e.target.value)}
         defaultValue={carInfo?.[item.name]}/>
    </div>
  )
}

export default TextAreaField