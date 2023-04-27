const db = require("../../plugins/mysql");
const TABLE = require("../../util/TABLE");
const STATUS = require("../../util/STATUS");
const { resData, isEmpty } = require("../../util/lib");
const moment = require("../../util/moment");


// row 존재유무
const getSelectOne = async (table, id, value) => {
    try {
      const query = `SELECT COUNT(*) AS cnt FROM ${table} WHERE ${value} = ?`;
      const values = [id];
      const [[{ cnt }]] = await db.execute(query, values);
      return cnt;
    } catch (e) {
      console.log(e.message);
      return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
};

//전체 row 갯수
const getTotal = async (tableName) => {
    
    const table = tableName;

    try {
        const query = `SELECT COUNT(*) AS cnt FROM ${table}`;
        const [[{ cnt }]] = await db.execute(query);
        return cnt;
    } catch (e) {
        console.log(e.message);
        return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
};

//전체 row 출력
const getList = async (req, tableName, id) => {

    const table = tableName;
    try {
      // 마지막 id, len 갯수
      const lastId = parseInt(req.query.lastId) || 0;
      const len = parseInt(req.query.len) || 10;
      let where = "";
      if (lastId) {
        // 0은 false
        where = `WHERE book_id < ${lastId}`;
      }
      const query = `SELECT * FROM ${table} ${where} order by ${id} asc limit 0, ${len}`;
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

    // 도서 일반 등록
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
            const query = `insert into ${TABLE.BOOKLIST} (book_title, genre_id, shop_id, book_publish) values (?, ?, ?, ?)`
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

    // 도서 상세 등록
    createDetail: async (req) => {

        // 파라미터 체크
        const { book_title, genre_name, book_stock, book_price, shop_name, book_author, book_publish } = req.body;
        if (isEmpty(book_title) || isEmpty(genre_name) || isEmpty(book_stock) || isEmpty(book_price) ||
        isEmpty(shop_name) || isEmpty(book_author) || isEmpty(book_publish)) {
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));
        }

        // 키 값으로 변환
        const genre_key = await getGenreKey(genre_name);
        const shop_key = await getShopKey(shop_name);

        // insert 쿼리 시작.
        try {
            const query = `insert into ${TABLE.BOOKLIST} (book_title, genre_id, book_stock, book_price, shop_id, book_author, book_publish)
            values (?, ?, ?, ?, ?, ?, ?)`
            const values = [book_title, genre_key, book_stock, book_price, shop_key, book_author, book_publish]
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

    // 장르 등록용
    createGenre: async (req) => {
        const {genre_id, genre_name } = req.body;
        if(isEmpty(genre_id) || isEmpty(genre_name)) {
            // 장르 아이디 값 또는 이름 없음
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));
        }

        try {
            const query = `insert into ${TABLE.GENRE} (genre_id, genre_name) values (?, ?)`
            const values = [genre_id, genre_name];
            const [rows] = await db.execute(query, values);
            if(rows.affectedRows == 1) {
                STATUS.S200.result,
                STATUS.S200.resultDesc,
                moment().format('LT')
            } 
        } catch (e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
        }

    },

    // 매장 등록용
    createShop: async (req) => {
        const {shop_id, shop_name } = req.body;
        if(isEmpty(shop_id) || isEmpty(shop_name)) {
            // 장르 아이디 값 또는 이름 없음
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));
        }

        try {
            const query = `insert into ${TABLE.SHOP} (shop_id, shop_name) values (?, ?)`
            const values = [shop_id, shop_name];
            const [rows] = await db.execute(query, values);
            if(rows.affectedRows == 1) {
                STATUS.S200.result,
                STATUS.S200.resultDesc,
                moment().format('LT')
            } 
        } catch (e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
        }

    },

    // 도서 번호 범위 지정해서 전부 출력
    bookList: async (req) => {
        const totalCount = await getTotal(TABLE.BOOKLIST);
        const list = await getList(req, TABLE.BOOKLIST, 'book_id');

        if (totalCount > 0 && list.length) {
            return resData(STATUS.S200.result,
                STATUS.S200.resultDesc,
                moment().format('LT'),
                {totalCount, list});
        } else {
            return resData(STATUS.S201.result, STATUS.S201.resultDesc, moment().format('LT'));
        }
    },

    // 장르 번호 범위 지정해서 전부 출력
    genreList : async (req) => {
        const totalCount = await getTotal(TABLE.GENRE);
        const list = await getList(req, TABLE.GENRE, 'genre_id');

        if(totalCount > 0 && list.length) {
            return resData(STATUS.S200.result,
                STATUS.S200.resultDesc,
                moment().format('LT'),
                {totalCount, list});
        } else {
            return resData(STATUS.S201.result, STATUS.S201.resultDesc, moment().format('LT'));
        }
    },

    // 매장 번호 범위 지정해서 전부 출력
    shopList: async (req) => {
        const totalCount = await getTotal(TABLE.SHOP);
        const list = await getList(req, TABLE.SHOP, 'shop_id');

        if(totalCount > 0 && list.length) {
            return resData(STATUS.S200.result,
                STATUS.S200.resultDesc,
                moment().format('LT'),
                {totalCount, list});
        } else {
            return resData(STATUS.S201.result, STATUS.S201.resultDesc, moment().format('LT'));
        }
    },

    // 자주 사용하는 재고 업데이트
    bookUpdate: async (req) => {
        const { book_id } = req.params;  // 조건 값
        const { book_stock, book_price, book_author } = req.body; // 입력 값

        if(isEmpty(book_id) || isEmpty(book_stock) || isEmpty(book_price) || isEmpty(book_author)) {
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));
        }

        // 데이터 존재 검사.
        const cnt = await getSelectOne(TABLE.BOOKLIST, book_id, 'book_id')
        try {
            if (!cnt) {
                return resData(
                    // 데이터 없음.
                    STATUS.E100.result,
                    STATUS.E100.resultDesc,
                    moment().format('LT')
                );
            }
            const query = `update ${TABLE.BOOKLIST} set book_stock = ?, book_price = ?, book_author = ? where book_id = ?`
            const values = [book_stock, book_price, book_author, book_id]
            const [rows] = await db.execute(query, values);
            if (rows.affectedRows == 1) {
                return resData(
                    STATUS.S200.result,
                    STATUS.S200.resultDesc,
                    moment().format('LT')
                );
            }
        } catch(e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
        }
    },

    // 주의 해당 내용 변경시 관련 도서 장르들 전부 변경.
    genreUpdate : async (req) => {
        const { genre_id } = req.params;
        const { genre_value , genre_name } = req.body;
        const cnt = await getSelectOne(TABLE.GENRE, genre_id, 'genre_id');
        try {
            if (!cnt) {
                // 데이터 없음.
                return resData(
                    STATUS.E100.result,
                    STATUS.E100.resultDesc,
                    moment().format('LT')
                );
            }
            const query = `update ${TABLE.GENRE} set genre_id = ? , genre_name = ? where genre_id = ?`
            const value = [genre_value, genre_name, genre_id];
            [rows] = await db.execute(query, value);
            if(rows.affectedRows == 1){
                return resData(
                    STATUS.S200.result,
                    STATUS.S200.resultDesc,
                    moment().format('LT')
                )
            }
        } catch(e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
        }
        
    },

    // 주의 해당 내용 변경시 관련 도서 장르들 전부 변경.
    shopUpdate : async (req) => {
        const { shop_id } = req.params;
        const { shop_value, shop_name } = req.body;

        const cnt = await getSelectOne(TABLE.SHOP, shop_id, 'shop_id');

        try{
            if (!cnt) {
                // 데이터 없음.
                return resData(
                    STATUS.E100.result,
                    STATUS.E100.resultDesc,
                    moment().format('LT')
                );
            }
            const query = `update ${TABLE.SHOP} set shop_id = ? , shop_name = ? where shop_id = ?`
            const value = [shop_value, shop_name, shop_id];
            const [rows] = await db.execute(query, value);

            if(rows.affectedRows == 1){
                return resData(
                    STATUS.S200.result,
                    STATUS.S200.resultDesc,
                    moment().format('LT')
                )
            }
        } catch (e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
        }

    },


    bookDelete : async (req) => {
        const { book_id } = req.params;
        if (isEmpty(book_id)) {
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));
        }
        const cnt = await getSelectOne(TABLE.BOOKLIST, book_id, 'book_id')
        try {
            if (!cnt) {
                return resData(
                    // 데이터 없음.
                    STATUS.E100.result,
                    STATUS.E100.resultDesc,
                    moment().format('LT')
                );
            }
            const query = `DELETE FROM ${TABLE.BOOKLIST} WHERE book_id = ?;`;
            const values = [book_id];
            const [rows] = await db.execute(query, values);
            if (rows.affectedRows == 1) {
                return resData(
                    STATUS.S200.result,
                    STATUS.S200.resultDesc,
                    moment().format('LT')
                );
            }
        } catch (e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
        }
    },

    // 주의 해당 내용 삭제시 관련 도서들 전부 삭제.
    genreDelete : async (req) => {
        const { genre_id } = req.params;
        if (isEmpty(genre_id)) {
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));
        }
        const cnt = await getSelectOne(TABLE.GENRE, genre_id, 'genre_id');
        try {
            if (!cnt) {
                return resData(
                    // 데이터 없음.
                    STATUS.E100.result,
                    STATUS.E100.resultDesc,
                    moment().format('LT')
                );
            }
            const query = `DELETE FROM ${TABLE.GENRE} WHERE genre_id = ?;`;
            const values = [genre_id];
            const [rows] = await db.execute(query, values);
            if (rows.affectedRows == 1) {
                return resData(
                    STATUS.S200.result,
                    STATUS.S200.resultDesc,
                    moment().format('LT')
                );
            }
        } catch (e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
        }
    },

    // 주의 해당 내용 삭제시 관련 도서들 전부 삭제.
    shopDelete : async (req) => {
        const { shop_id } = req.body;
        if (isEmpty(shop)) {
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));
        }
        const cnt = await getSelectOne(TABLE.SHOP, shop_id, 'shop_id')
        try {
            if(!cnt) {
                return resData(
                    // 데이터 없음.
                    STATUS.E100.result,
                    STATUS.E100.resultDesc,
                    moment().format('LT')
                );
            }
            const query = `DELETE FROM ${TABLE.SHOP} WHERE shop_id = ?;`;
            const values = [shop_id];
            const [rows] = await db.execute(query, values);
            if (rows.affectedRows == 1) {
                return resData(
                    STATUS.S200.result,
                    STATUS.S200.resultDesc,
                    moment().format('LT')
                );
            }
        } catch (e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
        }
    }
}
module.exports = bookController;