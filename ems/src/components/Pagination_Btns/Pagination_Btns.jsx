export default function Pagination_Btns({handlePagination , currPage , numOfPages}) {
    return(
    <>
        <button id="prev" onClick={handlePagination} className="table-btn">
          <ion-icon name="chevron-back-outline"></ion-icon>
        </button>
        <span className="currpage">{currPage} - {numOfPages}</span>
        <button id="next" onClick={handlePagination} className="table-btn">
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </button>
    </>
    )
}