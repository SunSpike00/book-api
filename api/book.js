const router = require('express').Router();
const bookController = require('./_controller/bookController');

/////  도서 생성용들 ///// 

// create 빠른 도서 생성 기능
// 도서의 필수정보를 먼저 넣고 나머지 재고,가격,저자가 정해졌을 때 등록.
router.post("/create", async (req, res) => {
    const result = await bookController.create(req);
    res.json(result);
});

// createDetail 상세 도서 생성 기능
// 도서에 관한 모든 정보가 정해졌을 때 등록.

router.post("/createDetail", async (req, res) => {
    const result = await bookController.createDetail(req);
    res.json(result);
});


/////  장르 생성용 ///// 
// 장르는 안쇄적으로 삭제되는 위험이 존재함.
router.post("/genre", async (req, res) => {
    const result = await bookController.createGenre(req);
    res.json(result);
});


/////  매장 생성용 ///// 
// 매장은 연쇄적으로 삭제되는 위험이 존재함.
router.post("/shop", async (req, res) => {
    const result = await bookController.createShop(req);
    res.json(result);
});




// 테이블 전체 조회용들

// list 도서 전체 조회, 최대 길이 지정
router.get('/bookList', async (req, res) => {
    const result = await bookController.bookList(req);
    res.json(result);
});


// 장르 전체 조회, 최대 길이 지정
router.get('/genreList', async (req, res) => {
    const result = await bookController.genreList(req);
    res.json(result);
});

// 매장 전체 조회, 최대 길이 지정
router.get('/shopList', async (req, res) => {
    const result = await bookController.shopList(req);
    res.json(result);
});



///// 재고 확인용들 /////

// 특정 매장에 있는 전체 책들의 재고 확인
router.get('/ShopAllSk', async (req, res) => {
    const result = await bookController.ShopAllSk(req);
    res.json(result);
});


// 특정 매장에 있는 특정 장르 책들의 재고 확인
router.get('/ShopGeAllSk', async (req, res) => {
    const result = await bookController.ShopGeAllSk(req);
    res.json(result);
});

///// 가격 비교용들 ///// 
// 동일한 이름의 책의 재고와 가격을 여러 매장에서 확인 
router.get('/bookAllSkPc', async (req, res) => {
    const result = await bookController.bookAllSkPc(req);
    res.json(result);
});

// 특정 장르별 도서 가격 확인.
router.get('/bookGeAllPc', async (req, res) => {
    const result = await bookController.bookGeAllPc(req);
    res.json(result);
});



/////  정보 수정용들 ///// 

// 도서 정보 수정
router.put('/bookUpdate/:book_id', async (req, res) => {
    const result = await bookController.bookUpdate(req);
    res.json(result);
});

// 장르 정보 수정
// 연쇄작용 발생함 주의.
router.put('/genreUpdate/:genre_id', async (req, res) => {
    const result = await bookController.genreUpdate(req);
    res.json(result);
});

// 매장 정보 수정
// 연쇄작용 발생함 주의.
router.put('/shopUpdate/:shop_id', async (req, res) => {
    const result = await bookController.shopUpdate(req);
    res.json(result);
});




/////  정보 삭제용들 /////

// 도서 정보 삭제
router.delete('/bookDelete/:book_id', async(req, res) => {
    const result = await bookController.bookDelete(req);
    res.json(result);
})
// 장르 정보 삭제
router.delete('/genreDelete/:genre_id', async(req, res) => {
    const result = await bookController.genreDelete(req);
    res.json(result);
})
// 매장 정보 삭제
router.delete('/shopDelete/:shop_id', async(req, res) => {
    const result = await bookController.shopDelete(req);
    res.json(result);
})




module.exports = router;