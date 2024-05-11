class ApiFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
  
    search() {
      const keyword = this.queryStr.keyword
        ? {
            name: {
              $regex: this.queryStr.keyword,
              $options: "i",
            },
          }
        : {};
  
      this.query = this.query.find({ ...keyword });
      return this;
    }
  
    filter() {
      const queryCopy = { ...this.queryStr };
  
      let queryStr = JSON.stringify(queryCopy);
  
      this.query = this.query.find(JSON.parse(queryStr));
  
      return this;
    }

  }
  
  module.exports = ApiFeatures;