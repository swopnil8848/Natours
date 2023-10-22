class APIFeatures{
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filter(){
        // filtering
       const queryObj = {...this.queryString}
       
       const exlcudedFields = ['page','sort','limit','fields']
       exlcudedFields.forEach(el=>delete queryObj[el])
       
       // advanced filtering
       let queryStr = JSON.stringify(queryObj);
       
       queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
       
    //    console.log(JSON.parse(queryStr));
   
       this.query =  this.query.find(JSON.parse(queryStr))
    //    let query = Tour.find(JSON.parse(queryStr))
    return this;
    }

    sort(){
        // 2) SORTING
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy); 
        }else{
            this.query = this.query.sort('price')
            // query = query.sort('-price') // sorts the query accorting to decending order
        }

        return this;
    }

    limitFields(){
        //3) field limiting
        if(this.queryString.fields){
            const fields = this.query.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }else{
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate(){
        const page = this.queryString.page * 1  || 1
        const limit = this.queryString.limit*1 || 100;
        const skip = (page-1)*limit

        this.query = this.query.skip(skip).limit(limit);

        return this;

    }
}

module.exports = APIFeatures;