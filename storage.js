// storage.js: chrome.storage.local 이용하여 기물별 커스텀 스킨 데이터를 관리하는 모듈

/**
 * getPiece
 * 특정 기물의 스킨 URL을 가져오는 함수
 * @param {string} color - 기물 색상 ("black" 또는 "white")
 * @param {string} piece - 기물 종류 ("king", "queen", 등)
 * @param {function} callback - 가져온 URL을 처리할 콜백 함수
 */
function getPiece(color, piece, callback) {
    const key = color + "_" + piece;
    chrome.storage.local.get([key], function(result) {
        callback(result[key]);
    });
}
  
/**
 * setPiece
 * 특정 기물의 스킨 URL을 저장하는 함수
 * @param {string} color - 기물 색상
 * @param {string} piece - 기물 종류
 * @param {string} url - 저장할 이미지 URL
 * @param {function} callback - 저장 완료 후 호출할 콜백 함수 (옵션)
 */
function setPiece(color, piece, url, callback) {
    const key = color + "_" + piece;
    let data = {};
    data[key] = url;
    chrome.storage.local.set(data, function() {
        if (callback) callback();
    });
}
  
/**
 * removePiece
 * 특정 기물의 스킨 데이터를 삭제하는 함수
 * @param {string} color - 기물 색상
 * @param {string} piece - 기물 종류
 * @param {function} callback - 삭제 완료 후 호출할 콜백 함수 (옵션)
 */
function removePiece(color, piece, callback) {
    const key = color + "_" + piece;
    chrome.storage.local.remove(key, function() {
        if (callback) callback();
    });
}
  
// ES 모듈 방식으로 default export를 사용하여 내보냅니다.
export default {
    getPiece,
    setPiece,
    removePiece
};
