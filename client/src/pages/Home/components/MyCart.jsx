import {UserNavLinks} from "./UserNavLinks";
import "../styles/Cart.css"
import {CartComponent} from "./CartComponent";

export const MyCart = () => {
    return (
        <div className="myAccount">
            <CartComponent/>
        </div>
    );
}