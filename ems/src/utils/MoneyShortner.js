export default function MoneyShortner(price) {
        if (price === undefined || price === null || price === "" || isNaN(price)) {
            price = 0;
        }else{
            price = Number(price);
        }
        
        const billion = 1000000000;
        const million = billion / 1000;
        if (price > billion) {
            return (price / billion).toFixed(2) + "B$";
        } else if (price > million) {
            return (price / million).toFixed(2) + "M$";
        } else if (price < million && price > 1000) {
            return (price / 1000).toFixed(1) + "K$";
        }
        else if (price <= 1000) {
            return price + "$";
        }
        
    }