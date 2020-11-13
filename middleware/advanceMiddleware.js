
const advanceMiddleware=(model,populate)=>async(req,res,next)=>{
    let query={...req.query}
    //remove Select 
    const remove=['select','sort','limit','page']

    remove.forEach(d=> delete query[d])
    //Convert to String

    query=JSON.stringify(query)
    
    
    //Add $ to lt,gt,lte,gte
    query=JSON.parse(query.replace(/\b(lt|gt|lte|gte|in)\b/g,match=>`$${match}`))
    
    if(populate){
        query=model.find(query).populate(populate)
    }

    if(req.query.select){
        const fields=req.query.select.split(',').join(' ')
        query=query.select(fields)
    }

    if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ')
        query=query.sort(sortBy)
    }
    else{
        query=query.sort("-createdAt")
    }

    const page=parseInt(req.query.page,10) || 1;
    const limit=parseInt(req.query.limit,10) || 10;
    const skip=(page - 1) * limit

    query=query.skip(skip).limit(limit)

    //execute Query
    const data=await query

    res.advanceResult={
        success:true,
        count:data.count,
        data
    }

    next()
}

export default advanceMiddleware