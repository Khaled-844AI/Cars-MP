
const FormatResponse = (response)=>{

    const result = []
    const Final = []

    response.forEach((item)=>{

        const CarId = item?.id
        if(!result[CarId]){

            result[CarId]={
                car:item,
                images:[]
            }

        }

        if(item.CarImages){
            result[CarId].images.push(item.CarImages)
        }
    })

    result.forEach((item)=>{
        Final.push({
            ...item.car,
            images:item.images
        })
    })

    return Final

}

export default FormatResponse