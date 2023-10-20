class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            {
              title: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              description: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyword });

    return this;
  }
  filter() {
    let queryCopy = { ...this.queryStr };

    const removeFields = ["keyword", "page", "resultPerPage", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    this.query = this.query.find(queryCopy);
    return this;
  }
  pagination(resultsPerPage = 5) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultsPerPage * (currentPage - 1);
    this.query = this.query.limit(resultsPerPage).skip(skip);
    return this;
  }
}

export { ApiFeatures };
