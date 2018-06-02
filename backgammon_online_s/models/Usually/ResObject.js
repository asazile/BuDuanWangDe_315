function ResObject(status, message = "", data = {}) {
    // 0 ----> ERROR
    // 1 ----> SUCCESS
    this.status = status;

    // if ERROR ----> ERROR MESSAGE
    // if SUCCESS ----> MESSAGE = ""
    this.message = message;

    // return data,
    // if not ,data = {}
    this.data = data;
}

module.exports = ResObject;