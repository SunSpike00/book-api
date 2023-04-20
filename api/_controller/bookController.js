const db = require("../../plugins/mysql");
const TABLE = require("../../util/TABLE");
const STATUS = require("../../util/STATUS");
const { resData, currentTime, isEmpty } = require("../../util/lib");
const moment = require("../../util/moment");


//전체 row 갯수
const getTotal = async () => {
    // const getTotal = async function () {
    try {
        const query = `SELECT COUNT(*) AS cnt FROM ${TABLE.TODO}`;
        const [[{ cnt }]] = await db.execute(query);
        return cnt;
    } catch (e) {
        console.log(e.message);
        return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
};

/*
// row 존재유무
const getSelectOne = async (id) => {
    // const getTotal = async function () {
    try {
        const query = `SELECT COUNT(*) AS cnt FROM ${TABLE.TODO} WHERE id=?`;
        const values = [id];
        const [[{ cnt }]] = await db.execute(query, values);
        return cnt;
    } catch (e) {
        console.log(e.message);
        return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
};
*/

const getList = async (req) => {
    try {
      // 마지막 id, len 갯수
      const lastId = parseInt(req.query.lastId) || 0;
      const len = parseInt(req.query.len) || 10;
  
      let where = "";
      if (lastId) {
        // 0은 false
        where = `WHERE id < ${lastId}`;
      }
      const query = `SELECT * FROM ${TABLE.TODO} ${where} order by id desc limit 0, ${len}`;
      const [rows] = await db.execute(query);
      return rows;
    } catch (e) {
      console.log(e.message);
      return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
  };

// genre_name이 존재하는 값인지 확인 절차.
const getGenreKey = async (genre_name) => {
    try{
        const genre_query = `select genre_id from ${TABLE.GENRE} where (genre_name = ?)`;
        const value = [genre_name];
        const [genre_name_rows] = await db.execute(genre_query, value);
        genre_key = Object.values(genre_name_rows)[0]['genre_id'];    // 장르 선택은 1개 뿐이라....
        console.log(genre_key);
        return genre_key;
    } catch (e) {
        console.log(e.message);
        return resData(STATUS.E300.result, STATUS.E103.resultDesc, moment().format('LT'));
    }
};

// shop_name이 존재하는 값인지 확인 절차.
const getShopKey = async (shop_name) => {
    
    try{
        const shop_query = `select shop_id from ${TABLE.SHOP} where (shop_name = ?)`;
        const value = [shop_name];
        const [shop_name_rows] = await db.execute(shop_query, value);
        shop_key = Object.values(shop_name_rows)[0]['shop_id'];       // 가게 선택은 1개 뿐이라....
        console.log(shop_key);
        return shop_key;
    } catch(e) {
        console.log(e.message);
        return resData(STATUS.E300.result, STATUS.E104.resultDesc, moment().format('LT'));
    }
};





const bookController = {


    create: async (req) => {

        // 파라미터 체크
        const { book_title, genre_name, shop_name, book_publish } = req.body; // postman 작성 값 받기
        if (isEmpty(book_title) || isEmpty(genre_name) || isEmpty(shop_name) || isEmpty(book_publish)) {
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));
        }

        // 키 값으로 변환
        const genre_key = await getGenreKey(genre_name);
        const shop_key = await getShopKey(shop_name);


        // insert 쿼리 시작.
        try {
            const query = `insert into book_list (book_title, genre_id, shop_id, book_publish) values (?, ?, ?, ?)`
            const values = [book_title, genre_key, shop_key, book_publish]
            const [rows] = await db.execute(query, values);
            if(rows.affectedRows == 1) {
                return resData(
                    STATUS.S200.result,
                    STATUS.S200.resultDesc,
                    moment().format('LT'),
                );
            }
        } catch (e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
        }

    },

    createDeatil: async (req) => {
        const { book_title, genre_name, book_stock, book_price, shop_name, book_author, book_publish } = req.body;
        if (isEmpty(book_title) || isEmpty(genre_name) || isEmpty(book_stock) || isEmpty(book_price)
        || isEmpty(shop_name) || isEmpty(book_author) || isEmpty(book_publish)) {
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));
        }


    },


    booklist: async (req) => {
        
        const totalCount = await getTotal();
        const list = await getList(req);


    },

}




module.exports = bookController;